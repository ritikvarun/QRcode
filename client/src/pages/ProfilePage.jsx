import React from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Mail, 
  User as UserIcon,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Admin Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your administrator account credentials and session
        </p>
      </div>

      {/* Main Admin Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold mb-1">
                <ShieldCheck className="h-3 w-3" /> Master Administrator
              </div>
              <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Ritik Varun'}</h3>
              <p className="text-xs text-slate-500">{user?.email || 'ritikvarun64@gamil.com'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center shadow-xs"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Account Details List */}
        <div className="pt-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Account Details
          </h4>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Mail className="h-4 w-4 text-slate-600" />
              <span>Registered Email</span>
            </div>
            <span className="text-slate-900 font-semibold">{user?.email || 'ritikvarun64@gamil.com'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-500">
              <UserIcon className="h-4 w-4 text-slate-600" />
              <span>Account Role</span>
            </div>
            <span className="text-emerald-700 font-semibold capitalize">{user?.role || 'Administrator'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Lock className="h-4 w-4 text-slate-600" />
              <span>Authentication</span>
            </div>
            <span className="text-slate-700 font-medium">Protected by JWT + bcrypt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
