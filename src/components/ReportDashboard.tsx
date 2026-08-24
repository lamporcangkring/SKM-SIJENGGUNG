import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS } from '../data/surveyQuestions';
import { BarChart2, Users, Award, ShieldCheck, Database, RefreshCw, TrendingUp, Lightbulb, ThumbsUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ReportDashboard() {
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  
  const count = responses.length;

  // Calculate SKM
  const skmWeight = count > 0 ? 1 / SKM_QUESTIONS.length : 0;
  const skmAverages = SKM_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0, nrrT: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.skm[q.id] || 0), 0);
    const avg = sum / count;
    const nrrT = avg * skmWeight;
    return { ...q, avg, nrrT };
  });

  const totalNrrT = skmAverages.reduce((acc, curr) => acc + curr.nrrT, 0);
  const ikmScore = totalNrrT * 25;

  const getSkmGrade = (score: number) => {
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik', color: 'text-emerald-500', bg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50', border: isDark ? 'border-emerald-500/30' : 'border-emerald-200' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik', color: 'text-blue-500', bg: isDark ? 'bg-blue-950/30' : 'bg-blue-50', border: isDark ? 'border-blue-500/30' : 'border-blue-200' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik', color: 'text-orange-500', bg: isDark ? 'bg-orange-950/30' : 'bg-orange-50', border: isDark ? 'border-orange-500/30' : 'border-orange-200' };
    return { grade: 'D', label: 'Tidak Baik', color: 'text-red-500', bg: isDark ? 'bg-red-950/30' : 'bg-red-50', border: isDark ? 'border-red-500/30' : 'border-red-200' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum ada data', color: 'text-slate-400', bg: isDark ? 'bg-slate-800/50' : 'bg-slate-100', border: isDark ? 'border-slate-700' : 'border-slate-200' };

  // Calculate Perilaku
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });

  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  const getPerilakuGrade = (score: number) => {
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik (Etis)', color: 'text-emerald-500', bg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50', border: isDark ? 'border-emerald-500/30' : 'border-emerald-200' };
    if (score >= 2.51) return { grade: 'B', label: 'Baik', color: 'text-blue-500', bg: isDark ? 'bg-blue-950/30' : 'bg-blue-50', border: isDark ? 'border-blue-500/30' : 'border-blue-200' };
    if (score >= 1.76) return { grade: 'C', label: 'Kurang Baik', color: 'text-orange-500', bg: isDark ? 'bg-orange-950/30' : 'bg-orange-50', border: isDark ? 'border-orange-500/30' : 'border-orange-200' };
    return { grade: 'D', label: 'Tidak Baik', color: 'text-red-500', bg: isDark ? 'bg-red-950/30' : 'bg-red-50', border: isDark ? 'border-red-500/30' : 'border-red-200' };
  };
  const perilakuGrade = count > 0 ? getPerilakuGrade(totalPerilaku) : { grade: '-', label: 'Belum ada data', color: 'text-slate-400', bg: isDark ? 'bg-slate-800/50' : 'bg-slate-100', border: isDark ? 'border-slate-700' : 'border-slate-200' };

  // Calculate Implementasi
  const implementasiAverages = IMPLEMENTASI_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.implementasi?.[q.id] || 0), 0);
    return { ...q, avg: sum / count };
  });
  const totalImplementasi = count > 0 ? implementasiAverages.reduce((acc, curr) => acc + curr.avg, 0) / IMPLEMENTASI_QUESTIONS.length : 0;

  // Calculate Kepuasan
  const totalKepuasan = count > 0 ? responses.reduce((acc, curr) => acc + (curr.kepuasan?.PS1 || 0), 0) / count : 0;

  // Prioritas perbaikan (Nilai terendah)
  const lowestSkmList = count > 0 ? [...skmAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];
  const lowestPerilakuList = count > 0 ? [...perilakuAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];

  const cardCls = isDark 
    ? 'bg-[#111936]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/20 shadow-xl' 
    : 'bg-white rounded-3xl p-6 border border-slate-200 shadow-md';

  return (
    <div className="space-y-6 w-full">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-xl">
              <BarChart2 size={24} />
            </div>
            Laporan Hasil Survei SKM & SPAK
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Kalkulasi otomatis berdasarkan formula NRR PermenPAN-RB untuk Desa Sijenggung.
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-colors cursor-pointer text-xs sm:text-sm"
        >
          <Database size={16} /> Download Laporan PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Responden */}
        <div className={`rounded-2xl p-5 flex flex-col gap-2 border transition-all ${cardCls}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Responden</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black">{count}</div>
          <div className="text-xs text-slate-500">warga berpartisipasi</div>
        </div>

        {/* Mutu SKM */}
        <div className={`rounded-2xl p-5 flex flex-col gap-2 border transition-all ${skmGrade.bg} ${skmGrade.border}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <Award size={18} className={skmGrade.color} />
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${skmGrade.color}`}>Mutu SKM</div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${skmGrade.color}`}>{skmGrade.grade}</div>
          <div className={`text-xs font-semibold ${skmGrade.color} opacity-85`}>IKM: {ikmScore.toFixed(2)} — {skmGrade.label}</div>
        </div>

        {/* Integritas */}
        <div className={`rounded-2xl p-5 flex flex-col gap-2 border transition-all ${perilakuGrade.bg} ${perilakuGrade.border}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <ShieldCheck size={18} className={perilakuGrade.color} />
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${perilakuGrade.color}`}>Integritas</div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${perilakuGrade.color}`}>{perilakuGrade.grade}</div>
          <div className={`text-xs font-semibold ${perilakuGrade.color} opacity-85`}>Skor: {totalPerilaku.toFixed(2)} — {perilakuGrade.label}</div>
        </div>

        {/* Kepuasan */}
        <div className={`rounded-2xl p-5 flex flex-col gap-2 border transition-all ${
          isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <ThumbsUp size={18} className="text-amber-500" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Kepuasan</div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 leading-tight truncate">
            {count > 0 ? (totalKepuasan >= 3.26 ? 'Sangat Puas' : totalKepuasan >= 2.51 ? 'Puas' : totalKepuasan >= 1.76 ? 'Cukup Puas' : 'Tidak Puas') : '-'}
          </div>
          <div className="text-xs font-semibold text-amber-500/80">Skor: {count > 0 ? totalKepuasan.toFixed(2) : '0.00'} / 4.00</div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* SKM Bar Chart */}
        <div className={cardCls}>
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              Distribusi Nilai SKM (Skala 4)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Nilai rata-rata per 9 unsur pelayanan masyarakat</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skmAverages} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="id" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
                <Bar dataKey="avg" fill="#0284c7" radius={[6, 6, 0, 0]} name="Nilai Rata-rata" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Perilaku Bar Chart */}
        <div className={cardCls}>
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Distribusi Nilai Perilaku Antikorupsi (Skala 4)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Skor persepsi integritas per indikator</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perilakuAverages} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="id" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
                <Bar dataKey="avg" fill="#818cf8" radius={[6, 6, 0, 0]} name="Nilai Rata-rata" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Rekomendasi Tindak Lanjut */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
            <Lightbulb size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Rekomendasi Area Prioritas Peningkatan</h2>
            <p className="text-xs text-slate-400">Aspek dengan skor terendah yang memerlukan evaluasi & tindakan nyata</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0d1425] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-sm font-bold text-cyan-500 mb-3 uppercase tracking-wider">
              Pelayanan Publik (SKM)
            </h3>
            {lowestSkmList.length > 0 ? (
              <ul className="space-y-3">
                {lowestSkmList.map(item => (
                  <li key={item.id} className="text-xs space-y-1">
                    <div className="font-bold flex justify-between">
                      <span>{item.id}. {item.label}</span>
                      <span className="text-cyan-500">{item.avg.toFixed(2)}/4</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Rekomendasi: Tingkatkan sosialisasi standar layanan dan percepat alur proses.</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Belum ada data.</p>
            )}
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0d1425] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-sm font-bold text-indigo-500 mb-3 uppercase tracking-wider">
              Penguatan Integritas (SPAK)
            </h3>
            {lowestPerilakuList.length > 0 ? (
              <ul className="space-y-3">
                {lowestPerilakuList.map(item => (
                  <li key={item.id} className="text-xs space-y-1">
                    <div className="font-bold flex justify-between">
                      <span>{item.id}. {item.label}</span>
                      <span className="text-indigo-500">{item.avg.toFixed(2)}/4</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Rekomendasi: Perkuat pengawasan internal dan pertegas komitmen bebas gratifikasi.</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Belum ada data.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
