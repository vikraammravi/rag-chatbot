import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaha Truly South — AI Chatbot",
  description: "AI-powered ordering assistant for Aaha Truly South",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
