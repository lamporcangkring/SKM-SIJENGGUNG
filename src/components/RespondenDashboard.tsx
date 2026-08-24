import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { Users, PieChart, BarChart2, Activity, FileText } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

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
        jenisKelamin[d.jenisKelamin] = (jenisKelamin[d.jenisKelamin] || 0) + 1;
        usia[d.usia] = (usia[d.usia] || 0) + 1;
        pendidikan[d.pendidikan] = (pendidikan[d.pendidikan] || 0) + 1;
        pekerjaan[d.pekerjaan] = (pekerjaan[d.pekerjaan] || 0) + 1;
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
    ? 'bg-[#111936]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/20 shadow-xl' 
    : 'bg-white rounded-3xl p-6 border border-slate-200 shadow-md';

  if (count === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
          isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
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
            <div className="p-2 bg-purple-500/15 text-purple-500 border border-purple-500/25 rounded-2xl">
              <Users size={24} />
            </div>
            Demografi & Profil Responden
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Infografis latar belakang warga yang telah berpartisipasi dalam pengisian survei.
          </p>
        </div>

        <div className={`px-5 py-2.5 rounded-2xl border ${
          isDark ? 'bg-[#111936] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Responden</div>
          <div className="text-2xl font-black text-purple-500">
            {count} <span className="text-xs font-semibold text-slate-400">Warga</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Jenis Kelamin Chart */}
        <div className={cardCls}>
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-blue-500" />
            Proporsi Jenis Kelamin
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={demografiData.jenisKelamin}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {demografiData.jenisKelamin.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usia Chart */}
        <div className={cardCls}>
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-500" />
            Distribusi Kelompok Usia (Tahun)
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.usia} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} name="Jumlah Warga" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tingkat Pendidikan */}
        <div className={cardCls}>
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            Tingkat Pendidikan Terakhir
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.pendidikan} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
                <Bar dataKey="value" fill="#818cf8" radius={[0, 6, 6, 0]} name="Jumlah Warga" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pekerjaan Utama */}
        <div className={cardCls}>
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-amber-500" />
            Pekerjaan Utama Responden
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={demografiData.pekerjaan}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  fill="#8884d8"
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {demografiData.pekerjaan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jenis Layanan Chart */}
        <div className={`lg:col-span-2 ${cardCls}`}>
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <FileText size={18} className="text-pink-500" />
            Sebaran Jenis Layanan yang Diakses Warga
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.jenisLayanan} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a' 
                  }} 
                />
                <Bar dataKey="value" fill="#ec4899" radius={[6, 6, 0, 0]} name="Jumlah Akses Layanan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
