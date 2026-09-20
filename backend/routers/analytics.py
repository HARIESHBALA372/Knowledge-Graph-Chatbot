"""
Analytics router — computes live dashboard metrics from the SQLite database,
with a fallback to static store data for time-series charts.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.database import get_db
from backend.models.db_models import KGNode, KGRelationship, Document, QueryHistory, ChatMessage
from backend.data.knowledge_store import DASHBOARD_STATS_STORE, ANALYTICS_STORE

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    """Retrieve KPI summaries computed live from the database."""

    # Live counts
    node_count = (await db.execute(select(func.count()).select_from(KGNode))).scalar_one()
    rel_count = (await db.execute(select(func.count()).select_from(KGRelationship))).scalar_one()
    doc_count = (await db.execute(select(func.count()).select_from(Document))).scalar_one()
    query_count = (await db.execute(select(func.count()).select_from(QueryHistory))).scalar_one()

    # Build KPIs, replacing the static values with live DB counts
    kpis = [
        {
            "id": "queries",
            "title": "Total Queries",
            "value": f"{query_count:,}",
            "change": "+Live",
            "trend": "up",
            "subtitle": "Stored in SQLite history",
            "icon": "MessageSquare",
        },
        {
            "id": "entities",
            "title": "Knowledge Entities",
            "value": f"{node_count:,}",
            "change": "Live count",
            "trend": "up",
            "subtitle": "KG nodes in database",
            "icon": "Boxes",
        },
        {
            "id": "relationships",
            "title": "Relationships",
            "value": f"{rel_count:,}",
            "change": "Live count",
            "trend": "up",
            "subtitle": "Directed labeled triples",
            "icon": "Share2",
        },
        {
            "id": "documents",
            "title": "Documents Ingested",
            "value": f"{doc_count:,}",
            "change": "100% indexed",
            "trend": "neutral",
            "subtitle": "PDF, TXT, JSON, DOCX",
            "icon": "FileText",
        },
        {
            "id": "active_users",
            "title": "Active Users",
            "value": "28",
            "change": "+4 this week",
            "trend": "up",
            "subtitle": "Researchers & Engineers",
            "icon": "Users",
        },
    ]

    # Return live KPIs merged with static time-series / distribution charts
    return {
        **DASHBOARD_STATS_STORE,
        "kpis": kpis,
    }


@router.get("", response_model=Dict[str, Any])
async def get_analytics(
    range: Optional[str] = Query("30d"),
    db: AsyncSession = Depends(get_db),
):
    """Return detailed analytical data including live entity type distribution."""

    # Live entity type counts
    type_counts_result = await db.execute(
        select(KGNode.type, func.count(KGNode.id).label("cnt"))
        .group_by(KGNode.type)
        .order_by(func.count(KGNode.id).desc())
    )
    type_rows = type_counts_result.all()

    # Live top queried entities from history
    entity_counts: dict[str, int] = {}
    history_result = await db.execute(select(QueryHistory.entities))
    for (entities,) in history_result.all():
        for e in (entities or []):
            entity_counts[e] = entity_counts.get(e, 0) + 1

    most_searched = sorted(
        [{"name": k, "searches": v, "type": "Entity"} for k, v in entity_counts.items()],
        key=lambda x: x["searches"],
        reverse=True,
    )[:8]

    # Fall back to static if no history yet
    if not most_searched:
        most_searched = ANALYTICS_STORE.get("mostSearchedEntities", [])

    return {
        **ANALYTICS_STORE,
        "mostSearchedEntities": most_searched,
        "entityTypeDistribution": [
            {"name": row.type, "count": row.cnt} for row in type_rows
        ],
    }
