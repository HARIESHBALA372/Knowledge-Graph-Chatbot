import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ text = 'Loading data...', className = '', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
        <p className="text-sm font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-6 text-slate-500 dark:text-slate-400 gap-2.5 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin text-brand-500 shrink-0" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
  );
}
