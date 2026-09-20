import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatWindow from '../components/chatbot/ChatWindow';
import { MOCK_CHAT_SESSIONS, MOCK_SUGGESTED_PROMPTS } from '../data/mockData';
import { api } from '../services/api';
import Modal from '../components/common/Modal';
import { MessageSquare, Calendar, Trash2 } from 'lucide-react';

export default function ChatbotPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState(MOCK_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(MOCK_CHAT_SESSIONS[0].id);
  const [messages, setMessages] = useState(MOCK_CHAT_SESSIONS[0].messages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  // Check URL query parameters (e.g. redirected from Graph or Dashboard)
  useEffect(() => {
    const initialQuery = searchParams.get('query');
    if (initialQuery) {
      handleSendMessage(initialQuery);
      // Clean query parameter from URL
      searchParams.delete('query');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const assistantResponse = await api.sendChatMessage({
        message: text,
        sessionId: activeSessionId,
      });

      setMessages((prev) => [...prev, assistantResponse]);
    } catch (err) {
      console.error('Failed to get chatbot response:', err);
      const errorMsg = {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: 'Unable to connect to the Knowledge Graph reasoning service. Please check your network connection or backend configuration.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    const newSession = {
      id: 'session_' + Date.now(),
      title: 'New Knowledge Inquiry',
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages([]);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages in the current conversation?')) {
      setMessages([]);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setShowSessionsModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatWindow
        messages={messages}
        isProcessing={isProcessing}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        onToggleHistory={() => setShowSessionsModal(true)}
        onSelectPrompt={(prompt) => handleSendMessage(prompt)}
      />

      {/* Session History Modal */}
      <Modal
        isOpen={showSessionsModal}
        onClose={() => setShowSessionsModal(false)}
        title="Saved Conversation Sessions"
        subtitle="Review past Knowledge Graph query threads"
        maxWidth="max-w-md"
      >
        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSession(s)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                s.id === activeSessionId
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="truncate text-xs">
                  <p className="font-semibold truncate">{s.title}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 inline" />
                    {new Date(s.createdAt).toLocaleDateString()} &bull; {s.messages.length} messages
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
