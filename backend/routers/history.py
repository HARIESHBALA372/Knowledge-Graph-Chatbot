"""
History router — backed by the SQLite `query_history` table.
Supports listing, individual lookup, and creating new history entries.
"""

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel

from backend.database import get_db
from backend.models.db_models import QueryHistory

router = APIRouter(prefix="/history", tags=["Query History"])


class HistoryCreateRequest(BaseModel):
    query: str
    intent: Optional[str] = ""
    entities: Optional[List[str]] = []
    source: Optional[str] = "Knowledge Graph"
    response_time: Optional[str] = ""
    status: Optional[str] = "Success"
    cypher: Optional[str] = ""
    answer_summary: Optional[str] = ""


def _history_to_dict(h: QueryHistory) -> Dict[str, Any]:
    return {
        "id": h.history_id,
        "query": h.query,
        "intent": h.intent,
        "entities": h.entities or [],
        "source": h.source,
        "responseTime": h.response_time,
        "status": h.status,
        "timestamp": h.timestamp.strftime("%Y-%m-%d %H:%M:%S") if h.timestamp else "",
        "cypher": h.cypher,
        "answerSummary": h.answer_summary,
    }


@router.get("", response_model=List[Dict[str, Any]])
async def get_history(
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Return query history records, newest first."""
    result = await db.execute(
        select(QueryHistory).order_by(desc(QueryHistory.timestamp)).limit(limit)
    )
    history = result.scalars().all()
    return [_history_to_dict(h) for h in history]


@router.get("/{history_id}", response_model=Dict[str, Any])
async def get_history_item(history_id: str, db: AsyncSession = Depends(get_db)):
    """Return a single history record by ID."""
    result = await db.execute(
        select(QueryHistory).where(QueryHistory.history_id == history_id)
    )
    item: QueryHistory | None = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail=f"History record '{history_id}' not found.")
    return _history_to_dict(item)


@router.post("", response_model=Dict[str, Any])
async def create_history(payload: HistoryCreateRequest, db: AsyncSession = Depends(get_db)):
    """Persist a new query history entry."""
    item = QueryHistory(
        history_id=f"qh_{uuid.uuid4().hex[:10]}",
        query=payload.query,
        intent=payload.intent,
        entities=payload.entities,
        source=payload.source,
        response_time=payload.response_time,
        status=payload.status,
        cypher=payload.cypher,
        answer_summary=payload.answer_summary,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(item)
    await db.flush()
    return _history_to_dict(item)


@router.delete("/{history_id}")
async def delete_history_item(history_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a history record by ID."""
    result = await db.execute(
        select(QueryHistory).where(QueryHistory.history_id == history_id)
    )
    item: QueryHistory | None = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail=f"History record '{history_id}' not found.")
    await db.delete(item)
    return {"success": True, "deleted_id": history_id}
