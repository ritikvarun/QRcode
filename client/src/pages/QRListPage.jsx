import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  Download, 
  CheckSquare, 
  Square, 
  Folder,
  SlidersHorizontal,
  FileQuestion
} from 'lucide-react';
import { qrApi } from '../services/api';
import QRCard from '../components/QRCard';

export default function QRListPage({ 
  onOpenCreate, 
  onEditQR, 
  onDeleteQR, 
  onViewDetails,
  onShowToast 
}) {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchQRs = async () => {
    try {
      setLoading(true);
      const res = await qrApi.list({
        search: search.trim(),
        status: statusFilter,
        folder: folderFilter,
      });
      if (res.success) {
        setQrs(res.data);
      }
    } catch (err) {
      onShowToast?.({ type: 'error', message: err.message || 'Failed to fetch QR codes' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchQRs();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, folderFilter]);

  useEffect(() => {
    window.addEventListener('focus', fetchQRs);
    return () => window.removeEventListener('focus', fetchQRs);
  }, []);

  // Extract distinct folders for the filter dropdown
  const uniqueFolders = useMemo(() => {
    const folders = new Set();
    qrs.forEach((q) => {
      if (q.folder) folders.add(q.folder);
    });
    return Array.from(folders);
  }, [qrs]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await qrApi.toggleStatus(id);
      if (res.success) {
        onShowToast?.({ type: 'success', message: res.message });
        // Update local state smoothly
        setQrs((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: res.data.status } : item))
        );
      }
    } catch (err) {
      onShowToast?.({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === qrs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(qrs.map((q) => q._id)));
    }
  };

  const handleBulkDownload = () => {
    if (selectedIds.size === 0) return;
    const selectedQrs = qrs.filter((q) => selectedIds.has(q._id));
    selectedQrs.forEach((qr, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = qr.qrDataUrl;
        link.download = `qr-${qr.qrId}-${(qr.title || 'code').replace(/[^a-z0-9_-]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 200);
    });
    onShowToast?.({ type: 'success', message: `Downloading ${selectedQrs.length} QR codes...` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            QR Code Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your dynamic targets, update URLs in real-time, and download print-ready PNGs
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> Create QR Code
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by title, website, or short ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs sm:text-sm placeholder-slate-500 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Paused Only</option>
          </select>

          <button
            onClick={fetchQRs}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar (When any selected) */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between text-xs text-indigo-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.size}</span> QR codes selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download All Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Select All Checkbox Bar */}
      {qrs.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 hover:text-slate-200 transition-colors"
          >
            {selectedIds.size === qrs.length && qrs.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-emerald-400" />
            ) : (
              <Square className="h-4 w-4 text-slate-600" />
            )}
            <span>Select All ({qrs.length})</span>
          </button>

          <span>Showing {qrs.length} QR codes</span>
        </div>
      )}

      {/* QR List */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-3 text-slate-400 text-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
          Fetching QR codes...
        </div>
      ) : qrs.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No QR codes found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || statusFilter || folderFilter
              ? 'No dynamic QR codes match the current search or filter criteria.'
              : 'Create your first dynamic QR code to start printing in books.'}
          </p>
          {(search || statusFilter || folderFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setFolderFilter('');
              }}
              className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {qrs.map((qr) => (
            <QRCard
              key={qr._id}
              qr={qr}
              isSelected={selectedIds.has(qr._id)}
              onSelect={handleSelectOne}
              onToggleStatus={handleToggleStatus}
              onEdit={onEditQR}
              onDelete={onDeleteQR}
              onViewDetails={onViewDetails}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
