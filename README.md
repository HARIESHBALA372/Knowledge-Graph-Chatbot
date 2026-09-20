# Knowledge Graph Chatbot — Enterprise Frontend Platform

> **AI-Powered Knowledge Discovery & Graph RAG Assistant**  
> An enterprise-grade, classic, academic-ready web application that couples Large Language Models (LLMs) with multi-hop property knowledge graphs (Neo4j) and vector databases (ChromaDB) to deliver verifiable, hallucination-free, and grounded answers.

---

## 1. System Overview

**Knowledge Graph Chatbot** is a neuro-symbolic enterprise platform built for academic evaluations, viva demonstrations, college capstone defense, and real-world production prototypes.

Unlike naive RAG systems that rely solely on fuzzy vector similarity, this system:
1. **Understands Natural Language Inquiries**: Disambiguates named entities and user intent.
2. **Translates Intents into Graph Traversals**: Automatically generates declarative Cypher graph pattern matches.
3. **Inspects Structured Multi-Hop Triples**: Verifies ontological relationships directly in the graph database.
4. **Retrieves Hybrid Semantic Passages**: Employs ChromaDB vector store embeddings for unstructured text.
5. **Synthesizes Grounded Proofs**: Delivers clear answers with clickable entity chips, interactive subgraph canvases, Cypher queries, and confidence-scored citations.

---

## 2. Technology Stack

### Frontend Architecture
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast ESM build tooling)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) with custom enterprise design tokens (Deep Navy, Slate, Crisp Neutrals)
- **Routing**: [React Router v6](https://reactrouter.com/) (12 full enterprise pages, persistent sidebar, dynamic breadcrumbs)
- **Graph Visualization**: [Cytoscape.js](https://js.cytoscape.org/) (Canvas-based rendering, physics layout algorithms, node/edge inspection, pan/zoom)
- **Data Analytics & Charts**: [Recharts](https://recharts.org/) (Area charts, bar charts, donut breakdowns, latency histograms)
- **Icons**: [Lucide React](https://lucide.dev/) (clean, consistent enterprise iconography)
- **HTTP & API Layer**: [Axios](https://axios-http.com/) (centralized interceptors, timeout handling, and automatic mock-mode fallback)

### Backend Architecture (Python)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance, async Python web framework)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (High-speed asynchronous server runner)
- **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/) (Strict type checking, response modeling)
- **LLM Integration**: [OpenRouter API](https://openrouter.ai/) (Unified API client for Gemini, DeepSeek, Gemma, Qwen, Nemotron)
- **Interactive Documentation**: Auto-generated Swagger UI (`http://localhost:8000/docs`) and ReDoc (`http://localhost:8000/redoc`)
- **Knowledge Graph Reasoning Engine**: Ontology store, multi-hop triple matching, and Cypher query synthesis

---

## 3. Quick Start (Running Both Frontend & Backend)

### 1. Launch the Python Backend
```bash
# In project root:
python run_backend.py
# Or directly with uvicorn:
uvicorn backend.main:app --reload --port 8000
```
Backend will be available at:
- **API Base**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

### 2. Launch the React Frontend
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`.


---

## 4. Project Architecture & Directory Structure

```
knowledge-graph-chatbot/
├── index.html                     # HTML5 shell with Inter & JetBrains Mono fonts
├── vite.config.js                 # Vite bundler & alias configuration
├── tailwind.config.js             # Theme tokens, custom colors, dark mode
├── package.json                   # Dependencies and scripts
├── .env                           # Environment configuration
├── run_backend.py                 # Convenience runner for FastAPI backend
├── backend/                       # Python FastAPI Backend
│   ├── main.py                    # FastAPI application, CORS, and routing
│   ├── config.py                  # OpenRouter and server configuration
│   ├── requirements.txt           # Python backend dependencies
│   ├── models/schemas.py          # Pydantic schemas for validation
│   ├── services/
│   │   ├── llm_service.py         # OpenRouter API client & KG reasoning fallback
│   │   └── graph_service.py       # Knowledge Graph querying & subgraph extraction
│   ├── routers/                   # API routes (/auth, /chat, /graph, /docs, etc.)
│   └── data/knowledge_store.py    # Ontology store & system data
├── src/
│   ├── main.jsx                   # Application bootstrap & Context wrappers
│   ├── App.jsx                    # React Router route registry
│   ├── index.css                  # Global styles, custom scrollbars, canvas CSS
│   │
│   ├── context/                   # Global state providers
│   │   ├── AuthContext.jsx        # User profile, role, and token management
│   │   ├── ThemeContext.jsx       # Light & Dark theme management
│   │   └── SettingsContext.jsx    # Application, graph, and chatbot preferences
│   │
│   ├── services/
│   │   └── api.js                 # Centralized Axios API service with mock fallback
│   │
│   ├── data/
│   │   └── mockData.js            # Comprehensive AI & CS ontology mock dataset
│   │
│   ├── components/
│   │   ├── common/                # Reusable design system components
│   │   │   ├── Button.jsx         # Accessible buttons (primary, secondary, danger, ghost)
│   │   │   ├── Badge.jsx          # Semantic status & entity type badges
│   │   │   ├── Modal.jsx          # Accessible dialog with backdrop & escape key
│   │   │   ├── Table.jsx          # Responsive data tables
│   │   │   ├── Pagination.jsx     # Table pagination controls
│   │   │   ├── EmptyState.jsx     # Clean empty states
│   │   │   ├── ErrorState.jsx     # Error boundary & retry cards
│   │   │   └── Loading.jsx        # Skeleton loaders & spinners
│   │   │
│   │   ├── layout/                # Persistent application frame
│   │   │   ├── Sidebar.jsx        # Left navigation with collapsible mode & profile card
│   │   │   ├── TopNavbar.jsx      # Header, breadcrumbs, search (Ctrl+K), theme toggle
│   │   │   ├── Breadcrumb.jsx     # Dynamic path navigation
│   │   │   └── AppLayout.jsx      # Responsive shell linking sidebar and content
│   │   │
│   │   ├── chatbot/               # Chatbot engine interface
│   │   │   ├── ChatWindow.jsx     # Chat conversation container & action header
│   │   │   ├── ChatMessage.jsx    # Assistant bubble with collapsible grounding drawers
│   │   │   ├── ChatInput.jsx      # Multi-line input, voice mock, file upload
│   │   │   ├── SuggestedQuestions.jsx # Clickable sample inquiry chips
│   │   │   └── ProcessingSteps.jsx# Multi-stage reasoning pipeline indicator
│   │   │
│   │   ├── graph/                 # Knowledge Graph visualization
│   │   │   ├── KnowledgeGraph.jsx # Interactive Cytoscape.js canvas
│   │   │   ├── GraphToolbar.jsx   # Layout switcher, type filters, search, zoom/fit
│   │   │   └── EntityPanel.jsx    # Side panel showing properties & connected triples
│   │   │
│   │   └── dashboard/             # Analytics cards & charts
│   │       ├── StatCard.jsx       # KPI card with trend indicator
│   │       ├── QueryActivityChart.jsx # Recharts line chart
│   │       ├── QueryTypeChart.jsx # Recharts bar chart
│   │       ├── KnowledgeGraphStats.jsx # Ontology density progress bars
│   │       └── RecentQueriesTable.jsx  # Recent queries audit table
│   │
│   └── pages/                     # 12 Complete Enterprise Pages
│       ├── LoginPage.jsx          # Split-screen auth with demo credentials
│       ├── RegisterPage.jsx       # Account registration & password strength
│       ├── Dashboard.jsx          # Main platform overview & KPIs
│       ├── ChatbotPage.jsx        # Core conversational AI interface
│       ├── GraphExplorerPage.jsx  # Fullscreen Cytoscape knowledge graph
│       ├── SearchPage.jsx         # Inverted search across entities & documents
│       ├── DocumentsPage.jsx      # Document repository & drag-and-drop upload
│       ├── KnowledgeSourcesPage.jsx # Neo4j, ChromaDB, and API cluster status
│       ├── QueryHistoryPage.jsx   # Forensic query audit log & CSV export
│       ├── AnalyticsPage.jsx      # Deep analytical charts & latency breakdown
│       ├── ProfilePage.jsx        # User profile, role, and security settings
│       ├── SettingsPage.jsx       # Graph depth, response length, privacy switches
│       └── HelpPage.jsx           # Technical documentation portal & FAQ accordion
```

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js v18.x, v20.x, or v22.x+
- npm v9+

### Installation Steps

1. **Clone or navigate to the repository directory**:
   ```bash
   cd "c:/Users/Hariesh Raj/OneDrive/Knowledge Graph Chatbot"
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 5. Environment Variables Configuration

Create or modify `.env` in the root directory:

```ini
# Knowledge Graph Chatbot Environment Configuration
# API base URL for FastAPI / Express / Flask backend
VITE_API_BASE_URL=http://localhost:8000/api

# Standalone Evaluation Mode
# Set to 'true' to run with built-in realistic mock data (Zero backend required!)
# Set to 'false' to connect to live backend services
VITE_USE_MOCK=true

# Application Branding
VITE_APP_TITLE="Knowledge Graph Chatbot"
```

---

## 6. Backend Integration Guide

When `VITE_USE_MOCK=false`, the centralized client in `src/services/api.js` expects the following REST endpoints:

### A. Chat Query Endpoint
- **URL**: `POST /api/chat/query`
- **Request Body**:
  ```json
  {
    "message": "Who created Python?",
    "sessionId": "session_01"
  }
  ```
- **Expected Response (Exact Specification)**:
  ```json
  {
    "answer": "Python was created by Guido van Rossum in 1991.",
    "entities": [
      { "name": "Python", "type": "Programming Language", "id": "python" },
      { "name": "Guido van Rossum", "type": "Person", "id": "guido" }
    ],
    "relationships": [
      { "source": "Guido van Rossum", "relation": "CREATED", "target": "Python" }
    ],
    "sources": [
      { "title": "Knowledge Base (Neo4j)", "type": "Knowledge Graph", "confidence": 0.98, "uri": "neo4j://nodes/python" }
    ],
    "query": {
      "intent": "Creator Search",
      "entity": "Python",
      "cypher": "MATCH (p:Person)-[:CREATED]->(l:Language {name: 'Python'}) RETURN p, l"
    },
    "graphData": {
      "nodes": [
        { "id": "python", "label": "Python", "type": "Programming Language" },
        { "id": "guido", "label": "Guido van Rossum", "type": "Person" }
      ],
      "relationships": [
        { "source": "guido", "target": "python", "label": "CREATED" }
      ]
    }
  }
  ```

### B. Graph Explorer Endpoint
- **URL**: `GET /api/graph?search=...&entityType=...`
- **Expected Response**:
  ```json
  {
    "nodes": [
      {
        "id": "python",
        "label": "Python",
        "type": "Programming Language",
        "properties": { "creator": "Guido van Rossum", "year": "1991" }
      }
    ],
    "relationships": [
      { "source": "guido", "target": "python", "label": "CREATED" }
    ]
  }
  ```

### C. Sample FastAPI Backend Implementation (Reference)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Knowledge Graph Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    sessionId: str = None

@app.post("/api/chat/query")
async def handle_query(req: ChatRequest):
    # Connect to your Neo4j driver and LLM chain here
    return {
        "answer": f"Processed query: {req.message}",
        "entities": [{"name": "Python", "type": "Programming Language", "id": "python"}],
        "relationships": [{"source": "Guido van Rossum", "relation": "CREATED", "target": "Python"}],
        "sources": [{"title": "Neo4j Property Store", "type": "Knowledge Graph", "confidence": 0.99}],
        "query": {
            "intent": "Entity Traversal",
            "entity": "Python",
            "cypher": "MATCH (n:Entity {name: 'Python'})-[r]->(m) RETURN n, r, m"
        }
    }
```

---

## 7. Key Features for Academic Presentations & Viva

1. **Zero Hallucination Proof**:
   - Each answer includes collapsible drawers showing exact triples (`[:CREATED]`, `[:USED_FOR]`, etc.) retrieved from the graph.
2. **Multi-Model Graph Visualization**:
   - Switch between **Force-Directed (CoSE)** physics, **Hierarchical (Tree)**, and **Concentric Circle** algorithms.
3. **Interactive Mini-Graph**:
   - Every chatbot answer contains an optional mini Cytoscape canvas previewing only the relevant subgraph.
4. **Document Ingestion Pipeline Simulation**:
   - Visual step-by-step progress: *Uploading &rarr; OCR / Chunking &rarr; NER Entity Extraction &rarr; Triples Ingestion*.
5. **Keyboard Accessibility & Shortcuts**:
   - Global quick search with `Ctrl+K` shortcut.
   - Enter to send, Shift+Enter for newline in chat.
6. **Dark & Light Mode**:
   - Restrained enterprise contrast with zero neon/gaming distractions.

---

## 8. Troubleshooting

- **Vite port in use**:
  If port `5173` is busy, run `npm run dev -- --port 3000`.
- **Backend disconnected**:
  If your backend is not yet started, ensure `VITE_USE_MOCK=true` in `.env`. The frontend will operate completely independently with full mock data.
- **Node module errors**:
  Run `npm clean-install` or delete `node_modules` and run `npm install`.

---

&copy; 2026 Knowledge Graph Chatbot Platform. Developed for Academic Excellence and Enterprise Knowledge Discovery.
"# Knowledge-Graph-Chatbot" 
