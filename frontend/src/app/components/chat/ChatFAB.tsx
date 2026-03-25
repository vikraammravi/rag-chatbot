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
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 62,
        height: 62,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #D4A24E, #B8872E)",
        border: "2px solid #D4A24E44",
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(212,162,78,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow = "0 6px 32px rgba(212,162,78,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(212,162,78,0.35)";
      }}
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
