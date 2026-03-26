"use client";

import ChatWidget from "@/app/components/ChatWidget";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#141414",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2C1810, #1A1A1A)",
          border: "2px solid #D4A24E44",
          boxShadow: "0 0 0 6px #D4A24E11, 0 8px 32px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <img
          src="https://aahatrulysouth.com/wp-content/uploads/2024/11/cropped-Aaha-Logo.png"
          alt="Aaha Truly South"
          style={{ width: 80, height: 80, objectFit: "contain", borderRadius: "50%" }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            el.parentElement!.style.fontSize = "36px";
            el.parentElement!.innerText = "🍛";
          }}
        />
      </div>

      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#F5EDE0" }}>
        Aaha Truly South
      </h1>

      <p style={{ margin: 0, fontSize: 14, color: "#A0917E", maxWidth: 320, lineHeight: 1.6 }}>
        Authentic South Indian vegetarian tiffin in Toronto.
        Chat with our AI assistant to explore the menu and place a pickup order.
      </p>

      <button
        onClick={() => {
          const fab = document.querySelector("[aria-label='Open chat']") as HTMLButtonElement;
          fab?.click();
        }}
        style={{
          marginTop: 12,
          padding: "16px 36px",
          borderRadius: 32,
          border: "none",
          background: "linear-gradient(135deg, #D4A24E, #B8872E)",
          color: "#1A1A1A",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: 0.3,
          boxShadow: "0 4px 24px rgba(212,162,78,0.4)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 6px 32px rgba(212,162,78,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(212,162,78,0.4)";
        }}
      >
        🍛 Start Ordering
      </button>

      <p style={{ margin: 0, fontSize: 11, color: "#3A3A3A" }}>
        No account needed · Pickup only · Scarborough & Downtown
      </p>

      <ChatWidget />
    </main>
  );
}
