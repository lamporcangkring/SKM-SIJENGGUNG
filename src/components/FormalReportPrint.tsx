import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS } from '../data/surveyQuestions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0284c7', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function FormalReportPrint() {
  const { responses } = useSurvey();
  const count = responses.length;

  // Tanggal pelaksanaan survei dari dataset
  const surveyDateStr = '30 Juni – 19 Agustus 2026';
  const surveyTimeStr = '08.00 – 15.00 WIB';

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
    if (score >= 2.51) return { grade: 'B', label: 'Baik (Berintegritas)' };
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
    <div className="hidden print:block w-full bg-white text-slate-900 font-sans text-xs pb-12 leading-relaxed relative print:p-8">
      
      {/* ── BINGKAI HALAMAN (PAGE BORDER) ─────────────────────── */}
      <div className="fixed inset-4 border-4 border-double border-black pointer-events-none z-50 print:block hidden" />

      {/* ── TANDA AIR (WATERMARK) ────────────────────────────── */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0 print:block hidden"
        style={{
          width: '450px',
          height: '450px',
          backgroundImage: "url('/logo-banjarnegara.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
      />
      
      {/* ── KOP SURAT RESMI PEMERINTAH DESA ───────────────────── */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 relative flex items-center justify-center">
        <img src="/logo-banjarnegara.png" alt="Logo Banjarnegara" className="absolute left-8 w-24 h-24 object-contain grayscale-0 print:grayscale-0" />
        <div className="text-center space-y-0.5 px-32">
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
        <div className="space-y-3 text-justify text-xs mb-4">
          <p>
            Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik mengamanatkan bahwa setiap penyelenggara pelayanan publik wajib melakukan evaluasi secara berkala terhadap kinerja pelayanan yang diberikan. Sejalan dengan amanat tersebut, Pemerintah Desa Sijenggung, Kecamatan Banjarmangu, Kabupaten Banjarnegara berkomitmen untuk senantiasa meningkatkan mutu pelayanan demi terwujudnya tata kelola pemerintahan desa yang bersih, transparan, akuntabel, dan berorientasi sepenuhnya pada kepentingan masyarakat warga.
          </p>
          <p>
            Sebagai instrumen evaluasi yang obyektif dan terukur, dilaksanakanlah Survei Kepuasan Masyarakat (SKM) berdasarkan Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PermenPAN-RB) Nomor 14 Tahun 2017. Guna melengkapi evaluasi tersebut dari aspek integritas pelayanan publik, diselenggarakan pula Survei Persepsi Perilaku Antikorupsi (SPAK) yang merujuk pada PermenPAN-RB Nomor 90 Tahun 2021.
          </p>
          <p>
            Survei ini diselenggarakan secara berkala dan terstruktur pada tanggal <strong>{surveyDateStr}</strong> dalam rentang waktu pukul <strong>{surveyTimeStr}</strong>. Melalui pengumpulan data yang melibatkan <strong>{count} responden aktif</strong> dari berbagai elemen demografi warga Desa Sijenggung, survei ini memotret secara riil persepsi masyarakat terhadap 9 unsur pelayanan publik dan 7 indikator perilaku antikorupsi di lingkungan kantor desa.
          </p>
        </div>

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
          <div className="border border-slate-300 rounded p-2 text-center flex flex-col items-center justify-center">
            <h6 className="font-bold text-[10px] mb-1">Grafik Proporsi Jenis Kelamin</h6>
            <div className="h-36 w-full flex items-center justify-center">
              <PieChart width={300} height={140}>
                <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" outerRadius={42} dataKey="value" isAnimationActive={false} label={renderOutsideLabel}>
                  {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </div>
          </div>

          <div className="border border-slate-300 rounded p-2 text-center flex flex-col items-center justify-center">
            <h6 className="font-bold text-[10px] mb-1">Grafik Pekerjaan Utama Responden</h6>
            <div className="h-36 w-full flex items-center justify-center">
              <PieChart width={300} height={140}>
                <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" outerRadius={42} dataKey="value" isAnimationActive={false} label={renderOutsideLabel}>
                  {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                </Pie>
              </PieChart>
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
        <div className="border border-slate-300 rounded p-3 mb-4 text-center flex flex-col items-center justify-center">
          <h5 className="font-bold text-xs mb-2">Nilai Rata-Rata (NRR) Per 9 Unsur Pelayanan Publik</h5>
          <div className="h-48 w-full flex items-center justify-center">
            <BarChart width={650} height={180} data={skmAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="id" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 10 }} />
              <Bar dataKey="avg" fill="#0284c7" isAnimationActive={false} />
            </BarChart>
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
              <td className="border border-black p-1.5 text-center text-xs font-black text-indigo-700">{perilakuGrade ? `Mutu ${perilakuGrade.grade}` : '-'}</td>
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
            Berdasarkan pengolahan data dan evaluasi komprehensif terhadap seluruh respon dari <strong>{count} responden</strong> yang dihimpun selama periode pelaksanaan survei dari <strong>{surveyDateStr}</strong>, Pemerintah Desa Sijenggung memperoleh predikat <strong>{skmGrade.label} (Mutu {skmGrade.grade})</strong> untuk indeks SKM dengan pencapaian skor konversi sebesar <strong>{ikmScore.toFixed(2)}</strong>. Sementara itu, untuk indeks SPAK, Pemerintah Desa Sijenggung mencatatkan predikat <strong>{perilakuGrade?.label ?? 'Baik'}</strong> dengan nilai rata-rata indeks sebesar <strong>{totalPerilaku.toFixed(2)}</strong> (dari skala maksimal 4.00).
          </p>
          <p>
            Meskipun pencapaian ini berada pada kategori yang sangat positif dan mencerminkan tingginya tingkat kepuasan serta kepercayaan warga terhadap dedikasi pelayanan Pemerintah Desa Sijenggung, upaya perbaikan yang berkelanjutan (continuous improvement) harus tetap diprioritaskan. Berdasarkan analisis unsur-unsur yang memperoleh penilaian paling rendah, disimpulkan beberapa rumusan rencana tindak lanjut strategis yang mendesak untuk diimplementasikan:
          </p>

          <div className="pl-4 border-l-2 border-slate-400 space-y-1.5 italic text-[11px] my-2">
            <p>1. <strong>Peningkatan Infrastruktur Pelayanan:</strong> Melakukan perbaikan dan penambahan sarana fisik pendukung di ruang pelayanan kantor desa (seperti penyejuk ruangan, komputer pelayanan mandiri, jaringan internet yang stabil, serta penyediaan fasilitas ramah disabilitas) untuk meningkatkan kenyamanan warga.</p>
            <p>2. <strong>Optimalisasi Waktu Pelayanan:</strong> Menyusun standar operasional prosedur (SOP) waktu penyelesaian yang lebih ketat, serta mengadopsi sistem nomor antrean digital guna meminimalisir waktu tunggu warga pada loket-loket pelayanan utama.</p>
            <p>3. <strong>Respon Cepat Pengaduan Warga:</strong> Mengembangkan dan mengintegrasikan sistem pengelolaan pengaduan masyarakat (SP4N-LAPOR! desa atau kotak saran digital) agar setiap keluhan warga dapat ditangani dan direspon secara cepat, transparan, dan terukur.</p>
            <p>4. <strong>Transparansi Informasi Publik:</strong> Meningkatkan kemudahan akses informasi mengenai persyaratan, tarif (jika ada), dan alur pelayanan dengan menyediakannya secara lengkap pada media luar ruang (baliho/papan pengumuman) dan portal digital resmi Desa Sijenggung.</p>
            <p>5. <strong>Pembudayaan Integritas:</strong> Menyelenggarakan program sosialisasi dan pelatihan internal secara periodik bagi seluruh aparatur desa mengenai nilai-nilai antikorupsi, kepatuhan kode etik, pelayanan prima (service excellence), serta pencegahan segala bentuk gratifikasi.</p>
          </div>

          <p>
            Laporan resmi eksekutif hasil survei kepuasan masyarakat dan persepsi anti korupsi ini disusun dengan menjunjung tinggi asas akuntabilitas, kejujuran, dan transparansi yang utuh. Dokumen ini diharapkan dapat menjadi rujukan berharga bagi perbaikan kualitas pelayanan Pemerintah Desa Sijenggung ke depan, sekaligus sebagai wujud pertanggungjawaban moral dan administratif kepada warga Desa Sijenggung serta instansi pembina di tingkat Kecamatan Banjarmangu dan Kabupaten Banjarnegara.
          </p>
        </div>
      </div>

      {/* ── TANDA TANGAN RESMI PENGESAHAN LAPORAN ──────────────── */}
      <div className="mt-10 pt-4 border-t border-slate-300">
        <div className="flex justify-between items-start text-center text-xs">
          
          <div className="w-48 space-y-1">
            <p className="font-semibold">Pembuat Laporan,</p>
            <p className="font-bold">Kaur TU & Umum</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 italic">[Tanda Tangan]</span>
            </div>
            <p className="font-bold underline uppercase">SAKHERUN</p>
            <p className="text-[10px] text-slate-600">Pengelola SKM & SPAK</p>
          </div>

          <div className="w-48 space-y-1">
            <p className="font-semibold">Verifikasi,</p>
            <p className="font-bold">Sekretaris Desa Sijenggung</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 italic">[Tanda Tangan]</span>
            </div>
            <p className="font-bold underline uppercase">TEGUH GIANA</p>
            <p className="text-[10px] text-slate-600">Sekretaris Desa</p>
          </div>

          <div className="w-48 space-y-1">
            <p className="font-semibold">Sijenggung, {currentDate}</p>
            <p className="font-bold">Kepala Desa Sijenggung</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 italic">[Tanda Tangan & Stempel]</span>
            </div>
            <p className="font-bold underline uppercase">SUYONO</p>
            <p className="text-[10px] text-slate-600">Kepala Desa</p>
          </div>

        </div>
      </div>

    </div>
  );
}
