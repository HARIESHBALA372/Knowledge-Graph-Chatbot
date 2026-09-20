import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Boxes,
  Share2,
  FileText,
  Terminal,
  Network,
  Copy,
  Check,
  ExternalLink,
  Bot,
  User,
} from 'lucide-react';
import Badge from '../common/Badge';
import KnowledgeGraph from '../graph/KnowledgeGraph';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const navigate = useNavigate();

  // Collapsible drawers default state
  const [openSection, setOpenSection] = useState({
    entities: true,
    relationships: true,
    sources: false,
    query: false,
    graph: false,
  });

  const [copiedQuery, setCopiedQuery] = useState(false);

  const toggleSection = (sectionKey) => {
    setOpenSection((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleCopyCypher = (cypherText) => {
    navigator.clipboard.writeText(cypherText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
          <div className="bg-brand-600 text-white p-3.5 rounded-lg rounded-tr-none shadow-subtle text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{message.text}</p>
            <span className="text-[10px] text-brand-200 block text-right mt-1">
              {message.timestamp}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant Response
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[85%] w-full">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-subtle">
          <Bot className="w-4 h-4" />
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 shadow-card text-sm text-slate-800 dark:text-slate-200">
          {/* Header info */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                Knowledge Graph Engine
              </span>
              <Badge variant="primary" size="sm">
                Grounded
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {message.timestamp}
            </span>
          </div>

          {/* Core Grounded Answer Body */}
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed mb-4 text-slate-700 dark:text-slate-200 space-y-2">
            {message.text.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Expandable Sections */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* 1. Related Entities */}
            {message.entities && message.entities.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
                <button
                  type="button"
                  onClick={() => toggleSection('entities')}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-3.5 h-3.5 text-brand-500" />
                    <span>Related Entities ({message.entities.length})</span>
                  </div>
                  {openSection.entities ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSection.entities && (
                  <div className="p-3 pt-1 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {message.entities.map((ent, i) => (
                      <span
                        key={i}
                        onClick={() => navigate(`/graph?entity=${encodeURIComponent(ent.id || ent.name)}`)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-750 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                        title="Click to view in Graph Explorer"
                      >
                        <span className="font-medium">{ent.name}</span>
                        <span className="text-[10px] text-slate-400">({ent.type})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Relationships / Triples Flow */}
            {message.relationships && message.relationships.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
                <button
                  type="button"
                  onClick={() => toggleSection('relationships')}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Active Knowledge Triples ({message.relationships.length})</span>
                  </div>
                  {openSection.relationships ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSection.relationships && (
                  <div className="p-3 pt-1 space-y-1.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {message.relationships.map((rel, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {rel.source}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800/60">
                          [:{rel.relation || rel.label}] &rarr;
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {rel.target}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Sources & Citations */}
            {message.sources && message.sources.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
                <button
                  type="button"
                  onClick={() => toggleSection('sources')}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Grounding Sources ({message.sources.length})</span>
                  </div>
                  {openSection.sources ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSection.sources && (
                  <div className="p-3 pt-1 space-y-1.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {message.sources.map((src, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-800"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                              {src.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate font-mono">
                              {src.uri || src.type}
                            </span>
                          </div>
                        </div>
                        {src.confidence && (
                          <Badge variant="success" size="sm">
                            {Math.round(src.confidence * 100)}% Match
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Query Details & Cypher Translation */}
            {message.query && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
                <button
                  type="button"
                  onClick={() => toggleSection('query')}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Query Reasoning & Cypher Details</span>
                  </div>
                  {openSection.query ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSection.query && (
                  <div className="p-3 pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Intent: </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {message.query.intent}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Anchor Entity: </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {message.query.entity}
                        </span>
                      </div>
                    </div>

                    {message.query.cypher && (
                      <div className="relative mt-2">
                        <pre className="p-2.5 bg-slate-900 text-slate-200 rounded text-[11px] font-mono overflow-x-auto border border-slate-800">
                          {message.query.cypher}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopyCypher(message.query.cypher)}
                          className="absolute right-2 top-2 p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                          title="Copy Cypher Query"
                        >
                          {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. Subgraph Interactive Visualizer */}
            {message.graphData && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-850/50">
                <button
                  type="button"
                  onClick={() => toggleSection('graph')}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Retrieved Subgraph Canvas</span>
                  </div>
                  {openSection.graph ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {openSection.graph && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <KnowledgeGraph
                      nodes={message.graphData.nodes}
                      relationships={message.graphData.relationships}
                      height="260px"
                      layoutName="cose"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
