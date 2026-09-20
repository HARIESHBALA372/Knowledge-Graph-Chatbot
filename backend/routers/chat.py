"""
Chat router — queries the LLM service and persists every message exchange
into the SQLite `chat_sessions` / `chat_messages` tables.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.database import get_db
from backend.models.db_models import ChatSession, ChatMessage
from backend.models.schemas import ChatQueryRequest, ChatMessageResponse
from backend.services.llm_service import llm_service

router = APIRouter(prefix="/chat", tags=["Chatbot"])


def _msg_to_dict(m: ChatMessage) -> Dict[str, Any]:
    return {
        "id": m.message_id,
        "sender": m.sender,
        "text": m.text,
        "timestamp": m.timestamp.strftime("%H:%M") if m.timestamp else "",
        "entities": m.entities or [],
        "relationships": m.relationships or [],
        "sources": m.sources or [],
        "query": m.query_meta or {},
        "graphData": m.graph_data or {},
    }


async def _ensure_session(session_id: str, db: AsyncSession) -> ChatSession:
    """Get or create a chat session row."""
    result = await db.execute(
        select(ChatSession).where(ChatSession.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        session = ChatSession(
            session_id=session_id,
            title="New Conversation",
            created_at=datetime.now(timezone.utc),
        )
        db.add(session)
        await db.flush()
    return session


@router.post("/query", response_model=ChatMessageResponse)
async def query_chat(payload: ChatQueryRequest, db: AsyncSession = Depends(get_db)):
    """Query the Knowledge Graph chatbot assistant and persist the exchange."""
    session_id = payload.sessionId or f"session_{uuid.uuid4().hex[:12]}"

    # Ensure a session row exists
    await _ensure_session(session_id, db)

    # Persist user message
    user_msg = ChatMessage(
        message_id=f"msg_u_{uuid.uuid4().hex[:12]}",
        session_id=session_id,
        sender="user",
        text=payload.message,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(user_msg)

    # Generate assistant response
    response_data = await llm_service.generate_response(
        message=payload.message,
        session_id=session_id,
    )

    # Persist assistant message
    asst_msg = ChatMessage(
        message_id=response_data["id"],
        session_id=session_id,
        sender="assistant",
        text=response_data["text"],
        entities=response_data.get("entities", []),
        relationships=response_data.get("relationships", []),
        sources=response_data.get("sources", []),
        query_meta=response_data.get("query", {}),
        graph_data=response_data.get("graphData", {}),
        timestamp=datetime.now(timezone.utc),
    )
    db.add(asst_msg)
    await db.flush()

    # Update session title from first user message if it's still default
    result = await db.execute(
        select(ChatSession).where(ChatSession.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if session and session.title == "New Conversation":
        session.title = payload.message[:80]

    return response_data


@router.get("/history", response_model=List[Dict[str, Any]])
async def get_chat_history(
    sessionId: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve chat sessions with their messages."""
    if sessionId:
        result = await db.execute(
            select(ChatSession).where(ChatSession.session_id == sessionId)
        )
        sessions = result.scalars().all()
    else:
        result = await db.execute(
            select(ChatSession).order_by(desc(ChatSession.created_at)).limit(limit)
        )
        sessions = result.scalars().all()

    output = []
    for s in sessions:
        msgs_result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == s.session_id)
            .order_by(ChatMessage.id)
        )
        msgs = msgs_result.scalars().all()
        output.append({
            "id": s.session_id,
            "title": s.title,
            "createdAt": s.created_at.isoformat() if s.created_at else "",
            "messages": [_msg_to_dict(m) for m in msgs],
        })
    return output


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a chat session and all its messages."""
    result = await db.execute(
        select(ChatSession).where(ChatSession.session_id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Session '{session_id}' not found.")
    await db.delete(session)
    return {"success": True, "deleted_id": session_id}
