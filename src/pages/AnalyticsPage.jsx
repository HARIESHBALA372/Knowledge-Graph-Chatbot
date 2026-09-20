import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { api } from '../services/api';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { isDark } = useTheme();

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const data = await api.getAnalytics(timeRange);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [timeRange]);

  if (loading || !analytics) {
    return <Loading text="Aggregating query logs and relationship metrics..." fullPage />;
  }

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            System Performance & Query Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical distribution of graph traversals, vector hybrid searches, and latency metrics.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-xs shadow-subtle">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                timeRange === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            Total Queries
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {analytics.kpiOverview.totalQueries.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            +14% volume
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            Successful Queries
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {analytics.kpiOverview.successfulQueries.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            {analytics.kpiOverview.successRate} success rate
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            Average Response Time
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {analytics.kpiOverview.avgResponseTime}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            -18ms optimization
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            Graph Queries (Neo4j)
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {analytics.kpiOverview.graphQueries}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            60% of total volume
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-subtle">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            Semantic Vector Queries
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {analytics.kpiOverview.semanticQueries}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            40% hybrid retrieval
          </span>
        </div>
      </div>

      {/* Row 1: Volume Over Time + Query Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Query Processing Volume Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily throughput and successful LLM responses
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.queriesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Query Type Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Intent distribution across system
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.typeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {analytics.typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: isDark ? '#f8fafc' : '#0f172a',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {analytics.typeDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-500 dark:text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Most Searched Entities & Popular Relationships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Searched Entities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-subtle">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Most Frequently Queried Entities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Ontology nodes with highest traversal frequency
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.mostSearchedEntities}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Bar dataKey="searches" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Relationships */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Top Traversed Relationships
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Dominant predicate edges traversed in multi-hop reasoning
            </p>

            <div className="space-y-3">
              {analytics.topRelationships.map((r, i) => {
                const maxCount = analytics.topRelationships[0].count;
                const pct = Math.round((r.count / maxCount) * 100);
                return (
                  <div key={r.relation} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
                        [:{r.relation}]
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {r.count} traversals
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall Traversal Efficiency</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              99.2% Subgraph Grounding
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
