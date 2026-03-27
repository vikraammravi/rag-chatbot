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
    <div className="flex-1 overflow-y-auto px-3 py-[14px] flex flex-col gap-[10px] bg-surface-dark">
      {messages.map((msg, i) =>
        msg.text === "" ? null : (
          <div
            key={i}
            className={[
              "max-w-[84%] px-[14px] py-[10px] text-[13.5px] leading-[1.55] break-words",
              msg.role === "bot"
                ? "self-start [border-radius:4px_16px_16px_16px] bg-chat-bot text-cream border border-gold/20"
                : "self-end [border-radius:16px_4px_16px_16px] bg-gold text-[#1A1A1A]",
            ].join(" ")}
          >
            {msg.text.startsWith("✨") ? (
              <span className="text-gold italic text-xs">{msg.text}</span>
            ) : (
              msg.text.split("\n").map((line, j, arr) => {
                const parts = line.split(/(https?:\/\/[^\s]+)/g);
                return (
                  <span key={j}>
                    {parts.map((part, k) =>
                      part.startsWith("http://") || part.startsWith("https://") ? (
                        <a
                          key={k}
                          href={part.replace(/[.,)}\]>]+$/, "")}
                          target="_self"
                          className="text-gold underline font-semibold"
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
        <div className="self-start bg-chat-bot border border-gold/20 [border-radius:4px_16px_16px_16px] px-4 py-3 flex gap-[6px] items-center">
          <span className="text-gold text-xs font-medium">Thinking</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[6px] h-[6px] rounded-full bg-gold inline-block aaha-bounce opacity-60"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
