import React from 'react';
import { Database, Share2, Layers, ShieldCheck } from 'lucide-react';

export default function KnowledgeGraphStats({
  entities = 3240,
  relationships = 8920,
  distribution = [],
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Knowledge Graph Ontology Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Taxonomy density and entity category breakdown
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>99.4% Validated</span>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Entities</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {Number(entities).toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Triples</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {Number(relationships).toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Entity Types</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {distribution.length} Types
            </span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3">
          {distribution.map((item) => {
            const pct = Math.round((item.count / entities) * 100);
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {item.count} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color || '#2563eb',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
