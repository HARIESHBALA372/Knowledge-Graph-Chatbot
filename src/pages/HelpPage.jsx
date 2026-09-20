import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Network,
  Search,
  FileText,
  Terminal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'asking-questions', label: 'How to Ask Questions', icon: MessageSquare },
  { id: 'graph-explorer', label: 'Knowledge Graph Explorer', icon: Network },
  { id: 'entity-search', label: 'Entity & Triple Search', icon: Search },
  { id: 'documents', label: 'Document Ingestion', icon: FileText },
  { id: 'troubleshooting', label: 'Troubleshooting & FAQ', icon: HelpCircle },
];

const FAQS = [
  {
    q: 'How does the Knowledge Graph Chatbot eliminate LLM hallucinations?',
    a: 'The system uses Graph RAG (Retrieval-Augmented Generation). When a user submits a natural-language question, the system extracts entities, translates the intent into a declarative Cypher graph query, fetches verified factual triples directly from Neo4j, retrieves semantic embeddings from ChromaDB, and injects only validated facts into the LLM prompt context.',
  },
  {
    q: 'What query language is generated under the hood?',
    a: 'OpenCypher (and ISO GQL standard). The reasoning engine constructs queries like: MATCH (p:Person)-[:CREATED]->(l:Language {name: "Python"}) RETURN p, l.',
  },
  {
    q: 'Can I upload my own PDF or Word documents?',
    a: 'Yes. Navigate to the Documents page and click "Upload Document". The system processes the document through OCR, chunking, Named Entity Recognition (NER), and automatically updates the Knowledge Graph with discovered entities and relationships.',
  },
  {
    q: 'What is the difference between Graph Search and Vector Search?',
    a: 'Vector Search finds semantically similar text passages using dense vector embeddings (e.g. from ChromaDB). Knowledge Graph Search traverses discrete, deterministic factual relationships (e.g. Creator, Subfield, Developer in Neo4j). Combining both yields hybrid precision with semantic flexibility.',
  },
  {
    q: 'How do I connect my own live backend?',
    a: 'Set VITE_USE_MOCK=false in your .env file and specify VITE_API_BASE_URL=http://your-backend-host:8000/api. The centralized API client in src/services/api.js will automatically direct all HTTP calls to your FastAPI or Express server.',
  },
];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-subtle space-y-1 sticky top-20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
            Documentation Index
          </span>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Documentation Area */}
      <div className="flex-1 space-y-6">
        {/* Getting Started */}
        {activeSection === 'getting-started' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Getting Started with Knowledge Graph Chatbot
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Knowledge Graph Chatbot represents a state-of-the-art neuro-symbolic AI architecture that pairs the conversational fluency of Large Language Models (LLMs) with the verifiable ground truth of Knowledge Graphs (KG).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  1. Ask Questions
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Submit conversational inquiries like "Who created Python?" or "Explain Graph RAG".
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  2. Explore Triples
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Inspect the interactive graph canvas, entity properties, and directional relations.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  3. Verify Provenance
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review the exact Cypher match query, similarity metrics, and source documents.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How to Ask Questions */}
        {activeSection === 'asking-questions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Prompting & Inquiry Guidelines
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The query engine handles both single-hop entity lookups and complex multi-hop relational inquiries.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-brand-600 dark:text-brand-400 block mb-1">
                  Direct Entity & Creator Lookups
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] mb-1">
                  "Who created Python and in what year was it first launched?"
                </p>
                <p className="text-slate-400 text-[11px]">
                  Extracts entities: Python, Guido van Rossum; matches predicate: [:CREATED].
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-brand-600 dark:text-brand-400 block mb-1">
                  Multi-Hop Network Traversal
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] mb-1">
                  "What deep learning framework was developed by Meta AI and what language is it built with?"
                </p>
                <p className="text-slate-400 text-[11px]">
                  Traverses: (Meta AI) &rarr; [:DEVELOPED] &rarr; (PyTorch) &rarr; [:BUILT_WITH] &rarr; (Python).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Graph Explorer */}
        {activeSection === 'graph-explorer' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Knowledge Graph Explorer Reference
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Powered by Cytoscape.js, the explorer lets you navigate nodes, pan, zoom, apply physics layouts, and inspect entity properties in real-time.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 w-28 shrink-0">
                  Force-Directed:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Spring-embedded CoSE layout balancing edge springs and node repulsions.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 w-28 shrink-0">
                  Hierarchical:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Breadthfirst tree layout displaying taxonomy and class inheritance paths.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 w-28 shrink-0">
                  Entity Details:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Click any node to open the side inspector showing properties and connected triples.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Entity Search & Documents */}
        {(activeSection === 'entity-search' || activeSection === 'documents') && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Inverted Search & Ingestion Pipelines
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Unstructured documents are parsed through Spacy / LLM entity extractors to construct new nodes and edges in Neo4j. Inverted indices allow instant lookups across all properties and passages.
            </p>
          </div>
        )}

        {/* Troubleshooting & FAQ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions (Academic & Viva Reference)
            </h3>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
