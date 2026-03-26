"use client";

import ChatWidget from "@/app/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brown to-[#1A1A1A] border-2 border-gold/25 shadow-[0_0_0_6px_rgba(212,162,78,0.07),0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center mb-2 overflow-hidden">
        <img
          src="https://aahatrulysouth.com/wp-content/uploads/2024/11/cropped-Aaha-Logo.png"
          alt="Aaha Truly South"
          className="w-20 h-20 object-contain rounded-full"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            el.parentElement!.style.fontSize = "36px";
            el.parentElement!.innerText = "🍛";
          }}
        />
      </div>

      <h1 className="m-0 text-[28px] font-bold text-cream">
        Aaha Truly South
      </h1>

      <p className="m-0 text-sm text-muted max-w-[320px] leading-relaxed">
        Authentic South Indian vegetarian tiffin in Toronto.
        Chat with our AI assistant to explore the menu and place a pickup order.
      </p>

      <button
        onClick={() => {
          const fab = document.querySelector("[aria-label='Open chat']") as HTMLButtonElement;
          fab?.click();
        }}
        className="mt-3 py-4 px-9 rounded-full bg-gradient-to-br from-gold to-gold-dark text-[#1A1A1A] text-[15px] font-bold cursor-pointer tracking-wide shadow-[0_4px_24px_rgba(212,162,78,0.4)] transition-all duration-150 hover:scale-[1.04] hover:shadow-[0_6px_32px_rgba(212,162,78,0.6)]"
      >
        Order Now
      </button>

      <p className="m-0 text-[11px] text-[#3A3A3A]">
        No account needed · Pickup only · Scarborough & Downtown
      </p>

      <ChatWidget />
    </main>
  );
}
