import React, { useMemo } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS } from '../data/surveyQuestions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function FormalReportPrint() {
  const { responses } = useSurvey();
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
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik' };
    return { grade: 'D', label: 'Tidak Baik' };
  };
  const skmGrade = count > 0 ? getSkmGrade(ikmScore) : { grade: '-', label: 'Belum ada data' };

  // Calculate Perilaku
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });
  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;

  const getPerilakuGrade = (score: number) => {
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik (Etis)' };
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

    responses.forEach(r => {
      const d = r.demografi;
      if (d) {
        jenisKelamin[d.jenisKelamin] = (jenisKelamin[d.jenisKelamin] || 0) + 1;
        usia[d.usia] = (usia[d.usia] || 0) + 1;
        pendidikan[d.pendidikan] = (pendidikan[d.pendidikan] || 0) + 1;
        pekerjaan[d.pekerjaan] = (pekerjaan[d.pekerjaan] || 0) + 1;
      }
    });

    const formatData = (obj: Record<string, number>) => 
      Object.entries(obj).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return {
      jenisKelamin: formatData(jenisKelamin),
      usia: formatData(usia).sort((a, b) => a.name.localeCompare(b.name)),
      pendidikan: formatData(pendidikan),
      pekerjaan: formatData(pekerjaan),
    };
  }, [responses]);

  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const renderOutsideLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
        {name}
      </text>
    );
  };

  return (
    <div className="hidden print:block w-full bg-white text-black font-sans text-sm pb-10">
      {/* KOP SURAT */}
      <div className="text-center border-b-4 border-black pb-4 mb-6">
        <h2 className="text-xl font-bold uppercase mb-1">Pemerintah Kabupaten Banjarnegara</h2>
        <h2 className="text-xl font-bold uppercase mb-1">Kecamatan Banjarmangu</h2>
        <h1 className="text-2xl font-black uppercase mb-2">Desa Sijenggung</h1>
        <p className="text-xs">Jl. Raya Sijenggung No. 1, Kec. Banjarmangu, Kab. Banjarnegara, Jawa Tengah</p>
      </div>

      {/* JUDUL LAPORAN */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold uppercase underline mb-1">
          Laporan Hasil Survei Kepuasan Masyarakat (SKM) &<br/>
          Indeks Perilaku Antikorupsi (SPAK)
        </h3>
        <p className="font-semibold">Tahun {new Date().getFullYear()}</p>
      </div>

      {/* BAB I */}
      <div className="mb-6">
        <h4 className="font-bold text-base mb-2">BAB I. PENDAHULUAN & DATA DEMOGRAFI</h4>
        <p className="mb-2 text-justify">
          Laporan ini menyajikan hasil pengukuran Survei Kepuasan Masyarakat (SKM) dan Survei Persepsi Perilaku Antikorupsi (SPAK) di lingkungan Pemerintah Desa Sijenggung. Pengukuran ini bertujuan untuk mengevaluasi kinerja pelayanan publik serta integritas aparatur desa. Total Responden yang berpartisipasi adalah sebanyak <strong>{count} Orang</strong>.
        </p>
        
        {/* Grafik Demografi */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="border border-gray-300 rounded p-2">
            <h5 className="text-center font-bold text-xs mb-2">Proporsi Jenis Kelamin</h5>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.jenisKelamin} cx="50%" cy="50%" outerRadius={50} dataKey="value" isAnimationActive={false} label={renderOutsideLabel} labelLine={true}>
                    {demografiData.jenisKelamin.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-2">
            <h5 className="text-center font-bold text-xs mb-2">Pekerjaan Utama</h5>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demografiData.pekerjaan} cx="50%" cy="50%" outerRadius={50} dataKey="value" isAnimationActive={false} label={renderOutsideLabel} labelLine={true}>
                    {demografiData.pekerjaan.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-2">
            <h5 className="text-center font-bold text-xs mb-2">Distribusi Usia (Tahun)</h5>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demografiData.usia} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Bar dataKey="value" fill="#10b981" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-2">
            <h5 className="text-center font-bold text-xs mb-2">Tingkat Pendidikan</h5>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demografiData.pendidikan} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={60} />
                  <Bar dataKey="value" fill="#8b5cf6" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* BAB II */}
      <div className="mb-6" style={{ pageBreakBefore: 'always' }}>
        <h4 className="font-bold text-base mb-2">BAB II. HASIL PENGUKURAN KINERJA PELAYANAN (SKM)</h4>
        
        {/* Grafik SKM */}
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h5 className="text-center font-bold text-sm mb-4">Grafik Nilai Rata-Rata Per Unsur SKM</h5>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skmAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                <Bar dataKey="avg" fill="#0ea5e9" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2 w-10 text-center">Unsur</th>
              <th className="border border-black p-2">Indikator Pelayanan</th>
              <th className="border border-black p-2 w-20 text-center">NRR</th>
              <th className="border border-black p-2 w-20 text-center">NRR Tertimbang</th>
            </tr>
          </thead>
          <tbody>
            {skmAverages.map(q => (
              <tr key={q.id}>
                <td className="border border-black p-2 text-center font-bold">{q.id}</td>
                <td className="border border-black p-2">{q.label}</td>
                <td className="border border-black p-2 text-center">{q.avg.toFixed(2)}</td>
                <td className="border border-black p-2 text-center">{q.nrrT.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-100">
              <td colSpan={3} className="border border-black p-2 text-right">Total Indeks Kepuasan Masyarakat (IKM)</td>
              <td className="border border-black p-2 text-center text-sm">{ikmScore.toFixed(2)}</td>
            </tr>
            <tr className="font-bold bg-gray-100">
              <td colSpan={3} className="border border-black p-2 text-right">Mutu Pelayanan</td>
              <td className="border border-black p-2 text-center text-sm">{skmGrade.grade} ({skmGrade.label})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* BAB III */}
      <div className="mb-6" style={{ pageBreakBefore: 'always' }}>
        <h4 className="font-bold text-base mb-2">BAB III. HASIL PENGUKURAN PERILAKU ANTIKORUPSI (SPAK)</h4>
        
        {/* Grafik Perilaku */}
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h5 className="text-center font-bold text-sm mb-4">Grafik Skor Persepsi Perilaku Antikorupsi</h5>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perilakuAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                <Bar dataKey="avg" fill="#8b5cf6" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2 w-10 text-center">Kode</th>
              <th className="border border-black p-2">Indikator Situasi Perilaku</th>
              <th className="border border-black p-2 w-24 text-center">Skor Rata-Rata</th>
            </tr>
          </thead>
          <tbody>
            {perilakuAverages.map(q => (
              <tr key={q.id}>
                <td className="border border-black p-2 text-center font-bold">{q.id}</td>
                <td className="border border-black p-2">{q.label}</td>
                <td className="border border-black p-2 text-center">{q.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-100">
              <td colSpan={2} className="border border-black p-2 text-right">Skor Integritas Keseluruhan (Skala 4)</td>
              <td className="border border-black p-2 text-center text-sm">{totalPerilaku.toFixed(2)}</td>
            </tr>
            <tr className="font-bold bg-gray-100">
              <td colSpan={2} className="border border-black p-2 text-right">Kategori Integritas</td>
              <td className="border border-black p-2 text-center text-sm">{perilakuGrade.grade} ({perilakuGrade.label})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* BAB IV */}
      <div className="mb-6">
        <h4 className="font-bold text-base mb-2">BAB IV. ANALISIS DAN RENCANA TINDAK LANJUT</h4>
        <p className="mb-2 text-justify">
          Berdasarkan hasil analisis data survei, telah diidentifikasi beberapa area prioritas yang memerlukan perbaikan segera guna meningkatkan kualitas pelayanan publik dan integritas aparatur:
        </p>
        
        <h5 className="font-bold mt-4 mb-2 text-sm">A. Area Prioritas Perbaikan Pelayanan (SKM)</h5>
        {count > 0 && lowestSkmList.length > 0 ? (
          <ol className="list-decimal pl-5 space-y-2 text-justify text-sm">
            {lowestSkmList.map((item) => (
              <li key={item.id}>
                <strong>{item.label} (Skor: {item.avg.toFixed(2)})</strong><br/>
                <em>Rekomendasi Tindak Lanjut:</em> Diperlukan evaluasi proses pelayanan pada aspek ini, penyederhanaan birokrasi, serta peningkatan kompetensi SDM petugas pelaksana agar standar operasional prosedur berjalan optimal.
              </li>
            ))}
          </ol>
        ) : (
          <p>Belum ada data prioritas SKM.</p>
        )}

        <h5 className="font-bold mt-4 mb-2 text-sm">B. Area Prioritas Penguatan Integritas (SPAK)</h5>
        {count > 0 && lowestPerilakuList.length > 0 ? (
          <ol className="list-decimal pl-5 space-y-2 text-justify text-sm">
            {lowestPerilakuList.map((item) => (
              <li key={item.id}>
                <strong>{item.label} (Skor: {item.avg.toFixed(2)})</strong><br/>
                <em>Rekomendasi Tindak Lanjut:</em> Perlu sosialisasi nilai-nilai integritas yang lebih intensif, penguatan sistem pengawasan internal, dan penerapan SOP yang ketat serta transparan dalam pengawasan tindakan aparatur.
              </li>
            ))}
          </ol>
        ) : (
          <p>Belum ada data prioritas Integritas.</p>
        )}
      </div>

      {/* BAB V */}
      <div className="mb-8">
        <h4 className="font-bold text-base mb-2">BAB V. PENUTUP</h4>
        <p className="text-justify text-sm">
          Pemerintah Desa Sijenggung berkomitmen penuh untuk merealisasikan rencana tindak lanjut yang telah disusun. Partisipasi dan pengawasan aktif dari seluruh elemen masyarakat sangat diharapkan untuk mewujudkan Desa Sijenggung yang melayani dengan prima dan bebas dari praktik korupsi, kolusi, serta nepotisme.
        </p>
      </div>

      {/* Tanda Tangan */}
      <div className="mt-8 flex justify-end text-center">
        <div className="w-64">
          <p className="mb-1">Sijenggung, {currentDate}</p>
          <p className="mb-16">Kepala Desa Sijenggung,</p>
          <p className="font-bold underline uppercase">( .............................................. )</p>
        </div>
      </div>
    </div>
  );
}
