import React, { useState } from 'react';
import {
  Upload,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, extracting, building, completed, error
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartUpload = () => {
    if (!file) return;

    setUploadStatus('uploading');
    setProgress(20);

    setTimeout(() => {
      setUploadStatus('processing');
      setProgress(45);
    }, 600);

    setTimeout(() => {
      setUploadStatus('extracting');
      setProgress(75);
    }, 1300);

    setTimeout(() => {
      setUploadStatus('building');
      setProgress(95);
    }, 2000);

    setTimeout(() => {
      setUploadStatus('completed');
      setProgress(100);
      if (onUploadComplete) {
        onUploadComplete({
          id: 'doc_' + Date.now(),
          name: file.name,
          type: file.name.split('.').pop().toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          source: 'User Upload',
          entitiesExtracted: Math.floor(Math.random() * 40) + 15,
          relationshipsExtracted: Math.floor(Math.random() * 60) + 25,
          status: 'Completed',
          uploadedAt: 'Just now',
          processedBy: 'Worker-01 (Spacy + LLM)',
        });
      }
    }, 2700);
  };

  const handleReset = () => {
    setFile(null);
    setUploadStatus('idle');
    setProgress(0);
    onClose();
  };

  const statusLabels = {
    uploading: 'Uploading file to storage bucket...',
    processing: 'Parsing document structure & chunking...',
    extracting: 'Named Entity Recognition (NER) in progress...',
    building: 'Constructing triples & updating Neo4j graph...',
    completed: 'Document ingested and graph updated successfully!',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Upload Knowledge Document"
      subtitle="Ingest PDF, DOCX, TXT, CSV, or JSON into the Knowledge Graph and Vector Database"
      maxWidth="max-w-lg"
      footer={
        uploadStatus === 'completed' ? (
          <Button variant="primary" size="sm" onClick={handleReset}>
            Done
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={uploadStatus !== 'idle'}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!file || uploadStatus !== 'idle'}
              onClick={handleStartUpload}
            >
              Ingest Document
            </Button>
          </>
        )
      }
    >
      <div className="space-y-4">
        {uploadStatus === 'idle' ? (
          <div>
            {/* Drag & Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
              }`}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.csv,.json"
                onChange={handleFileChange}
              />
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 stroke-[1.75]" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Click to browse or drag and drop your file here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supported formats: PDF, DOCX, TXT, CSV, JSON (up to 25MB)
              </p>
            </div>

            {file && (
              <div className="mt-3 flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <File className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Multi-step processing display */
          <div className="py-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-brand-50 dark:bg-brand-950/60 text-brand-500">
              {uploadStatus === 'completed' ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              ) : (
                <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {statusLabels[uploadStatus]}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting Neo4j Property Store & ChromaDB Collection
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-sm mx-auto">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">{progress}% complete</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
