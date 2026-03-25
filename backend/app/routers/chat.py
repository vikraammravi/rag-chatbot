import json
from typing import Optional

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator

from app.config import settings
from app.ingestion.pipeline import get_store
from app.services import session, chat_service, cart_service

router = APIRouter()

_MAX_MESSAGE_LENGTH = 1000


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("message cannot be empty")
        if len(v) > _MAX_MESSAGE_LENGTH:
            raise ValueError(f"message too long (max {_MAX_MESSAGE_LENGTH} characters)")
        return v


class ChatResponse(BaseModel):
    session_id: str
    response: str
    cart: list
    cart_total: float


@router.post("/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    sess = session.get_or_create(request.session_id)

    msg_lower = request.message.lower()
    for trigger, cached in settings.FAQ_CACHE.items():
        if trigger in msg_lower:
            return ChatResponse(
                session_id=sess["id"],
                response=cached,
                cart=sess["cart"],
                cart_total=cart_service.get_total(sess),
            )

    bot_response = chat_service.get_response(request.message, sess)
    return ChatResponse(
        session_id=sess["id"],
        response=bot_response,
        cart=sess["cart"],
        cart_total=cart_service.get_total(sess),
    )


@router.post("/chat/stream")
def handle_chat_stream(request: ChatRequest):
    sess = session.get_or_create(request.session_id)

    msg_lower = request.message.lower()
    for trigger, cached in settings.FAQ_CACHE.items():
        if trigger in msg_lower:
            def faq_stream():
                yield f"data: {json.dumps({'type': 'session', 'session_id': sess['id']})}\n\n"
                yield f"data: {json.dumps({'type': 'token', 'text': cached})}\n\n"
                yield f"data: {json.dumps({'type': 'done', 'cart': sess['cart'], 'cart_total': cart_service.get_total(sess)})}\n\n"
            return StreamingResponse(faq_stream(), media_type="text/event-stream")

    def event_stream():
        yield f"data: {json.dumps({'type': 'session', 'session_id': sess['id']})}\n\n"
        for chunk in chat_service.get_response_stream(request.message, sess):
            yield f"data: {json.dumps(chunk)}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'cart': sess['cart'], 'cart_total': cart_service.get_total(sess)})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/menu")
def get_menu():
    return get_store().menu


@router.get("/health")
def health():
    store = get_store()
    return {"status": "ok", "sessions": session.count(), "menu_items": len(store.chunks)}


@router.delete("/session/{session_id}")
def delete_session(session_id: str):
    session.clear(session_id)
    return {"status": "cleared"}
