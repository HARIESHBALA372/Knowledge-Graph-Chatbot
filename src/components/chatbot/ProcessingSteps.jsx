import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Cpu } from 'lucide-react';

const STEPS = [
  'Understanding question & intent...',
  'Identifying entities & disambiguating...',
  'Searching Knowledge Graph & Vector Store...',
  'Synthesizing grounded response...',
];

export default function ProcessingSteps() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 max-w-xl text-xs select-none">
      <div className="w-7 h-7 rounded-md bg-brand-500/10 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400 flex items-center justify-center shrink-0">
        <Cpu className="w-4 h-4 animate-pulse" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Graph Reasoning Engine Active
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
        </div>

        <div className="space-y-1.5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-2 transition-opacity duration-200 ${
                  idx > currentStepIndex ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                <span
                  className={`${
                    isCurrent
                      ? 'font-medium text-slate-900 dark:text-slate-100'
                      : isCompleted
                      ? 'text-slate-600 dark:text-slate-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
