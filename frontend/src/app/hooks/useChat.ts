"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, CartItem } from "../types/chat";
import { API_URL, RESTAURANT_PHONE, INITIAL_BOT_MESSAGE } from "../constants/chat";

const PAYMENT_SUCCESS_MESSAGE =
  "Your payment was successful! Your order is confirmed and will be ready for pickup. Thank you for ordering from Aaha Truly South!";

const PAYMENT_CANCELLED_MESSAGE =
  "No worries — your order is still saved. Whenever you're ready, just say 'checkout' and we'll pick up right where you left off.";

const STORAGE_KEY = "aaha_chat_session";

function saveSession(sessionId: string | null, messages: Message[], cart: CartItem[], cartTotal: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, messages, cart, cartTotal }));
  } catch {}
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { sessionId: string | null; messages: Message[]; cart: CartItem[]; cartTotal: number };
  } catch {
    return null;
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: INITIAL_BOT_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);

  // On mount: restore session if returning from Stripe (success or cancel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    if (payment === "success" || payment === "cancelled") {
      const saved = loadSession();
      const baseMessages = saved?.messages ?? [{ role: "bot" as const, text: INITIAL_BOT_MESSAGE }];
      const followUp = payment === "success" ? PAYMENT_SUCCESS_MESSAGE : PAYMENT_CANCELLED_MESSAGE;

      if (saved) {
        setSessionId(saved.sessionId);
        setCart(saved.cart);
        setCartTotal(saved.cartTotal);
      }

      setMessages([...baseMessages, { role: "bot", text: followUp }]);
      setShowQuickReplies(false);
      if (payment === "success") setPaymentSuccess(true);
      if (payment === "cancelled") setPaymentCancelled(true);

      window.history.replaceState({}, "", window.location.pathname);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist session whenever it changes so Stripe redirect can restore it
  useEffect(() => {
    if (sessionId) {
      saveSession(sessionId, messages, cart, cartTotal);
    }
  }, [sessionId, messages, cart, cartTotal]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || isStreaming) return;

      const userMsg = text.trim();
      setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
      setInput("");
      setShowQuickReplies(false);
      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/api/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: userMsg }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let botText = "";
        setIsLoading(false);
        setIsStreaming(true);
        setMessages((prev) => [...prev, { role: "bot", text: "" }]);

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const data = JSON.parse(raw);
              if (data.type === "session" && data.session_id) {
                setSessionId(data.session_id);
              } else if (data.type === "token") {
                botText += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "bot", text: botText };
                  return updated;
                });
              } else if (data.type === "status") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "bot",
                    text: "✨ Looking up menu...",
                  };
                  return updated;
                });
                botText = "";
              } else if (data.type === "done") {
                if (data.cart) setCart(data.cart);
                if (data.cart_total !== undefined) setCartTotal(data.cart_total);
              }
            } catch {
              /* skip malformed SSE line */
            }
          }
        }
      } catch (err) {
        console.error("Chat error:", err);
        setIsLoading(false);
        setMessages((prev) => {
          const cleaned = prev.filter(
            (m, i) =>
              !(i === prev.length - 1 && m.role === "bot" && m.text === ""),
          );
          return [
            ...cleaned,
            {
              role: "bot",
              text: `Something went wrong. Please try again or call ${RESTAURANT_PHONE}.`,
            },
          ];
        });
      } finally {
        setIsStreaming(false);
        setIsLoading(false);
      }
    },
    [isLoading, isStreaming, sessionId],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    isStreaming,
    cart,
    cartTotal,
    showQuickReplies,
    paymentSuccess,
    paymentCancelled,
    sendMessage,
  };
}
