"use client";

interface ChatFABProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatFAB({ isOpen, onClick }: ChatFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="fixed bottom-5 right-5 w-[62px] h-[62px] rounded-full bg-gradient-to-br from-gold to-gold-dark border-2 border-gold/25 cursor-pointer shadow-[0_4px_24px_rgba(212,162,78,0.35)] flex items-center justify-center z-[99999] transition-all duration-200 hover:scale-[1.08] hover:shadow-[0_6px_32px_rgba(212,162,78,0.5)]"
    >
      {isOpen ? (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
}
