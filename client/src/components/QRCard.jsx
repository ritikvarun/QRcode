import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  Link as LinkIcon,
  CornerDownRight,
  Clock,
  Folder,
  Edit3,
  Copy,
  Trash2,
  Palette,
  Check,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

export default function QRCard({
  qr,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
  onShowToast,
  isSelected,
  onSelect
}) {
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isActive = qr.status === 'active';

  // Format date: "Oct 21, 2026"
  const formattedDate = new Date(qr.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyShortUrl = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(qr.shortUrl);
      setCopied(true);
      onShowToast?.({ type: 'success', message: 'Permanent QR link copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast?.({ type: 'error', message: 'Failed to copy link' });
    }
  };

  const handleDownloadPNG = (e) => {
    e.stopPropagation();
    if (!qr.qrDataUrl) {
      window.open(qr.shortUrl, '_blank');
      return;
    }
    const link = document.createElement('a');
    link.href = qr.qrDataUrl;
    link.download = `qr-${qr.qrId}-${(qr.title || 'code').replace(/[^a-z0-9_-]/gi, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast?.({ type: 'success', message: `Downloaded QR code for "${qr.title}"` });
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isToggling) return;
    try {
      setIsToggling(true);
      await onToggleStatus(qr._id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`relative bg-white hover:bg-slate-50/50 border rounded-2xl p-5 md:p-6 transition-all duration-200 shadow-xs hover:shadow-md ${isSelected ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'
      }`}>
      {/* 3-Column Responsive Grid */}
      <div className="flex flex-col md:flex-row items-stretch gap-6">

        {/* Left Column: Checkbox, QR Code Image, Download Button */}
        <div className="flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 md:w-56 shrink-0">
          <div className="w-full flex items-center justify-start mb-2">
            <input
              type="checkbox"
              checked={!!isSelected}
              onChange={(e) => onSelect?.(qr._id, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 bg-white text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
          </div>

          <div
            onClick={() => onViewDetails?.(qr)}
            className="group relative cursor-pointer bg-white p-3 rounded-xl shadow-xs border border-slate-200 transition-transform hover:scale-105"
            title="Click to view full preview & analytics"
          >
            {qr.qrDataUrl ? (
              <img
                src={qr.qrDataUrl}
                alt={`QR Code for ${qr.title}`}
                className="w-36 h-36 object-contain"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-slate-100 text-slate-500 text-xs">
                Generating QR...
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[1px]">
              View Details
            </div>
          </div>

          <button
            onClick={handleDownloadPNG}
            className="mt-4 w-full py-2 px-5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>

        {/* Middle Column: Total Scans, Statistics, Status Toggle */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 md:w-44 shrink-0">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Total scans:
            </span>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
              {qr.scanCount || 0}
            </span>
            <button
              onClick={() => onViewDetails?.(qr)}
              className="mt-1 text-xs font-semibold text-slate-800 hover:text-black flex items-center gap-1 transition-colors"
            >
              Statistics <TrendingUp className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-6 md:mt-0">
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Status:
            </span>
            <div className="flex items-center gap-2.5">
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={handleToggle}
                disabled={isToggling}
                role="switch"
                aria-checked={isActive}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white ${isActive ? 'bg-emerald-600' : 'bg-slate-200'
                  } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>

              <div className="flex items-center gap-1 text-xs">
                <span className={`font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <HelpCircle
                  className="h-3.5 w-3.5 text-slate-400 cursor-help"
                  title={isActive ? 'QR code is live and redirecting visitors' : 'QR code is paused and displays an inactive notification'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Short Link, Destination URL, Timestamps, Actions */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            {/* Category / Type Header */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-slate-700" />
              <span>Website</span>
            </div>

            {/* Bold Title */}
            <h3
              onClick={() => onViewDetails?.(qr)}
              className="text-lg md:text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer truncate"
              title={qr.title}
            >
              {qr.title}
            </h3>

            {/* Permanent Short Redirect URL (Printed on books/cards) */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                <LinkIcon className="h-3 w-3 text-slate-600" />
                <span className="font-mono">{qr.shortUrl?.replace(/^https?:\/\//, '')}</span>
              </span>

              <button
                onClick={handleCopyShortUrl}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors text-xs flex items-center gap-1"
                title="Copy permanent short URL"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={qr.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Test redirect in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Current Destination URL (Mutable without changing QR) */}
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600 group">
              <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="text-slate-500">Destination: </span>
                {qr.destinationUrl ? (
                  <a
                    href={qr.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 hover:text-black hover:underline transition-colors font-mono"
                    title={qr.destinationUrl}
                  >
                    {qr.destinationUrl}
                  </a>
                ) : (
                  <button
                    onClick={() => onEdit?.(qr)}
                    className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Not added yet (Click here to set destination link)
                  </button>
                )}
              </div>
            </div>

            {/* Metadata: Date */}
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Right Action Icons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[11px] text-slate-400 sm:hidden">Actions:</span>

            <div className="flex items-center gap-1">
              {/* Preview & Style Modal */}
              <button
                onClick={() => onViewDetails?.(qr)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Preview & Analytics"
              >
                <Palette className="h-4 w-4" />
              </button>

              {/* Edit Destination URL */}
              <button
                onClick={() => onEdit?.(qr)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Edit destination URL"
              >
                <Edit3 className="h-4 w-4" />
              </button>

              {/* Duplicate/Copy Link */}
              <button
                onClick={handleCopyShortUrl}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Copy short link"
              >
                <Copy className="h-4 w-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete?.(qr)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete QR code"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
