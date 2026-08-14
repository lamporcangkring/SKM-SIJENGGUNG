import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { Users, PieChart, BarChart2, Activity, FileText } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f87171', '#c084fc'];

export function RespondenDashboard() {
  const { responses } = useSurvey();
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
      usia: formatData(usia).sort((a, b) => a.name.localeCompare(b.name)), // Sort by age group label
      pendidikan: formatData(pendidikan),
      pekerjaan: formatData(pekerjaan),
      jenisLayanan: formatData(jenisLayanan),
    };
  }, [responses]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  if (count === 0) {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Users size={48} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Belum Ada Data Responden</h2>
        <p className="text-slate-400 max-w-md text-center">Data demografi responden akan muncul di sini setelah ada yang mengisi form survei.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg">
              <Users size={24} />
            </div>
            Data Demografi Responden
          </h1>
          <p className="text-purple-200/80 font-medium max-w-2xl">
            Infografis profil responden yang telah berpartisipasi dalam pengisian survei SKM dan Perilaku Antikorupsi.
          </p>
        </div>
        <div className="bg-[#1e294b]/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Total Responden</div>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            {count} <span className="text-lg font-medium text-slate-400">Orang</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Jenis Kelamin Chart */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-blue-400" />
            Proporsi Jenis Kelamin
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={demografiData.jenisKelamin}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demografiData.jenisKelamin.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usia Chart */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-emerald-400" />
            Distribusi Usia
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.usia} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                />
                <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pendidikan Chart */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-indigo-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-indigo-400" />
            Tingkat Pendidikan
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.pendidikan} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(129, 140, 248, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                />
                <Bar dataKey="value" fill="#818cf8" radius={[0, 6, 6, 0]} name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pekerjaan Chart */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-amber-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-amber-400" />
            Pekerjaan Utama
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={demografiData.pekerjaan}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demografiData.pekerjaan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jenis Layanan Chart */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-pink-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-pink-400" />
            Jenis Layanan yang Diakses
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demografiData.jenisLayanan} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(244, 114, 182, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                />
                <Bar dataKey="value" fill="#f472b6" radius={[6, 6, 0, 0]} name="Jumlah" maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
