"use client";

import { useRef, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  focus: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled, focus }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focus && inputRef.current) inputRef.current.focus();
  }, [focus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      style={{
        padding: "10px 12px",
        borderTop: "1px solid #2A2A2A",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        background: "#141414",
        flexShrink: 0,
      }}
    >
      <textarea
        ref={inputRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about our menu, catering..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 24,
          border: "1px solid #3A3A3A",
          background: "#222",
          color: "#F5EDE0",
          fontSize: 13.5,
          outline: "none",
          resize: "none",
          maxHeight: 80,
          fontFamily: "inherit",
          lineHeight: 1.4,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#D4A24E55")}
        onBlur={(e) => (e.target.style.borderColor = "#3A3A3A")}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background: "#D4A24E",
          color: "#1A1A1A",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          opacity: value.trim() ? 1 : 0.4,
          transition: "all 0.15s",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
