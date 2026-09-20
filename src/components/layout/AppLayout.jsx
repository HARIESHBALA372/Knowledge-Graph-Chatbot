import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Modal from '../common/Modal';
import { Search, Boxes, FileText, ArrowRight } from 'lucide-react';
import { MOCK_GRAPH_DATA, MOCK_DOCUMENTS } from '../../data/mockData';

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Listen for Ctrl+K / Cmd+K global search trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredEntities = searchQuery
    ? MOCK_GRAPH_DATA.nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredDocs = searchQuery
    ? MOCK_DOCUMENTS.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleSelectEntity = (entity) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/graph?entity=${encodeURIComponent(entity.id)}`);
  };

  const handleSelectDoc = (doc) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate('/documents');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen
          ${isCollapsed ? 'lg:pl-18' : 'lg:pl-64'}
        `}
      >
        <TopNavbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Knowledge Base Quick Search"
        subtitle="Search across ontology entities, relationships, and ingested documents"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search Python, Transformer, Deep Learning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {searchQuery && (
            <div className="space-y-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Entities
                </span>
                {filteredEntities.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No matching entities found.</p>
                ) : (
                  <div className="space-y-1">
                    {filteredEntities.map((ent) => (
                      <div
                        key={ent.id}
                        onClick={() => handleSelectEntity(ent)}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Boxes className="w-3.5 h-3.5 text-brand-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {ent.label}
                          </span>
                          <span className="text-[10px] text-slate-400">({ent.type})</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Documents
                </span>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No matching documents found.</p>
                ) : (
                  <div className="space-y-1">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc)}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {doc.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{doc.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!searchQuery && (
            <div className="text-xs text-slate-400 py-3 text-center">
              Type to search knowledge entities, relations, or documents across the system.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
