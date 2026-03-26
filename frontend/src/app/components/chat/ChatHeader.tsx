"use client";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-surface to-brown px-4 py-[14px] flex items-center gap-3 border-b border-gold/25 shrink-0">
      <img
        src="https://aahatrulysouth.com/wp-content/uploads/2024/11/cropped-Aaha-Logo.png"
        alt="Aaha"
        className="w-[42px] h-[42px] rounded-full object-contain bg-white p-0.5 shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="m-0 text-sm font-semibold text-gold tracking-wide">
          Aaha Truly South
        </p>
        <p className="m-0 text-[11px] text-muted mt-0.5">
          Pure Veg • South Indian Tiffin
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close chat"
        className="w-8 h-8 rounded-full bg-white/[6%] border-none cursor-pointer flex items-center justify-center text-muted shrink-0 hover:bg-white/10 transition-colors duration-150"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
