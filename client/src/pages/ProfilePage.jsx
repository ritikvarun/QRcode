import React from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Mail, 
  User as UserIcon,
  Calendar,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Admin Profile & Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your administrator account credentials and session
        </p>
      </div>

      {/* Main Admin Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold mb-1">
                <ShieldCheck className="h-3 w-3" /> Master Administrator
              </div>
              <h3 className="text-lg font-bold text-white">{user?.name || 'Super Admin'}</h3>
              <p className="text-xs text-slate-400">{user?.email || 'admin@dynamicqr.local'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center shadow-sm"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Account Details List */}
        <div className="pt-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Account Details
          </h4>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="h-4 w-4 text-indigo-400" />
              <span>Registered Email</span>
            </div>
            <span className="text-white font-medium">{user?.email || 'admin@dynamicqr.local'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-400">
              <UserIcon className="h-4 w-4 text-purple-400" />
              <span>Account Role</span>
            </div>
            <span className="text-emerald-400 font-semibold capitalize">{user?.role || 'Administrator'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Authentication</span>
            </div>
            <span className="text-slate-300">Protected by JWT + bcrypt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
