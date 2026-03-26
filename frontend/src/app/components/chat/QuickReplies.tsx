"use client";

import { QUICK_REPLIES } from "../../constants/chat";

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-[6px] px-3 pt-2 pb-[10px] bg-bg">
      {QUICK_REPLIES.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="px-[14px] py-[6px] rounded-[20px] border border-gold/30 bg-transparent text-gold text-[11.5px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 hover:bg-gold hover:text-[#1A1A1A] hover:border-gold"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
