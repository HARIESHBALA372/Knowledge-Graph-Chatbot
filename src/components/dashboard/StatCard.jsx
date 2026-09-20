import React from 'react';
import {
  MessageSquare,
  Boxes,
  Share2,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const ICON_MAP = {
  MessageSquare,
  Boxes,
  Share2,
  FileText,
  Users,
};

export default function StatCard({ stat }) {
  const IconComponent = ICON_MAP[stat.icon] || Boxes;
  const isUp = stat.trend === 'up';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {stat.title}
        </span>
        <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {stat.value}
        </h3>
        {stat.change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isUp
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isUp && <TrendingUp className="w-3 h-3" />}
            {stat.change}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
        {stat.subtitle}
      </p>
    </div>
  );
}
