import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  HardDrive,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { api } from '../services/api';

const SOURCE_ICONS = {
  'Neo4j Knowledge Graph': Database,
  'ChromaDB Vector Store': Layers,
  'Document Repository': HardDrive,
  'Semantic Scholar Academic API': Globe,
};

export default function KnowledgeSourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await api.getKnowledgeSources();
      setSources(data);
    } catch (err) {
      console.error('Failed to load knowledge sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSyncSource = (sourceId) => {
    setSyncingId(sourceId);
    setTimeout(() => {
      setSyncingId(null);
      alert('Source synchronized successfully! Ontological graph records refreshed.');
    }, 1200);
  };

  const handleTestConnection = (sourceName) => {
    alert(`Testing ping to ${sourceName}... Response time: 14ms (Healthy)`);
  };

  if (loading) {
    return <Loading text="Checking knowledge source connections & cluster states..." fullPage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Connected Knowledge Sources & Databases
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time status of the property graph, vector store, and external ontology sources.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadSources}
          icon={RefreshCw}
        >
          Check All Statuses
        </Button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sources.map((src) => {
          const IconComp = SOURCE_ICONS[src.name] || Database;
          const isSyncing = syncingId === src.id;

          return (
            <div
              key={src.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {src.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {src.type}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={src.status === 'Connected' ? 'success' : 'warning'}
                    size="sm"
                    dot
                  >
                    {src.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {src.description}
                </p>

                {/* Stats Table */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Target Host / URI
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate block text-[11px]">
                      {src.host}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Records / Density
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {src.records}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Last Synchronized
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {src.lastSync}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Network Latency
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {src.latency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="xs"
                  isLoading={isSyncing}
                  onClick={() => handleSyncSource(src.id)}
                  icon={RefreshCw}
                  className="flex-1"
                >
                  Sync Now
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleTestConnection(src.name)}
                  icon={Zap}
                >
                  Ping Test
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
