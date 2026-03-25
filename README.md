# Aaha Truly South — AI Restaurant Chatbot

An AI-powered chat widget for [Aaha Truly South](https://aahatrulysouth.com), an authentic South Indian vegetarian restaurant in Toronto. Customers can explore the menu, build a cart, and place pickup orders through a conversational interface powered by Claude.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10+, FastAPI, Uvicorn |
| AI | Anthropic Claude API (tool use + streaming) |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

---

## Running the Backend

```bash
cd backend

# 1. Create and activate a virtual environment
python -m venv venv

# Mac / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Open .env and set your ANTHROPIC_API_KEY

# 4. Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
Interactive API docs (Swagger): `http://localhost:8000/docs`

---

## Running the Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# NEXT_PUBLIC_API_URL is already set to http://localhost:8000 for local dev

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/health` | Server status + session count + menu item count |
| `GET` | `/api/menu` | Full menu JSON |
| `POST` | `/api/chat` | Non-streaming chat response |
| `POST` | `/api/chat/stream` | Streaming SSE chat response (used by frontend) |
| `DELETE` | `/api/session/{id}` | Clear a session and cart |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from console.anthropic.com |
| `CLAUDE_MODEL` | No | Claude model ID (default: `claude-sonnet-4-20250514`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes (prod) | Backend URL. Defaults to `http://localhost:8000` for local dev |

---

## Project Structure

```
ahaa-chatbot/
├── backend/
│   ├── main.py                  # FastAPI entry point, CORS, lifespan
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── config.py            # Settings + constants
│       ├── routers/
│       │   └── chat.py          # API route handlers
│       ├── services/
│       │   ├── chat_service.py  # Claude tool-use loop + streaming
│       │   ├── cart_service.py  # Cart add/remove/checkout
│       │   ├── menu_search.py   # Keyword search over menu
│       │   └── session.py       # In-memory session store
│       ├── ingestion/
│       │   ├── pipeline.py      # Startup: load menu → build system prompt
│       │   └── loader.py        # MenuStore dataclass + JSON parsing
│       ├── tools/
│       │   └── definitions.py   # Claude tool schemas
│       └── data/
│           └── menu.json        # Restaurant menu data
│
└── frontend/
    ├── src/app/
    │   ├── components/
    │   │   ├── ChatWidget.tsx       # Root orchestrator (~80 lines)
    │   │   └── chat/
    │   │       ├── ChatHeader.tsx
    │   │       ├── CartPanel.tsx
    │   │       ├── MessageList.tsx
    │   │       ├── QuickReplies.tsx
    │   │       ├── ChatInput.tsx
    │   │       └── ChatFAB.tsx
    │   ├── hooks/
    │   │   └── useChat.ts           # All chat logic (SSE, cart, session)
    │   ├── types/
    │   │   └── chat.ts              # Shared TypeScript interfaces
    │   └── constants/
    │       └── chat.ts              # API URL, quick replies, phone
    └── package.json
```
