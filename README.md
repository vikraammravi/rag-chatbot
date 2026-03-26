# Aaha Truly South — AI Restaurant Chatbot

> **Built with:** Claude API · Tool Use · Real-time SSE Streaming · RAG-style menu retrieval · Stripe Payments · FastAPI · Next.js 16

**Live demo:** [rag-chatbot-rho-one.vercel.app](https://rag-chatbot-rho-one.vercel.app)

An AI-powered chat widget for [Aaha Truly South](https://aahatrulysouth.com), an authentic South Indian vegetarian restaurant in Toronto. Customers can explore the menu, build a cart, and place a pickup order entirely through conversation.

---

## Demo

> 📸 _Add a GIF or screenshot here — record the chat widget in action_

---

## Why I Built This

Most restaurant websites make ordering frustrating — you hunt through PDFs, call during busy hours, or navigate clunky online menus. I wanted to show that a conversational AI interface could replace all of that: ask in plain English, get real answers, and pay — without ever leaving the chat.

This project also let me go deep on **Claude's tool use API**, which I think is one of the most underused patterns in applied AI. Instead of cramming everything into a prompt, you give the model tools and let it decide what to call and when. The result is a more reliable, cheaper, and faster system.

---

## Architecture

```
User types message
       │
       ▼
 Next.js Frontend  ──── SSE stream (tokens arrive in real time) ────▶  UI updates word by word
       │
       │  POST /api/chat/stream
       ▼
  FastAPI Backend
       │
       ├─▶ FAQ Cache hit?  ──yes──▶ instant response (no API call)
       │
       │   no
       ▼
  Claude API (Haiku)
       │
       ├─▶ stop_reason = tool_use
       │         │
       │         ├─▶ search_menu   → keyword search over menu chunks
       │         ├─▶ add_to_cart   → updates in-memory session
       │         ├─▶ get_cart      → returns cart summary
       │         ├─▶ set_location  → saves pickup location
       │         ├─▶ collect_customer_info → saves name + phone
       │         └─▶ create_checkout → Stripe Checkout Session → payment URL
       │
       └─▶ stop_reason = end_turn
                 │
                 ▼
         stream tokens → SSE → browser
```

---

## Tech Decisions

**Why Claude over OpenAI?**
Claude's tool use implementation is cleaner for agentic loops — the `stop_reason` pattern makes it easy to know exactly when to execute tools vs stream a final answer. Claude also handles multi-step reasoning (search → add → checkout) more reliably out of the box.

**Why SSE over WebSockets?**
WebSockets are bidirectional — overkill here. The browser only needs to receive a stream from the server, not send one back. SSE is simpler, works over standard HTTP, needs no special infrastructure, and reconnects automatically. One `ReadableStream` on the client is all it takes.

**Why FastAPI over Flask/Django?**
FastAPI is built for async from the ground up — essential for `StreamingResponse`. It also gives you Pydantic validation and auto-generated Swagger docs for free. Flask would need extra libraries to do the same; Django is far heavier than needed.

**Why RAG-style retrieval over full menu in prompt?**
Putting the entire menu JSON in every prompt costs ~2500 tokens per request. With tool-based retrieval, Claude calls `search_menu` and only the relevant items (~200 tokens) enter the context. Faster, cheaper, and scales as the menu grows.

**Why Haiku over Sonnet?**
For a restaurant chatbot, queries are simple: find a dish, add to cart, confirm location. Haiku handles these at 3–5x lower latency and cost vs Sonnet. Sonnet is still available via env var for higher-stakes queries.

---

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Backend  | Python 3.10+, FastAPI, Uvicorn                         |
| AI       | Anthropic Claude API (tool use + true token streaming) |
| Payments | Stripe Checkout                                        |
| Frontend | Next.js 16, React 19, TypeScript                       |
| Styling  | Tailwind CSS v4                                        |
| Deploy   | Render (backend) · Vercel (frontend)                   |

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App at `http://localhost:3000`

---

## API Endpoints

| Method   | Endpoint            | Description                                     |
| -------- | ------------------- | ----------------------------------------------- |
| `GET`    | `/api/health`       | Server status + session count + menu item count |
| `GET`    | `/api/menu`         | Full menu JSON                                  |
| `POST`   | `/api/chat`         | Non-streaming chat response                     |
| `POST`   | `/api/chat/stream`  | Streaming SSE response (used by frontend)       |
| `DELETE` | `/api/session/{id}` | Clear a session and cart                        |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Required | Default                     | Description                              |
| --------------------- | -------- | --------------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY`   | Yes      | —                           | Anthropic API key                        |
| `CLAUDE_MODEL`        | No       | `claude-haiku-4-5-20251001` | Swap to `claude-sonnet-4-6` for quality  |
| `STRIPE_SECRET_KEY`   | No       | —                           | Stripe secret key for live payments      |
| `STRIPE_SUCCESS_URL`  | No       | localhost                   | Redirect after successful payment        |
| `STRIPE_CANCEL_URL`   | No       | localhost                   | Redirect after cancelled payment         |
| `CORS_ORIGINS`        | No       | localhost + aahatrulysouth  | Comma-separated allowed origins          |

### Frontend (`frontend/.env.local`)

| Variable              | Required   | Default                 | Description      |
| --------------------- | ---------- | ----------------------- | ---------------- |
| `NEXT_PUBLIC_API_URL` | Yes (prod) | `http://localhost:8000` | Backend base URL |

---

## Project Structure

```
ahaa-chatbot/
├── backend/
│   ├── main.py                  # FastAPI entry point, CORS, lifespan
│   ├── requirements.txt
│   ├── Procfile                 # Render deploy config
│   ├── .env.example
│   └── app/
│       ├── config.py            # Settings, FAQ cache, system prompt
│       ├── routers/
│       │   └── chat.py          # Route handlers + Pydantic validation
│       ├── services/
│       │   ├── chat_service.py  # Claude streaming tool-use loop
│       │   ├── cart_service.py  # Cart operations + Stripe checkout
│       │   ├── menu_search.py   # Keyword search over menu chunks
│       │   └── session.py       # In-memory session store
│       ├── ingestion/
│       │   ├── pipeline.py      # Startup: load menu → build system prompt
│       │   └── loader.py        # MenuStore dataclass + JSON parsing
│       ├── tools/
│       │   └── definitions.py   # Claude tool schemas (8 tools)
│       └── data/
│           └── menu.json
│
└── frontend/
    └── src/app/
        ├── components/
        │   ├── ChatWidget.tsx       # Root orchestrator
        │   └── chat/
        │       ├── ChatHeader.tsx
        │       ├── CartPanel.tsx
        │       ├── MessageList.tsx
        │       ├── QuickReplies.tsx
        │       ├── ChatInput.tsx
        │       └── ChatFAB.tsx
        ├── hooks/
        │   └── useChat.ts           # SSE streaming, session, cart state
        ├── types/chat.ts
        └── constants/chat.ts
```
