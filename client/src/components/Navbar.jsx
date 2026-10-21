import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar, currentTabTitle }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {currentTabTitle}
            </h1>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium">
              Dynamic QR Code Studio • Books & Physical Media
            </span>
          </div>
        </div>

        {/* Right: API Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
