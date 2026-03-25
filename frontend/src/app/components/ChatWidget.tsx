"use client";

import { useState } from "react";
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
    sendMessage,
  } = useChat();

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 16,
            width: 390,
            maxWidth: "calc(100vw - 24px)",
            height: 580,
            maxHeight: "calc(100vh - 120px)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            zIndex: 99998,
            fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
            background: "#141414",
            border: "1px solid #2A2A2A",
          }}
        >
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
          <div
            style={{
              textAlign: "center",
              fontSize: 9,
              color: "#555",
              padding: "4px 0 6px",
              background: "#141414",
            }}
          >
            Powered by AI
          </div>
        </div>
      )}

      <ChatFAB isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}
