import React, { useState } from 'react';
import { X, Sparkles, Link as LinkIcon, ShieldCheck, Loader2 } from 'lucide-react';
import { qrApi } from '../services/api';

export default function CreateQRModal({ isOpen, onClose, onSuccess, onShowToast }) {
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [addLater, setAddLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }
    if (!addLater && !destinationUrl.trim()) {
      setError('Please enter a website URL or check "Add Website URL Later"');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await qrApi.create({
        title: title.trim(),
        destinationUrl: addLater ? '' : destinationUrl.trim(),
        addLater,
      });

      if (res.success) {
        onShowToast?.({
          type: 'success',
          message: `Created dynamic QR code: "${res.data.title}"`,
        });
        onSuccess?.(res.data);
        handleClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDestinationUrl('');
    setAddLater(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Dynamic QR Code</h2>
              <p className="text-xs text-slate-500">Print in books now • Update destination website anytime later</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              QR Code Title *
            </label>
            <input
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 text-sm placeholder-slate-400 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Website URL {addLater ? '(Optional - Add Later)' : '*'}
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                disabled={addLater}
                placeholder="New Website"
                value={addLater ? '' : destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 transition-all font-mono text-xs sm:text-sm ${
                  addLater ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                }`}
              />
            </div>

            {/* Print Now, Add Link Later Option */}
            <label className="mt-2.5 flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none font-medium">
              <input
                type="checkbox"
                checked={addLater}
                onChange={(e) => setAddLater(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 bg-white text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <span>I don't have the final website link yet (Print QR in book now, add link later)</span>
            </label>
          </div>

          {/* Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Printing Safe:</strong> Download this QR code and print it in your books today. Whenever you update or add the website link in this software, the printed QR code will automatically redirect readers to your new URL!
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Generating...' : 'Generate Dynamic QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
