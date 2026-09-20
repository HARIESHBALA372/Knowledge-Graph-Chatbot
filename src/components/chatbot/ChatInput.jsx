import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  X,
  CornerDownLeft,
} from 'lucide-react';
import Button from '../common/Button';

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Voice input simulation
      setTimeout(() => {
        setText('What entities are related to Python?');
        setIsRecording(false);
      }, 1800);
    }
  };

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setText((prev) => `${prev} [Attached: ${file.name}] `);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-card p-2.5 transition-all focus-within:border-brand-500/80 focus-within:ring-1 focus-within:ring-brand-500/20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileAttach}
        className="hidden"
        accept=".pdf,.txt,.docx,.csv,.json"
      />

      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about the Knowledge Graph, entities, or relations (e.g., 'Who created Python?')..."
        disabled={disabled}
        className="w-full bg-transparent border-none outline-none resize-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 max-h-36 py-1 px-1.5 focus:ring-0"
      />

      {/* Footer controls: Attach, Voice, Clear, Counter, Send */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Attach document (.pdf, .txt, .csv, .json)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={`p-1.5 rounded transition-colors ${
              isRecording
                ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/50 animate-pulse'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Voice inquiry (demo mock)"
          >
            <Mic className="w-4 h-4" />
          </button>

          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isRecording && (
            <span className="text-[11px] text-rose-500 font-medium ml-1">
              Listening...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-400">
            {text.length}/1000
          </span>
          <Button
            variant="primary"
            size="sm"
            disabled={!text.trim() || disabled}
            onClick={handleSubmit}
            icon={Send}
            iconPosition="right"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
