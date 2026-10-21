import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Activity, 
  CheckCircle2, 
  PauseCircle, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  RefreshCw,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { qrApi } from '../services/api';
import QRCard from '../components/QRCard';

export default function DashboardPage({ 
  onOpenCreate, 
  onNavigateToList,
  onEditQR, 
  onDeleteQR, 
  onViewDetails,
  onShowToast 
}) {
  const [stats, setStats] = useState({ totalQRs: 0, activeQRs: 0, disabledQRs: 0, totalScans: 0 });
  const [recentQRs, setRecentQRs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, listRes] = await Promise.all([
        qrApi.getStats(),
        qrApi.list(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (listRes.success) setRecentQRs(listRes.data.slice(0, 3));
    } catch (err) {
      onShowToast?.({ type: 'error', message: err.message || 'Failed to load dashboard metrics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('focus', loadDashboardData);
    return () => window.removeEventListener('focus', loadDashboardData);
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await qrApi.toggleStatus(id);
      if (res.success) {
        onShowToast?.({ type: 'success', message: res.message });
        loadDashboardData();
      }
    } catch (err) {
      onShowToast?.({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Dynamic QR Code Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Print once. Update anytime.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Generate permanent dynamic QR codes for textbooks, workbooks, and brochures. If the online resource URL changes later, simply edit its destination URL without re-printing anything.
          </p>
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button
              onClick={onOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Create New Dynamic QR
            </button>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total QR Codes */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL QR CODES</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalQRs}</div>
          <p className="text-[11px] text-slate-500 mt-1">Generated dynamic targets</p>
        </div>

        {/* Active QR Codes */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ACTIVE & REDIRECTING</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.activeQRs}</div>
          <p className="text-[11px] text-slate-500 mt-1">Currently live for scanners</p>
        </div>

        {/* Inactive / Paused */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>PAUSED / INACTIVE</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <PauseCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.disabledQRs}</div>
          <p className="text-[11px] text-slate-500 mt-1">Showing friendly paused page</p>
        </div>

        {/* Total Scans */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL SCANS</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{stats.totalScans}</div>
          <p className="text-[11px] text-slate-500 mt-1">Aggregated visitor hits</p>
        </div>
      </div>

      {/* Recent QR Codes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Dynamic QR Codes</h3>
            <p className="text-xs text-slate-400">Latest generated codes ready for download and print</p>
          </div>
          <button
            onClick={onNavigateToList}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View All ({stats.totalQRs}) <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-3 text-slate-400 text-sm">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
            Loading dynamic QR codes...
          </div>
        ) : recentQRs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No QR codes created yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first dynamic QR code to print in books and manage destinations effortlessly.
            </p>
            <button
              onClick={onOpenCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Create QR Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentQRs.map((qr) => (
              <QRCard
                key={qr._id}
                qr={qr}
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
    </div>
  );
}
