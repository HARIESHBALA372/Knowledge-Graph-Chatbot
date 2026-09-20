import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import Button from '../common/Button';

export default function GraphToolbar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  layoutName,
  onLayoutChange,
  onFit,
  onReset,
  entityTypes = [],
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-subtle">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search input */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search entity node..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Entity Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Types ({entityTypes.length})</option>
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Layout Algorithm */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={layoutName}
            onChange={(e) => onLayoutChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="cose">Force-Directed (Cose)</option>
            <option value="breadthfirst">Hierarchical (Tree)</option>
            <option value="circle">Concentric Circle</option>
            <option value="grid">Orthogonal Grid</option>
          </select>
        </div>
      </div>

      {/* Canvas View Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          onClick={onFit}
          icon={Maximize2}
          title="Fit view to all nodes"
        >
          Fit Screen
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={onReset}
          icon={RotateCcw}
          title="Reset graph layout"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
