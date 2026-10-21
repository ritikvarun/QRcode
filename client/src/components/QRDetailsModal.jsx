import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  Link as LinkIcon, 
  CornerDownRight, 
  Printer
} from 'lucide-react';

export default function QRDetailsModal({ qr, isOpen, onClose, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !qr) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qr.shortUrl);
      setCopied(true);
      onShowToast?.({ type: 'success', message: 'Permanent QR link copied!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast?.({ type: 'error', message: 'Failed to copy link' });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qr.qrDataUrl;
    link.download = `qr-${qr.qrId}-${(qr.title || 'code').replace(/[^a-z0-9_-]/gi, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast?.({ type: 'success', message: 'QR Code PNG downloaded' });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${qr.title}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            img { width: 320px; height: 320px; }
            h2 { margin: 16px 0 6px; font-size: 24px; color: #111; }
            p { color: #666; font-size: 14px; margin: 0; }
            .url { font-family: monospace; color: #111; margin-top: 8px; }
          </style>
        </head>
        <body>
          <img src="${qr.qrDataUrl}" alt="${qr.title}" />
          <h2>${qr.title}</h2>
          <p class="url">${qr.shortUrl}</p>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md">{qr.title}</h2>
            <p className="text-xs text-slate-500">Dynamic QR Preview & Performance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Image Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
              <img
                src={qr.qrDataUrl}
                alt={qr.title}
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 w-full">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="h-4 w-4" /> Download PNG
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors"
                title="Print QR Code"
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Details & Live Redirection Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Scan Count Metric Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Total Scans Recorded</span>
                  <span className="text-3xl font-extrabold text-slate-900">{qr.scanCount || 0}</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              {/* Status */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Status</span>
                <span className={`font-semibold ${qr.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  ● {qr.status === 'active' ? 'Active & Live' : 'Paused'}
                </span>
              </div>

              {/* Permanent Redirect URL */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Permanent Dynamic URL:</span>
                <div className="flex items-center justify-between gap-2 font-mono text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span className="truncate font-medium">{qr.shortUrl}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleCopyLink}
                      className="p-1 hover:text-emerald-950 transition-colors"
                      title="Copy URL"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <a
                      href={qr.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 hover:text-emerald-950 transition-colors"
                      title="Test URL"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Destination URL */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Current Target Destination:</span>
                {qr.destinationUrl ? (
                  <a
                    href={qr.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-slate-800 hover:text-indigo-600 font-medium break-all transition-colors flex items-start gap-1"
                  >
                    <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    {qr.destinationUrl}
                  </a>
                ) : (
                  <span className="text-amber-600 font-medium">Not configured yet</span>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Created: {new Date(qr.createdAt).toLocaleDateString()}</span>
              <span>Last scanned: {qr.lastScannedAt ? new Date(qr.lastScannedAt).toLocaleDateString() : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
