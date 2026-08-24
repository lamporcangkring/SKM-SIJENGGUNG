import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { Users, PieChart, BarChart2, Briefcase, FileText, GraduationCap } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const PASTEL = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#60a5fa', '#e879f9', '#22d3ee', '#f87171'];

// ── Custom Legend component for Pie/Donut charts ──
const CustomPieLegend = ({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
      {data.map((item, i) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={item.name} className="flex items-center justify-between text-xs font-semibold gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="truncate text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-black text-slate-800 dark:text-white">{item.value}</span>
              <span className="text-[10px] text-slate-400 font-bold">({pct.toFixed(0)}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function RespondenDashboard() {
  const { responses } = useSurvey();
  const { isDark } = useTheme();
  const count = responses.length;

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
      usia: formatData(usia).sort((a, b) => a.name.localeCompare(b.name)),
      pendidikan: formatData(pendidikan),
      pekerjaan: formatData(pekerjaan),
      jenisLayanan: formatData(jenisLayanan),
    };
  }, [responses]);

  const cardCls = isDark 
    ? 'bg-[#111936]/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-xl' 
    : 'bg-white rounded-3xl p-6 shadow-neumorph';

  const tooltipStyle = { borderRadius: '16px', backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#ffffff' : '#0f172a', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' };

  if (count === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
          isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400 shadow-neumorph-sm'
        }`}>
          <Users size={40} />
        </div>
        <h2 className="text-xl font-bold mb-2">Belum Ada Data Responden</h2>
        <p className="text-slate-400 max-w-md text-xs sm:text-sm">Data demografi responden akan muncul otomatis setelah warga mengisi formulir survei.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <div className={`p-2 rounded-2xl shadow-neumorph-sm ${isDark ? 'bg-[#151e32] text-indigo-400' : 'bg-white text-indigo-600'}`}>
              <Users size={24} />
            </div>
            Demografi & Profil Responden
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Infografis latar belakang warga yang telah berpartisipasi dalam survei
          </p>
        </div>

        <div className={`px-5 py-2.5 rounded-2xl ${
          isDark ? 'bg-[#151e32] border border-slate-700/50' : 'bg-white shadow-neumorph-sm'
        }`}>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Responden</div>
          <div className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {count} <span className="text-xs font-semibold text-slate-400">Warga</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Jenis Kelamin Chart */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-pink-500" />
            Proporsi Jenis Kelamin
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={PASTEL[i % PASTEL.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full">
              <CustomPieLegend data={demografiData.jenisKelamin} colors={PASTEL} />
            </div>
          </div>
        </div>

        {/* Usia Chart */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-500" />
            Distribusi Kelompok Usia
          </h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.usia} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Warga">
                  {demografiData.usia.map((_, i) => <Cell key={i} fill={PASTEL[(i + 2) % PASTEL.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tingkat Pendidikan */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-500" />
            Tingkat Pendidikan Terakhir
          </h2>
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {demografiData.pendidikan.map((item, i) => {
              const maxVal = demografiData.pendidikan[0]?.value || 1;
              const pct = (item.value / maxVal) * 100;
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-36 truncate text-right text-slate-700 dark:text-slate-300">{item.name}</span>
                  <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#1a2340]' : 'bg-slate-100'}`}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: PASTEL[(i + 1) % PASTEL.length] }} />
                  </div>
                  <span className="text-xs font-black w-8 text-right shrink-0" style={{ color: PASTEL[(i + 1) % PASTEL.length] }}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pekerjaan Utama */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
            <Briefcase size={18} className="text-amber-500" />
            Pekerjaan Utama Responden
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={PASTEL[(i + 4) % PASTEL.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full">
              <CustomPieLegend data={demografiData.pekerjaan} colors={PASTEL.slice(4).concat(PASTEL.slice(0, 4))} />
            </div>
          </div>
        </div>

        {/* Jenis Layanan Chart */}
        <div className={`lg:col-span-2 ${cardCls}`}>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
            <FileText size={18} className="text-rose-500" />
            Sebaran Jenis Layanan yang Diakses
          </h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.jenisLayanan} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Akses Layanan">
                  {demografiData.jenisLayanan.map((_, i) => <Cell key={i} fill={PASTEL[(i + 3) % PASTEL.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
