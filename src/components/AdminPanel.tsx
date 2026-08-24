import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { Trash2, Users, AlertCircle, RefreshCw, Search, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';

export function AdminPanel() {
  const { responses, loading, error, deleteResponse, refreshResponses } = useSurvey();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = responses.filter(r => {
    const q = search.toLowerCase();
    return (
      r.demografi.jenisKelamin?.toLowerCase().includes(q) ||
      r.demografi.pekerjaan?.toLowerCase().includes(q) ||
      r.demografi.jenisLayanan?.toLowerCase().includes(q) ||
      r.demografi.usia?.toLowerCase().includes(q) ||
      r.id.includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteResponse(id);
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-500/15 text-rose-500 border border-rose-500/25 rounded-2xl">
              <Users size={24} />
            </div>
            Data Responden Masuk
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Daftar seluruh jawaban survei warga yang tersimpan di database SQLite lokal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold ${
            isDark ? 'bg-[#111936] border-slate-700/60 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            Total Data: <span className="text-rose-500 font-extrabold">{responses.length}</span>
          </div>

          <button 
            onClick={refreshResponses} 
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl border transition-colors cursor-pointer disabled:opacity-50 ${
              isDark 
                ? 'bg-[#162039] hover:bg-[#1e294b] text-white border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
            }`}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-cyan-500' : ''} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan pekerjaan, jenis layanan, usia, ID responden..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full border rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-medium focus:outline-none transition-colors ${
            isDark 
              ? 'bg-[#111936]/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-sm'
          }`}
        />
      </div>

      {/* Table / List Items */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-cyan-500" />
          <span className="text-sm font-bold">Memuat data dari database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold">{search ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data responden yang tersimpan.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, idx) => (
            <div 
              key={r.id} 
              className={`rounded-3xl border transition-all overflow-hidden ${
                isDark 
                  ? 'bg-[#111936]/80 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Row Header */}
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-black text-sm flex items-center justify-center shrink-0 border border-blue-500/20">
                  {responses.length - responses.findIndex(x => x.id === r.id)}
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs sm:text-sm min-w-0">
                  <div>
                    <div className="text-slate-400 text-[11px] font-semibold">Jenis Kelamin</div>
                    <div className="font-bold truncate">{r.demografi.jenisKelamin || '-'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px] font-semibold">Usia</div>
                    <div className="font-bold truncate">{r.demografi.usia || '-'} Thn</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px] font-semibold">Pekerjaan</div>
                    <div className="font-bold truncate">{r.demografi.pekerjaan || '-'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px] font-semibold">Layanan Diakses</div>
                    <div className="font-bold truncate text-blue-600 dark:text-cyan-400">{r.demografi.jenisLayanan || '-'}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1 shrink-0">
                  <Clock size={12} />
                  <span>{formatDate(r.timestamp)}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {expandedId === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {confirmId === r.id ? (
                    <div className="flex gap-1.5 animate-in fade-in">
                      <button 
                        onClick={() => handleDelete(r.id)} 
                        disabled={deletingId === r.id}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === r.id ? 'Menghapus...' : 'Ya, Hapus'}
                      </button>
                      <button 
                        onClick={() => setConfirmId(null)} 
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmId(r.id)}
                      title="Hapus Data Ini"
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Dropdown */}
              {expandedId === r.id && (
                <div className={`border-t p-5 grid md:grid-cols-2 gap-4 text-xs ${
                  isDark ? 'bg-[#0d1425]/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                }`}>
                  {/* Nilai SKM */}
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#111936] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="font-bold text-cyan-500 uppercase tracking-wider mb-2.5">
                      Rincian Nilai 9 Unsur SKM
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {Object.entries(r.skm).map(([k, v]) => (
                        <div key={k} className={`p-2 rounded-xl text-center ${isDark ? 'bg-[#070b14]' : 'bg-slate-100'}`}>
                          <div className="text-[10px] text-slate-400 font-bold">{k}</div>
                          <div className="font-black text-sm text-blue-500">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nilai SPAK */}
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#111936] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="font-bold text-indigo-500 uppercase tracking-wider mb-2.5">
                      Rincian Nilai 7 Butir Perilaku (SPAK)
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {Object.entries(r.perilaku).map(([k, v]) => (
                        <div key={k} className={`p-2 rounded-xl text-center ${isDark ? 'bg-[#070b14]' : 'bg-slate-100'}`}>
                          <div className="text-[10px] text-slate-400 font-bold">{k}</div>
                          <div className="font-black text-sm text-indigo-500">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Komentar / Saran */}
                  {r.komentar && (
                    <div className={`md:col-span-2 p-4 rounded-2xl border ${isDark ? 'bg-[#111936] border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="font-bold text-purple-500 uppercase tracking-wider mb-1">
                        Saran / Masukan Warga
                      </div>
                      <p className="italic text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                        "{r.komentar}"
                      </p>
                    </div>
                  )}

                  <div className="md:col-span-2 text-[11px] text-slate-400">
                    ID Data: <code className="font-bold">{r.id}</code> | Waktu Input: {formatDate(r.timestamp)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
