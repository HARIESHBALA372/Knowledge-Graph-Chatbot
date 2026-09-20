import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  ArrowRight,
  Terminal,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function QueryHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const data = await api.getQueryHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load query history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredHistory = history.filter(
    (h) =>
      h.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.entities.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedItems = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Query,Intent,Source,Latency,Status,Timestamp']
        .concat(
          history.map(
            (h) =>
              `"${h.id}","${h.query.replace(/"/g, '""')}","${h.intent}","${h.source}","${h.responseTime}","${h.status}","${h.timestamp}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kg_query_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Query Audit Log & Lineage Provenance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full forensic record of generated Cypher statements, entity extractions, and model latencies.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          icon={Download}
        >
          Export CSV Audit
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search query text, entities, or intent..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <span className="text-xs text-slate-400">
          Total {filteredHistory.length} recorded queries
        </span>
      </div>

      {/* History Table */}
      {loading ? (
        <Loading text="Loading query trace audit log..." />
      ) : (
        <div className="space-y-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Natural Language Query</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Anchor Entities</TableHead>
                <TableHead>Source Store</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    "{item.query}"
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">
                      {item.intent}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.entities.map((e, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                    {item.source}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {item.responseTime}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 'Success' ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {item.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedItem(item)}
                      icon={Eye}
                      title="View Full Execution Trace"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredHistory.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Trace Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Query Execution Trace"
          subtitle={`Audit ID: ${selectedItem.id}`}
          maxWidth="max-w-xl"
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const qText = selectedItem.query;
                setSelectedItem(null);
                navigate(`/chatbot?query=${encodeURIComponent(qText)}`);
              }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Run in Live Chat
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Original Natural-Language Question
              </span>
              <p className="font-semibold text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 leading-relaxed">
                "{selectedItem.query}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Identified Intent</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedItem.intent}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Retrieved From</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedItem.source}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Detected Ontology Entities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedItem.entities.map((e, i) => (
                  <Badge key={i} variant="primary" size="md">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedItem.cypher && (
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                  Translated Cypher Graph Traversal
                </span>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-xs overflow-x-auto border border-slate-800">
                  {selectedItem.cypher}
                </pre>
              </div>
            )}

            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Synthesized Grounded Answer
              </span>
              <p className="p-3 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedItem.answerSummary}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
