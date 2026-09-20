import sys
import uvicorn
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    print("[INFO] Starting Knowledge Graph Chatbot Python Backend (FastAPI)...")
    print("[INFO] API Docs available at: http://localhost:8000/docs")
    print("[INFO] Health check: http://localhost:8000/api/health")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
