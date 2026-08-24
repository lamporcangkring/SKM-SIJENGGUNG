import React, { useState, useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS } from '../data/surveyQuestions';
import { BarChart2, Users, Award, ShieldCheck, Database, RefreshCw, TrendingUp, Lightbulb, ThumbsUp, Calendar, Filter, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0284c7', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function ReportDashboard() {
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'demografi' | 'skm' | 'spak'>('ringkasan');
  
  const count = responses.length;
  const surveyDateStr = '10 Agustus 2026';

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

  // Calculate Kepuasan
  const totalKepuasan = count > 0 ? responses.reduce((acc, curr) => acc + (curr.kepuasan?.PS1 || 0), 0) / count : 0;

  // Prioritas perbaikan
  const lowestSkmList = count > 0 ? [...skmAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];
  const lowestPerilakuList = count > 0 ? [...perilakuAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];

  // Demografi Data
  const demografiData = useMemo(() => {
    const jenisKelamin: Record<string, number> = {};
    const usia: Record<string, number> = {};
    const pendidikan: Record<string, number> = {};
    const pekerjaan: Record<string, number> = {};
    const jenisLayanan: Record<string, number> = {};

    responses.forEach(r => {
      const d = r.demografi;
      if (d) {
        if (d.jenisKelamin) jenisKelamin[d.jenisKelamin] = (jenisKelamin[d.jenisKelamin] || 0) + 1;
        if (d.usia) usia[d.usia] = (usia[d.usia] || 0) + 1;
        if (d.pendidikan) pendidikan[d.pendidikan] = (pendidikan[d.pendidikan] || 0) + 1;
        if (d.pekerjaan) pekerjaan[d.pekerjaan] = (pekerjaan[d.pekerjaan] || 0) + 1;
        if (d.jenisLayanan) jenisLayanan[d.jenisLayanan] = (jenisLayanan[d.jenisLayanan] || 0) + 1;
      }
    });

    const formatData = (obj: Record<string, number>) => 
      Object.entries(obj).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return {
      jenisKelamin: formatData(jenisKelamin),
      usia: formatData(usia),
      pendidikan: formatData(pendidikan),
      pekerjaan: formatData(pekerjaan),
      jenisLayanan: formatData(jenisLayanan),
    };
  }, [responses]);

  const cardCls = isDark 
    ? 'bg-[#111936]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/20 shadow-xl' 
    : 'bg-white rounded-3xl p-6 border border-slate-200 shadow-md';

  return (
    <div className="space-y-6 w-full print:hidden">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-xs font-bold mb-2">
            <Calendar size={13} /> Periode Data: {surveyDateStr}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-xl">
              <BarChart2 size={24} />
            </div>
            Laporan Hasil Survei SKM & SPAK
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Kalkulasi otomatis berdasarkan formula NRR PermenPAN-RB No. 14 / 2017 & PermenPAN-RB No. 90 / 2021.
          </p>
        </div>

        <button 
          onClick={() => window.print()} 
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm"
        >
          <Database size={17} /> Download Laporan PDF Resmi
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'ringkasan', label: 'Ringkasan Utama', icon: TrendingUp },
          { id: 'demografi', label: 'Analisis Demografi', icon: PieChartIcon },
          { id: 'skm', label: 'Detail 9 Unsur SKM', icon: Award },
          { id: 'spak', label: 'Detail 7 Indikator SPAK', icon: ShieldCheck },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-800/50 text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary Cards (Full View) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Responden */}
        <div className={`rounded-3xl p-5 flex flex-col gap-2 border transition-all ${cardCls}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Responden</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black">{count}</div>
          <div className="text-xs text-slate-500 font-semibold">100% Warga Desa Sijenggung</div>
        </div>

        {/* Mutu SKM */}
        <div className={`rounded-3xl p-5 flex flex-col gap-2 border transition-all ${skmGrade.bg} ${skmGrade.border}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <Award size={18} className={skmGrade.color} />
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${skmGrade.color}`}>Mutu SKM</div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${skmGrade.color}`}>{skmGrade.grade}</div>
          <div className={`text-xs font-bold ${skmGrade.color} opacity-90`}>IKM: {ikmScore.toFixed(2)} — {skmGrade.label}</div>
        </div>

        {/* Integritas SPAK */}
        <div className={`rounded-3xl p-5 flex flex-col gap-2 border transition-all ${perilakuGrade.bg} ${perilakuGrade.border}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <ShieldCheck size={18} className={perilakuGrade.color} />
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${perilakuGrade.color}`}>Integritas SPAK</div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${perilakuGrade.color}`}>{perilakuGrade.grade}</div>
          <div className={`text-xs font-bold ${perilakuGrade.color} opacity-90`}>Skor: {totalPerilaku.toFixed(2)} — {perilakuGrade.label}</div>
        </div>

        {/* Kepuasan */}
        <div className={`rounded-3xl p-5 flex flex-col gap-2 border transition-all ${
          isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#0f172a]' : 'bg-white shadow-sm'}`}>
              <ThumbsUp size={18} className="text-amber-500" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Kepuasan</div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 leading-tight truncate">
            {count > 0 ? (totalKepuasan >= 3.26 ? 'Sangat Puas' : totalKepuasan >= 2.51 ? 'Puas' : 'Cukup Puas') : '-'}
          </div>
          <div className="text-xs font-bold text-amber-500/90">Skor: {totalKepuasan.toFixed(2)} / 4.00</div>
        </div>

      </div>

      {/* TAB CONTENT 1: RINGKASAN UTAMA & GRAFIK */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
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

          {/* Rekomendasi Area Prioritas */}
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
                        <p className="text-slate-400 text-[11px]">Rekomendasi: Tingkatkan sosialisasi standar layanan dan alur proses.</p>
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
                        <p className="text-slate-400 text-[11px]">Rekomendasi: Perkuat pengawasan internal dan perjelas transparansi bansos.</p>
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
      )}

      {/* TAB CONTENT 2: ANALISIS DEMOGRAFI */}
      {activeTab === 'demografi' && (
        <div className="grid md:grid-cols-2 gap-6">
          
          <div className={cardCls}>
            <h3 className="font-bold text-base mb-3">Distribusi Jenis Kelamin</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-bold text-base mb-3">Distribusi Pekerjaan Utama</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-bold text-base mb-3">Distribusi Usia (Tahun)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demografiData.usia}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-bold text-base mb-3">Distribusi Jenis Layanan Diakses</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demografiData.jenisLayanan} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 3: SKM DETAIL TABLE */}
      {activeTab === 'skm' && (
        <div className={cardCls}>
          <h2 className="text-lg font-bold mb-4">Tabel 9 Unsur Evaluasi Pelayanan Publik (PermenPAN-RB No. 14 / 2017)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b font-bold ${isDark ? 'border-slate-800 text-slate-300 bg-[#0d1425]' : 'border-slate-200 text-slate-700 bg-slate-100'}`}>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Pertanyaan / Unsur Standar Pelayanan</th>
                  <th className="p-3 text-center">NRR</th>
                  <th className="p-3 text-center">NRR Tertimbang</th>
                  <th className="p-3 text-center">Kategori Mutu</th>
                </tr>
              </thead>
              <tbody>
                {skmAverages.map(q => (
                  <tr key={q.id} className={`border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="p-3 font-bold text-cyan-500">{q.id}</td>
                    <td className="p-3 font-medium">{q.label}</td>
                    <td className="p-3 text-center font-bold">{q.avg.toFixed(2)}</td>
                    <td className="p-3 text-center font-bold text-blue-500">{q.nrrT.toFixed(3)}</td>
                    <td className="p-3 text-center font-extrabold text-emerald-500">Sangat Baik</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SPAK DETAIL TABLE */}
      {activeTab === 'spak' && (
        <div className={cardCls}>
          <h2 className="text-lg font-bold mb-4">Tabel 7 Indikator Persepsi Perilaku Antikorupsi (PermenPAN-RB No. 90 / 2021)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b font-bold ${isDark ? 'border-slate-800 text-slate-300 bg-[#0d1425]' : 'border-slate-200 text-slate-700 bg-slate-100'}`}>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Indikator Situasi Integritas & Antikorupsi</th>
                  <th className="p-3 text-center">Skor Rata-Rata</th>
                  <th className="p-3 text-center">Kategori Integritas</th>
                </tr>
              </thead>
              <tbody>
                {perilakuAverages.map(q => (
                  <tr key={q.id} className={`border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="p-3 font-bold text-indigo-500">{q.id}</td>
                    <td className="p-3 font-medium">{q.label}</td>
                    <td className="p-3 text-center font-bold text-indigo-500">{q.avg.toFixed(2)}</td>
                    <td className="p-3 text-center font-extrabold text-emerald-500">Sangat Berintegritas</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
