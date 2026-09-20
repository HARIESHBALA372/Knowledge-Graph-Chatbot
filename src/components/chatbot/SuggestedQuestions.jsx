import React from 'react';
import { Sparkles } from 'lucide-react';
import { MOCK_SUGGESTED_PROMPTS } from '../../data/mockData';

export default function SuggestedQuestions({ onSelectPrompt, prompts = MOCK_SUGGESTED_PROMPTS }) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="py-2.5">
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
        <span>Suggested Knowledge Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="text-left text-xs px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-750 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-subtle"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
