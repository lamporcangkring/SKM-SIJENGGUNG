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
    <div className="hidden print:block w-full bg-white text-slate-900 font-sans text-xs pb-12 leading-relaxed">
      
        </div>
      </div>

    </div>
  );
}
