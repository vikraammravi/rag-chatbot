# Aaha Truly South — Frontend

Next.js chat widget for the Aaha Truly South restaurant chatbot. Embeds a floating chat button on the restaurant website that lets customers explore the menu, build a cart, and place pickup orders via Claude AI.

## Setup

```bash
npm install
cp .env.example .env.local   # already set for local dev
npm run dev
```

App runs at `http://localhost:3000`. Requires the backend running at `http://localhost:8000` (see root README).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL. Defaults to `http://localhost:8000` if not set. Must be set for production. |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Component Structure

```
src/app/
├── components/
│   ├── ChatWidget.tsx        # Root orchestrator — composes all chat UI
│   └── chat/
│       ├── ChatFAB.tsx       # Floating action button (open/close)
│       ├── ChatHeader.tsx    # Header bar with logo + close button
│       ├── CartPanel.tsx     # Cart banner + expandable item list
│       ├── MessageList.tsx   # Message bubbles + thinking indicator
│       ├── QuickReplies.tsx  # Quick reply pill buttons
│       └── ChatInput.tsx     # Textarea + send button
├── hooks/
│   └── useChat.ts            # All logic: SSE streaming, session, cart state
├── types/
│   └── chat.ts               # Message and CartItem TypeScript interfaces
└── constants/
    └── chat.ts               # API_URL, RESTAURANT_PHONE, QUICK_REPLIES
```
