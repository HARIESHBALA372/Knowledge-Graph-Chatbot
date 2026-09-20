import React, { useRef, useEffect } from 'react';
import {
  MessageSquarePlus,
  Trash2,
  History,
  Activity,
  Download,
  Info,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import ProcessingSteps from './ProcessingSteps';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

export default function ChatWindow({
  messages = [],
  isProcessing = false,
  onSendMessage,
  onNewChat,
  onClearChat,
  onToggleHistory,
  onSelectPrompt,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleExportChat = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kg_chat_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-card overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Knowledge Graph Assistant
              </h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Grounded Question Answering & Ontology Traversal
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={onNewChat}
            icon={MessageSquarePlus}
            title="Start new conversation"
          >
            New Chat
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={onToggleHistory}
            icon={History}
            title="Toggle conversation sessions"
          >
            Sessions
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleExportChat}
            icon={Download}
            title="Export conversation as JSON"
          />

          <Button
            variant="ghost"
            size="xs"
            onClick={onClearChat}
            icon={Trash2}
            title="Clear current messages"
          />
        </div>
      </div>

      {/* Conversation Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center py-10">
            <EmptyState
              icon={Activity}
              title="Start a conversation with the Knowledge Graph Assistant"
              description="Ask natural-language inquiries about entities, semantic relationships, or enterprise knowledge facts."
            />
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {/* Multi-step processing indicator */}
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <ProcessingSteps />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts & Chat input area */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 shrink-0">
        <SuggestedQuestions onSelectPrompt={onSelectPrompt} />
        <ChatInput onSendMessage={onSendMessage} disabled={isProcessing} />
      </div>
    </div>
  );
}
