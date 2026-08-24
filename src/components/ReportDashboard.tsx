import React, { useState, useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS } from '../data/surveyQuestions';
import { BarChart2, Users, Award, ShieldCheck, Database, TrendingUp, Lightbulb, ThumbsUp, Calendar, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, AreaChart, Area, Legend } from 'recharts';

const PASTEL = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#60a5fa', '#e879f9', '#22d3ee', '#f87171'];

// ── Circular Gauge SVG component ──
const CircularGauge = ({ value, max, label, sublabel, color, size = 160 }: { value: number; max: number; label: string; sublabel: string; color: string; size?: number }) => {
  const { isDark } = useTheme();
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="12" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-3xl font-black" style={{ color }}>{value.toFixed(1)}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sublabel}</div>
      </div>
      <div className="text-xs font-bold text-center mt-1">{label}</div>
    </div>
  );
};

// ── Progress Bar Row component ──
const ProgressRow = ({ label, value, max = 4, color, index }: { label: string; value: number; max?: number; color: string; index: number }) => {
  const { isDark } = useTheme();
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 group">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`} style={{ color }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold truncate pr-2">{label}</span>
          <span className="text-xs font-black shrink-0" style={{ color }}>{value.toFixed(2)}</span>
        </div>
        <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`}>
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
        </div>
      </div>
    </div>
  );
};

export function ReportDashboard() {
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'demografi' | 'skm' | 'spak'>('ringkasan');
  
  const count = responses.length;
  const surveyDateStr = '30 Juni – 19 Agustus 2026';

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
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik', color: '#10b981', accent: 'emerald' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik', color: '#6366f1', accent: 'indigo' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik', color: '#f59e0b', accent: 'amber' };
    return { grade: 'D', label: 'Tidak Baik', color: '#ef4444', accent: 'red' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum ada data', color: '#94a3b8', accent: 'slate' };

  // Calculate Perilaku
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });

  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  const getPerilakuGrade = (score: number) => {
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik', color: '#10b981', accent: 'emerald' };
    if (score >= 2.51) return { grade: 'B', label: 'Baik', color: '#6366f1', accent: 'indigo' };
    if (score >= 1.76) return { grade: 'C', label: 'Kurang Baik', color: '#f59e0b', accent: 'amber' };
    return { grade: 'D', label: 'Tidak Baik', color: '#ef4444', accent: 'red' };
  };
  const perilakuGrade = count > 0 ? getPerilakuGrade(totalPerilaku) : { grade: '-', label: 'Belum ada data', color: '#94a3b8', accent: 'slate' };

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
    ? 'bg-[#111936]/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-xl' 
    : 'bg-white rounded-3xl p-6 shadow-neumorph';

  // ── Tooltip styling ──
  const tooltipStyle = { borderRadius: '16px', backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#ffffff' : '#0f172a', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' };

  // ── Area chart data (responses per day) ──
  const dailyData = useMemo(() => {
    const map = new Map<string, number>();
    responses.forEach(r => {
      const d = new Date(r.timestamp);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([date, jumlah]) => ({ date, jumlah }));
  }, [responses]);

  return (
    <div className="space-y-6 w-full print:hidden">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-2 ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
            <Calendar size={13} /> Periode: {surveyDateStr}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1 flex items-center gap-3">
            <div className={`p-2 rounded-2xl shadow-neumorph-sm flex items-center justify-center ${isDark ? 'bg-[#151e32]' : 'bg-white'}`}>
              <img src="/logo-banjarnegara.png" alt="Logo Banjarnegara" className="w-8 h-8 object-contain drop-shadow-md" />
            </div>
            Dashboard Analitik SKM & SPAK
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Kalkulasi otomatis PermenPAN-RB No. 14/2017 & No. 90/2021
          </p>
        </div>

        <button 
          onClick={() => window.print()} 
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-extrabold rounded-2xl shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm"
        >
          <Database size={17} /> Download Laporan PDF
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ringkasan', label: 'Ringkasan', icon: TrendingUp },
          { id: 'demografi', label: 'Demografi', icon: PieChartIcon },
          { id: 'skm', label: '9 Unsur SKM', icon: Award },
          { id: 'spak', label: '7 Indikator SPAK', icon: ShieldCheck },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] transform -translate-y-0.5'
                  : isDark
                  ? 'bg-[#151e32] text-slate-400 hover:text-white'
                  : 'bg-white text-slate-500 hover:text-indigo-600 shadow-neumorph-sm'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════ TAB: RINGKASAN ═══════ */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">

          {/* Row 1: 4 Stat Mini Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Responden */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-50'}`}>
                  <Users size={20} className="text-indigo-500" />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={12} /> 100%</span>
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{count}</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Total Responden</div>
            </div>
            {/* IKM Score */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
                  <Award size={20} className="text-blue-500" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Mutu {skmGrade.grade}</span>
              </div>
              <div className="text-3xl font-black" style={{ color: skmGrade.color }}>{ikmScore.toFixed(1)}</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Nilai IKM • {skmGrade.label}</div>
            </div>
            {/* SPAK */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
                  <ShieldCheck size={20} className="text-purple-500" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>Mutu {perilakuGrade.grade}</span>
              </div>
              <div className="text-3xl font-black" style={{ color: perilakuGrade.color }}>{totalPerilaku.toFixed(2)}</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Skor SPAK • {perilakuGrade.label}</div>
            </div>
            {/* Kepuasan */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-pink-500/15' : 'bg-pink-50'}`}>
                  <ThumbsUp size={20} className="text-pink-500" />
                </div>
                <span className="text-[10px] font-bold text-pink-500 flex items-center gap-0.5"><ArrowUpRight size={12} /> {((totalKepuasan / 4) * 100).toFixed(0)}%</span>
              </div>
              <div className="text-3xl font-black text-pink-500">{totalKepuasan.toFixed(2)}</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Kepuasan Warga</div>
            </div>
          </div>

          {/* Row 2: Circular Gauges + Area Chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Gauges Card */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Indeks Kinerja
              </h3>
              <div className="flex items-center justify-around gap-4">
                {/* IKM Gauge */}
                <div className="relative">
                  <CircularGauge value={ikmScore} max={100} label="IKM" sublabel="dari 100" color={skmGrade.color} size={140} />
                </div>
                {/* SPAK Gauge */}
                <div className="relative">
                  <CircularGauge value={totalPerilaku} max={4} label="SPAK" sublabel="dari 4.00" color={perilakuGrade.color} size={140} />
                </div>
              </div>
            </div>

            {/* Area Chart: Tren Harian */}
            <div className={`lg:col-span-2 ${cardCls}`}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Tren Pengisian Harian
              </h3>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="date" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="jumlah" stroke="#a78bfa" strokeWidth={2.5} fill="url(#areaGrad)" name="Responden" dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#8b5cf6' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: SKM Progress Bars + SPAK Progress Bars */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* SKM Horizontal Bars */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Skor 9 Unsur SKM
              </h3>
              <div className="space-y-3.5">
                {skmAverages.map((item, i) => (
                  <React.Fragment key={item.id}>
                    <ProgressRow label={item.label} value={item.avg} color={PASTEL[i % PASTEL.length]} index={i} />
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* SPAK Horizontal Bars */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Skor 7 Indikator Perilaku Antikorupsi
              </h3>
              <div className="space-y-3.5">
                {perilakuAverages.map((item, i) => (
                  <React.Fragment key={item.id}>
                    <ProgressRow label={item.label} value={item.avg} color={PASTEL[(i + 3) % PASTEL.length]} index={i} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Rekomendasi */}
          <div className={cardCls}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/15' : 'bg-amber-50'}`}>
                <Lightbulb size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Area Prioritas Peningkatan</h3>
                <p className="text-[11px] text-slate-400">Aspek skor terendah yang memerlukan evaluasi</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-[#0d1425] border border-slate-800' : 'bg-slate-50'}`}>
                <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-3">Pelayanan (SKM)</h4>
                <div className="space-y-2.5">
                  {lowestSkmList.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2.5 text-xs">
                      <span className="w-5 h-5 rounded-lg bg-cyan-500/15 text-cyan-500 font-black text-[10px] flex items-center justify-center">{i+1}</span>
                      <span className="flex-1 font-medium truncate">{item.label}</span>
                      <span className="font-black text-cyan-500">{item.avg.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-[#0d1425] border border-slate-800' : 'bg-slate-50'}`}>
                <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-3">Antikorupsi (SPAK)</h4>
                <div className="space-y-2.5">
                  {lowestPerilakuList.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2.5 text-xs">
                      <span className="w-5 h-5 rounded-lg bg-purple-500/15 text-purple-500 font-black text-[10px] flex items-center justify-center">{i+1}</span>
                      <span className="flex-1 font-medium truncate">{item.label}</span>
                      <span className="font-black text-purple-500">{item.avg.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TAB: DEMOGRAFI ═══════ */}
      {activeTab === 'demografi' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Gender Donut */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500" /> Jenis Kelamin</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value"
                      label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={PASTEL[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Usia Bar */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Distribusi Usia</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demografiData.usia} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="name" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Jumlah">
                      {demografiData.usia.map((_, i) => <Cell key={i} fill={PASTEL[(i + 2) % PASTEL.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Pendidikan */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Tingkat Pendidikan</h3>
              <div className="space-y-3">
                {demografiData.pendidikan.map((item, i) => {
                  const maxVal = demografiData.pendidikan[0]?.value || 1;
                  const pct = (item.value / maxVal) * 100;
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-28 truncate text-right">{item.name}</span>
                      <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PASTEL[i % PASTEL.length], transition: 'width 0.7s ease-out' }} />
                      </div>
                      <span className="text-xs font-black w-8 text-right" style={{ color: PASTEL[i % PASTEL.length] }}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Pekerjaan Donut */}
            <div className={cardCls}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pekerjaan</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value"
                      label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={PASTEL[(i + 4) % PASTEL.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Layanan Full Width */}
          <div className={cardCls}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Jenis Layanan Diakses</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demografiData.jenisLayanan} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="layananGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="url(#layananGr)" radius={[8, 8, 0, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TAB: SKM DETAIL ═══════ */}
      {activeTab === 'skm' && (
        <div className="space-y-6">
          <div className={cardCls}>
            <h3 className="text-sm font-bold mb-2">Detail 9 Unsur Pelayanan Publik</h3>
            <p className="text-xs text-slate-400 mb-6">Kalkulasi NRR tertimbang per unsur sesuai PermenPAN-RB No. 14/2017</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={isDark ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                    <th className="text-left py-3 px-2 font-bold text-slate-400">No</th>
                    <th className="text-left py-3 px-2 font-bold text-slate-400">Unsur</th>
                    <th className="text-center py-3 px-2 font-bold text-slate-400">NRR</th>
                    <th className="text-center py-3 px-2 font-bold text-slate-400">Bobot</th>
                    <th className="text-center py-3 px-2 font-bold text-slate-400">NRR×B</th>
                    <th className="text-left py-3 px-2 font-bold text-slate-400 w-40">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {skmAverages.map((item, i) => (
                    <tr key={item.id} className={`${isDark ? 'border-b border-slate-800 hover:bg-white/[0.02]' : 'border-b border-slate-100 hover:bg-slate-50/50'} transition-colors`}>
                      <td className="py-3 px-2 font-black" style={{ color: PASTEL[i] }}>{i + 1}</td>
                      <td className="py-3 px-2 font-semibold">{item.label}</td>
                      <td className="py-3 px-2 text-center font-bold">{item.avg.toFixed(3)}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{skmWeight.toFixed(3)}</td>
                      <td className="py-3 px-2 text-center font-bold" style={{ color: PASTEL[i] }}>{item.nrrT.toFixed(3)}</td>
                      <td className="py-3 px-2">
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`}>
                          <div className="h-full rounded-full" style={{ width: `${(item.avg / 4) * 100}%`, background: PASTEL[i], transition: 'width 0.5s' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={isDark ? 'border-t-2 border-slate-600' : 'border-t-2 border-slate-300'}>
                    <td colSpan={4} className="py-3 px-2 font-black text-right">Total NRR Tertimbang (IKM)</td>
                    <td className="py-3 px-2 text-center font-black text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{ikmScore.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        Mutu {skmGrade.grade} — {skmGrade.label}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TAB: SPAK DETAIL ═══════ */}
      {activeTab === 'spak' && (
        <div className="space-y-6">
          <div className={cardCls}>
            <h3 className="text-sm font-bold mb-2">Detail 7 Indikator Perilaku Antikorupsi</h3>
            <p className="text-xs text-slate-400 mb-6">Persepsi masyarakat terhadap integritas (PermenPAN-RB No. 90/2021)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={isDark ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                    <th className="text-left py-3 px-2 font-bold text-slate-400">No</th>
                    <th className="text-left py-3 px-2 font-bold text-slate-400">Indikator</th>
                    <th className="text-center py-3 px-2 font-bold text-slate-400">Skor</th>
                    <th className="text-center py-3 px-2 font-bold text-slate-400">% Max</th>
                    <th className="text-left py-3 px-2 font-bold text-slate-400 w-40">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {perilakuAverages.map((item, i) => {
                    const pct = (item.avg / 4) * 100;
                    return (
                      <tr key={item.id} className={`${isDark ? 'border-b border-slate-800 hover:bg-white/[0.02]' : 'border-b border-slate-100 hover:bg-slate-50/50'} transition-colors`}>
                        <td className="py-3 px-2 font-black" style={{ color: PASTEL[(i + 3) % PASTEL.length] }}>{i + 1}</td>
                        <td className="py-3 px-2 font-semibold">{item.label}</td>
                        <td className="py-3 px-2 text-center font-bold" style={{ color: PASTEL[(i + 3) % PASTEL.length] }}>{item.avg.toFixed(3)}</td>
                        <td className="py-3 px-2 text-center text-slate-400 font-semibold">{pct.toFixed(1)}%</td>
                        <td className="py-3 px-2">
                          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PASTEL[(i + 3) % PASTEL.length], transition: 'width 0.5s' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={isDark ? 'border-t-2 border-slate-600' : 'border-t-2 border-slate-300'}>
                    <td colSpan={2} className="py-3 px-2 font-black text-right">Rata-rata SPAK</td>
                    <td className="py-3 px-2 text-center font-black text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{totalPerilaku.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-400">{((totalPerilaku / 4) * 100).toFixed(1)}%</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                        Mutu {perilakuGrade.grade} — {perilakuGrade.label}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
