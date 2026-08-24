import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, BarChart2, MessageSquare, PieChart, LogOut, Globe, 
  FileText, Shield, RefreshCw, Printer, Menu, X, CheckCircle, Smartphone, Download
} from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { ReportDashboard } from './ReportDashboard';
import { RespondenDashboard } from './RespondenDashboard';
import { FeedbackDashboard } from './FeedbackDashboard';
import { ThemeToggle } from './ThemeToggle';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS } from '../data/surveyQuestions';

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
    { id: 'report', path: '/admin/laporan', label: 'Laporan & Statistik', shortLabel: 'Statistik', icon: BarChart2 },
    { id: 'demografi', path: '/admin/demografi', label: 'Demografi Warga', shortLabel: 'Demografi', icon: PieChart },
    { id: 'feedback', path: '/admin/feedback', label: 'Saran & Masukan', shortLabel: 'Saran', icon: MessageSquare },
  ];

  const handleDownloadCSV = () => {
    // Generate CSV Header
    const headers = [
      'ID', 'Waktu Pengisian', 'Jenis Kelamin', 'Usia', 'Pendidikan', 'Pekerjaan', 'Jenis Layanan',
      ...SKM_QUESTIONS.map((_, i) => `U${i+1}`),
      ...PERILAKU_QUESTIONS.map((_, i) => `P${i+1}`),
      ...IMPLEMENTASI_QUESTIONS.map((_, i) => `I${i+1}`),
      'Komentar/Saran'
    ];
    
    // Generate CSV Rows
    const rows = responses.map(r => {
      const d = r.demografi;
      const skmScores = SKM_QUESTIONS.map(q => r.skm?.[q.id] || '');
      const perilakuScores = PERILAKU_QUESTIONS.map(q => r.perilaku?.[q.id] || '');
      const implScores = IMPLEMENTASI_QUESTIONS.map(q => r.implementasi?.[q.id] || '');
      
      const formatString = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
      
      return [
        r.id,
        new Date(r.timestamp).toLocaleString('id-ID'),
        d?.jenisKelamin || '',
        d?.usia || '',
        d?.pendidikan || '',
        d?.pekerjaan || '',
        d?.jenisLayanan || '',
        ...skmScores,
        ...perilakuScores,
        ...implScores,
        formatString(r.komentar || '')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hasil_Survei_Sijenggung_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-20 md:pb-0 ${
      isDark ? 'bg-[#0b1120] text-slate-100' : 'bg-[#eef2f6] text-slate-800'
    }`}>
      
      {/* ── Top Admin Navbar (Glassmorphism) ───────────────── */}
      <header className={`border-b px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-colors ${
        isDark ? 'bg-glass border-slate-800/50 shadow-md' : 'bg-glass border-white/40 shadow-sm'
      }`}>
        
        {/* Left: Brand Identity */}
        <Link to="/admin" className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl shrink-0 shadow-neumorph-sm flex items-center justify-center ${isDark ? 'bg-[#151e32]' : 'bg-white'}`}>
            <img src="/logo-banjarnegara.png" alt="Logo" className="w-5 h-5 object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5 leading-tight">
              ADMIN DESA
              <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">
                Sijenggung
              </span>
            </h1>
          </div>
        </Link>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-[0_4px_10px_rgba(16,185,129,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Download size={15} /> Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-2xl shadow-[0_4px_10px_rgba(99,102,241,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Printer size={15} /> Cetak PDF
          </button>

          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* User Profile Pill */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl shadow-neumorph-sm ${
            isDark ? 'bg-[#151e32]' : 'bg-white'
          }`}>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold leading-none">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Role: {user?.role || 'Admin'}</div>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            title="Keluar / Logout"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white text-red-500 shadow-neumorph-sm hover:shadow-neumorph'
            }`}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

        {/* Right Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 rounded-2xl transition-colors cursor-pointer ${
              isDark ? 'bg-[#151e32] text-white' : 'bg-white text-slate-800 shadow-neumorph-sm'
            }`}
          >
            <Menu size={18} />
          </button>
        </div>

      </header>

      {/* ── Main Admin Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Desktop Sidebar (Solid Neumorphic Color) */}
        <aside className={`hidden md:flex w-64 p-4 shrink-0 flex-col gap-2 shadow-2xl z-20 transition-colors ${
          isDark ? 'bg-[#080d1a] border-r border-slate-800' : 'bg-indigo-600 text-white rounded-tr-3xl rounded-br-3xl my-4 ml-4 shadow-indigo-500/20'
        }`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 ${isDark ? 'text-slate-500' : 'text-indigo-200'}`}>
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
                    ? (isDark ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-white text-indigo-600 shadow-lg transform translate-x-2')
                    : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-indigo-100 hover:bg-indigo-500')
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? (isDark ? 'text-white' : 'text-indigo-600') : (isDark ? 'text-slate-400' : 'text-indigo-200')} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive 
                      ? (isDark ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600') 
                      : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500 text-indigo-100')
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className={`mt-auto pt-6 ${isDark ? 'border-t border-slate-800' : 'border-t border-indigo-400/30'}`}>
            <div className={`p-4 rounded-2xl text-xs space-y-1.5 ${
              isDark ? 'bg-[#0d1425] border border-slate-800 text-slate-400' : 'bg-indigo-500/50 text-white'
            }`}>
              <div className="font-bold">Status Database</div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SQLite Terhubung
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-indigo-100'}`}>
                {responses.length} Responden Aktif
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content Body */}
        <main className={`flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto ${
          isDark ? 'bg-[#0b1120]' : 'bg-[#eef2f6]'
        }`}>
          {activeAdminTab === 'responden' && <AdminPanel />}
          {activeAdminTab === 'report' && <ReportDashboard />}
          {activeAdminTab === 'demografi' && <RespondenDashboard />}
          {activeAdminTab === 'feedback' && <FeedbackDashboard />}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl ${
        isDark ? 'bg-[#0d1425]/95 backdrop-blur-2xl border-t border-slate-800' : 'bg-white/95 backdrop-blur-2xl border-t border-slate-200'
      }`}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />}
              </div>
              <span className="text-[10px] font-bold">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile Slide-Over Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className={`w-80 h-full p-6 flex flex-col justify-between shadow-2xl border-l ${
              isDark ? 'bg-[#0d1425] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Menu Admin</h3>
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
                  onClick={() => { setMobileMenuOpen(false); handleDownloadCSV(); }}
                  className="w-full p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-3 shadow-md transition-colors cursor-pointer"
                >
                  <Download size={18} />
                  <span>Export Data CSV</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); window.print(); }}
                  className="w-full p-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-3 shadow-md transition-colors cursor-pointer"
                >
                  <Printer size={18} />
                  <span>Cetak Laporan PDF</span>
                </button>

                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    isDark ? 'bg-[#162039] border-slate-700 text-cyan-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Globe size={18} className="text-cyan-500" />
                  <span>Buka Web Publik</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer: Logout */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl border border-red-500/20 flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Keluar dari Akun</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
