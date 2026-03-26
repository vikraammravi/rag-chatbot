"use client";

import { useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { ChatFAB } from "./chat/ChatFAB";
import { ChatHeader } from "./chat/ChatHeader";
import { CartPanel } from "./chat/CartPanel";
import { MessageList } from "./chat/MessageList";
import { QuickReplies } from "./chat/QuickReplies";
import { ChatInput } from "./chat/ChatInput";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
  } = useChat();

  useEffect(() => {
    if (paymentSuccess || paymentCancelled) setIsOpen(true);
  }, [paymentSuccess, paymentCancelled]);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-[390px] max-w-[calc(100vw-24px)] h-[580px] max-h-[calc(100vh-120px)] rounded-[20px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.35)] flex flex-col z-[99998] font-sans bg-bg border border-[#2A2A2A]">
          <ChatHeader onClose={() => setIsOpen(false)} />
          <CartPanel cart={cart} cartTotal={cartTotal} />
          <MessageList
            messages={messages}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
          {showQuickReplies && <QuickReplies onSelect={sendMessage} />}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage(input)}
            disabled={isLoading || isStreaming}
            focus={isOpen}
          />
          <div className="text-center text-[9px] text-[#555] pt-1 pb-1.5 bg-bg">
            Powered by AI
          </div>
        </div>
      )}

      <ChatFAB isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}
