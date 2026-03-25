"""
Aaha Truly South — AI Restaurant Chatbot
Entry point: runs ingestion pipeline on startup, registers routes.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ingestion.pipeline import run_pipeline
from app.routers import chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load menu.json → chunk → build prompt."""
    print("🚀 Running ingestion pipeline...")
    run_pipeline(settings.DATA_DIR)  # raises on failure — server should not start with empty store
    print("✅ Ingestion complete. Server ready.")
    yield


app = FastAPI(
    title="Aaha Truly South Chatbot API",
    description="AI-powered restaurant ordering chatbot using Claude tool use",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Aaha Truly South Chatbot API"}
