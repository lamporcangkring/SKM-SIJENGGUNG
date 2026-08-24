import React, { useState, useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare, Clock, User, Search, Filter, RotateCcw, Calendar, Briefcase, FileText, CheckCircle } from 'lucide-react';

const MONTH_NAMES = [
  'Semua Bulan', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PEKERJAAN_OPTIONS = [
  'Semua Pekerjaan', 'Petani', 'PNS', 'Wiraswasta', 'Karyawan Swasta', 'Pelajar/Mahasiswa', 'Lainnya'
];

const LAYANAN_OPTIONS = [
  'Semua Layanan', 'Administrasi Umum', 'Kependudukan', 'Perizinan', 'Pertanahan', 'Kesejahteraan Sosial'
];

export function FeedbackDashboard() {
  const { responses } = useSurvey();
  const { isDark } = useTheme();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua Tahun');
  const [selectedMonth, setSelectedMonth] = useState('Semua Bulan');
  const [selectedPekerjaan, setSelectedPekerjaan] = useState('Semua Pekerjaan');
  const [selectedLayanan, setSelectedLayanan] = useState('Semua Layanan');

  // Ambil daftar tahun yang tersedia dari data respon
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    responses.forEach(r => {
      if (r.timestamp) {
        years.add(new Date(r.timestamp).getFullYear().toString());
      }
    });
    // Selalu sertakan tahun ini
    years.add(new Date().getFullYear().toString());
    return ['Semua Tahun', ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
  }, [responses]);

  // Filter list responses yang memiliki komentar
  const allFeedback = useMemo(() => {
    return responses
      .filter(r => r.komentar && r.komentar.trim().length > 0)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [responses]);

  // Terapkan filter dinamis
  const filteredFeedback = useMemo(() => {
    return allFeedback.filter(item => {
      const date = new Date(item.timestamp);
      const itemYear = date.getFullYear().toString();
      const itemMonth = (date.getMonth() + 1).toString(); // 1 - 12

      // Filter Tahun
      if (selectedYear !== 'Semua Tahun' && itemYear !== selectedYear) {
        return false;
      }

      // Filter Bulan
      if (selectedMonth !== 'Semua Bulan') {
        const monthIndex = MONTH_NAMES.indexOf(selectedMonth);
        if (date.getMonth() + 1 !== monthIndex) {
          return false;
        }
      }

      // Filter Pekerjaan
      if (selectedPekerjaan !== 'Semua Pekerjaan') {
        if (item.demografi.pekerjaan !== selectedPekerjaan) {
          return false;
        }
      }

      // Filter Layanan
      if (selectedLayanan !== 'Semua Layanan') {
        if (item.demografi.jenisLayanan !== selectedLayanan) {
          return false;
        }
      }

      // Filter Pencarian Teks
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesComment = item.komentar?.toLowerCase().includes(query);
        const matchesJob = item.demografi.pekerjaan?.toLowerCase().includes(query);
        const matchesService = item.demografi.jenisLayanan?.toLowerCase().includes(query);
        const matchesAge = item.demografi.usia?.toLowerCase().includes(query);
        if (!matchesComment && !matchesJob && !matchesService && !matchesAge) {
          return false;
        }
      }

      return true;
    });
  }, [allFeedback, selectedYear, selectedMonth, selectedPekerjaan, selectedLayanan, searchQuery]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedYear('Semua Tahun');
    setSelectedMonth('Semua Bulan');
    setSelectedPekerjaan('Semua Pekerjaan');
    setSelectedLayanan('Semua Layanan');
  };

  const isFiltered = searchQuery !== '' || selectedYear !== 'Semua Tahun' || selectedMonth !== 'Semua Bulan' || selectedPekerjaan !== 'Semua Pekerjaan' || selectedLayanan !== 'Semua Layanan';

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <div className={`p-2 rounded-2xl shadow-neumorph-sm ${isDark ? 'bg-[#151e32] text-pink-400' : 'bg-white text-pink-500'}`}>
              <MessageSquare size={24} />
            </div>
            Kotak Aspirasi & Saran Warga
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pantauan langsung aspirasi, kritik konstruktif, dan saran dari responden survei desa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold ${
            isDark ? 'bg-[#151e32] border border-slate-700/50 text-slate-300' : 'bg-white text-slate-700 shadow-neumorph-sm'
          }`}>
            Menampilkan: <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-extrabold">{filteredFeedback.length}</span> dari {allFeedback.length} Masukan
          </div>
        </div>
      </div>

      {/* ── FILTER CONTROLS BAR ───────────────────────────────── */}
      <div className={`p-5 rounded-3xl transition-all space-y-4 ${
        isDark ? 'bg-[#111936]/80 border border-slate-700/50 shadow-xl' : 'bg-white shadow-neumorph'
      }`}>
        
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari isi masukan, kata kunci, nama layanan, atau pekerjaan..."
            className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium focus:outline-none transition-colors ${
              isDark 
                ? 'bg-[#0a0f1c] border-slate-700 text-white placeholder-slate-500 focus:border-pink-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-pink-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-2 py-1"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Row 2: Select Filters (Tahun, Bulan, Pekerjaan, Layanan) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Filter Tahun */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar size={12} className="text-blue-500" /> Filter Tahun
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-cyan-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              }`}
            >
              {availableYears.map(year => (
                <option key={year} value={year} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Bulan */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar size={12} className="text-cyan-500" /> Filter Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-cyan-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              }`}
            >
              {MONTH_NAMES.map(month => (
                <option key={month} value={month} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Pekerjaan */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Briefcase size={12} className="text-purple-500" /> Filter Pekerjaan
            </label>
            <select
              value={selectedPekerjaan}
              onChange={e => setSelectedPekerjaan(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-cyan-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              }`}
            >
              {PEKERJAAN_OPTIONS.map(job => (
                <option key={job} value={job} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                  {job}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Layanan */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileText size={12} className="text-pink-500" /> Filter Layanan
            </label>
            <select
              value={selectedLayanan}
              onChange={e => setSelectedLayanan(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-cyan-400' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
              }`}
            >
              {LAYANAN_OPTIONS.map(srv => (
                <option key={srv} value={srv} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filter Indicators & Reset Button */}
        {isFiltered && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <span>Filter Aktif:</span>
              {selectedYear !== 'Semua Tahun' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/30">
                  Thn: {selectedYear}
                </span>
              )}
              {selectedMonth !== 'Semua Bulan' && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
                  Bln: {selectedMonth}
                </span>
              )}
              {selectedPekerjaan !== 'Semua Pekerjaan' && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500 border border-purple-500/30">
                  {selectedPekerjaan}
                </span>
              )}
              {selectedLayanan !== 'Semua Layanan' && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-500 border border-pink-500/30">
                  {selectedLayanan}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  "{searchQuery}"
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}

      </div>

      {/* ── LIST FEEDBACK CARDS ──────────────────────────────── */}
      {filteredFeedback.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border dark:border-slate-800 border-slate-200 text-slate-400">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">Tidak Ada Masukan yang Sesuai</h3>
          <p className="text-xs">Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter di atas.</p>
          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl transition-transform hover:scale-105 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFeedback.map(item => (
            <div 
              key={item.id} 
              className={`p-5 sm:p-6 rounded-3xl transition-all ${
                isDark 
                  ? 'bg-[#111936]/80 border border-slate-700/50 hover:border-pink-500/30' 
                  : 'bg-white shadow-neumorph-sm hover:shadow-neumorph'
              }`}
            >
              {/* Card Header: Profil Responden & Waktu */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDark ? 'bg-pink-500/15 text-pink-400 border border-pink-500/20' : 'bg-pink-50 text-pink-600 border border-pink-200'
                  }`}>
                    <User size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{item.demografi.pekerjaan || 'Warga'}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.demografi.jenisKelamin}, {item.demografi.usia} Thn
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Layanan: <span className="text-pink-500 font-bold">{item.demografi.jenisLayanan || 'Umum'}</span>
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full shrink-0 self-start sm:self-auto ${
                  isDark ? 'text-slate-400 bg-slate-800/60' : 'text-slate-500 bg-slate-100'
                }`}>
                  <Clock size={12} />
                  {item.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {/* Card Body: Isi Aspirasi / Komentar */}
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                isDark ? 'bg-[#0d1425]/70 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-pink-500 font-serif font-black text-base mr-1">“</span>
                <span className="font-medium italic">{item.komentar}</span>
                <span className="text-pink-500 font-serif font-black text-base ml-1">”</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
