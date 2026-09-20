"""
Database seeder — populates the SQLite database with initial data
from the in-memory knowledge_store.py on first startup.
"""

import uuid
import bcrypt
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.database import engine, Base
from backend.models.db_models import (
    User, KGNode, KGRelationship, Document,
    KnowledgeSource, QueryHistory, ChatSession, ChatMessage
)
from backend.data.knowledge_store import (
    KNOWLEDGE_GRAPH, DOCUMENTS_STORE, KNOWLEDGE_SOURCES_STORE,
    QUERY_HISTORY_STORE, CHAT_SESSIONS_STORE
)


def _hash_pw(plain: str) -> str:
    """Hash a plaintext password with bcrypt."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


async def _count(session: AsyncSession, model) -> int:
    result = await session.execute(select(func.count()).select_from(model))
    return result.scalar_one()


async def init_db():
    """Create all tables and seed initial data if the database is empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from backend.database import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        await _seed_all(session)


async def _seed_all(session: AsyncSession):
    # ── Users ────────────────────────────────────────────────────────────────
    if await _count(session, User) == 0:
        admin = User(
            uid="usr_01",
            name="Hariesh Raj",
            email="hariesh.raj@enterprise.ai",
            hashed_pw=_hash_pw("Admin@1234"),
            role="Administrator",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            department="Data Engineering & AI Architecture",
            last_login=datetime.now(timezone.utc),
        )
        demo = User(
            uid="usr_02",
            name="Demo Researcher",
            email="researcher@enterprise.ai",
            hashed_pw=_hash_pw("Demo@1234"),
            role="Researcher",
            avatar="",
            department="AI Research",
            last_login=datetime.now(timezone.utc),
        )
        session.add_all([admin, demo])
        await session.flush()

    # ── KG Nodes ─────────────────────────────────────────────────────────────
    if await _count(session, KGNode) == 0:
        nodes = [
            KGNode(
                node_id=n["id"],
                label=n["label"],
                type=n["type"],
                properties=n.get("properties", {}),
            )
            for n in KNOWLEDGE_GRAPH["nodes"]
        ]
        session.add_all(nodes)
        await session.flush()

    # ── KG Relationships ──────────────────────────────────────────────────────
    if await _count(session, KGRelationship) == 0:
        rels = [
            KGRelationship(
                source_id=r["source"],
                target_id=r["target"],
                label=r["label"],
                properties=r.get("properties", {}),
            )
            for r in KNOWLEDGE_GRAPH["relationships"]
        ]
        session.add_all(rels)
        await session.flush()

    # ── Documents ─────────────────────────────────────────────────────────────
    if await _count(session, Document) == 0:
        docs = []
        for d in DOCUMENTS_STORE:
            try:
                dt = datetime.strptime(d["uploadedAt"], "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
            except Exception:
                dt = datetime.now(timezone.utc)
            docs.append(Document(
                doc_id=d["id"],
                name=d["name"],
                type=d["type"],
                size=d["size"],
                source=d["source"],
                entities_extracted=d["entitiesExtracted"],
                relationships_extracted=d["relationshipsExtracted"],
                status=d["status"],
                uploaded_at=dt,
                processed_by=d["processedBy"],
            ))
        session.add_all(docs)
        await session.flush()

    # ── Knowledge Sources ─────────────────────────────────────────────────────
    if await _count(session, KnowledgeSource) == 0:
        sources = [
            KnowledgeSource(
                source_id=s["id"],
                name=s["name"],
                type=s["type"],
                host=s["host"],
                status=s["status"],
                last_sync=s["lastSync"],
                records=s["records"],
                latency=s["latency"],
                description=s["description"],
            )
            for s in KNOWLEDGE_SOURCES_STORE
        ]
        session.add_all(sources)
        await session.flush()

    # ── Query History ─────────────────────────────────────────────────────────
    if await _count(session, QueryHistory) == 0:
        history = []
        for q in QUERY_HISTORY_STORE:
            try:
                ts = datetime.strptime(q["timestamp"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
            except Exception:
                ts = datetime.now(timezone.utc)
            history.append(QueryHistory(
                history_id=q["id"],
                query=q["query"],
                intent=q.get("intent", ""),
                entities=q.get("entities", []),
                source=q.get("source", "Knowledge Graph"),
                response_time=q.get("responseTime", ""),
                status=q.get("status", "Success"),
                cypher=q.get("cypher", ""),
                answer_summary=q.get("answerSummary", ""),
                timestamp=ts,
            ))
        session.add_all(history)
        await session.flush()

    # ── Chat Sessions + Messages ───────────────────────────────────────────────
    if await _count(session, ChatSession) == 0:
        for s in CHAT_SESSIONS_STORE:
            try:
                created = datetime.fromisoformat(s["createdAt"].replace("Z", "+00:00"))
            except Exception:
                created = datetime.now(timezone.utc)

            chat_session = ChatSession(
                session_id=s["id"],
                title=s.get("title", "Conversation"),
                created_at=created,
            )
            session.add(chat_session)
            await session.flush()

            for m in s.get("messages", []):
                msg = ChatMessage(
                    message_id=m["id"],
                    session_id=s["id"],
                    sender=m.get("sender", "user"),
                    text=m.get("text", ""),
                    entities=m.get("entities", []),
                    relationships=m.get("relationships", []),
                    sources=m.get("sources", []),
                    query_meta=m.get("query", {}),
                    graph_data=m.get("graphData", {}),
                )
                session.add(msg)

        await session.flush()

    await session.commit()
    print("[DB] Database initialized and seeded successfully.")
