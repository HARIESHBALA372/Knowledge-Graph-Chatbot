import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  'chatbot': 'Assistant',
  'graph': 'Graph Explorer',
  'search': 'Knowledge Search',
  'documents': 'Documents',
  'sources': 'Knowledge Sources',
  'history': 'Query History',
  'analytics': 'Analytics',
  'profile': 'User Profile',
  'settings': 'Settings',
  'help': 'Documentation',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-1.5" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.length === 0 ? (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-slate-800 dark:text-slate-200">Dashboard</span>
        </>
      ) : (
        pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = ROUTE_LABELS[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {isLast ? (
                <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })
      )}
    </nav>
  );
}
