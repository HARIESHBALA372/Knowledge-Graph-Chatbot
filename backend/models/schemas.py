from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ═════════════════════════════════════════
# Authentication Schemas
# ═════════════════════════════════════════
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: Optional[str] = None
    fullName: Optional[str] = None
    email: str
    password: str
    role: Optional[str] = "Researcher"

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: str
    department: str
    lastLogin: str
    token: str

class AuthResponse(BaseModel):
    success: bool
    user: UserProfile
    token: str

# ═════════════════════════════════════════
# Graph Schemas
# ═════════════════════════════════════════
class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Optional[Dict[str, Any]] = None

class GraphRelationship(BaseModel):
    source: str
    target: str
    label: str
    properties: Optional[Dict[str, Any]] = None

class GraphData(BaseModel):
    nodes: List[GraphNode] = []
    relationships: List[GraphRelationship] = []

class EntityDetail(GraphNode):
    incoming: List[Dict[str, Any]] = []
    outgoing: List[Dict[str, Any]] = []

# ═════════════════════════════════════════
# Chatbot Schemas
# ═════════════════════════════════════════
class ChatQueryRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None

class EntityItem(BaseModel):
    name: str
    type: str
    id: str

class RelationshipItem(BaseModel):
    source: str
    relation: str
    target: str

class SourceItem(BaseModel):
    title: str
    type: str
    confidence: float
    uri: str

class QueryMeta(BaseModel):
    intent: str
    entity: str
    cypher: str

class ChatMessageResponse(BaseModel):
    id: str
    sender: str = "assistant"
    text: str
    timestamp: str
    entities: List[EntityItem] = []
    relationships: List[RelationshipItem] = []
    sources: List[SourceItem] = []
    query: QueryMeta
    graphData: GraphData

# ═════════════════════════════════════════
# Document Schemas
# ═════════════════════════════════════════
class DocumentItem(BaseModel):
    id: str
    name: str
    type: str
    size: str
    source: str
    entitiesExtracted: int
    relationshipsExtracted: int
    status: str
    uploadedAt: str
    processedBy: str

class DocumentUploadResponse(BaseModel):
    success: bool
    document: DocumentItem

# ═════════════════════════════════════════
# Search Schemas
# ═════════════════════════════════════════
class SearchResponse(BaseModel):
    entities: List[GraphNode]
    relationships: List[GraphRelationship]
    documents: List[DocumentItem]
