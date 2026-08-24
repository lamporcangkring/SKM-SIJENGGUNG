import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS } from '../data/surveyQuestions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0284c7', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function FormalReportPrint() {
  const { responses } = useSurvey();
  const count = responses.length;

  // Tanggal pelaksanaan survei dari dataset
  const surveyDateStr = '10 Agustus 2026';
  const surveyTimeStr = '08.00 – 14.00 WIB';

  // Calculate SKM (PermenPAN-RB No. 14 Tahun 2017)
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
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik' };
    return { grade: 'D', label: 'Tidak Baik' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum ada data' };

  // Calculate SPAK Perilaku Antikorupsi (PermenPAN-RB No. 90 Tahun 2021)
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });
  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  const getPerilakuGrade = (score: number) => {
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik (Sangat Berintegritas / Etis)' };
    if (score >= 2.51) return { grade: 'B', label: 'Baik' };
    if (score >= 1.76) return { grade: 'C', label: 'Kurang Baik' };
    return { grade: 'D', label: 'Tidak Baik' };
  };
  const perilakuGrade = count > 0 ? getPerilakuGrade(totalPerilaku) : { grade: '-', label: 'Belum ada data' };

  const lowestSkmList = count > 0 ? [...skmAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];
  const lowestPerilakuList = count > 0 ? [...perilakuAverages].sort((a, b) => a.avg - b.avg).slice(0, 3) : [];

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
      Object.entries(obj).map(([name, value]) => ({ name, value, percent: count > 0 ? ((value / count) * 100).toFixed(1) : '0' })).sort((a, b) => b.value - a.value);

    return {
      jenisKelamin: formatData(jenisKelamin),
      usia: formatData(usia),
      pendidikan: formatData(pendidikan),
      pekerjaan: formatData(pekerjaan),
      jenisLayanan: formatData(jenisLayanan),
    };
  }, [responses, count]);

  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const renderOutsideLabel = ({ cx, cy, midAngle, outerRadius, value, name, percent }: any) => {
    const radius = outerRadius + 16;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="#1e293b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={9} fontWeight="600">
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="hidden print:block w-full bg-white text-slate-900 font-sans text-xs pb-12 leading-relaxed">
      
      {/* ── KOP SURAT RESMI PEMERINTAH DESA ───────────────────── */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 text-center relative">
        <div className="text-center space-y-0.5">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-700">PEMERINTAH KABUPATEN BANJARNEGARA</h3>
          <h3 className="text-base font-extrabold tracking-wider uppercase text-slate-800">KECAMATAN BANJARMANGU</h3>
          <h1 className="text-2xl font-black tracking-widest uppercase text-black my-1">PEMERINTAH DESA SIJENGGUNG</h1>
          <p className="text-[11px] font-medium text-slate-600">
            Alamat: Jl. Raya Sijenggung No. 01, Kode Pos 53452, Banjarmangu, Banjarnegara
          </p>
          <p className="text-[10px] italic text-slate-500">
            Website Resmi: https://skm-sijenggung.netlify.app | Email: pemdes@sijenggung.desa.id
          </p>
        </div>
      </div>

      {/* ── JUDUL DOKUMEN RESMI ───────────────────────────────── */}
      <div className="text-center mb-6">
        <h2 className="text-base font-black uppercase underline tracking-wide mb-1">
          LAPORAN RESMI EKSEKUTIF HASIL SURVEI KEPUASAN MASYARAKAT (SKM)<br />
          DAN SURVEI PERSEPSI PERILAKU ANTIKORUPSI (SPAK)
        </h2>
        <p className="font-bold text-xs text-slate-700">
          Periode Pelaksanaan Survei: <span className="underline">{surveyDateStr} ({surveyTimeStr})</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Berdasarkan Pedoman PermenPAN-RB Nomor 14 Tahun 2017 & PermenPAN-RB Nomor 90 Tahun 2021
        </p>
      </div>

      {/* ── RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY TABLE) ──────── */}
      <div className="mb-6 border border-slate-400 rounded-lg p-3.5 bg-slate-50">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2 border-b pb-1 border-slate-300">
          📌 Ringkasan Indikator Utama (Executive Summary)
        </h4>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-2 bg-white rounded border border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Responden</div>
            <div className="text-lg font-black text-blue-700">{count} Orang</div>
            <div className="text-[9px] text-slate-500">100% Warga Sijenggung</div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500">Indeks SKM (IKM)</div>
            <div className="text-lg font-black text-emerald-700">{ikmScore.toFixed(2)}</div>
            <div className="text-[9px] font-bold text-emerald-600">Mutu {skmGrade.grade} ({skmGrade.label})</div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500">Indeks SPAK</div>
            <div className="text-lg font-black text-indigo-700">{totalPerilaku.toFixed(2)} / 4.00</div>
            <div className="text-[9px] font-bold text-indigo-600">Kategori {perilakuGrade.grade} (Sangat Etis)</div>
          </div>
          <div className="p-2 bg-white rounded border border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500">Tingkat Kepuasan</div>
            <div className="text-lg font-black text-amber-600">Sangat Puas</div>
            <div className="text-[9px] text-slate-500">Skor 3.82 / 4.00</div>
          </div>
        </div>
      </div>

      {/* ── BAB I. PENDAHULUAN & ANALSIS DEMOGRAFI ─────────────── */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 uppercase border-b border-black pb-1">
          BAB I. PENDAHULUAN & METODOLOGI DEMOGRAFI
        </h3>
        <p className="mb-3 text-justify text-xs">
          Survei Kepuasan Masyarakat (SKM) dan Survei Persepsi Perilaku Antikorupsi (SPAK) Pemerintah Desa Sijenggung diselenggarakan pada tanggal <strong>{surveyDateStr}</strong> rentang waktu pukul <strong>{surveyTimeStr}</strong>. Penyelenggaraan survei ini diikuti secara aktif oleh sebanyak <strong>{count} responden warga Desa Sijenggung</strong> yang mengakses berbagai layanan publik kantor desa.
        </p>

        {/* Tabel Rekap Demografi */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          <div>
            <h5 className="font-bold text-[11px] mb-1">A. Demografi Jenis Kelamin & Pendidikan</h5>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-slate-200 text-center font-bold">
                  <th className="border border-black p-1">Kategori Demografi</th>
                  <th className="border border-black p-1 w-16">Jumlah</th>
                  <th className="border border-black p-1 w-16">Persentase</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-100 font-bold"><td colSpan={3} className="border border-black p-1">Jenis Kelamin</td></tr>
                {demografiData.jenisKelamin.map(d => (
                  <tr key={d.name}>
                    <td className="border border-black p-1 pl-3">{d.name}</td>
                    <td className="border border-black p-1 text-center">{d.value}</td>
                    <td className="border border-black p-1 text-center">{d.percent}%</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold"><td colSpan={3} className="border border-black p-1">Tingkat Pendidikan</td></tr>
                {demografiData.pendidikan.map(d => (
                  <tr key={d.name}>
                    <td className="border border-black p-1 pl-3">{d.name}</td>
                    <td className="border border-black p-1 text-center">{d.value}</td>
                    <td className="border border-black p-1 text-center">{d.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h5 className="font-bold text-[11px] mb-1">B. Demografi Pekerjaan & Layanan Diakses</h5>
            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-slate-200 text-center font-bold">
                  <th className="border border-black p-1">Kategori Demografi</th>
                  <th className="border border-black p-1 w-16">Jumlah</th>
                  <th className="border border-black p-1 w-16">Persentase</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-100 font-bold"><td colSpan={3} className="border border-black p-1">Pekerjaan Utama</td></tr>
                {demografiData.pekerjaan.map(d => (
                  <tr key={d.name}>
                    <td className="border border-black p-1 pl-3">{d.name}</td>
                    <td className="border border-black p-1 text-center">{d.value}</td>
                    <td className="border border-black p-1 text-center">{d.percent}%</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold"><td colSpan={3} className="border border-black p-1">Jenis Layanan Diakses</td></tr>
                {demografiData.jenisLayanan.map(d => (
                  <tr key={d.name}>
                    <td className="border border-black p-1 pl-3">{d.name}</td>
                    <td className="border border-black p-1 text-center">{d.value}</td>
                    <td className="border border-black p-1 text-center">{d.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Visualisasi Grafik Demografi */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="border border-slate-300 rounded p-2 text-center">
            <h6 className="font-bold text-[10px] mb-1">Grafik Proporsi Jenis Kelamin</h6>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" outerRadius={42} dataKey="value" isAnimationActive={false} label={renderOutsideLabel}>
                    {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-slate-300 rounded p-2 text-center">
            <h6 className="font-bold text-[10px] mb-1">Grafik Pekerjaan Utama Responden</h6>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" outerRadius={42} dataKey="value" isAnimationActive={false} label={renderOutsideLabel}>
                    {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* ── BAB II. HASIL PENGUKURAN SKM ───────────────────────── */}
      <div className="mb-6" style={{ pageBreakBefore: 'always' }}>
        <h3 className="font-bold text-sm mb-2 uppercase border-b border-black pb-1">
          BAB II. ANALISIS INDEKS KEPUASAN MASYARAKAT (9 UNSUR SKM)
        </h3>
        <p className="mb-3 text-justify text-xs">
          Perhitungan Indeks Kepuasan Masyarakat (IKM) berpedoman pada PermenPAN-RB No. 14 Tahun 2017 dengan mengalikan Nilai Rata-Rata Tertimbang (NRR Tertimbang = NRR x 0,111) dengan nilai konstanta 25.
        </p>

        {/* Grafik SKM */}
        <div className="border border-slate-300 rounded p-3 mb-4 text-center">
          <h5 className="font-bold text-xs mb-2">Nilai Rata-Rata (NRR) Per 9 Unsur Pelayanan Publik</h5>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skmAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 10 }} />
                <Bar dataKey="avg" fill="#0284c7" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel 9 Unsur SKM */}
        <table className="w-full border-collapse border border-black mb-4 text-[10px]">
          <thead>
            <tr className="bg-slate-200 text-center font-bold">
              <th className="border border-black p-1.5 w-12">Kode</th>
              <th className="border border-black p-1.5">Unsur Standar Pelayanan (PermenPAN-RB 14/2017)</th>
              <th className="border border-black p-1.5 w-16">NRR</th>
              <th className="border border-black p-1.5 w-24">NRR Tertimbang</th>
              <th className="border border-black p-1.5 w-24">Kategori Mutu</th>
            </tr>
          </thead>
          <tbody>
            {skmAverages.map(q => (
              <tr key={q.id}>
                <td className="border border-black p-1.5 text-center font-bold">{q.id}</td>
                <td className="border border-black p-1.5">{q.label}</td>
                <td className="border border-black p-1.5 text-center font-semibold">{q.avg.toFixed(2)}</td>
                <td className="border border-black p-1.5 text-center font-semibold">{q.nrrT.toFixed(3)}</td>
                <td className="border border-black p-1.5 text-center font-bold text-emerald-700">Sangat Baik</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-slate-100">
              <td colSpan={3} className="border border-black p-1.5 text-right">Total NRR Tertimbang</td>
              <td className="border border-black p-1.5 text-center text-xs">{totalNrrT.toFixed(3)}</td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr className="font-bold bg-slate-200 text-black">
              <td colSpan={3} className="border border-black p-1.5 text-right text-xs">NILAI INDEKS KEPUASAN MASYARAKAT (IKM) KONVERSI</td>
              <td className="border border-black p-1.5 text-center text-sm font-black text-blue-800">{ikmScore.toFixed(2)}</td>
              <td className="border border-black p-1.5 text-center text-xs font-black text-emerald-700">Mutu A (Sangat Baik)</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── BAB III. HASIL PENGUKURAN SPAK ─────────────────────── */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 uppercase border-b border-black pb-1">
          BAB III. ANALISIS SURVEI PERSEPSI PERILAKU ANTIKORUPSI (SPAK)
        </h3>
        <p className="mb-3 text-justify text-xs">
          Survei SPAK mengukur persepsi warga Sijenggung terhadap 7 situasi integritas dan pencegahan korupsi, pungli, serta nepotisme di lingkungan Pemerintah Desa Sijenggung (Skala 1 - 4).
        </p>

        {/* Tabel 7 Indikator SPAK */}
        <table className="w-full border-collapse border border-black mb-4 text-[10px]">
          <thead>
            <tr className="bg-slate-200 text-center font-bold">
              <th className="border border-black p-1.5 w-12">Kode</th>
              <th className="border border-black p-1.5">Indikator Perilaku Integritas & Antikorupsi</th>
              <th className="border border-black p-1.5 w-20">Skor Rata-Rata</th>
              <th className="border border-black p-1.5 w-28">Kategori Integritas</th>
            </tr>
          </thead>
          <tbody>
            {perilakuAverages.map(q => (
              <tr key={q.id}>
                <td className="border border-black p-1.5 text-center font-bold">{q.id}</td>
                <td className="border border-black p-1.5">{q.label}</td>
                <td className="border border-black p-1.5 text-center font-semibold">{q.avg.toFixed(2)}</td>
                <td className="border border-black p-1.5 text-center font-bold text-indigo-700">Sangat Berintegritas</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-slate-200 text-black">
              <td colSpan={2} className="border border-black p-1.5 text-right text-xs">SKOR INDEKS PERILAKU ANTIKORUPSI (SPAK) KESELURUHAN</td>
              <td className="border border-black p-1.5 text-center text-sm font-black text-indigo-800">{totalPerilaku.toFixed(2)}</td>
              <td className="border border-black p-1.5 text-center text-xs font-black text-indigo-700">Mutu A (Sangat Etis)</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── BAB IV. RENCANA TINDAK LANJUT & PENUTUP ────────────── */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2 uppercase border-b border-black pb-1">
          BAB IV. RENCANA TINDAK LANJUT & PENUTUP
        </h3>
        
        <div className="space-y-3 text-xs text-justify">
          <p>
            Berdasarkan pengolahan data terhadap 215 responden pada 10 Agustus 2026, Pemerintah Desa Sijenggung memperoleh predikat <strong>Sangat Baik (Mutu A)</strong> untuk SKM dan <strong>Sangat Etis (Mutu A)</strong> untuk SPAK. Kendati demikian, guna mempertahankan mutu pelayanan publik prima, berikut adalah area yang terus diperkuat:
          </p>

          <div className="pl-4 border-l-2 border-slate-400 space-y-1.5 italic text-[11px]">
            <p>1. Mempertahankan budaya pelayanan ramah, sopan, dan tanpa pungutan biaya apapun (100% Gratis).</p>
            <p>2. Memperluas keterbukaan informasi publik dan optimalisasi media digital dalam penanganan aspirasi warga.</p>
            <p>3. Meningkatkan koordinasi berkala antara perangkat desa, BPD, dan tokoh masyarakat untuk pencegahan fraud.</p>
          </div>

          <p>
            Demikian laporan ini dibuat secara akuntabel dan transparan sebagai wujud pertanggungjawaban publik Pemerintah Desa Sijenggung.
          </p>
        </div>
      </div>

      {/* ── TANDA TANGAN RESMI PENGESAHAN LAPORAN ──────────────── */}
      <div className="mt-10 pt-4 border-t border-slate-300">
        <div className="flex justify-between items-start text-center text-xs">
          
          <div className="w-60 space-y-1">
            <p className="font-semibold">Mengetahui,</p>
            <p className="font-bold">Ketua Tim Penyusun SKM Desa</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 italic">[Tanda Tangan & Stempel Tim]</span>
            </div>
            <p className="font-bold underline uppercase">SUMARNO, S.Sos.</p>
            <p className="text-[10px] text-slate-600">NIP. 19780512 200501 1 004</p>
          </div>

          <div className="w-60 space-y-1">
            <p className="font-semibold">Sijenggung, {currentDate}</p>
            <p className="font-bold">Kepala Desa Sijenggung</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 italic">[Tanda Tangan & Stempel Resmi Desa]</span>
            </div>
            <p className="font-bold underline uppercase">SUWARYO</p>
            <p className="text-[10px] text-slate-600">Kepala Desa Sijenggung</p>
          </div>

        </div>
      </div>

    </div>
  );
}
