import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Boxes,
  Share2,
  FileText,
  ArrowRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

export default function SearchPage() {
  const [query, setQuery] = useState('Python');
  const [results, setResults] = useState({ entities: [], relationships: [], documents: [] });
  const [activeTab, setActiveTab] = useState('all'); // all, entities, relationships, documents
  const [loading, setLoading] = useState(false);
  const [entityTypeFilter, setEntityTypeFilter] = useState('All');
  const navigate = useNavigate();

  const handleSearch = async (searchStr = query) => {
    setLoading(true);
    try {
      const data = await api.searchEntities(searchStr);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Python');
  }, []);

  const totalMatches =
    results.entities.length + results.relationships.length + results.documents.length;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Global Knowledge & Provenance Search
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Query nodes, labeled edges, ontology relationships, and ingested source documents simultaneously.
        </p>

        {/* Search Bar + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search entities, relationships, documents (e.g. 'Python', 'Transformer', 'LeCun')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSearch(query)}
            icon={Search}
          >
            Search
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Quick Filters:</span>
          {['Python', 'Machine Learning', 'Transformer', 'Neo4j', 'Guido'].map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                handleSearch(q);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-750 text-[11px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          All Results ({totalMatches})
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'entities'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Entities ({results.entities.length})
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'relationships'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Relationships ({results.relationships.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Documents ({results.documents.length})
        </button>
      </div>

      {/* Results Content */}
      {loading ? (
        <Loading text="Querying ontology store and inverted indices..." />
      ) : totalMatches === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching entities or records found"
          description="Try refining your query or explore related entities in the Knowledge Graph Explorer."
          actionLabel="Explore Knowledge Graph"
          onAction={() => navigate('/graph')}
        />
      ) : (
        <div className="space-y-6">
          {/* 1. Entities Section */}
          {(activeTab === 'all' || activeTab === 'entities') && results.entities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Boxes className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Matched Knowledge Entities ({results.entities.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.entities.map((ent) => (
                  <div
                    key={ent.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {ent.label}
                        </h4>
                        <Badge variant="primary" size="sm">
                          {ent.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                        {ent.properties?.description || 'Entity recorded in knowledge ontology.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => navigate(`/graph?entity=${encodeURIComponent(ent.id)}`)}
                        icon={ArrowRight}
                        iconPosition="right"
                        className="flex-1"
                      >
                        Inspect Node
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => navigate(`/chatbot?query=${encodeURIComponent(`What is ${ent.label}?`)}`)}
                        icon={MessageSquare}
                        title="Ask about this entity in chat"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Relationships Section */}
          {(activeTab === 'all' || activeTab === 'relationships') && results.relationships.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Identified Relationships ({results.relationships.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.relationships.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-subtle flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {rel.source}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                        [:{rel.label}] &rarr;
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {rel.target}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => navigate(`/chatbot?query=${encodeURIComponent(`Explain the relationship between ${rel.source} and ${rel.target}.`)}`)}
                      icon={MessageSquare}
                    >
                      Ask
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Documents Section */}
          {(activeTab === 'all' || activeTab === 'documents') && results.documents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Corpus Documents ({results.documents.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-subtle flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {doc.name}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {doc.type} &bull; {doc.size} &bull; {doc.entitiesExtracted} Entities
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigate('/documents')}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
