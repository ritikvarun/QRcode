import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { qrApi } from '../services/api';

export default function DeleteConfirmModal({ qr, isOpen, onClose, onSuccess, onShowToast }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !qr) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await qrApi.delete(qr._id);
      if (res.success) {
        onShowToast?.({
          type: 'success',
          message: `QR code "${qr.title}" deleted permanently`,
        });
        onSuccess?.(qr._id);
        onClose();
      }
    } catch (err) {
      onShowToast?.({
        type: 'error',
        message: err.message || 'Failed to delete QR code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete QR Code?</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-200">{qr.title}</strong>? Any physical prints of this QR code will stop redirecting immediately.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
