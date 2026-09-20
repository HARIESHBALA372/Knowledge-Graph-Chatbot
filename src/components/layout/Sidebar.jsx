import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareCode,
  Network,
  Search,
  FileText,
  Database,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'MAIN',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/chatbot', label: 'Chatbot', icon: MessageSquareCode },
      { to: '/graph', label: 'Knowledge Graph', icon: Network },
      { to: '/search', label: 'Search', icon: Search },
    ],
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { to: '/documents', label: 'Documents', icon: FileText },
      { to: '/sources', label: 'Knowledge Sources', icon: Database },
      { to: '/history', label: 'Query History', icon: History },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
      { to: '/help', label: 'Help & Docs', icon: HelpCircle },
    ],
  },
];

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 select-none
          ${isCollapsed ? 'w-18' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shrink-0 shadow-subtle">
              <Network className="w-5 h-5 stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
                  Knowledge Graph
                  <span className="text-[10px] uppercase font-semibold bg-brand-500/20 text-brand-400 px-1.5 py-0.2 rounded border border-brand-500/30">
                    AI
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 truncate">
                  AI-Powered Discovery
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <h2 className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </h2>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => `
                        group relative flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all
                        ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-subtle'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}

                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-950 text-slate-200 text-xs rounded shadow-lg border border-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-800 relative shrink-0">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-semibold shrink-0 border border-slate-600">
              {user?.name ? user.name.charAt(0) : 'H'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Hariesh Raj'}
                </p>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Shield className="w-3 h-3 text-brand-400 inline" />
                  {user?.role || 'Administrator'}
                </p>
              </div>
            )}
          </div>

          {/* User popup menu */}
          {showUserMenu && (
            <div
              className={`absolute bottom-full mb-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1.5 z-50 space-y-1 text-xs
                ${isCollapsed ? 'left-full ml-2 w-44' : 'left-3 right-3'}
              `}
            >
              <div className="px-2.5 py-1.5 border-b border-slate-800">
                <p className="font-medium text-white truncate">{user?.name || 'Hariesh Raj'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@enterprise.ai'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Preferences
              </button>
              <div className="border-t border-slate-800 my-1"></div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
