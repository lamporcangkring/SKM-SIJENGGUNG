import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, BarChart2, MessageSquare, PieChart, LogOut, Globe, 
  FileText, Shield, RefreshCw, Printer, Menu, X, CheckCircle, Smartphone
} from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { ReportDashboard } from './ReportDashboard';
import { RespondenDashboard } from './RespondenDashboard';
import { FeedbackDashboard } from './FeedbackDashboard';
import { ThemeToggle } from './ThemeToggle';

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync tab with URL pathname
  const path = location.pathname;
  let activeAdminTab = 'responden';
  if (path.includes('/admin/laporan')) activeAdminTab = 'report';
  else if (path.includes('/admin/demografi')) activeAdminTab = 'demografi';
  else if (path.includes('/admin/feedback')) activeAdminTab = 'feedback';
  else if (path.includes('/admin/responden') || path === '/admin') activeAdminTab = 'responden';

  const menuItems = [
    { id: 'responden', path: '/admin/responden', label: 'Kelola Responden', shortLabel: 'Responden', icon: Users, count: responses.length },
    { id: 'report', path: '/admin/laporan', label: 'Laporan & Statistik SKM', shortLabel: 'Statistik', icon: BarChart2 },
    { id: 'demografi', path: '/admin/demografi', label: 'Demografi Responden', shortLabel: 'Demografi', icon: PieChart },
    { id: 'feedback', path: '/admin/feedback', label: 'Saran & Masukan Warga', shortLabel: 'Saran', icon: MessageSquare },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-20 md:pb-0 ${
      isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* ── Top Admin Navbar (Desktop & Mobile) ───────────────── */}
      <header className={`border-b px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#0a0f1c]/90 border-blue-500/15' : 'bg-white/95 border-slate-200'
      }`}>
        
        {/* Left: Brand Identity */}
        <Link to="/admin" className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/15 text-rose-500 border border-rose-500/25 rounded-2xl shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5 leading-tight">
              ADMIN DESA
              <span className="text-[9px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full border border-rose-500/20 font-bold uppercase">
                Backend
              </span>
            </h1>
            <p className={`text-[10px] sm:text-xs truncate max-w-[170px] sm:max-w-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Desa Sijenggung
            </p>
          </div>
        </Link>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            <Printer size={15} /> Cetak Laporan PDF
          </button>

          <Link
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-2xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#162039] hover:bg-[#1e294b] text-cyan-300 border-blue-500/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Globe size={15} className="text-cyan-500" />
            <span>Lihat Web Publik</span>
          </Link>

          <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 mx-1" />

          {/* User Profile Pill */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border ${
            isDark ? 'bg-[#0d1425] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold leading-none">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Role: {user?.role || 'Admin'}</div>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            title="Keluar / Logout"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-2xl border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

        {/* Right Mobile Actions (ThemeToggle + Hamburger) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
              isDark ? 'bg-[#162039] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
            title="Buka Menu Aksi Admin"
          >
            <Menu size={18} />
          </button>
        </div>

      </header>

      {/* ── Main Admin Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className={`hidden md:flex w-64 border-r p-4 shrink-0 flex-col gap-2 transition-colors ${
          isDark ? 'bg-[#0a0f1c] border-blue-500/10' : 'bg-white border-slate-200'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Menu Pengelolaan
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="mt-auto pt-6 border-t dark:border-slate-800 border-slate-200">
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              isDark ? 'bg-[#0d1425] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="font-bold text-slate-900 dark:text-white">Status Database</div>
              <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SQLite Terhubung Aktif
              </div>
              <div className="text-[10px] text-slate-400 mt-1">File: data/skm.db</div>
            </div>
          </div>
        </aside>

        {/* Tab Content Body Sesuai Sub-Route URL */}
        <main className={`flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto ${
          isDark ? 'bg-[#070b14]' : 'bg-[#f8fafc]'
        }`}>
          {activeAdminTab === 'responden' && <AdminPanel />}
          {activeAdminTab === 'report' && <ReportDashboard />}
          {activeAdminTab === 'demografi' && <RespondenDashboard />}
          {activeAdminTab === 'feedback' && <FeedbackDashboard />}
        </main>
      </div>

      {/* ── Mobile Floating Bottom Navigation Bar for Admin (md:hidden) dengan Link URL ── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t px-2 py-1.5 flex items-center justify-around shadow-2xl ${
        isDark ? 'bg-[#0d1425]/95 border-blue-500/20' : 'bg-white/95 border-slate-200'
      }`}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
                isActive ? 'text-blue-600 dark:text-cyan-400 font-black' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile Slide-Over Menu Modal ──────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-80 h-full p-6 flex flex-col justify-between shadow-2xl border-l animate-in slide-in-from-right ${
            isDark ? 'bg-[#0d1425] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Pengaturan Admin</h3>
                    <p className="text-[11px] text-slate-400">{user?.name || 'Administrator'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); window.print(); }}
                  className="w-full p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-3 shadow-md transition-colors cursor-pointer"
                >
                  <Printer size={18} />
                  <span>Cetak Laporan PDF Resmi</span>
                </button>

                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    isDark ? 'bg-[#162039] border-slate-700 text-cyan-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Globe size={18} className="text-cyan-500" />
                  <span>Buka Web Publik Warga</span>
                </Link>

                <div className={`p-4 rounded-2xl border text-xs space-y-1 mt-4 ${
                  isDark ? 'bg-[#111936] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <div className="font-bold text-slate-900 dark:text-white">Status Database</div>
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SQLite Aktif
                  </div>
                  <div className="text-[10px] text-slate-400">Total {responses.length} Responden</div>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Logout */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl border border-red-500/20 flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Keluar dari Akun Admin</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
