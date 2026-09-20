import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MessageSquare,
  Network,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function EntityPanel({
  entity,
  relationships = [],
  allNodes = [],
  onClose,
  onSelectNeighbor,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!entity) return null;

  // Find incoming and outgoing relationships
  const outgoing = relationships
    .filter((r) => r.source === entity.id)
    .map((r) => {
      const targetNode = allNodes.find((n) => n.id === r.target);
      return {
        ...r,
        neighbor: targetNode || { id: r.target, label: r.target, type: 'Entity' },
      };
    });

  const incoming = relationships
    .filter((r) => r.target === entity.id)
    .map((r) => {
      const sourceNode = allNodes.find((n) => n.id === r.source);
      return {
        ...r,
        neighbor: sourceNode || { id: r.source, label: r.source, type: 'Entity' },
      };
    });

  const handleAskAbout = () => {
    navigate(`/chatbot?query=${encodeURIComponent(`What is ${entity.label} and how does it connect to other entities in the Knowledge Graph?`)}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(entity.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full lg:w-84 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-card p-4 flex flex-col max-h-[750px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Ontology Entity
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {entity.label}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="primary" size="sm">
              {entity.type}
            </Badge>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              title="Copy Entity ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{entity.id}</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description / Summary */}
      {entity.properties?.description && (
        <div className="py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {entity.properties.description}
          </p>
        </div>
      )}

      {/* Properties Table */}
      <div className="py-3 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Properties
        </h4>
        <div className="space-y-1.5 text-xs">
          {entity.properties && Object.keys(entity.properties).length > 0 ? (
            Object.entries(entity.properties)
              .filter(([k]) => k !== 'description')
              .map(([key, val]) => (
                <div key={key} className="flex justify-between items-start gap-2">
                  <span className="text-slate-400 dark:text-slate-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                    {String(val)}
                  </span>
                </div>
              ))
          ) : (
            <span className="text-slate-400 italic">No additional properties</span>
          )}
        </div>
      </div>

      {/* Relationships */}
      <div className="py-3 border-b border-slate-100 dark:border-slate-800 flex-1">
        <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Connected Triples</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({outgoing.length + incoming.length})
          </span>
        </h4>

        {/* Outgoing */}
        {outgoing.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-medium text-slate-400 block mb-1">
              Outgoing Relations
            </span>
            <div className="space-y-1.5">
              {outgoing.map((r, i) => (
                <div
                  key={i}
                  onClick={() => onSelectNeighbor && onSelectNeighbor(r.neighbor.id)}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center justify-between border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 block font-semibold">
                      {r.label} &rarr;
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {r.neighbor.label}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {r.neighbor.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incoming */}
        {incoming.length > 0 && (
          <div>
            <span className="text-[10px] font-medium text-slate-400 block mb-1">
              Incoming Relations
            </span>
            <div className="space-y-1.5">
              {incoming.map((r, i) => (
                <div
                  key={i}
                  onClick={() => onSelectNeighbor && onSelectNeighbor(r.neighbor.id)}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center justify-between border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-semibold">
                      &larr; {r.label}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {r.neighbor.label}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {r.neighbor.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 space-y-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAskAbout}
          icon={MessageSquare}
          className="w-full"
        >
          Ask Chatbot About Entity
        </Button>
      </div>
    </div>
  );
}
