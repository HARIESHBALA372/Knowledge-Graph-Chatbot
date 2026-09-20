"""
SQLAlchemy ORM table definitions for the Knowledge Graph Chatbot.
Covers: users, graph nodes/relationships, documents, knowledge sources,
        query history, chat sessions, and chat messages.
"""

import json
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime,
    ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.database import Base


def _now():
    return datetime.now(timezone.utc)


# ═══════════════════════════════════════════════════════════
# Users
# ═══════════════════════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    uid         = Column(String(64), unique=True, index=True, nullable=False)   # e.g. "usr_01"
    name        = Column(String(128), nullable=False)
    email       = Column(String(256), unique=True, index=True, nullable=False)
    hashed_pw   = Column(String(512), nullable=False)
    role        = Column(String(64), default="Researcher")
    avatar      = Column(Text, default="")
    department  = Column(String(256), default="")
    last_login  = Column(DateTime(timezone=True), default=_now, onupdate=_now)
    created_at  = Column(DateTime(timezone=True), default=_now)

    sessions    = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    history     = relationship("QueryHistory", back_populates="user", cascade="all, delete-orphan")


# ═══════════════════════════════════════════════════════════
# Knowledge Graph
# ═══════════════════════════════════════════════════════════
class KGNode(Base):
    __tablename__ = "kg_nodes"

    id          = Column(Integer, primary_key=True, index=True)
    node_id     = Column(String(128), unique=True, index=True, nullable=False)  # e.g. "python"
    label       = Column(String(256), nullable=False)
    type        = Column(String(128), nullable=False)
    properties  = Column(JSON, default=dict)   # arbitrary key-value properties
    created_at  = Column(DateTime(timezone=True), default=_now)


class KGRelationship(Base):
    __tablename__ = "kg_relationships"

    id          = Column(Integer, primary_key=True, index=True)
    source_id   = Column(String(128), ForeignKey("kg_nodes.node_id"), nullable=False, index=True)
    target_id   = Column(String(128), ForeignKey("kg_nodes.node_id"), nullable=False, index=True)
    label       = Column(String(128), nullable=False)
    properties  = Column(JSON, default=dict)
    created_at  = Column(DateTime(timezone=True), default=_now)


# ═══════════════════════════════════════════════════════════
# Documents
# ═══════════════════════════════════════════════════════════
class Document(Base):
    __tablename__ = "documents"

    id                      = Column(Integer, primary_key=True, index=True)
    doc_id                  = Column(String(64), unique=True, index=True, nullable=False)
    name                    = Column(String(512), nullable=False)
    type                    = Column(String(32), default="TXT")
    size                    = Column(String(32), default="")
    source                  = Column(String(256), default="User Upload")
    entities_extracted      = Column(Integer, default=0)
    relationships_extracted = Column(Integer, default=0)
    status                  = Column(String(64), default="Completed")
    uploaded_at             = Column(DateTime(timezone=True), default=_now)
    processed_by            = Column(String(128), default="FastAPI Ingestion Worker")


# ═══════════════════════════════════════════════════════════
# Knowledge Sources
# ═══════════════════════════════════════════════════════════
class KnowledgeSource(Base):
    __tablename__ = "knowledge_sources"

    id          = Column(Integer, primary_key=True, index=True)
    source_id   = Column(String(64), unique=True, index=True, nullable=False)
    name        = Column(String(256), nullable=False)
    type        = Column(String(128), nullable=False)
    host        = Column(Text, default="")
    status      = Column(String(64), default="Connected")
    last_sync   = Column(String(64), default="")
    records     = Column(String(128), default="")
    latency     = Column(String(32), default="")
    description = Column(Text, default="")
    created_at  = Column(DateTime(timezone=True), default=_now)


# ═══════════════════════════════════════════════════════════
# Query History
# ═══════════════════════════════════════════════════════════
class QueryHistory(Base):
    __tablename__ = "query_history"

    id              = Column(Integer, primary_key=True, index=True)
    history_id      = Column(String(64), unique=True, index=True, nullable=False)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=True)
    query           = Column(Text, nullable=False)
    intent          = Column(String(256), default="")
    entities        = Column(JSON, default=list)    # list of entity name strings
    source          = Column(String(128), default="Knowledge Graph")
    response_time   = Column(String(32), default="")
    status          = Column(String(32), default="Success")
    cypher          = Column(Text, default="")
    answer_summary  = Column(Text, default="")
    timestamp       = Column(DateTime(timezone=True), default=_now)

    user            = relationship("User", back_populates="history")


# ═══════════════════════════════════════════════════════════
# Chat Sessions + Messages
# ═══════════════════════════════════════════════════════════
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id          = Column(Integer, primary_key=True, index=True)
    session_id  = Column(String(64), unique=True, index=True, nullable=False)
    title       = Column(String(512), default="New Conversation")
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at  = Column(DateTime(timezone=True), default=_now)

    user        = relationship("User", back_populates="sessions")
    messages    = relationship("ChatMessage", back_populates="session",
                               cascade="all, delete-orphan", order_by="ChatMessage.id")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id              = Column(Integer, primary_key=True, index=True)
    message_id      = Column(String(64), unique=True, index=True, nullable=False)
    session_id      = Column(String(64), ForeignKey("chat_sessions.session_id"), nullable=False)
    sender          = Column(String(32), default="user")   # "user" | "assistant"
    text            = Column(Text, nullable=False)
    entities        = Column(JSON, default=list)
    relationships   = Column(JSON, default=list)
    sources         = Column(JSON, default=list)
    query_meta      = Column(JSON, default=dict)
    graph_data      = Column(JSON, default=dict)
    timestamp       = Column(DateTime(timezone=True), default=_now)

    session         = relationship("ChatSession", back_populates="messages")
