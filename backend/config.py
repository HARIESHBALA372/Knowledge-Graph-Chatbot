import os
from pathlib import Path
from dotenv import load_dotenv

# Load root .env first, then optional backend/.env
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "Knowledge Graph Chatbot Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Server Config
    HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    DEBUG: bool = os.getenv("BACKEND_DEBUG", "True").lower() in ("true", "1", "yes")

    # OpenRouter API Key and Models
    OPENROUTER_API_KEY: str = os.getenv(
        "OPENROUTER_API_KEY",
        os.getenv("VITE_OPENROUTER_API_KEY", "")
    )
    
    # Model configuration with auto-fallback cascade
    PRIMARY_MODEL: str = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-v4-flash-0731:free")
    FALLBACK_MODELS: list[str] = [
        "deepseek/deepseek-v4-flash-0731:free",
        "nex-agi/nex-n2.5-mini:free",
        "liquid/lfm-2.5-2.6b:free",
        "nvidia/nemotron-3.5-lightning:free",
        "google/gemma-4-26b-a4b-it:free",
        "qwen/qwen3.8-27b:free",
        "z-ai/glm-5.2:free"
    ]
    
    # CORS Origins for frontend communication
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()
