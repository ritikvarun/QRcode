import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar, currentTabTitle }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {currentTabTitle}
            </h1>
            <span className="hidden sm:inline-block text-[11px] text-slate-400">
              Dynamic QR Code Studio • Books & Physical Media
            </span>
          </div>
        </div>

        {/* Right: API Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
