import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  RotateCcw,
  Eye,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import UploadModal from '../components/documents/UploadModal';
import { api } from '../services/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const navigate = useNavigate();

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadComplete = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm('Remove this document and prune associated extracted triples?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleReprocessDoc = (doc) => {
    alert(`Triggered asynchronous re-indexing pipeline for "${doc.name}".`);
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.source.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Ingested Documents & Knowledge Sources
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage unstructured corpora, inspect OCR extraction pipelines, and update property graph triples.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          icon={Upload}
        >
          Upload Document
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter documents by name or source..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
          <span>{filteredDocs.length} of {documents.length} documents</span>
          <Button
            variant="outline"
            size="xs"
            onClick={loadDocuments}
            icon={RotateCcw}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <Loading text="Loading document corpus records..." />
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source Repository</TableHead>
              <TableHead>Entities Extracted</TableHead>
              <TableHead>Ingestion Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="truncate max-w-xs">{doc.name}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-500 uppercase">
                    {doc.type}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                  {doc.source}
                </TableCell>
                <TableCell>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {doc.entitiesExtracted} entities
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="success" size="sm" dot>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  {doc.uploadedAt}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setViewingDoc(doc)}
                      icon={Eye}
                      title="Inspect Document Metadata"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleReprocessDoc(doc)}
                      icon={RotateCcw}
                      title="Reprocess Document Extraction"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteDoc(doc.id)}
                      icon={Trash2}
                      title="Delete Document"
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Document Details Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title="Document Extraction Details"
          subtitle={viewingDoc.name}
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const docName = viewingDoc.name;
                setViewingDoc(null);
                navigate(`/chatbot?query=${encodeURIComponent(`What entities and relationships were discovered in ${docName}?`)}`);
              }}
            >
              Ask Chatbot About Document
            </Button>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Format & Size</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {viewingDoc.type} &bull; {viewingDoc.size || '2.1 MB'}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Extraction Worker</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {viewingDoc.processedBy || 'Default Worker'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Extracted Knowledge Metrics</span>
              <div className="flex gap-4 font-mono">
                <div>
                  <span className="text-slate-400">Entities: </span>
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    {viewingDoc.entitiesExtracted}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Triples: </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {viewingDoc.relationshipsExtracted || 54}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Corpus Source</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {viewingDoc.source}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
