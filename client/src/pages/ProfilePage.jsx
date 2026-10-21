import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Server, 
  Database, 
  LogOut, 
  Link as LinkIcon, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkHealth } from '../services/api';

export default function ProfilePage({ onShowToast }) {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    checkHealth()
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Admin Profile & Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your administrative session and review deployment architecture
        </p>
      </div>

      {/* Admin Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">
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
          className="px-4 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {/* System Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend & DB Health */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-400" /> Infrastructure Health
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Backend Server:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Online (Express)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Database Driver:</span>
              <span className="text-slate-200 font-mono">
                {health?.database?.status === 'connected' ? 'MongoDB Atlas (Connected)' : 'Memory / Fallback Engine'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Environment:</span>
              <span className="text-slate-200 capitalize">{health?.environment || 'development'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Redirection Architecture */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-purple-400" /> Dynamic Redirection Protocol
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Permanent Public Route:</span>
              <code className="text-emerald-400 font-mono text-[11px]">
                GET /q/:qrId &rarr; 302 Found
              </code>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              When readers scan a physical QR printed in your books, the permanent short link looks up the destination in MongoDB and instantly forwards the visitor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
