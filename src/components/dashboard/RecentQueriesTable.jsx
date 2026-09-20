import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function RecentQueriesTable({ queries = [], onSelectQuery }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-subtle p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Knowledge Queries
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time log of chatbot questions, identified intents, and response latencies
          </p>
        </div>
        <Button
          variant="outline"
          size="xs"
          onClick={() => navigate('/history')}
          icon={ArrowUpRight}
          iconPosition="right"
        >
          View Full History
        </Button>
      </div>

      <Table>
        <TableHeader>
          <tr>
            <TableHead>Question</TableHead>
            <TableHead>Intent</TableHead>
            <TableHead>Extracted Entities</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {queries.map((q) => (
            <TableRow key={q.id} onClick={() => onSelectQuery && onSelectQuery(q)}>
              <TableCell className="font-medium text-slate-900 dark:text-white max-w-xs truncate">
                {q.question}
              </TableCell>
              <TableCell>
                <Badge variant="neutral" size="sm">
                  {q.intent}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {q.entities.map((e, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {q.responseTime}
              </TableCell>
              <TableCell className="text-xs text-slate-400">
                {q.timestamp}
              </TableCell>
              <TableCell>
                <Badge
                  variant={q.status === 'Success' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {q.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
