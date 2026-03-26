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
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #D4A24E, #B8872E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 8,
        }}
      >
        🍛
      </div>

      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#F5EDE0" }}>
        Aaha Truly South
      </h1>

      <p style={{ margin: 0, fontSize: 14, color: "#A0917E", maxWidth: 320, lineHeight: 1.6 }}>
        Authentic South Indian vegetarian tiffin in Toronto.
        Chat with our AI assistant to explore the menu and place a pickup order.
      </p>

      <div
        style={{
          marginTop: 8,
          padding: "10px 20px",
          borderRadius: 24,
          border: "1px solid #D4A24E33",
          fontSize: 12,
          color: "#D4A24E",
          background: "#D4A24E0D",
        }}
      >
        Click the chat button below to get started →
      </div>

      <ChatWidget />
    </main>
  );
}
