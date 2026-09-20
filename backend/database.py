"""
Async SQLAlchemy database engine and session management.
Database file: backend/kg_chatbot.db (SQLite)
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

# ── Database URL ────────────────────────────────────────────────────────────
# Place the SQLite file next to this module so it is always discoverable.
_DB_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite+aiosqlite:///{os.path.join(_DB_DIR, 'kg_chatbot.db')}"

# ── Engine ──────────────────────────────────────────────────────────────────
engine = create_async_engine(
    DATABASE_URL,
    echo=False,          # set True to log SQL statements during development
    future=True,
    connect_args={"check_same_thread": False},  # required for SQLite
)

# ── Session factory ─────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# ── Base class for all ORM models ────────────────────────────────────────────
class Base(DeclarativeBase):
    pass

# ── FastAPI dependency ────────────────────────────────────────────────────────
async def get_db() -> AsyncSession:
    """Yield a database session, rolling back on error and closing on exit."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
