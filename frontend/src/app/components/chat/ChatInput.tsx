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
    <div className="px-3 py-[10px] border-t border-[#2A2A2A] flex gap-2 items-end bg-bg shrink-0">
      <textarea
        ref={inputRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about our menu, catering..."
        className="flex-1 px-[14px] py-[10px] rounded-[24px] border border-[#3A3A3A] bg-[#222] text-cream text-[13.5px] outline-none resize-none max-h-[80px] font-sans leading-[1.4] focus:border-gold/30 transition-colors duration-150"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={[
          "w-[38px] h-[38px] rounded-full border-none bg-gold text-[#1A1A1A] flex items-center justify-center shrink-0 transition-all duration-150",
          disabled || !value.trim() ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
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
