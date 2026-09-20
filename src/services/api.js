import axios from 'axios';
import {
  MOCK_USER,
  MOCK_GRAPH_DATA,
  MOCK_DASHBOARD_STATS,
  MOCK_DOCUMENTS,
  MOCK_KNOWLEDGE_SOURCES,
  MOCK_QUERY_HISTORY,
  MOCK_ANALYTICS,
  MOCK_CHAT_SESSIONS,
  generateMockAnswer,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// ═══════════════════════════════════════════════════════
// OpenRouter LLM Configuration for Live Chatbot Responses
// ═══════════════════════════════════════════════════════
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
const USE_LIVE_LLM = import.meta.env.VITE_USE_LIVE_LLM === 'true' && !!OPENROUTER_API_KEY;

// Build a compact summary of the Knowledge Graph for the LLM system prompt
const KG_ENTITY_SUMMARY = MOCK_GRAPH_DATA.nodes
  .map((n) => `- ${n.label} (${n.type})${n.properties?.description ? ': ' + n.properties.description : ''}`)
  .join('\n');

const KG_RELATIONSHIP_SUMMARY = MOCK_GRAPH_DATA.relationships
  .map((r) => {
    const src = MOCK_GRAPH_DATA.nodes.find((n) => n.id === r.source);
    const tgt = MOCK_GRAPH_DATA.nodes.find((n) => n.id === r.target);
    return `- (${src?.label || r.source}) -[:${r.label}]-> (${tgt?.label || r.target})`;
  })
  .join('\n');

const KG_SYSTEM_PROMPT = `You are the **Knowledge Graph Chatbot** — an enterprise AI assistant that answers natural-language questions by querying a structured Knowledge Graph (Neo4j) and a vector database (ChromaDB).

## Your Knowledge Graph contains these entities:
${KG_ENTITY_SUMMARY}

## Known relationships (triples):
${KG_RELATIONSHIP_SUMMARY}

## Response Instructions
For EVERY user question, you MUST respond with a single valid JSON object (no markdown fences, no extra text before or after the JSON). The JSON must follow this exact schema:

{
  "answer": "<A clear, professional, grounded answer in markdown. Use **bold** for entity names. Reference specific relationships using [:PREDICATE] notation. Be thorough but concise.>",
  "entities": [
    { "name": "<entity name>", "type": "<entity type>", "id": "<lowercase_underscore_id>" }
  ],
  "relationships": [
    { "source": "<source entity name>", "relation": "<RELATIONSHIP_LABEL>", "target": "<target entity name>" }
  ],
  "sources": [
    { "title": "<source title>", "type": "<Knowledge Graph | Vector Database | Document Store>", "confidence": <0.0-1.0>, "uri": "<neo4j://... or chroma://...>" }
  ],
  "query": {
    "intent": "<one of: Entity Search, Relationship Traversal, Creator Search, Property Lookup, Taxonomy Search, Architecture Inquiry, Semantic Search, General QA>",
    "entity": "<primary entity mentioned>",
    "cypher": "<a plausible Cypher query for Neo4j that would retrieve this information>"
  },
  "graphData": {
    "nodes": [
      { "id": "<lowercase_id>", "label": "<Display Name>", "type": "<Entity Type>" }
    ],
    "relationships": [
      { "source": "<source_id>", "target": "<target_id>", "label": "<RELATIONSHIP>" }
    ]
  }
}

## Rules:
1. Only include entities and relationships that are relevant to the question.
2. The "answer" field should be rich, professional text with markdown formatting.
3. The "cypher" field should be a realistic Cypher query.
4. The "graphData" should contain only the subset of the graph relevant to the answer (2-6 nodes typically).
5. Always provide at least one source with a confidence score.
6. If the question is about something NOT in your knowledge graph, still answer helpfully but note it may not be in the current graph, and set confidence lower.
7. Output ONLY the JSON object. No explanation before or after it.`;

/**
 * Call the OpenRouter Chat Completions API with retry logic
 */
async function callOpenRouterLLM(userMessage, retries = 2) {
  const requestBody = {
    model: OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: KG_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.4,
    max_tokens: 2048,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Knowledge Graph Chatbot',
          },
          timeout: 30000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from LLM');
      }

      // Strip markdown fences if the model wrapped the JSON
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (err) {
      const status = err?.response?.status;
      const errMsg = err?.response?.data?.error?.message || err.message || '';
      console.warn(`[OpenRouter] Attempt ${attempt + 1} failed:`, errMsg);

      // Retry on 429 (rate limit) or 503 (overloaded)
      if ((status === 429 || status === 503 || errMsg.includes('overloaded')) && attempt < retries) {
        const backoff = (attempt + 1) * 1500;
        console.log(`[OpenRouter] Retrying in ${backoff}ms...`);
        await simulateDelay(backoff);
        continue;
      }

      throw err;
    }
  }
}

// Create Axios client instance for custom backend
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Service Error]:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Centralized API Service for Knowledge Graph Chatbot
 */
export const api = {
  // Authentication
  async login(credentials) {
    if (USE_MOCK) {
      await simulateDelay(600);
      if (credentials.email && credentials.password) {
        const user = { ...MOCK_USER, email: credentials.email };
        localStorage.setItem('kg_token', user.token);
        localStorage.setItem('kg_user', JSON.stringify(user));
        return { success: true, user, token: user.token };
      }
      throw new Error('Invalid email or password');
    }
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('kg_token', response.data.token);
      localStorage.setItem('kg_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    if (USE_MOCK) {
      await simulateDelay(800);
      const user = {
        ...MOCK_USER,
        name: userData.fullName || userData.name,
        email: userData.email,
        role: userData.role || 'Researcher',
      };
      localStorage.setItem('kg_token', user.token);
      localStorage.setItem('kg_user', JSON.stringify(user));
      return { success: true, user, token: user.token };
    }
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // ═══════════════════════════════════════════════
  // Chatbot Assistant — Live LLM or Mock Fallback
  // ═══════════════════════════════════════════════
  async sendChatMessage(payload) {
    // payload: { message: string, sessionId?: string }

    // ── Strategy 1: Live LLM via OpenRouter ──
    if (USE_LIVE_LLM) {
      try {
        console.log('[Chatbot] Sending to OpenRouter LLM:', payload.message);
        const llmResponse = await callOpenRouterLLM(payload.message);

        return {
          id: 'msg_' + Date.now(),
          sender: 'assistant',
          text: llmResponse.answer || 'No answer was generated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          entities: llmResponse.entities || [],
          relationships: llmResponse.relationships || [],
          sources: llmResponse.sources || [],
          query: llmResponse.query || { intent: 'General QA', entity: '', cypher: '' },
          graphData: llmResponse.graphData || { nodes: [], relationships: [] },
        };
      } catch (err) {
        console.warn('[Chatbot] OpenRouter LLM failed, falling back to mock data:', err.message);
        // Fall through to mock response below
        const mockData = generateMockAnswer(payload.message);
        return {
          id: 'msg_' + Date.now(),
          sender: 'assistant',
          text: mockData.answer + '\n\n> ⚠️ *Live LLM was temporarily unavailable. This response was generated from cached knowledge graph data.*',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          entities: mockData.entities,
          relationships: mockData.relationships,
          sources: mockData.sources,
          query: mockData.query,
          graphData: mockData.graphData,
        };
      }
    }

    // ── Strategy 2: Pure mock mode ──
    if (USE_MOCK) {
      await simulateDelay(900);
      const responseData = generateMockAnswer(payload.message);
      return {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: responseData.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        entities: responseData.entities,
        relationships: responseData.relationships,
        sources: responseData.sources,
        query: responseData.query,
        graphData: responseData.graphData,
      };
    }

    // ── Strategy 3: Custom backend API ──
    try {
      const response = await apiClient.post('/chat/query', payload);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, falling back to local reasoning model.');
      const fallback = generateMockAnswer(payload.message);
      return {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: fallback.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        entities: fallback.entities,
        relationships: fallback.relationships,
        sources: fallback.sources,
        query: fallback.query,
        graphData: fallback.graphData,
      };
    }
  },

  async getChatHistory(sessionId) {
    if (USE_MOCK) {
      await simulateDelay(400);
      return MOCK_CHAT_SESSIONS;
    }
    const response = await apiClient.get('/chat/history', { params: { sessionId } });
    return response.data;
  },

  // Knowledge Graph Explorer
  async getGraph(filters = {}) {
    if (USE_MOCK) {
      await simulateDelay(400);
      let nodes = [...MOCK_GRAPH_DATA.nodes];
      let relationships = [...MOCK_GRAPH_DATA.relationships];

      if (filters.entityType && filters.entityType !== 'All') {
        nodes = nodes.filter((n) => n.type === filters.entityType);
        const nodeIds = new Set(nodes.map((n) => n.id));
        relationships = relationships.filter(
          (r) => nodeIds.has(r.source) && nodeIds.has(r.target)
        );
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        nodes = nodes.filter(
          (n) =>
            n.label.toLowerCase().includes(query) ||
            n.type.toLowerCase().includes(query) ||
            n.properties?.description?.toLowerCase().includes(query)
        );
        const nodeIds = new Set(nodes.map((n) => n.id));
        relationships = relationships.filter(
          (r) => nodeIds.has(r.source) || nodeIds.has(r.target)
        );
      }

      return { nodes, relationships };
    }
    const response = await apiClient.get('/graph', { params: filters });
    return response.data;
  },

  async getEntity(entityId) {
    if (USE_MOCK) {
      await simulateDelay(250);
      const node = MOCK_GRAPH_DATA.nodes.find(
        (n) => n.id.toLowerCase() === entityId.toLowerCase() || n.label.toLowerCase() === entityId.toLowerCase()
      );
      if (!node) throw new Error('Entity not found');

      const incoming = MOCK_GRAPH_DATA.relationships
        .filter((r) => r.target === node.id)
        .map((r) => ({
          ...r,
          sourceNode: MOCK_GRAPH_DATA.nodes.find((n) => n.id === r.source),
        }));

      const outgoing = MOCK_GRAPH_DATA.relationships
        .filter((r) => r.source === node.id)
        .map((r) => ({
          ...r,
          targetNode: MOCK_GRAPH_DATA.nodes.find((n) => n.id === r.target),
        }));

      return { ...node, incoming, outgoing };
    }
    const response = await apiClient.get(`/graph/entities/${entityId}`);
    return response.data;
  },

  async searchEntities(query, filters = {}) {
    if (USE_MOCK) {
      await simulateDelay(350);
      const q = (query || '').toLowerCase();
      const matchedNodes = MOCK_GRAPH_DATA.nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          JSON.stringify(n.properties).toLowerCase().includes(q)
      );

      const matchedRels = MOCK_GRAPH_DATA.relationships.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q) ||
          r.target.toLowerCase().includes(q)
      );

      const matchedDocs = MOCK_DOCUMENTS.filter((d) =>
        d.name.toLowerCase().includes(q) || d.source.toLowerCase().includes(q)
      );

      return {
        entities: matchedNodes,
        relationships: matchedRels,
        documents: matchedDocs,
      };
    }
    const response = await apiClient.get('/search', { params: { q: query, ...filters } });
    return response.data;
  },

  // Document Management
  async getDocuments() {
    if (USE_MOCK) {
      await simulateDelay(300);
      return MOCK_DOCUMENTS;
    }
    const response = await apiClient.get('/documents');
    return response.data;
  },

  async uploadDocument(formData, onProgress) {
    if (USE_MOCK) {
      if (onProgress) {
        onProgress(30);
        await simulateDelay(400);
        onProgress(60);
        await simulateDelay(500);
        onProgress(90);
        await simulateDelay(300);
        onProgress(100);
      }
      return {
        success: true,
        document: {
          id: 'doc_' + Date.now(),
          name: formData.name || 'uploaded_document.pdf',
          type: 'PDF',
          size: '1.8 MB',
          source: 'User Upload',
          entitiesExtracted: 24,
          relationshipsExtracted: 39,
          status: 'Completed',
          uploadedAt: 'Just now',
          processedBy: 'Auto-Pipeline Worker',
        },
      };
    }
    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Knowledge Sources Status
  async getKnowledgeSources() {
    if (USE_MOCK) {
      await simulateDelay(300);
      return MOCK_KNOWLEDGE_SOURCES;
    }
    const response = await apiClient.get('/sources');
    return response.data;
  },

  // Dashboard & Analytics
  async getDashboardStats() {
    if (USE_MOCK) {
      await simulateDelay(350);
      return MOCK_DASHBOARD_STATS;
    }
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  async getAnalytics(timeRange = '30d') {
    if (USE_MOCK) {
      await simulateDelay(400);
      return MOCK_ANALYTICS;
    }
    const response = await apiClient.get('/analytics', { params: { range: timeRange } });
    return response.data;
  },

  // Query History
  async getQueryHistory(params = {}) {
    if (USE_MOCK) {
      await simulateDelay(300);
      return MOCK_QUERY_HISTORY;
    }
    const response = await apiClient.get('/history', { params });
    return response.data;
  },
};

function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
