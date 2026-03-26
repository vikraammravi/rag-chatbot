"use client";

import { useEffect, useRef } from "react";
import { Message } from "../../types/chat";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
}

export function MessageList({ messages, isLoading, isStreaming }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const showThinking =
    isLoading ||
    (isStreaming && messages[messages.length - 1]?.text === "");

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#171717",
      }}
    >
      {messages.map((msg, i) =>
        msg.text === "" ? null : (
          <div
            key={i}
            style={{
              maxWidth: "84%",
              padding: "10px 14px",
              fontSize: 13.5,
              lineHeight: 1.55,
              wordBreak: "break-word",
              alignSelf: msg.role === "bot" ? "flex-start" : "flex-end",
              borderRadius:
                msg.role === "bot" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
              background: msg.role === "bot" ? "#2D2520" : "#D4A24E",
              color: msg.role === "bot" ? "#F5EDE0" : "#1A1A1A",
              border: msg.role === "bot" ? "1px solid #D4A24E30" : "none",
            }}
          >
            {msg.text.startsWith("✨") ? (
              <span style={{ color: "#D4A24E", fontStyle: "italic", fontSize: 12 }}>
                {msg.text}
              </span>
            ) : (
              msg.text.split("\n").map((line, j, arr) => {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const parts = line.split(urlRegex);
                return (
                  <span key={j}>
                    {parts.map((part, k) =>
                      part.startsWith("http://") || part.startsWith("https://") ? (
                        <a
                          key={k}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#D4A24E", textDecoration: "underline", wordBreak: "break-all" }}
                        >
                          Click here to pay
                        </a>
                      ) : (
                        part
                      )
                    )}
                    {j < arr.length - 1 && <br />}
                  </span>
                );
              })
            )}
          </div>
        ),
      )}

      {showThinking && (
        <div
          style={{
            alignSelf: "flex-start",
            background: "#2D2520",
            border: "1px solid #D4A24E30",
            borderRadius: "4px 16px 16px 16px",
            padding: "12px 16px",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ color: "#D4A24E", fontSize: 12, fontWeight: 500 }}>
            Thinking
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D4A24E",
                animation: "aaha-bounce 1s infinite",
                animationDelay: `${i * 150}ms`,
                opacity: 0.6,
                display: "inline-block",
              }}
            />
          ))}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
