import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, FileText, BarChart2, ShieldCheck, Heart, ArrowRight, 
  Sparkles, Award, Shield, ThumbsUp, Users, CheckCircle2, 
  HelpCircle, Clock, DollarSign, Smile, MessageSquare, 
  ChevronRight, Building2, MapPin, QrCode, X, Printer
} from 'lucide-react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS } from '../data/surveyQuestions';
import { SurveyForm } from './SurveyForm';
import { ReportDashboard } from './ReportDashboard';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeToggle } from './ThemeToggle';

export function PublicPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  const count = responses.length;

  // Tentukan tab aktif berdasarkan pathname URL
  const currentPath = location.pathname;
  const isHome = currentPath === '/' || currentPath === '';
  const isSurvey = currentPath === '/survei';
  const isReport = currentPath === '/laporan';

  // Realtime SKM calculation
  const skmWeight = count > 0 ? 1 / SKM_QUESTIONS.length : 0;
  const skmAverages = SKM_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0, nrrT: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.skm[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg, nrrT: avg * skmWeight };
  });
  const totalNrrT = skmAverages.reduce((acc, curr) => acc + curr.nrrT, 0);
  const ikmScore = count > 0 ? totalNrrT * 25 : 0;

  // Realtime SPAK calculation
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    return { ...q, avg: sum / count };
  });
  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  // Kepuasan calculation
  const totalKepuasan = count > 0 
    ? responses.reduce((acc, curr) => acc + (curr.kepuasan?.PS1 || 0), 0) / count 
    : 0;

  const getSkmGrade = (score: number) => {
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik', color: 'text-emerald-500' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik', color: 'text-blue-500' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik', color: 'text-orange-500' };
    return { grade: 'D', label: 'Tidak Baik', color: 'text-red-500' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum Ada Data', color: 'text-slate-400' };

  const UNSUR_PELAYANAN = [
    { no: 'U1', title: 'Persyaratan Layanan', desc: 'Kemudahan syarat teknis & administratif permohonan surat.', icon: FileText, color: 'text-cyan-500' },
    { no: 'U2', title: 'Prosedur & Alur', desc: 'Kemudahan alur pelayanan dari loket hingga penerbitan.', icon: ChevronRight, color: 'text-blue-500' },
    { no: 'U3', title: 'Waktu Pelayanan', desc: 'Kecepatan dan kepastian durasi penyelesaian layanan.', icon: Clock, color: 'text-emerald-500' },
    { no: 'U4', title: 'Biaya / Tarif Gratis', desc: 'Transparansi tanpa ada pungutan liar dalam pelayanan.', icon: DollarSign, color: 'text-amber-500' },
    { no: 'U5', title: 'Kesesuaian Produk', desc: 'Hasil produk surat/layanan sesuai dengan standar baku.', icon: CheckCircle2, color: 'text-indigo-500' },
    { no: 'U6', title: 'Sarana & Prasarana', desc: 'Kenyamanan fasilitas ruang tunggu, internet, dan komputer.', icon: Building2, color: 'text-purple-500' },
    { no: 'U7', title: 'Perilaku Petugas (3S)', desc: 'Kesopanan, keramahan, serta budaya Senyum Sapa Salam.', icon: Smile, color: 'text-pink-500' },
    { no: 'U8', title: 'Kompetensi SDM', desc: 'Kejelasan penjelasan petugas atas prosedur dan solusi warga.', icon: Award, color: 'text-teal-500' },
    { no: 'U9', title: 'Layanan Pengaduan', desc: 'Ketersediaan dan respons cepat penanganan saran/keluhan.', icon: MessageSquare, color: 'text-rose-500' },
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 pb-20 md:pb-0 ${
      isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* ── Top Floating Glass Navbar ───────────────────────── */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-[#0a0f1c]/85 border-blue-500/15' : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDark ? 'bg-[#0d1425]' : 'bg-white'
              }`}>
                <Shield className="text-cyan-500" size={22} />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight flex items-center gap-2">
                PEMDES SIJENGGUNG
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Resmi
                </span>
              </div>
              <p className={`text-[11px] tracking-wider uppercase font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Survei Kepuasan Masyarakat & Antikorupsi
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links dengan Route URL Aktif */}
          <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md ${
            isDark ? 'bg-[#111936]/60 border-blue-500/20' : 'bg-slate-100 border-slate-200'
          }`}>
            <Link
              to="/"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isHome
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/survei"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSurvey
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Isi Survei
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </Link>
            <Link
              to="/laporan"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isReport
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Hasil IKM Publik
            </Link>
          </nav>

          {/* Right Action: ThemeToggle, QR Loket, PWA Install & Admin Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* QR Code Loket Modal Trigger */}
            <button
              onClick={() => setShowQrModal(true)}
              title="Tampilkan QR Code untuk Loket Pelayanan"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#162039] hover:bg-[#1e294b] text-slate-300 border-slate-700' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <QrCode size={14} className="text-cyan-500" />
              <span>QR Loket</span>
            </button>

            <PWAInstallButton />

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-full shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all hover:scale-105"
              >
                <ShieldCheck size={15} />
                <span className="hidden sm:inline">Dashboard Admin</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-full border transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-[#162039] hover:bg-[#1e294b] text-blue-300 hover:text-white border-blue-500/30'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
              >
                <ShieldCheck size={15} className="text-cyan-500" />
                <span className="hidden sm:inline">Login Petugas</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ── Main Full-Screen Content Sesuai URL Route ────────── */}
      <main className="flex-1 w-full">
        
        {/* ROUTE /: BERANDA / HOME LANDING */}
        {isHome && (
          <div className="w-full">
            
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/10 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

              <div className="max-w-5xl mx-auto text-center relative z-10">
                
                {/* Pill Announcement */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border shadow-sm ${
                  isDark 
                    ? 'bg-blue-500/10 border-blue-500/25 text-cyan-300' 
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <Sparkles size={14} className="text-cyan-500" />
                  <span>Survei Terbuka untuk Seluruh Warga Desa Sijenggung</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6">
                  Suara Anda, Wujudkan Pelayanan Desa Sijenggung{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600">
                    Prima & Berintegritas
                  </span>
                </h1>

                {/* Subtitle */}
                <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Bantu Pemerintah Desa Sijenggung mengukur dan meningkatkan kualitas pelayanan publik serta menjamin tata kelola pemerintahan yang bersih dan bebas dari korupsi.
                </p>

                {/* CTA Buttons dengan Navigasi URL */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <Link
                    to="/survei"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.35)] transition-all hover:scale-105 flex items-center justify-center gap-3 group cursor-pointer"
                  >
                    <span>Mulai Isi Survei Sekarang</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/laporan"
                    className={`w-full sm:w-auto px-8 py-4 font-bold text-base rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isDark 
                        ? 'bg-[#162039]/80 hover:bg-[#1e294b] text-slate-200 border-slate-700' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                    }`}
                  >
                    <BarChart2 size={18} className="text-cyan-500" />
                    <span>Lihat Capaian Nilai IKM</span>
                  </Link>
                </div>

                {/* ── LIVE STATS TICKER (Directly from SQLite) ────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
                  
                  {/* Total Responden */}
                  <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all ${
                    isDark ? 'bg-[#111936]/80 border-blue-500/20' : 'bg-white border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center mb-3">
                      <Users size={20} />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1">{count}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Responden</div>
                    <div className="text-[11px] text-slate-500 mt-1">Warga telah berpartisipasi</div>
                  </div>

                  {/* Mutu SKM */}
                  <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all ${
                    isDark ? 'bg-[#111936]/80 border-emerald-500/20' : 'bg-white border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-3">
                      <Award size={20} />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-500 tracking-tight mb-1 flex items-baseline gap-2">
                      {skmGrade.grade}
                      <span className="text-base font-bold text-slate-400">({count > 0 ? ikmScore.toFixed(1) : '0'})</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Mutu Pelayanan (SKM)</div>
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">Kategori: {skmGrade.label}</div>
                  </div>

                  {/* Indeks Integritas */}
                  <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all ${
                    isDark ? 'bg-[#111936]/80 border-indigo-500/20' : 'bg-white border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-3">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-indigo-500 tracking-tight mb-1 flex items-baseline gap-1">
                      {count > 0 ? totalPerilaku.toFixed(2) : '0.00'}
                      <span className="text-sm font-semibold text-slate-400">/4.00</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Indeks Integritas (SPAK)</div>
                    <div className="text-[11px] text-indigo-500 font-semibold mt-1">Bebas Pungli & KKN</div>
                  </div>

                  {/* Kepuasan */}
                  <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all ${
                    isDark ? 'bg-[#111936]/80 border-amber-500/20' : 'bg-white border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3">
                      <ThumbsUp size={20} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight mb-1 truncate">
                      {count > 0 ? (totalKepuasan >= 3.26 ? 'Sangat Puas' : totalKepuasan >= 2.51 ? 'Puas' : totalKepuasan >= 1.76 ? 'Cukup Puas' : 'Kurang Puas') : '-'}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tingkat Kepuasan</div>
                    <div className="text-[11px] text-amber-500 font-semibold mt-1">Skor: {count > 0 ? totalKepuasan.toFixed(2) : '0'}/4.00</div>
                  </div>

                </div>

              </div>
            </section>

            {/* 9 STANDAR UNSUR PELAYANAN SECTION */}
            <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t border-b ${
              isDark ? 'bg-[#0a0f1c]/50 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2">
                    Standar PermenPAN-RB No. 14 / 2017
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                    9 Unsur Evaluasi Kualitas Pelayanan Publik
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Setiap penilaian yang Anda berikan mengacu pada 9 pilar standar mutu pelayanan desa:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {UNSUR_PELAYANAN.map((u) => {
                    const Icon = u.icon;
                    return (
                      <div
                        key={u.no}
                        className={`p-6 rounded-3xl border transition-all hover:translate-y-[-2px] group ${
                          isDark 
                            ? 'bg-[#111936]/60 border-slate-800 hover:border-blue-500/40' 
                            : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${u.color} ${
                            isDark ? 'bg-white/5' : 'bg-slate-100'
                          } group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                          </div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                            isDark ? 'text-slate-500 bg-slate-800' : 'text-slate-500 bg-slate-100'
                          }`}>
                            {u.no}
                          </span>
                        </div>
                        <h3 className="text-base font-bold mb-2">{u.title}</h3>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 3 LANGKAH PENGISIAN SURVEI */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                  Bagaimana Cara Mengisi Survei?
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Proses pengisian bertahap sangat mudah dan dijamin 100% anonim.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className={`p-8 rounded-3xl border text-center shadow-md ${
                  isDark ? 'bg-gradient-to-b from-[#111936] to-[#0d1425] border-blue-500/20' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-14 h-14 bg-cyan-500/20 text-cyan-500 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-5 border border-cyan-500/30">
                    1
                  </div>
                  <h3 className="text-lg font-bold mb-2">Pilih Profil Anda</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Lengkapi data demografi dasar (usia, pekerjaan, layanan). Tidak ada nama atau data pribadi yang diminta.
                  </p>
                </div>

                <div className={`p-8 rounded-3xl border text-center shadow-md ${
                  isDark ? 'bg-gradient-to-b from-[#111936] to-[#0d1425] border-blue-500/20' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-14 h-14 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-5 border border-blue-500/30">
                    2
                  </div>
                  <h3 className="text-lg font-bold mb-2">Beri Penilaian Beremotikon</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pilih ekspresi penilaian (😠 😐 😊 🤩) terkait syarat, waktu, keramahan petugas, dan integritas bebas pungli.
                  </p>
                </div>

                <div className={`p-8 rounded-3xl border text-center shadow-md ${
                  isDark ? 'bg-gradient-to-b from-[#111936] to-[#0d1425] border-blue-500/20' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-5 border border-emerald-500/30">
                    3
                  </div>
                  <h3 className="text-lg font-bold mb-2">Kirim & Terekam Otomatis</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Jawaban Anda langsung tersimpan ke sistem database untuk evaluasi peningkatan pelayanan desa.
                  </p>
                </div>
              </div>

              {/* Bottom Big Banner */}
              <div className="mt-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black mb-3">Siap Memberikan Penilaian?</h3>
                  <p className="text-sm text-blue-100 max-w-lg mx-auto mb-6">
                    Hanya membutuhkan waktu 2 menit untuk kemajuan pelayanan Pemerintah Desa Sijenggung.
                  </p>
                  <Link
                    to="/survei"
                    className="inline-block px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-transform hover:scale-105 cursor-pointer"
                  >
                    Buka Formulir Survei Bertahap ✍️
                  </Link>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ROUTE /survei: FORMULIR SURVEI (FULL SCREEN WIZARD) */}
        {isSurvey && (
          <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 w-full">
            <SurveyForm />
          </div>
        )}

        {/* ROUTE /laporan: HASIL IKM PUBLIK (FULL SCREEN) */}
        {isReport && (
          <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 w-full">
            <ReportDashboard />
          </div>
        )}

      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className={`border-t py-10 px-4 sm:px-6 lg:px-8 mt-auto text-xs ${
        isDark ? 'bg-[#050810] border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pemerintah Desa Sijenggung</span> — Kecamatan Banjarmangu, Kabupaten Banjarnegara.
          </div>
          <div className="flex items-center gap-1 justify-center">
            Dikembangkan dengan <Heart size={14} className="fill-current text-rose-500" /> untuk Pelayanan Publik Transparan & Akuntabel.
          </div>
        </div>
      </footer>

      {/* ── Mobile Floating Bottom Navigation Bar (md:hidden) dengan Link URL ── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t px-4 py-2 flex items-center justify-around shadow-2xl ${
        isDark ? 'bg-[#0d1425]/90 border-blue-500/20' : 'bg-white/95 border-slate-200'
      }`}>
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            isHome ? 'text-cyan-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px]">Beranda</span>
        </Link>

        <Link
          to="/survei"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            isSurvey ? 'text-cyan-500 font-bold' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <FileText size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <span className="text-[10px]">Isi Survei</span>
        </Link>

        <Link
          to="/laporan"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            isReport ? 'text-cyan-500 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart2 size={20} />
          <span className="text-[10px]">Hasil IKM</span>
        </Link>

        <Link
          to={isAuthenticated ? '/admin' : '/login'}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-rose-400 cursor-pointer"
        >
          <ShieldCheck size={20} />
          <span className="text-[10px]">Admin</span>
        </Link>
      </div>

      {/* ── QR CODE MEJA LOKET MODAL ───────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border relative text-center ${
            isDark ? 'bg-[#111936] border-blue-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center mx-auto mb-3">
              <QrCode size={26} />
            </div>

            <h3 className="text-lg font-black tracking-tight mb-1">QR Code Loket Survei</h3>
            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pindai menggunakan kamera HP untuk langsung membuka formulir survei.
            </p>

            {/* QR Code Graphic Langsung Menuju /survei */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border border-slate-200 mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  (typeof window !== 'undefined' ? window.location.origin : 'https://skm-sijenggung.netlify.app') + '/survei'
                )}`}
                alt="QR Code Formulir Survei Desa Sijenggung"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>

            <div className="text-[11px] font-semibold text-cyan-500 mb-5">
              URL: {(typeof window !== 'undefined' ? window.location.origin : 'https://skm-sijenggung.netlify.app') + '/survei'}
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={16} /> Cetak QR Code Meja Loket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
