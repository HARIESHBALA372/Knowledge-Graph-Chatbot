// Realistic enterprise Knowledge Graph data and mock responses for Knowledge Graph Chatbot

export const MOCK_USER = {
  id: 'usr_01',
  name: 'Hariesh Raj',
  email: 'hariesh.raj@enterprise.ai',
  role: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Data Engineering & AI Architecture',
  lastLogin: '2026-09-18 16:30:12 IST',
  token: 'kg_auth_tok_892348a9f2bc8401',
};

// Full Knowledge Graph nodes and edges for Explorer and Chatbot
export const MOCK_GRAPH_DATA = {
  nodes: [
    {
      id: 'python',
      label: 'Python',
      type: 'Programming Language',
      properties: {
        creator: 'Guido van Rossum',
        yearCreated: '1991',
        paradigm: 'Multi-paradigm, Object-oriented, Functional',
        latestVersion: '3.12',
        domain: 'Data Science, Web, AI/ML',
        description: 'High-level, interpreted programming language emphasizing code readability and simplicity.'
      }
    },
    {
      id: 'guido',
      label: 'Guido van Rossum',
      type: 'Person',
      properties: {
        nationality: 'Dutch',
        title: 'Benevolent Dictator for Life (Emeritus)',
        affiliatedOrganization: 'Python Software Foundation, Microsoft',
        notableWork: 'Python Programming Language',
        description: 'Dutch programmer best known as the creator of the Python programming language.'
      }
    },
    {
      id: 'pytorch',
      label: 'PyTorch',
      type: 'Framework',
      properties: {
        developer: 'Meta AI',
        initialRelease: '2016',
        writtenIn: 'Python, C++, CUDA',
        license: 'Modified BSD',
        description: 'Open-source machine learning library used for applications such as computer vision and NLP.'
      }
    },
    {
      id: 'meta_ai',
      label: 'Meta AI',
      type: 'Organization',
      properties: {
        founded: '2013',
        headquarters: 'Menlo Park, CA',
        lead: 'Yann LeCun',
        domain: 'Artificial Intelligence, Deep Learning'
      }
    },
    {
      id: 'deep_learning',
      label: 'Deep Learning',
      type: 'Concept',
      properties: {
        subcategoryOf: 'Machine Learning',
        keyArchitecture: 'Neural Networks',
        mathematicalBasis: 'Linear Algebra, Calculus, Optimization',
        description: 'A class of machine learning algorithms that uses multiple layers to extract higher-level features.'
      }
    },
    {
      id: 'machine_learning',
      label: 'Machine Learning',
      type: 'Field',
      properties: {
        parentField: 'Artificial Intelligence',
        learningParadigms: 'Supervised, Unsupervised, Reinforcement',
        description: 'Study of computer algorithms that improve automatically through experience and by the use of data.'
      }
    },
    {
      id: 'artificial_intelligence',
      label: 'Artificial Intelligence',
      type: 'Field',
      properties: {
        formalized: '1956 (Dartmouth Workshop)',
        subfields: 'NLP, Computer Vision, Robotics, Knowledge Representation',
        description: 'Intelligence demonstrated by machines, as opposed to natural intelligence displayed by humans.'
      }
    },
    {
      id: 'neo4j',
      label: 'Neo4j',
      type: 'Software',
      properties: {
        category: 'Graph Database Management System',
        queryLanguage: 'Cypher',
        developer: 'Neo4j, Inc.',
        storageModel: 'Native Graph, Property Graph',
        description: 'ACID-compliant transactional graph database with native graph storage and processing.'
      }
    },
    {
      id: 'cypher',
      label: 'Cypher',
      type: 'Technology',
      properties: {
        purpose: 'Declarative Graph Query Language',
        syntaxPattern: 'ASCII-art style node & edge matching',
        standardization: 'OpenCypher, ISO GQL'
      }
    },
    {
      id: 'transformer',
      label: 'Transformer',
      type: 'Concept',
      properties: {
        introduced: '2017',
        paper: 'Attention Is All You Need',
        coreMechanism: 'Self-Attention',
        description: 'Deep learning architecture based on multi-head self-attention mechanisms without recurrent units.'
      }
    },
    {
      id: 'attention_paper',
      label: 'Attention Is All You Need',
      type: 'Paper',
      properties: {
        authors: 'Vaswani et al.',
        published: '2017',
        venue: 'NeurIPS 2017',
        citations: '110,000+'
      }
    },
    {
      id: 'chromadb',
      label: 'ChromaDB',
      type: 'Software',
      properties: {
        category: 'Vector Database',
        license: 'Apache 2.0',
        primaryUse: 'Semantic Search, LLM Embeddings, RAG',
        description: 'Open-source AI-native vector database designed to make building LLM apps simple.'
      }
    },
    {
      id: 'rag',
      label: 'Graph RAG',
      type: 'Concept',
      properties: {
        components: 'Knowledge Graph, Vector Search, LLM Synthesis',
        benefit: 'Reduces hallucination, provides structured provenance',
        description: 'Retrieval-Augmented Generation that combines semantic embeddings with structured knowledge graphs.'
      }
    },
    {
      id: 'yann_lecun',
      label: 'Yann LeCun',
      type: 'Person',
      properties: {
        award: 'Turing Award (2018)',
        notableContribution: 'Convolutional Neural Networks (CNNs)',
        role: 'Chief AI Scientist at Meta'
      }
    },
    {
      id: 'tensorflow',
      label: 'TensorFlow',
      type: 'Framework',
      properties: {
        developer: 'Google Brain',
        initialRelease: '2015',
        primaryLanguage: 'Python, C++',
        description: 'End-to-end open source platform for machine learning.'
      }
    },
    {
      id: 'google_brain',
      label: 'Google Brain',
      type: 'Organization',
      properties: {
        founded: '2011',
        mergedInto: 'Google DeepMind (2023)',
        notableProjects: 'TensorFlow, Word2Vec, Transformer'
      }
    },
    {
      id: 'gnn',
      label: 'Graph Neural Network',
      type: 'Concept',
      properties: {
        application: 'Node classification, Link prediction, Graph generation',
        mechanism: 'Message Passing Neural Networks (MPNN)',
        description: 'Class of deep learning methods designed to perform inference on data described by graphs.'
      }
    },
    {
      id: 'knowledge_graph',
      label: 'Knowledge Graph',
      type: 'Concept',
      properties: {
        definition: 'Structured representation of facts consisting of entities, relationships, and semantic descriptions.',
        formalisms: 'RDF, OWL, Property Graphs',
        useCases: 'Question Answering, Semantic Search, Entity Disambiguation'
      }
    }
  ],
  relationships: [
    { source: 'guido', target: 'python', label: 'CREATED' },
    { source: 'python', target: 'deep_learning', label: 'USED_FOR' },
    { source: 'pytorch', target: 'python', label: 'BUILT_WITH' },
    { source: 'meta_ai', target: 'pytorch', label: 'DEVELOPED' },
    { source: 'yann_lecun', target: 'meta_ai', label: 'LEADS' },
    { source: 'yann_lecun', target: 'deep_learning', label: 'CONTRIBUTED_TO' },
    { source: 'deep_learning', target: 'machine_learning', label: 'SUBFIELD_OF' },
    { source: 'machine_learning', target: 'artificial_intelligence', label: 'SUBFIELD_OF' },
    { source: 'transformer', target: 'deep_learning', label: 'ARCHITECTURE_IN' },
    { source: 'attention_paper', target: 'transformer', label: 'INTRODUCED' },
    { source: 'google_brain', target: 'attention_paper', label: 'PUBLISHED' },
    { source: 'google_brain', target: 'tensorflow', label: 'DEVELOPED' },
    { source: 'tensorflow', target: 'python', label: 'WRITTEN_IN' },
    { source: 'neo4j', target: 'cypher', label: 'USES_LANGUAGE' },
    { source: 'neo4j', target: 'knowledge_graph', label: 'IMPLEMENTS' },
    { source: 'rag', target: 'knowledge_graph', label: 'RETRIEVES_FROM' },
    { source: 'rag', target: 'chromadb', label: 'USES_VECTOR_STORE' },
    { source: 'gnn', target: 'knowledge_graph', label: 'OPERATES_ON' },
    { source: 'gnn', target: 'deep_learning', label: 'TYPE_OF' },
    { source: 'pytorch', target: 'gnn', label: 'SUPPORTS' }
  ]
};

// Pre-packaged conversational QA pairs with grounding metadata
export const MOCK_CHAT_SESSIONS = [
  {
    id: 'session_01',
    title: 'Python Creator & Ecosystem Analysis',
    createdAt: '2026-09-18T10:15:00Z',
    messages: [
      {
        id: 'msg_01',
        sender: 'user',
        text: 'Who created Python, and what domains is it utilized for in our Knowledge Graph?',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg_02',
        sender: 'assistant',
        text: 'Based on verified data in the **Knowledge Graph**, **Python** was created by **Guido van Rossum** in **1991**.\n\nWithin our ontology, Python is classified as a *Multi-paradigm Programming Language* with primary applications in:\n- **Data Science & Analytics**\n- **Artificial Intelligence & Deep Learning** (via frameworks such as *PyTorch* and *TensorFlow*)\n- **Web Application Development**\n- **Scientific Computing**\n\nThe graph confirms direct relationships linking Guido van Rossum via `[:CREATED]` to Python, and Python via `[:USED_FOR]` to Deep Learning.',
        timestamp: '10:15 AM',
        entities: [
          { name: 'Python', type: 'Programming Language', id: 'python' },
          { name: 'Guido van Rossum', type: 'Person', id: 'guido' },
          { name: 'Deep Learning', type: 'Concept', id: 'deep_learning' },
          { name: 'PyTorch', type: 'Framework', id: 'pytorch' }
        ],
        relationships: [
          { source: 'Guido van Rossum', relation: 'CREATED', target: 'Python' },
          { source: 'Python', relation: 'USED_FOR', target: 'Deep Learning' },
          { source: 'PyTorch', relation: 'BUILT_WITH', target: 'Python' }
        ],
        sources: [
          { title: 'Enterprise Knowledge Graph (Neo4j)', type: 'Knowledge Graph', confidence: 0.99, uri: 'neo4j://nodes/python' },
          { title: 'Doc 04: Python Language Specification & History', type: 'Document Store', confidence: 0.96, uri: 'docs://ref/python_spec.pdf' }
        ],
        query: {
          intent: 'Entity & Relationship Retrieval',
          entity: 'Python',
          cypher: 'MATCH (p:Person)-[r1:CREATED]->(l:Language {id: "python"})-[r2:USED_FOR]->(c:Concept) RETURN p, r1, l, r2, c LIMIT 10'
        },
        graphData: {
          nodes: [
            { id: 'guido', label: 'Guido van Rossum', type: 'Person' },
            { id: 'python', label: 'Python', type: 'Programming Language' },
            { id: 'deep_learning', label: 'Deep Learning', type: 'Concept' },
            { id: 'pytorch', label: 'PyTorch', type: 'Framework' }
          ],
          relationships: [
            { source: 'guido', target: 'python', label: 'CREATED' },
            { source: 'python', target: 'deep_learning', label: 'USED_FOR' },
            { source: 'pytorch', target: 'python', label: 'BUILT_WITH' }
          ]
        }
      }
    ]
  }
];

// Suggested questions
export const MOCK_SUGGESTED_PROMPTS = [
  'Who created Python?',
  'What entities are related to Python?',
  'Explain the relationship between PyTorch, Meta AI, and Deep Learning.',
  'How does Graph RAG integrate Knowledge Graphs and Vector Databases?',
  'What architecture did the paper "Attention Is All You Need" introduce?'
];

// Dynamic question responder
export function generateMockAnswer(questionText) {
  const q = questionText.toLowerCase();

  if (q.includes('python') || q.includes('guido')) {
    return {
      answer: 'According to our enterprise **Knowledge Graph**, **Python** is a high-level programming language conceived by **Guido van Rossum** and first released in **1991**.\n\nKey graph traversal insights:\n- **Creator**: Guido van Rossum (`[:CREATED]` relationship)\n- **Ecosystem**: Acts as the foundation for modern machine learning frameworks including **PyTorch** and **TensorFlow**\n- **Field**: Linked to **Deep Learning** and **Artificial Intelligence**\n\nAll retrieved triples have been verified against the underlying Neo4j property store.',
      entities: [
        { name: 'Python', type: 'Programming Language', id: 'python' },
        { name: 'Guido van Rossum', type: 'Person', id: 'guido' },
        { name: 'Deep Learning', type: 'Concept', id: 'deep_learning' },
        { name: 'PyTorch', type: 'Framework', id: 'pytorch' }
      ],
      relationships: [
        { source: 'Guido van Rossum', relation: 'CREATED', target: 'Python' },
        { source: 'Python', relation: 'USED_FOR', target: 'Deep Learning' },
        { source: 'PyTorch', relation: 'BUILT_WITH', target: 'Python' }
      ],
      sources: [
        { title: 'Neo4j Property Graph (Master Node)', type: 'Knowledge Graph', confidence: 0.99, uri: 'neo4j://nodes/python' },
        { title: 'Doc 04: Python Language Specification', type: 'Document Store', confidence: 0.95, uri: 'docs://ref/python_spec.pdf' }
      ],
      query: {
        intent: 'Entity Relationship Search',
        entity: 'Python',
        cypher: 'MATCH (p:Person {name: "Guido van Rossum"})-[:CREATED]->(l:Language {name: "Python"}) RETURN p, l'
      },
      graphData: {
        nodes: [
          { id: 'guido', label: 'Guido van Rossum', type: 'Person' },
          { id: 'python', label: 'Python', type: 'Programming Language' },
          { id: 'deep_learning', label: 'Deep Learning', type: 'Concept' },
          { id: 'pytorch', label: 'PyTorch', type: 'Framework' }
        ],
        relationships: [
          { source: 'guido', target: 'python', label: 'CREATED' },
          { source: 'python', target: 'deep_learning', label: 'USED_FOR' },
          { source: 'pytorch', target: 'python', label: 'BUILT_WITH' }
        ]
      }
    };
  }

  if (q.includes('pytorch') || q.includes('meta') || q.includes('lecun')) {
    return {
      answer: '**PyTorch** is an open-source deep learning framework actively developed and open-sourced by **Meta AI** in **2016**.\n\nKnowledge Graph traversal reveals:\n- **Developer**: Meta AI (`[:DEVELOPED]`)\n- **Leadership**: Yann LeCun serves as Chief AI Scientist leading AI initiatives at Meta\n- **Implementation**: Built in C++, CUDA, and tightly integrated with **Python**\n- **Capabilities**: Used to train complex neural network architectures like Transformers and Graph Neural Networks (GNNs).',
      entities: [
        { name: 'PyTorch', type: 'Framework', id: 'pytorch' },
        { name: 'Meta AI', type: 'Organization', id: 'meta_ai' },
        { name: 'Yann LeCun', type: 'Person', id: 'yann_lecun' },
        { name: 'Deep Learning', type: 'Concept', id: 'deep_learning' }
      ],
      relationships: [
        { source: 'Meta AI', relation: 'DEVELOPED', target: 'PyTorch' },
        { source: 'Yann LeCun', relation: 'LEADS', target: 'Meta AI' },
        { source: 'PyTorch', relation: 'BUILT_WITH', target: 'Python' }
      ],
      sources: [
        { title: 'Meta AI Open Source Repository', type: 'Knowledge Graph', confidence: 0.98, uri: 'neo4j://nodes/pytorch' },
        { title: 'PyTorch: An Imperative Style, High-Performance Deep Learning Library', type: 'Academic Paper', confidence: 0.97, uri: 'arxiv://1912.01703' }
      ],
      query: {
        intent: 'Organization & Framework Association',
        entity: 'PyTorch',
        cypher: 'MATCH (o:Organization)-[:DEVELOPED]->(f:Framework {name: "PyTorch"}) OPTIONAL MATCH (p:Person)-[:LEADS]->(o) RETURN o, f, p'
      },
      graphData: {
        nodes: [
          { id: 'pytorch', label: 'PyTorch', type: 'Framework' },
          { id: 'meta_ai', label: 'Meta AI', type: 'Organization' },
          { id: 'yann_lecun', label: 'Yann LeCun', type: 'Person' },
          { id: 'python', label: 'Python', type: 'Programming Language' }
        ],
        relationships: [
          { source: 'meta_ai', target: 'pytorch', label: 'DEVELOPED' },
          { source: 'yann_lecun', target: 'meta_ai', label: 'LEADS' },
          { source: 'pytorch', target: 'python', label: 'BUILT_WITH' }
        ]
      }
    };
  }

  if (q.includes('transformer') || q.includes('attention')) {
    return {
      answer: 'The **Transformer** architecture was introduced in the seminal 2017 paper *"Attention Is All You Need"* by researchers at **Google Brain** (Vaswani et al.).\n\nGraph properties and triples retrieved:\n- **Mechanism**: Eliminates recurrence in favor of multi-head self-attention mechanisms\n- **Publisher**: Google Brain (`[:PUBLISHED]`)\n- **Impact**: Serves as the core architectural backbone for modern Large Language Models (LLMs) and foundation models\n- **Citations**: Over 110,000 academic citations recorded in the graph index.',
      entities: [
        { name: 'Transformer', type: 'Concept', id: 'transformer' },
        { name: 'Attention Is All You Need', type: 'Paper', id: 'attention_paper' },
        { name: 'Google Brain', type: 'Organization', id: 'google_brain' },
        { name: 'Deep Learning', type: 'Concept', id: 'deep_learning' }
      ],
      relationships: [
        { source: 'Attention Is All You Need', relation: 'INTRODUCED', target: 'Transformer' },
        { source: 'Google Brain', relation: 'PUBLISHED', target: 'Attention Is All You Need' },
        { source: 'Transformer', relation: 'ARCHITECTURE_IN', target: 'Deep Learning' }
      ],
      sources: [
        { title: 'NeurIPS 2017 Proceedings: Attention Is All You Need', type: 'Academic Paper', confidence: 0.99, uri: 'arxiv://1706.03762' },
        { title: 'Google Research Publications Graph', type: 'Knowledge Graph', confidence: 0.98, uri: 'neo4j://papers/vaswani2017' }
      ],
      query: {
        intent: 'Paper & Architectural Lineage Search',
        entity: 'Transformer',
        cypher: 'MATCH (p:Paper)-[:INTRODUCED]->(c:Concept {name: "Transformer"}) OPTIONAL MATCH (o:Organization)-[:PUBLISHED]->(p) RETURN p, c, o'
      },
      graphData: {
        nodes: [
          { id: 'transformer', label: 'Transformer', type: 'Concept' },
          { id: 'attention_paper', label: 'Attention Is All You Need', type: 'Paper' },
          { id: 'google_brain', label: 'Google Brain', type: 'Organization' },
          { id: 'deep_learning', label: 'Deep Learning', type: 'Concept' }
        ],
        relationships: [
          { source: 'attention_paper', target: 'transformer', label: 'INTRODUCED' },
          { source: 'google_brain', target: 'attention_paper', label: 'PUBLISHED' },
          { source: 'transformer', target: 'deep_learning', label: 'ARCHITECTURE_IN' }
        ]
      }
    };
  }

  // Generic fallback grounded response
  return {
    answer: `The query **"${questionText}"** was processed by the Knowledge Graph reasoning pipeline.\n\nEntities and related triples were matched against the ontological schema. The Knowledge Graph links concepts across **Artificial Intelligence**, **Machine Learning**, and **Software Systems** to provide structured provenance and hallucination-free factual grounding.\n\nExplore the interactive sections below to inspect the extracted entities, active relationships, grounding citations, and the generated Cypher graph traversal.`,
    entities: [
      { name: 'Knowledge Graph', type: 'Concept', id: 'knowledge_graph' },
      { name: 'Artificial Intelligence', type: 'Field', id: 'artificial_intelligence' },
      { name: 'Machine Learning', type: 'Field', id: 'machine_learning' },
      { name: 'Graph RAG', type: 'Concept', id: 'rag' }
    ],
    relationships: [
      { source: 'Machine Learning', relation: 'SUBFIELD_OF', target: 'Artificial Intelligence' },
      { source: 'Graph RAG', relation: 'RETRIEVES_FROM', target: 'Knowledge Graph' }
    ],
    sources: [
      { title: 'Enterprise Ontological Store (Neo4j)', type: 'Knowledge Graph', confidence: 0.94, uri: 'neo4j://query/hybrid' },
      { title: 'Vector Semantic Index (ChromaDB)', type: 'Vector Database', confidence: 0.91, uri: 'chroma://embeddings/ai_concepts' }
    ],
    query: {
      intent: 'Semantic Graph Traversal',
      entity: 'Artificial Intelligence',
      cypher: 'MATCH (e)-[r]->(target) WHERE e.label CONTAINS "Intelligence" RETURN e, r, target LIMIT 5'
    },
    graphData: {
      nodes: [
        { id: 'knowledge_graph', label: 'Knowledge Graph', type: 'Concept' },
        { id: 'artificial_intelligence', label: 'Artificial Intelligence', type: 'Field' },
        { id: 'machine_learning', label: 'Machine Learning', type: 'Field' },
        { id: 'rag', label: 'Graph RAG', type: 'Concept' }
      ],
      relationships: [
        { source: 'machine_learning', target: 'artificial_intelligence', label: 'SUBFIELD_OF' },
        { source: 'rag', target: 'knowledge_graph', label: 'RETRIEVES_FROM' }
      ]
    }
  };
}

// Dashboard statistics
export const MOCK_DASHBOARD_STATS = {
  kpis: [
    {
      id: 'queries',
      title: 'Total Queries',
      value: '1,482',
      change: '+12.4%',
      trend: 'up',
      subtitle: 'vs. previous 30 days',
      icon: 'MessageSquare'
    },
    {
      id: 'entities',
      title: 'Knowledge Entities',
      value: '3,240',
      change: '+180',
      trend: 'up',
      subtitle: 'Across 8 entity categories',
      icon: 'Boxes'
    },
    {
      id: 'relationships',
      title: 'Relationships',
      value: '8,920',
      change: '+420',
      trend: 'up',
      subtitle: 'Directed labeled triples',
      icon: 'Share2'
    },
    {
      id: 'documents',
      title: 'Documents Ingested',
      value: '142',
      change: '100% indexed',
      trend: 'neutral',
      subtitle: 'PDF, TXT, JSON, DOCX',
      icon: 'FileText'
    },
    {
      id: 'active_users',
      title: 'Active Users',
      value: '28',
      change: '+4 this week',
      trend: 'up',
      subtitle: 'Researchers & Engineers',
      icon: 'Users'
    }
  ],
  queryActivity: [
    { date: 'Sep 12', queries: 42, latency: 280 },
    { date: 'Sep 13', queries: 58, latency: 260 },
    { date: 'Sep 14', queries: 73, latency: 245 },
    { date: 'Sep 15', queries: 64, latency: 270 },
    { date: 'Sep 16', queries: 89, latency: 230 },
    { date: 'Sep 17', queries: 112, latency: 215 },
    { date: 'Sep 18', queries: 138, latency: 205 }
  ],
  queryTypes: [
    { name: 'Entity Search', count: 480, percentage: 32 },
    { name: 'Relationship Traversal', count: 410, percentage: 28 },
    { name: 'Semantic / Hybrid Search', count: 370, percentage: 25 },
    { name: 'General Inquiries', count: 222, percentage: 15 }
  ],
  entityDistribution: [
    { name: 'Concepts & Theories', count: 860, color: '#2563eb' },
    { name: 'Software & Frameworks', count: 720, color: '#38bdf8' },
    { name: 'Persons & Researchers', count: 540, color: '#6366f1' },
    { name: 'Organizations & Labs', count: 430, color: '#0ea5e9' },
    { name: 'Academic Papers', count: 390, color: '#64748b' },
    { name: 'Programming Languages', count: 300, color: '#10b981' }
  ],
  recentQueries: [
    {
      id: 'q_101',
      question: 'Who created Python?',
      intent: 'Creator Search',
      entities: ['Python', 'Guido van Rossum'],
      responseTime: '210ms',
      timestamp: '2026-09-18 16:22',
      status: 'Success'
    },
    {
      id: 'q_102',
      question: 'What entities are related to Python?',
      intent: 'Ecosystem Traversal',
      entities: ['Python', 'PyTorch', 'TensorFlow'],
      responseTime: '245ms',
      timestamp: '2026-09-18 16:10',
      status: 'Success'
    },
    {
      id: 'q_103',
      question: 'Show the relationships of Machine Learning',
      intent: 'Taxonomy Search',
      entities: ['Machine Learning', 'Artificial Intelligence', 'Deep Learning'],
      responseTime: '190ms',
      timestamp: '2026-09-18 15:45',
      status: 'Success'
    },
    {
      id: 'q_104',
      question: 'Find documents related to Graph RAG',
      intent: 'Document Retrieval',
      entities: ['Graph RAG', 'Neo4j', 'ChromaDB'],
      responseTime: '310ms',
      timestamp: '2026-09-18 14:30',
      status: 'Success'
    },
    {
      id: 'q_105',
      question: 'Who developed PyTorch and what license does it use?',
      intent: 'Property Lookup',
      entities: ['PyTorch', 'Meta AI'],
      responseTime: '235ms',
      timestamp: '2026-09-18 13:12',
      status: 'Success'
    }
  ]
};

// Document inventory
export const MOCK_DOCUMENTS = [
  {
    id: 'doc_01',
    name: 'attention_is_all_you_need.pdf',
    type: 'PDF',
    size: '2.4 MB',
    source: 'Academic Corpus',
    entitiesExtracted: 42,
    relationshipsExtracted: 78,
    status: 'Completed',
    uploadedAt: '2026-09-15 11:20',
    processedBy: 'Worker-01 (Spacy + LLM)'
  },
  {
    id: 'doc_02',
    name: 'graph_rag_architecture_guide.docx',
    type: 'DOCX',
    size: '1.1 MB',
    source: 'Internal Knowledge Base',
    entitiesExtracted: 28,
    relationshipsExtracted: 54,
    status: 'Completed',
    uploadedAt: '2026-09-16 09:45',
    processedBy: 'Worker-02 (Graph Builder)'
  },
  {
    id: 'doc_03',
    name: 'neo4j_cypher_cheat_sheet.json',
    type: 'JSON',
    size: '480 KB',
    source: 'Technical Documentation',
    entitiesExtracted: 65,
    relationshipsExtracted: 112,
    status: 'Completed',
    uploadedAt: '2026-09-16 14:15',
    processedBy: 'Worker-01 (Direct Parser)'
  },
  {
    id: 'doc_04',
    name: 'python_language_reference.pdf',
    type: 'PDF',
    size: '4.8 MB',
    source: 'Language Foundation',
    entitiesExtracted: 84,
    relationshipsExtracted: 140,
    status: 'Completed',
    uploadedAt: '2026-09-17 10:00',
    processedBy: 'Worker-03 (Entity Extraction)'
  },
  {
    id: 'doc_05',
    name: 'gnn_algorithms_comparative_survey.pdf',
    type: 'PDF',
    size: '3.6 MB',
    source: 'Research Archive',
    entitiesExtracted: 36,
    relationshipsExtracted: 62,
    status: 'Completed',
    uploadedAt: '2026-09-17 16:30',
    processedBy: 'Worker-02 (Graph Builder)'
  },
  {
    id: 'doc_06',
    name: 'enterprise_ai_governance_framework.csv',
    type: 'CSV',
    size: '220 KB',
    source: 'Compliance Repository',
    entitiesExtracted: 19,
    relationshipsExtracted: 31,
    status: 'Completed',
    uploadedAt: '2026-09-18 08:15',
    processedBy: 'Worker-01 (Direct Parser)'
  }
];

// Connected Knowledge Sources
export const MOCK_KNOWLEDGE_SOURCES = [
  {
    id: 'source_neo4j',
    name: 'Neo4j Knowledge Graph',
    type: 'Graph Database',
    host: 'bolt://neo4j-cluster.internal:7687',
    status: 'Connected',
    lastSync: '10 minutes ago',
    records: '12,160 Nodes & Relationships',
    latency: '12ms',
    description: 'Primary native property graph store hosting labeled entities, taxonomic relationships, and ontological schemas.'
  },
  {
    id: 'source_chroma',
    name: 'ChromaDB Vector Store',
    type: 'Vector Database',
    host: 'http://chromadb-svc.internal:8000',
    status: 'Connected',
    lastSync: '18 minutes ago',
    records: '18,450 Embeddings (Text-Embedding-3)',
    latency: '24ms',
    description: 'Vector store for dense semantic context, chunk embeddings, and hybrid retrieval-augmented generation.'
  },
  {
    id: 'source_docs',
    name: 'Document Repository',
    type: 'Object Storage (MinIO / S3)',
    host: 's3://kg-enterprise-documents',
    status: 'Connected',
    lastSync: '1 hour ago',
    records: '142 Documents Processed',
    latency: '35ms',
    description: 'Unstructured document storage for academic papers, specifications, and project whitepapers.'
  },
  {
    id: 'source_scholar',
    name: 'Semantic Scholar Academic API',
    type: 'External REST API',
    host: 'https://api.semanticscholar.org/v1',
    status: 'Connected',
    lastSync: '2 hours ago',
    records: 'Dynamic External Lookup',
    latency: '140ms',
    description: 'External academic citation graph integration for retrieving author metadata and paper citations.'
  }
];

// Query History Log
export const MOCK_QUERY_HISTORY = [
  {
    id: 'qh_01',
    query: 'Who created Python and what year was it launched?',
    intent: 'Creator & Property Search',
    entities: ['Python', 'Guido van Rossum'],
    source: 'Knowledge Graph',
    responseTime: '210ms',
    status: 'Success',
    timestamp: '2026-09-18 16:22:04',
    cypher: 'MATCH (p:Person)-[:CREATED]->(l:Language {name: "Python"}) RETURN p.name, l.yearCreated',
    answerSummary: 'Python was created by Guido van Rossum in 1991 as an open-source programming language.'
  },
  {
    id: 'qh_02',
    query: 'What entities are related to Python?',
    intent: 'Neighborhood Expansion',
    entities: ['Python', 'PyTorch', 'Deep Learning', 'Guido van Rossum'],
    source: 'Knowledge Graph',
    responseTime: '245ms',
    status: 'Success',
    timestamp: '2026-09-18 16:10:18',
    cypher: 'MATCH (l:Language {name: "Python"})-[r]-(neighbor) RETURN l, r, neighbor LIMIT 25',
    answerSummary: 'Python is connected to Deep Learning (USED_FOR), PyTorch (BUILT_WITH), and Guido van Rossum (CREATED).'
  },
  {
    id: 'qh_03',
    query: 'How does Graph RAG integrate with ChromaDB and Neo4j?',
    intent: 'Architecture Inquiry',
    entities: ['Graph RAG', 'Neo4j', 'ChromaDB'],
    source: 'Hybrid (KG + Vector)',
    responseTime: '380ms',
    status: 'Success',
    timestamp: '2026-09-18 15:45:30',
    cypher: 'MATCH (r:Concept {name: "Graph RAG"})-[rel]->(db) RETURN r, rel, db',
    answerSummary: 'Graph RAG extracts dense embeddings via ChromaDB and combines them with structured triple paths from Neo4j.'
  },
  {
    id: 'qh_04',
    query: 'Find documents related to Transformer architecture',
    intent: 'Document Search',
    entities: ['Transformer', 'Attention Is All You Need', 'Google Brain'],
    source: 'Vector Store',
    responseTime: '290ms',
    status: 'Success',
    timestamp: '2026-09-18 14:12:05',
    cypher: 'MATCH (p:Paper {title: "Attention Is All You Need"}) RETURN p',
    answerSummary: 'Found 3 documents matching Attention Is All You Need and Transformer papers.'
  },
  {
    id: 'qh_05',
    query: 'Who leads AI research at Meta and what framework did they build?',
    intent: 'Entity Relationship Search',
    entities: ['Meta AI', 'Yann LeCun', 'PyTorch'],
    source: 'Knowledge Graph',
    responseTime: '230ms',
    status: 'Success',
    timestamp: '2026-09-18 13:08:44',
    cypher: 'MATCH (p:Person)-[:LEADS]->(o:Organization {name: "Meta AI"})-[:DEVELOPED]->(f:Framework) RETURN p, o, f',
    answerSummary: 'Yann LeCun leads Meta AI, which developed the PyTorch deep learning framework.'
  },
  {
    id: 'qh_06',
    query: 'Synthesize overview of Quantum Computing in our graph',
    intent: 'Domain Query',
    entities: ['Quantum Computing'],
    source: 'Knowledge Graph',
    responseTime: '410ms',
    status: 'Warning',
    timestamp: '2026-09-18 11:30:19',
    cypher: 'MATCH (n {name: "Quantum Computing"}) RETURN n',
    answerSummary: 'Limited entity density. Found 2 related nodes with low confidence score.'
  }
];

// Deep analytics data
export const MOCK_ANALYTICS = {
  kpiOverview: {
    totalQueries: 1482,
    successfulQueries: 1461,
    successRate: '98.6%',
    avgResponseTime: '238ms',
    graphQueries: 890,
    semanticQueries: 592
  },
  queriesOverTime: [
    { date: 'Aug 20', queries: 28, success: 27, avgLatency: 280 },
    { date: 'Aug 25', queries: 45, success: 44, avgLatency: 265 },
    { date: 'Aug 30', queries: 62, success: 61, avgLatency: 250 },
    { date: 'Sep 04', queries: 80, success: 79, avgLatency: 240 },
    { date: 'Sep 09', queries: 104, success: 102, avgLatency: 232 },
    { date: 'Sep 14', queries: 125, success: 123, avgLatency: 220 },
    { date: 'Sep 18', queries: 138, success: 136, avgLatency: 205 }
  ],
  typeDistribution: [
    { name: 'Entity Search', value: 480, fill: '#2563eb' },
    { name: 'Relationship Traversal', value: 410, fill: '#38bdf8' },
    { name: 'Hybrid Semantic Search', value: 370, fill: '#6366f1' },
    { name: 'General QA', value: 222, fill: '#64748b' }
  ],
  responseTimeDistribution: [
    { range: '< 100ms', count: 210 },
    { range: '100-200ms', count: 640 },
    { range: '200-300ms', count: 420 },
    { range: '300-500ms', count: 162 },
    { range: '> 500ms', count: 50 }
  ],
  mostSearchedEntities: [
    { name: 'Python', searches: 340, type: 'Programming Language' },
    { name: 'Transformer', searches: 290, type: 'Concept' },
    { name: 'PyTorch', searches: 245, type: 'Framework' },
    { name: 'Deep Learning', searches: 210, type: 'Concept' },
    { name: 'Neo4j', searches: 180, type: 'Software' },
    { name: 'Guido van Rossum', searches: 155, type: 'Person' },
    { name: 'ChromaDB', searches: 140, type: 'Software' },
    { name: 'Graph RAG', searches: 128, type: 'Concept' }
  ],
  topRelationships: [
    { relation: 'CREATED', count: 412 },
    { relation: 'SUBFIELD_OF', count: 388 },
    { relation: 'USED_FOR', count: 320 },
    { relation: 'DEVELOPED', count: 275 },
    { relation: 'INTRODUCED', count: 210 },
    { relation: 'RETRIEVES_FROM', count: 195 }
  ]
};
