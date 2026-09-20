import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import KnowledgeGraph from '../components/graph/KnowledgeGraph';
import GraphToolbar from '../components/graph/GraphToolbar';
import EntityPanel from '../components/graph/EntityPanel';
import Loading from '../components/common/Loading';
import { api } from '../services/api';
import { Network, Info, Eye } from 'lucide-react';

export default function GraphExplorerPage() {
  const [searchParams] = useSearchParams();
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [layoutName, setLayoutName] = useState('cose');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityTypes, setEntityTypes] = useState([]);

  // Fetch graph data
  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await api.getGraph({
        search: searchQuery,
        entityType: selectedType,
      });
      setGraphData(data);

      // Extract distinct entity types
      const types = Array.from(new Set(data.nodes.map((n) => n.type))).filter(Boolean);
      setEntityTypes(types);

      // Handle query param selection
      const targetParam = searchParams.get('entity');
      if (targetParam) {
        const found = data.nodes.find(
          (n) => n.id.toLowerCase() === targetParam.toLowerCase() || n.label.toLowerCase() === targetParam.toLowerCase()
        );
        if (found) {
          setSelectedEntity(found);
        }
      }
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, [selectedType]);

  // Handle live search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadGraph();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFit = () => {
    // Re-trigger layout
    setLayoutName((prev) => (prev === 'cose' ? 'cose' : 'cose'));
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('All');
    setLayoutName('cose');
    setSelectedEntity(null);
  };

  const handleSelectNeighbor = (neighborId) => {
    const node = graphData.nodes.find((n) => n.id === neighborId);
    if (node) {
      setSelectedEntity(node);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-3">
      {/* Top Toolbar */}
      <GraphToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        layoutName={layoutName}
        onLayoutChange={setLayoutName}
        onFit={handleFit}
        onReset={handleReset}
        entityTypes={entityTypes}
      />

      {/* Main Canvas + Side Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 relative">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <Loading text="Computing graph layout & rendering nodes..." />
            </div>
          ) : (
            <div className="h-full w-full relative">
              <KnowledgeGraph
                nodes={graphData.nodes}
                relationships={graphData.relationships}
                selectedNodeId={selectedEntity?.id}
                onSelectNode={(node) => setSelectedEntity(node)}
                layoutName={layoutName}
                height="100%"
              />

              {/* Legend & Count Overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-subtle flex items-center gap-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {graphData.nodes.length} Nodes &bull; {graphData.relationships.length} Edges
                </span>
                <span className="hidden sm:inline text-slate-400">
                  Tip: Click node to view properties & triples
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Entity Details Panel */}
        {selectedEntity && (
          <EntityPanel
            entity={selectedEntity}
            relationships={graphData.relationships}
            allNodes={graphData.nodes}
            onClose={() => setSelectedEntity(null)}
            onSelectNeighbor={handleSelectNeighbor}
          />
        )}
      </div>
    </div>
  );
}
