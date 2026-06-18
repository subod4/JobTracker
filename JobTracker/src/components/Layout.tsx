import type { ReactNode } from 'react';
import type { User } from '../types';

interface LayoutProps {
  children: ReactNode;
  user?: User | null;
  onLogout?: () => void;
}

export default function Layout({ children, user = null, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans" id="app-root">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" id="app-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                Job Tracker
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide leading-tight">
                Application Manager
              </span>
            </div>
          </div>

          {/* Right side — User info & logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
                  <span className="text-[9px] text-slate-400 font-medium leading-normal">{user.email}</span>
                </div>
                <div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase shadow-sm select-none"
                  title={user.name}
                >
                  {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                  title="Logout"
                  id="logout-btn"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-700">Connected</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 mt-auto" id="app-footer">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Job Application Tracker — Full Stack Project
          </span>
          <span className="text-[10px] text-slate-300 font-mono">
            React + TypeScript + Vite
          </span>
        </div>
      </footer>
    </div>
  );
}
