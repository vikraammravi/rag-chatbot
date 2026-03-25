"""Session management — in-memory for MVP, swap to Redis for production."""

import uuid
from datetime import datetime
from typing import Any, Optional

_sessions: dict[str, dict[str, Any]] = {}


def get_or_create(session_id: Optional[str] = None) -> dict:
    if not session_id:
        session_id = str(uuid.uuid4())
    if session_id not in _sessions:
        _sessions[session_id] = {
            "id": session_id,
            "conversation_history": [],
            "cart": [],
            "location": None,
            "customer_name": None,
            "customer_phone": None,
            "created_at": datetime.now().isoformat(),
        }
    return _sessions[session_id]


def clear(session_id: str) -> bool:
    return _sessions.pop(session_id, None) is not None


def count() -> int:
    return len(_sessions)
