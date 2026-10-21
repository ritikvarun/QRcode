import React, { useState, useEffect } from 'react';
import { X, Edit3, Link as LinkIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { qrApi } from '../services/api';

export default function EditQRModal({ qr, isOpen, onClose, onSuccess, onShowToast }) {
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (qr) {
      setTitle(qr.title || '');
      setDestinationUrl(qr.destinationUrl || '');
      setError('');
    }
  }, [qr]);

  if (!isOpen || !qr) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    if (!destinationUrl.trim()) {
      setError('Website URL cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await qrApi.update(qr._id, {
        title: title.trim(),
        destinationUrl: destinationUrl.trim(),
      });

      if (res.success) {
        onShowToast?.({
          type: 'success',
          message: `Website URL updated for "${res.data.title}"`,
        });
        onSuccess?.(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to update QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Website URL</h2>
              <p className="text-xs text-slate-400">Updates target without regenerating the printed QR code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300">
              {error}
            </div>
          )}

          {/* Unchanged Permanent Short URL Information */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Permanent QR Link (Printed in books):</span>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">Never Changes</span>
            </div>
            <div className="font-mono text-slate-200 truncate flex items-center gap-1.5">
              <LinkIcon className="h-3 w-3 text-emerald-400 shrink-0" />
              {qr.shortUrl}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              QR Code Title *
            </label>
            <input
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Website URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="New Website"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm font-mono text-xs sm:text-sm placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Zero Reprinting Required:</strong> When you save this update, existing printed QR codes in books will instantly redirect to this new URL.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Saving Changes...' : 'Save New Website URL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
