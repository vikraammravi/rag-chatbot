"use client";

import { QUICK_REPLIES } from "../../constants/chat";

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "8px 12px 10px",
        background: "#141414",
      }}
    >
      {QUICK_REPLIES.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            border: "1.5px solid #D4A24E55",
            background: "transparent",
            color: "#D4A24E",
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "#D4A24E";
            el.style.color = "#1A1A1A";
            el.style.borderColor = "#D4A24E";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = "#D4A24E";
            el.style.borderColor = "#D4A24E55";
          }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
