import ChatWidget from "@/app/components/ChatWidget";

export default function Home() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-800 mb-2">
            Aaha Truly South — Chatbot Demo
          </h1>
          <p className="text-stone-500 text-sm">
            Click the red chat button in the bottom-right corner
          </p>
        </div>
      </div>
      <ChatWidget />
    </main>
  );
}
