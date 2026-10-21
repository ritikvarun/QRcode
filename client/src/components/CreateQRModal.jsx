import React, { useState } from 'react';
import { X, Sparkles, Link as LinkIcon, Folder, ShieldCheck, Loader2, BookOpen } from 'lucide-react';
import { qrApi } from '../services/api';

export default function CreateQRModal({ isOpen, onClose, onSuccess, onShowToast }) {
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [addLater, setAddLater] = useState(false);
  const [folder, setFolder] = useState('No Folder');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title (e.g. Book Name, Chapter, or Subject)');
      return;
    }
    if (!addLater && !destinationUrl.trim()) {
      setError('Please enter a destination URL or check "Add Destination URL Later"');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await qrApi.create({
        title: title.trim(),
        destinationUrl: addLater ? '' : destinationUrl.trim(),
        addLater,
        folder: folder.trim() || 'No Folder',
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
    setFolder('No Folder');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Dynamic QR Code</h2>
              <p className="text-xs text-slate-400">Print in books now • Update destination website anytime later</p>
            </div>
          </div>
          <button
            onClick={handleClose}
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              QR Code Title / Book Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Educazone Class 9 - Chapter 1 Solutions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Destination Website URL {addLater ? '(Optional - Add Later)' : '*'}
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                disabled={addLater}
                placeholder={addLater ? "You can set the final link later anytime from the dashboard" : "https://www.educazonebooks.com/class-9"}
                value={addLater ? '' : destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 transition-all font-mono text-xs sm:text-sm ${
                  addLater ? 'opacity-50 cursor-not-allowed bg-slate-900' : 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Print Now, Add Link Later Option */}
            <label className="mt-2.5 flex items-center gap-2 cursor-pointer text-xs text-indigo-300 hover:text-indigo-200 select-none">
              <input
                type="checkbox"
                checked={addLater}
                onChange={(e) => setAddLater(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>I don't have the final website link yet (Print QR in book now, add link later)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Folder / Category (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Folder className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Class 9, Textbooks, Math, Science"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Printing Safe:</strong> Download this QR code and print it in your books today. Whenever you update or add the website link in this software, the printed QR code will automatically redirect readers to your new URL!
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
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
              {loading ? 'Generating...' : 'Generate Dynamic QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
