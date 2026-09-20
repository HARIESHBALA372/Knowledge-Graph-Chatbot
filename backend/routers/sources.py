"""
Sources router — backed by the SQLite `knowledge_sources` table.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models.db_models import KnowledgeSource

router = APIRouter(prefix="/sources", tags=["Knowledge Sources"])


def _source_to_dict(s: KnowledgeSource) -> Dict[str, Any]:
    return {
        "id": s.source_id,
        "name": s.name,
        "type": s.type,
        "host": s.host,
        "status": s.status,
        "lastSync": s.last_sync,
        "records": s.records,
        "latency": s.latency,
        "description": s.description,
    }


@router.get("", response_model=List[Dict[str, Any]])
async def list_sources(db: AsyncSession = Depends(get_db)):
    """Return all registered knowledge sources."""
    result = await db.execute(select(KnowledgeSource))
    sources = result.scalars().all()
    return [_source_to_dict(s) for s in sources]


@router.get("/{source_id}", response_model=Dict[str, Any])
async def get_source(source_id: str, db: AsyncSession = Depends(get_db)):
    """Return a single knowledge source by its ID."""
    result = await db.execute(
        select(KnowledgeSource).where(KnowledgeSource.source_id == source_id)
    )
    source: KnowledgeSource | None = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")
    return _source_to_dict(source)
