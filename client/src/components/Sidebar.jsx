import React from 'react';
import {
  QrCode,
  LayoutDashboard,
  ListFilter,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentTab, setCurrentTab, onOpenCreate, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qrcodes', label: 'QR Codes', icon: ListFilter },
    { id: 'profile', label: 'Admin Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  Dynamic QR
                </h1>
                <span className="text-[11px] text-slate-500 font-medium">Studio Admin</span>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="px-4 py-4">
            <button
              onClick={() => {
                onOpenCreate();
                onClose?.();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Dynamic QR</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Widget & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Ritik Varun'}</div>
                <div className="text-[10px] text-slate-500 truncate">{user?.email || 'ritikvarun64@gamil.com'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>MERN Stack Production</span>
          </div>
        </div>
      </aside>
    </>
  );
}
