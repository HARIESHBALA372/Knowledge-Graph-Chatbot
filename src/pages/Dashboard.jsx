import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import QueryActivityChart from '../components/dashboard/QueryActivityChart';
import QueryTypeChart from '../components/dashboard/QueryTypeChart';
import KnowledgeGraphStats from '../components/dashboard/KnowledgeGraphStats';
import RecentQueriesTable from '../components/dashboard/RecentQueriesTable';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { api } from '../services/api';
import { MessageSquare, Network, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <Loading text="Loading enterprise analytics dashboard..." fullPage />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-900 dark:to-slate-950 border border-slate-800 rounded-xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-panel">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">
              Knowledge Graph Intelligent System
            </h2>
            <span className="text-[10px] font-semibold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded">
              v2.4 Production
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Ask natural-language inquiries across multi-hop property graphs, inspect ontological relationships, and trace factually grounded answers.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/graph')}
            icon={Network}
          >
            Graph Explorer
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/chatbot')}
            icon={MessageSquare}
          >
            Launch Assistant
          </Button>
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.kpis.map((kpi) => (
          <StatCard key={kpi.id} stat={kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueryActivityChart data={stats.queryActivity} />
        <QueryTypeChart data={stats.queryTypes} />
      </div>

      {/* Ontology Health & Breakdown */}
      <div className="grid grid-cols-1 gap-6">
        <KnowledgeGraphStats
          entities={3240}
          relationships={8920}
          distribution={stats.entityDistribution}
        />
      </div>

      {/* Recent Queries Table */}
      <RecentQueriesTable
        queries={stats.recentQueries}
        onSelectQuery={(q) => setSelectedQuery(q)}
      />

      {/* Query Detail Modal */}
      {selectedQuery && (
        <Modal
          isOpen={!!selectedQuery}
          onClose={() => setSelectedQuery(null)}
          title="Query Details & Provenance"
          subtitle={`Trace ID: ${selectedQuery.id}`}
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const qText = selectedQuery.question;
                setSelectedQuery(null);
                navigate(`/chatbot?query=${encodeURIComponent(qText)}`);
              }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Re-run in Chatbot
            </Button>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">User Question</span>
              <p className="font-semibold text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                "{selectedQuery.question}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Identified Intent</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedQuery.intent}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Processing Latency</span>
                <span className="font-medium font-mono text-slate-800 dark:text-slate-200">
                  {selectedQuery.responseTime}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1.5">Detected Knowledge Entities</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedQuery.entities.map((e, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Generated Cypher Match</span>
              <pre className="p-2.5 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto border border-slate-800">
                {`MATCH (e)-[r]->(target)\nWHERE e.name IN ${JSON.stringify(selectedQuery.entities)}\nRETURN e, r, target LIMIT 10`}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
