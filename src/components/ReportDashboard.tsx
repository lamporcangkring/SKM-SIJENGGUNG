import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS } from '../data/surveyQuestions';
import { BarChart2, Users, Award, ShieldCheck, Database, RefreshCw, TrendingUp, Lightbulb, ThumbsUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ReportDashboard() {
  const { responses, addMockData, resetResponses } = useSurvey();
  
  const count = responses.length;

  // Calculate SKM
  const skmAverages = SKM_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0, nrrT: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.skm[q.id] || 0), 0);
    const avg = sum / count;
    const nrrT = avg * (1 / 9); // Bobot 1/9
    return { ...q, avg, nrrT };
  });

  const totalNrrT = skmAverages.reduce((acc, curr) => acc + curr.nrrT, 0);
  const ikmScore = totalNrrT * 25;

  const getSkmGrade = (score: number) => {
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik', color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/30' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik', color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-500/30' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik', color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-500/30' };
    return { grade: 'D', label: 'Tidak Baik', color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-500/30' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum ada data', color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700' };

  // Calculate Perilaku
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });

  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  const getPerilakuGrade = (score: number) => {
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik (Etis)', color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/30' };
    if (score >= 2.51) return { grade: 'B', label: 'Baik', color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-500/30' };
    if (score >= 1.76) return { grade: 'C', label: 'Kurang Baik', color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-500/30' };
    return { grade: 'D', label: 'Tidak Baik', color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-500/30' };
  };
  const perilakuGrade = count > 0 ? getPerilakuGrade(totalPerilaku) : { grade: '-', label: 'Belum ada data', color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700' };

  // Calculate Implementasi
  const implementasiAverages = IMPLEMENTASI_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.implementasi?.[q.id] || 0), 0);
    return { ...q, avg: sum / count };
  });
  const totalImplementasi = count > 0 ? implementasiAverages.reduce((acc, curr) => acc + curr.avg, 0) / IMPLEMENTASI_QUESTIONS.length : 0;

  // Calculate Kepuasan
  const kepuasanAverages = KEPUASAN_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.kepuasan?.[q.id] || 0), 0);
    return { ...q, avg: sum / count };
  });
  const totalKepuasan = count > 0 ? kepuasanAverages[0].avg : 0;

  const currentIkm = count > 0 ? Number(ikmScore.toFixed(2)) : 0;
  const currentPerilaku = count > 0 ? Number(totalPerilaku.toFixed(2)) : 0;

  // Identifikasi 3 Unsur Terendah
  const lowestSkmList = count > 0 ? [...skmAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];
  const lowestPerilakuList = count > 0 ? [...perilakuAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];

  const generateSkmPlan = (id: string | undefined) => {
    switch (id) {
      case 'U1': return { action: 'Peninjauan kembali syarat layanan agar lebih relevan dan penyederhanaan dokumen administratif.', pic: 'Kasi Pemerintahan', time: '1 Bulan' };
      case 'U2': return { action: 'Pembuatan alur infografis pelayanan di loket dan website untuk memudahkan pemahaman warga.', pic: 'Sekdes / Kasi Pelayanan', time: '2 Minggu' };
      case 'U3': return { action: 'Penerapan standar waktu operasional (SLA) ketat pada setiap meja layanan.', pic: 'Kepala Desa', time: '1 Bulan' };
      case 'U4': return { action: 'Publikasi transparansi biaya/tarif gratis layanan di tempat yang terlihat jelas.', pic: 'Kaur Keuangan', time: '1 Minggu' };
      case 'U5': return { action: 'Audit berkala antara standar pelayanan baku dengan hasil produk fisik yang diberikan.', pic: 'Sekdes', time: '3 Bulan' };
      case 'U6': return { action: 'Pelatihan bimbingan teknis dan peningkatan kompetensi SDM petugas loket.', pic: 'Kepala Desa', time: '6 Bulan' };
      case 'U7': return { action: 'Pemberian reward & punishment terkait budaya senyum, sapa, salam (3S).', pic: 'Kepala Desa', time: '1 Bulan' };
      case 'U8': return { action: 'Perbaikan fasilitas ruang tunggu, penambahan AC, dan fasilitas disabilitas.', pic: 'Kaur Umum', time: '3 Bulan' };
      case 'U9': return { action: 'Pembuatan kanal pengaduan WhatsApp respons cepat dan kotak saran digital.', pic: 'Kasi Pelayanan', time: '1 Bulan' };
      default: return { action: 'Evaluasi menyeluruh terhadap standar pelayanan minimum.', pic: 'Tim Evaluasi', time: '1 Bulan' };
    }
  };

  const generatePerilakuPlan = (id: string | undefined) => {
    switch (id) {
      case 'P1': return { action: 'Sosialisasi masif tolak gratifikasi dan sanksi tegas kepada aparatur penerima pungli.', pic: 'Kepala Desa', time: '1 Bulan' };
      case 'P2': return { action: 'Pengetatan SOP pemakaian inventaris dinas, wajib lapor penggunaan di luar jam kerja.', pic: 'Kaur Umum', time: '1 Bulan' };
      case 'P3': return { action: 'Pemberlakuan sistem antrean elektronik transparan tanpa jalur khusus/favoritisme.', pic: 'Kasi Pelayanan', time: '3 Bulan' };
      case 'P4': return { action: 'Penanaman nilai-nilai kesederhanaan dan keteladanan pimpinan di lingkungan kerja.', pic: 'Seluruh Aparatur', time: 'Berkelanjutan' };
      case 'P5': return { action: 'Pembentukan unit pengendali gratifikasi (UPG) di tingkat pemerintah desa.', pic: 'Sekdes', time: '3 Bulan' };
      case 'P6': return { action: 'Deklarasi pakta integritas netralitas perangkat desa dalam kontestasi politik lokal.', pic: 'Kepala Desa', time: '1 Bulan' };
      case 'P7': return { action: 'Digitalisasi verifikasi data bansos melalui musyawarah desa yang transparan dan partisipatif.', pic: 'Kasi Kesejahteraan', time: '3 Bulan' };
      default: return { action: 'Peningkatan pengawasan internal (SPIP) untuk mewujudkan wilayah bebas korupsi (WBK).', pic: 'Sekdes', time: 'Berkelanjutan' };
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-cyan-400 border border-blue-500/30 rounded-lg">
              <BarChart2 size={24} />
            </div>
            Laporan Hasil Survei
          </h1>
          <p className="text-blue-200/80 font-medium max-w-2xl">
            Perhitungan otomatis berdasarkan formula NRR (Nilai Rata-Rata) untuk SKM dan Persepsi Perilaku Antikorupsi.
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400 transition-colors whitespace-nowrap"
        >
          <Database size={18} /> Download Laporan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Users size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Responden</div>
            <div className="text-4xl font-black text-white">{count}</div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-5 backdrop-blur-md border ${skmGrade.bg} ${skmGrade.border}`}>
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a]/50 flex items-center justify-center shrink-0 shadow-sm border border-white/5">
            <Award size={32} className={skmGrade.color} />
          </div>
          <div>
            <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${skmGrade.color} opacity-80`}>Mutu SKM</div>
            <div className={`text-4xl font-black ${skmGrade.color} flex items-baseline gap-2`}>
              {skmGrade.grade} <span className="text-lg font-bold opacity-75">({ikmScore.toFixed(2)})</span>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-5 backdrop-blur-md border ${perilakuGrade.bg} ${perilakuGrade.border}`}>
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a]/50 flex items-center justify-center shrink-0 shadow-sm border border-white/5">
            <ShieldCheck size={32} className={perilakuGrade.color} />
          </div>
          <div>
            <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${perilakuGrade.color} opacity-80`}>Integritas</div>
            <div className={`text-4xl font-black ${perilakuGrade.color} flex items-baseline gap-2`}>
              {perilakuGrade.grade} <span className="text-lg font-bold opacity-75">({currentPerilaku.toFixed(2)})</span>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-5 backdrop-blur-md border border-amber-500/30 bg-amber-950/30`}>
          <div className="w-16 h-16 rounded-2xl bg-[#0f172a]/50 flex items-center justify-center shrink-0 shadow-sm border border-white/5">
            <ThumbsUp size={32} className="text-amber-400" />
          </div>
          <div>
            <div className={`text-sm font-bold uppercase tracking-wider mb-1 text-amber-400 opacity-80`}>Kepuasan</div>
            <div className={`text-4xl font-black text-amber-400 flex items-baseline gap-2`}>
              {count > 0 ? (totalKepuasan >= 3.26 ? 'Sangat Puas' : totalKepuasan >= 2.51 ? 'Puas' : totalKepuasan >= 1.76 ? 'Kr. Puas' : 'Tidak Puas') : '-'} <span className="text-lg font-bold opacity-75">({count > 0 ? totalKepuasan.toFixed(2) : '0'})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section - Removed trend line, added bar charts for SKM and Perilaku */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart2 size={20} className="text-cyan-400" />
                Distribusi Nilai SKM (Skala 4)
              </h2>
              <p className="text-sm text-blue-200/80">Nilai rata-rata per unsur pelayanan</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skmAverages} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="avg" name="Nilai Rata-rata" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-indigo-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart2 size={20} className="text-indigo-400" />
                Distribusi Nilai Perilaku (Skala 4)
              </h2>
              <p className="text-sm text-indigo-200/80">Nilai rata-rata per situasi perilaku antikorupsi</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perilakuAverages} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="avg" name="Nilai Rata-rata" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb size={20} className="text-emerald-400" />
                Distribusi Nilai Implementasi (Skala 4)
              </h2>
              <p className="text-sm text-emerald-200/80">Nilai rata-rata persepsi masyarakat terhadap implementasi nilai antikorupsi</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={implementasiAverages} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: '#0f172a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="avg" name="Nilai Rata-rata" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* SKM Table */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-6 border-b border-blue-500/20 bg-[#0f172a]/40">
            <h2 className="text-xl font-bold text-white">Rincian SKM</h2>
            <p className="text-sm text-blue-200/80">Nilai Rata-rata per unsur pelayanan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f172a]/60 text-slate-400 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 border-b border-blue-500/20">Unsur</th>
                  <th className="px-6 py-4 border-b border-blue-500/20 text-center">NRR</th>
                  <th className="px-6 py-4 border-b border-blue-500/20 text-center">NRR Tertimbang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10">
                {skmAverages.map(q => (
                  <tr key={q.id} className="hover:bg-[#3b82f6]/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-300">
                      <span className="inline-block w-8 text-blue-400/80">{q.id}</span>
                      <span className="line-clamp-1">{q.label}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white">{q.avg.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center text-slate-400">{q.nrrT.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#0f172a]/60 font-bold border-t border-blue-500/20">
                <tr>
                  <td className="px-6 py-4 text-right text-slate-300">Total Indeks Kepuasan Masyarakat (IKM)</td>
                  <td className="px-6 py-4 text-center text-slate-500">-</td>
                  <td className="px-6 py-4 text-center text-2xl text-cyan-400">{ikmScore.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Perilaku Table */}
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl border border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-blue-500/20 bg-[#0f172a]/40">
            <h2 className="text-xl font-bold text-white">Rincian Survei Perilaku</h2>
            <p className="text-sm text-blue-200/80">Skor persepsi antikorupsi per situasi</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f172a]/60 text-slate-400 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 border-b border-blue-500/20">Situasi Perilaku</th>
                  <th className="px-6 py-4 border-b border-blue-500/20 text-center">Skor Rata-rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10">
                {perilakuAverages.map(q => (
                  <tr key={q.id} className="hover:bg-[#3b82f6]/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-300">
                      <span className="inline-block w-8 text-blue-400/80">{q.id}</span>
                      <span className="line-clamp-2">{q.label}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white">
                      <div className="inline-flex items-center justify-center bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-lg">
                        {q.avg.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#0f172a]/60 font-bold mt-auto border-t border-blue-500/20">
                <tr>
                  <td className="px-6 py-4 text-right text-slate-300">Nilai Rata-Rata Survei Perilaku</td>
                  <td className="px-6 py-4 text-center text-2xl text-indigo-400">{totalPerilaku.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Tindak Lanjut Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award size={16} />
            </div>
            Saran & Tindak Lanjut Pelayanan (SKM)
          </h2>
          {count > 0 && lowestSkmList.length > 0 ? (
            <div className="space-y-4">
              {lowestSkmList.map((item, index) => {
                const plan = generateSkmPlan(item.id);
                return (
                  <div key={item.id} className="bg-[#0f172a]/40 p-4 rounded-xl border border-blue-500/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-medium text-sm">
                        <span className="text-emerald-400 font-bold mr-2">#{index + 1}</span>
                        {item.id} - {item.label}
                      </div>
                      <div className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs">
                        {item.avg.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20 mt-2">
                      <p className="text-emerald-100 text-sm mb-2">{plan.action}</p>
                      <div className="flex gap-4 text-xs font-semibold">
                        <div className="text-slate-400"><span className="text-emerald-400/70">PIC:</span> {plan.pic}</div>
                        <div className="text-slate-400"><span className="text-emerald-400/70">Waktu:</span> {plan.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic">Belum ada data untuk dianalisis.</div>
          )}
        </div>

        <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 border border-indigo-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={16} />
            </div>
            Saran & Tindak Lanjut Integritas
          </h2>
          {count > 0 && lowestPerilakuList.length > 0 ? (
            <div className="space-y-4">
              {lowestPerilakuList.map((item, index) => {
                const plan = generatePerilakuPlan(item.id);
                return (
                  <div key={item.id} className="bg-[#0f172a]/40 p-4 rounded-xl border border-indigo-500/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-medium text-sm">
                        <span className="text-indigo-400 font-bold mr-2">#{index + 1}</span>
                        {item.id} - {item.label}
                      </div>
                      <div className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs">
                        {item.avg.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/20 mt-2">
                      <p className="text-indigo-100 text-sm mb-2">{plan.action}</p>
                      <div className="flex gap-4 text-xs font-semibold">
                        <div className="text-slate-400"><span className="text-indigo-400/70">PIC:</span> {plan.pic}</div>
                        <div className="text-slate-400"><span className="text-indigo-400/70">Waktu:</span> {plan.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic">Belum ada data untuk dianalisis.</div>
          )}
        </div>
      </div>

      {/* Simpulan Hasil Survei */}
      <div className="bg-[#1e294b]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] pb-10">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/20 pb-4">Simpulan Hasil Survei</h2>
        {count > 0 ? (
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Berdasarkan hasil survei yang telah dilaksanakan terhadap <strong className="text-white">{count} responden</strong>, 
              Pemerintah Desa Sijenggung memperoleh nilai Indeks Kepuasan Masyarakat (IKM) sebesar <strong className="text-cyan-400">{ikmScore.toFixed(2)} ({skmGrade.label})</strong>. 
              Sementara itu, untuk Survei Perilaku Antikorupsi (SPAK) mendapatkan skor rata-rata <strong className="text-indigo-400">{totalPerilaku.toFixed(2)} dari skala 4.00 ({perilakuGrade.label})</strong>.
            </p>
            <p>
              Secara umum, kualitas pelayanan publik dan integritas aparatur dinilai <strong>{skmGrade.label}</strong> oleh masyarakat. Namun demikian, terdapat beberapa area yang perlu mendapat perhatian khusus, di antaranya adalah 
              <span className="text-white mx-1">{lowestSkmList.map(i => i.label).join(', ')}</span> pada aspek pelayanan publik, serta 
              <span className="text-white mx-1">{lowestPerilakuList.map(i => i.label).join(', ')}</span> pada aspek perilaku antikorupsi.
            </p>
            <p>
              Pemerintah Desa Sijenggung berkomitmen untuk melaksanakan rencana tindak lanjut atas rekomendasi yang telah disusun guna mewujudkan pelayanan yang lebih cepat, transparan, dan bebas dari praktik KKN.
            </p>
          </div>
        ) : (
          <div className="text-slate-400 italic">Belum ada data survei untuk ditarik kesimpulan.</div>
        )}
      </div>
    </div>
  );
}
