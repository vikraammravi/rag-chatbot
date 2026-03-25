"use client";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1E1E1E 0%, #2C1810 100%)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #D4A24E44",
        flexShrink: 0,
      }}
    >
      <img
        src="https://aahatrulysouth.com/wp-content/uploads/2024/11/cropped-Aaha-Logo.png"
        alt="Aaha"
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          objectFit: "contain",
          background: "#fff",
          padding: 2,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "#D4A24E",
            letterSpacing: 0.5,
          }}
        >
          Aaha Truly South
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#A0917E", marginTop: 2 }}>
          Pure Veg • South Indian Tiffin
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close chat"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#ffffff10",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#A0917E",
          flexShrink: 0,
        }}
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
