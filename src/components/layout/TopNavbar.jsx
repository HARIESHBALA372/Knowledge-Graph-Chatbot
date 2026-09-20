import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Database,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/chatbot': 'Knowledge Graph Assistant',
  '/graph': 'Knowledge Graph Explorer',
  '/search': 'Global Knowledge Search',
  '/documents': 'Document Management',
  '/sources': 'Connected Knowledge Sources',
  '/history': 'Query History & Provenance',
  '/analytics': 'System & Query Analytics',
  '/profile': 'User Profile',
  '/settings': 'System Settings',
  '/help': 'Help & Documentation',
};

export default function TopNavbar({ onOpenMobileMenu, onOpenSearchModal }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);

  const currentTitle = PAGE_TITLES[location.pathname] || 'Knowledge Graph Chatbot';

  const mockNotifications = [
    {
      id: 1,
      title: 'Graph Synchronized',
      desc: '180 new entities indexed from python_language_reference.pdf',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Vector Store Optimized',
      desc: 'ChromaDB collection embeddings re-indexed with text-embedding-3',
      time: '1h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'System Health Check',
      desc: 'Neo4j cluster latency optimal at 12ms',
      time: '3h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Hamburger + Title + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
            {currentTitle}
          </h2>
          <Breadcrumb />
        </div>
      </div>

      {/* Right side utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Knowledge Graph Status Indicator Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Knowledge Graph Online</span>
        </div>

        {/* Global Search Shortcut Button */}
        <button
          type="button"
          onClick={onOpenSearchModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-slate-50 dark:bg-slate-800/50"
          title="Search entities and documents"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-300">
            Ctrl+K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50">
              <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Notifications
                </span>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Documentation / Help shortcut */}
        <button
          type="button"
          onClick={() => navigate('/help')}
          className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block"></div>

        {/* User avatar button */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all"
          title="View profile"
        >
          <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
            {user?.name ? user.name.charAt(0) : 'H'}
          </div>
        </button>
      </div>
    </header>
  );
}
