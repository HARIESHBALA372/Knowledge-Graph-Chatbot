from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.db_seed import init_db

# Import API routers
from backend.routers.auth import router as auth_router
from backend.routers.chat import router as chat_router
from backend.routers.graph import router as graph_router
from backend.routers.documents import router as documents_router
from backend.routers.sources import router as sources_router
from backend.routers.analytics import router as analytics_router
from backend.routers.history import router as history_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the SQLite database and seed data on startup."""
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Knowledge Graph Chatbot Backend with Neo4j ontology and OpenRouter LLM reasoning.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
api_prefix = settings.API_PREFIX
app.include_router(auth_router, prefix=api_prefix)
app.include_router(chat_router, prefix=api_prefix)
app.include_router(graph_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(sources_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(history_router, prefix=api_prefix)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs"
    }

@app.get("/api/health")
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "primary_model": settings.PRIMARY_MODEL,
        "api_key_configured": bool(settings.OPENROUTER_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
