"""
Graph router — reads nodes and relationships from the SQLite `kg_nodes` /
`kg_relationships` tables instead of the in-memory store.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from backend.database import get_db
from backend.models.db_models import KGNode, KGRelationship
from backend.models.schemas import GraphData, GraphNode, GraphRelationship, EntityDetail

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])


def _node_to_schema(n: KGNode) -> dict:
    return {
        "id": n.node_id,
        "label": n.label,
        "type": n.type,
        "properties": n.properties or {},
    }


def _rel_to_schema(r: KGRelationship) -> dict:
    return {
        "source": r.source_id,
        "target": r.target_id,
        "label": r.label,
        "properties": r.properties or {},
    }


@router.get("", response_model=GraphData)
async def get_graph(
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """Return all graph nodes and relationships (paginated)."""
    nodes_result = await db.execute(select(KGNode).limit(limit))
    nodes = nodes_result.scalars().all()

    rels_result = await db.execute(select(KGRelationship).limit(limit))
    rels = rels_result.scalars().all()

    return {
        "nodes": [_node_to_schema(n) for n in nodes],
        "relationships": [_rel_to_schema(r) for r in rels],
    }


@router.get("/entity/{entity_id}", response_model=EntityDetail)
async def get_entity(entity_id: str, db: AsyncSession = Depends(get_db)):
    """Return a single entity with its incoming and outgoing relationships."""
    result = await db.execute(select(KGNode).where(KGNode.node_id == entity_id))
    node: KGNode | None = result.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found.")

    # Outgoing relationships
    out_result = await db.execute(
        select(KGRelationship).where(KGRelationship.source_id == entity_id)
    )
    outgoing = [_rel_to_schema(r) for r in out_result.scalars().all()]

    # Incoming relationships
    in_result = await db.execute(
        select(KGRelationship).where(KGRelationship.target_id == entity_id)
    )
    incoming = [_rel_to_schema(r) for r in in_result.scalars().all()]

    return {
        **_node_to_schema(node),
        "incoming": incoming,
        "outgoing": outgoing,
    }


@router.get("/search", response_model=GraphData)
async def search_graph(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    """Full-text search across node labels and types."""
    pattern = f"%{q}%"
    nodes_result = await db.execute(
        select(KGNode).where(
            or_(KGNode.label.ilike(pattern), KGNode.type.ilike(pattern))
        ).limit(50)
    )
    nodes = nodes_result.scalars().all()

    node_ids = {n.node_id for n in nodes}
    rels_result = await db.execute(
        select(KGRelationship).where(
            or_(
                KGRelationship.source_id.in_(node_ids),
                KGRelationship.target_id.in_(node_ids),
            )
        ).limit(100)
    )
    rels = rels_result.scalars().all()

    return {
        "nodes": [_node_to_schema(n) for n in nodes],
        "relationships": [_rel_to_schema(r) for r in rels],
    }
