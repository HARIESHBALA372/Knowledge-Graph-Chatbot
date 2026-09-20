import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  MessageSquare,
  Network,
  Bell,
  Lock,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            System & Application Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure default reasoning depth, ontology visualizations, response parameters, and privacy modes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={resetSettings}
            icon={RotateCcw}
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={handleSave}
            icon={Save}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 shadow-subtle">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>System configuration saved successfully.</span>
        </div>
      )}

      {/* 1. GENERAL SETTINGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            General & Localization
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Interface Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="light">Classic Light (Default)</option>
              <option value="dark">Enterprise Dark</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Ontology Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="en">English (US / Academic)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Audit Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST, UTC+5:30)</option>
              <option value="UTC">Universal Coordinated Time (UTC)</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. CHATBOT PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <MessageSquare className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Chatbot Reasoning Parameters
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Response Synthesis Length
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Controls verbosity and reasoning chain depth in synthesized answers
              </p>
            </div>
            <select
              value={settings.responseLength}
              onChange={(e) => updateSetting('responseLength', e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="concise">Concise (Factual facts only)</option>
              <option value="balanced">Balanced (Recommended)</option>
              <option value="detailed">Detailed (Includes multi-hop triples & proofs)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Show Citations & Grounding Sources
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Always render the provenance source list with similarity confidence scores
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showSources}
              onChange={(e) => updateSetting('showSources', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Render Subgraph Previews
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Embed interactive Cytoscape subgraphs directly inside assistant response cards
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showGraph}
              onChange={(e) => updateSetting('showGraph', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Enable Contextual Prompt Suggestions
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Suggest related graph entities and follow-up inquiry chips under the chat input
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableSuggestions}
              onChange={(e) => updateSetting('enableSuggestions', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* 3. KNOWLEDGE GRAPH SETTINGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Network className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Knowledge Graph Explorer Engine
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Default Graph Traversal Depth
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Number of hop levels expanded upon selecting an entity in the Explorer
              </p>
            </div>
            <select
              value={settings.defaultGraphDepth}
              onChange={(e) => updateSetting('defaultGraphDepth', Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value={1}>1 Hop (Direct Neighbors)</option>
              <option value={2}>2 Hops (Recommended)</option>
              <option value={3}>3 Hops (Extended Network)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Display Edge Relationship Labels
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Render directional predicate labels (e.g. `[:CREATED]`) directly along Cytoscape edges
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showEntityLabels}
              onChange={(e) => updateSetting('showEntityLabels', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* 4. PRIVACY & TELEMETRY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Privacy & Governance Logging
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Persist Conversation History
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Store conversation threads locally for session continuity across page reloads
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.saveChatHistory}
              onChange={(e) => updateSetting('saveChatHistory', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Query Telemetry & Latency Audit
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Record anonymized Cypher query benchmarks in the Query History audit trail
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.queryLogging}
              onChange={(e) => updateSetting('queryLogging', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
