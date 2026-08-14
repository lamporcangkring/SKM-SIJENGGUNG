import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Heart, Bookmark, Share2, ChevronDown, LayoutGrid, Search, BookOpen, Users, Building2, MessageSquare, ShieldCheck, Activity, Award, PieChart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '../context/SurveyContext';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS } from '../data/surveyQuestions';

interface DashboardHomeProps {
  onNavigate?: (tab: string) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { responses: allResponses } = useSurvey();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('Semua Jenis Layanan');
  const [selectedPeriod, setSelectedPeriod] = useState('2026');

  const services = ['Semua Jenis Layanan', 'Administrasi Umum', 'Kependudukan', 'Perizinan', 'Pertanahan', 'Kesejahteraan Sosial'];
  const periods = ['2030', '2029', '2028', '2027', '2026'];

  const responses = selectedService === 'Semua Jenis Layanan' 
    ? allResponses 
    : allResponses.filter(r => r.demografi.jenisLayanan === selectedService);

  const count = responses.length;

  // Calculate SKM
  const skmAverages = SKM_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0, nrrT: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.skm[q.id] || 0), 0);
    const avg = sum / count;
    const nrrT = avg * (1 / 9);
    return { ...q, avg, nrrT };
  });

  const totalNrrT = skmAverages.reduce((acc, curr) => acc + curr.nrrT, 0);
  const ikmScore = count > 0 ? totalNrrT * 25 : 0;

  // Calculate Perilaku
  const perilakuAverages = PERILAKU_QUESTIONS.map(q => {
    if (count === 0) return { ...q, avg: 0 };
    const sum = responses.reduce((acc, curr) => acc + (curr.perilaku[q.id] || 0), 0);
    const avg = sum / count;
    return { ...q, avg };
  });

  const totalPerilaku = count > 0 ? perilakuAverages.reduce((acc, curr) => acc + curr.avg, 0) / PERILAKU_QUESTIONS.length : 0;
  const perilakuScore = totalPerilaku * 25;
  
  const getGrade = (score: number) => {
    if (score === 0) return { grade: '-', label: 'Belum ada data' };
    if (score >= 88.31) return { grade: 'A', label: 'Sangat Baik' };
    if (score >= 76.61) return { grade: 'B', label: 'Baik' };
    if (score >= 65.00) return { grade: 'C', label: 'Kurang Baik' };
    return { grade: 'D', label: 'Tidak Baik' };
  };

  const getSkmGrade = (score: number) => getGrade(score);
  const skmGrade = getSkmGrade(ikmScore);

  const getPerilakuGrade = (score: number) => {
    if (score === 0) return { grade: '-', label: 'Belum ada data' };
    if (score >= 3.26) return { grade: 'A', label: 'Sangat Baik (Etis)' };
    if (score >= 2.51) return { grade: 'B', label: 'Baik' };
    if (score >= 1.76) return { grade: 'C', label: 'Kurang Baik' };
    return { grade: 'D', label: 'Tidak Baik' };
  };
  const perilakuGrade = getPerilakuGrade(totalPerilaku);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center w-full mt-2 gap-4 md:gap-0">
        <button className="w-full md:w-auto justify-center bg-[#162039]/80 backdrop-blur-md px-8 py-3.5 rounded-full font-bold text-blue-100 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center gap-2 text-sm hover:scale-105 hover:bg-[#1e294b] transition-all">
          <ArrowUpRight size={18} className="rotate-180 text-cyan-400" /> Portal Desa
        </button>
        
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <div className="bg-[#162039]/60 backdrop-blur-md px-6 py-2.5 rounded-2xl flex flex-col shadow-sm border border-blue-500/20 cursor-default">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin size={10} /> Lokasi
            </span>
            <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
              Sijenggung
            </span>
          </div>
          
          {/* Layanan Dropdown */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('layanan')}
              className="bg-[#162039]/60 backdrop-blur-md px-6 py-2.5 rounded-2xl flex flex-col shadow-sm border border-blue-500/20 cursor-pointer hover:bg-[#1e294b]/80 transition-colors h-full"
            >
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <LayoutGrid size={10} /> Layanan
              </span>
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                {selectedService} <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === 'layanan' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            
            <AnimatePresence>
              {activeDropdown === 'layanan' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-[#162039]/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="py-2">
                    {services.map(service => (
                      <div 
                        key={service}
                        onClick={() => { setSelectedService(service); setActiveDropdown(null); }}
                        className="px-4 py-2.5 hover:bg-blue-500/20 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <span className={`text-sm ${selectedService === service ? 'text-cyan-400 font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                          {service}
                        </span>
                        {selectedService === service && <Check size={14} className="text-cyan-400" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Periode Dropdown */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('periode')}
              className="bg-[#162039]/60 backdrop-blur-md px-6 py-2.5 rounded-2xl flex flex-col shadow-sm border border-blue-500/20 cursor-pointer hover:bg-[#1e294b]/80 transition-colors h-full"
            >
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Search size={10} /> Periode
              </span>
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                {selectedPeriod} <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === 'periode' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            
            <AnimatePresence>
              {activeDropdown === 'periode' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-[#162039]/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="py-2">
                    {periods.map(period => (
                      <div 
                        key={period}
                        onClick={() => { setSelectedPeriod(period); setActiveDropdown(null); }}
                        className="px-4 py-2.5 hover:bg-blue-500/20 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <span className={`text-sm ${selectedPeriod === period ? 'text-cyan-400 font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                          {period}
                        </span>
                        {selectedPeriod === period && <Check size={14} className="text-cyan-400" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={() => onNavigate && onNavigate('survey')}
          className="w-full md:w-auto justify-center bg-blue-600 px-8 py-3.5 rounded-full font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 text-sm hover:scale-105 hover:bg-blue-500 transition-all border border-blue-400"
        >
          Isi Survei <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Hero Text */}
      <div className="text-center mt-8 md:mt-12 mb-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[400px] h-[80px] md:h-[100px] bg-blue-500/20 blur-[60px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-xl tracking-tight leading-[1.1] mb-4 relative z-10">
          Infografis Capaian <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Kinerja Pelayanan</span>
        </h1>
        <p className="text-blue-200 text-sm md:text-lg max-w-2xl mx-auto font-medium drop-shadow-md relative z-10 px-4">
          Hasil Survei Kepuasan Masyarakat (SKM) dan Survei Perilaku Antikorupsi Pemerintah Desa Sijenggung.
        </p>
      </div>

      {/* Bottom Infographic Cards Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end mt-8 md:mt-4 pb-4 md:pb-0">
        
        {/* SKM Card */}
        <div className="bg-[#162039]/80 backdrop-blur-2xl border border-blue-500/30 rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative h-[260px] flex flex-col justify-between overflow-hidden group hover:border-cyan-400/50 transition-colors">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Award size={20} />
              <h2 className="text-lg font-bold tracking-wide uppercase">Indeks SKM</h2>
            </div>
            <p className="text-blue-200/90 text-xs leading-relaxed max-w-[90%]">
              Nilai Mutu Pelayanan Administrasi Umum
            </p>
          </div>
          
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{Math.floor(ikmScore)}<span className="text-4xl text-cyan-400">.{(ikmScore % 1).toFixed(2).substring(2)}</span></div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               Kategori {skmGrade.grade} ({skmGrade.label})
            </div>
          </div>
        </div>

        {/* Perilaku Card */}
        <div className="bg-[#162039]/80 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative h-[260px] flex flex-col justify-between overflow-hidden group hover:border-indigo-400/50 transition-colors">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <ShieldCheck size={20} />
              <h2 className="text-lg font-bold tracking-wide uppercase">Integritas</h2>
            </div>
            <p className="text-blue-200/90 text-xs leading-relaxed max-w-[90%]">
              Skor Persepsi Perilaku Antikorupsi Aparatur
            </p>
          </div>
          
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{Math.floor(totalPerilaku)}<span className="text-4xl text-indigo-400">.{(totalPerilaku % 1).toFixed(2).substring(2)}</span><span className="text-2xl text-slate-400 font-bold">/4</span></div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               Kategori {perilakuGrade.grade} ({perilakuGrade.label})
            </div>
          </div>
        </div>

        {/* Overview Glass Card */}
        <div className="bg-gradient-to-br from-[#1e294b]/90 to-[#0f172a]/90 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative h-[260px] flex flex-col justify-between overflow-hidden">
          
          <div className="absolute top-6 right-6 z-10">
            <button className="w-10 h-10 bg-[#0f172a] border border-slate-700 text-slate-300 rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:text-white transition-all">
              <ArrowUpRight size={18} />
            </button>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-slate-300">
              <PieChart size={20} />
              <h2 className="text-lg font-bold tracking-wide uppercase">Data Responden</h2>
            </div>
            <div className="flex items-center gap-1 mb-3 text-cyan-400/90 text-xs font-bold uppercase tracking-wider">
              <Users size={12} /> Total {count} Warga
            </div>
            <p className="text-blue-100 text-sm mb-0 leading-relaxed font-light">
              Distribusi responden didominasi oleh Petani dan Laki-laki. Survei dievaluasi terhadap 9 unsur pelayanan.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto relative z-10">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#1e294b] flex items-center justify-center shadow-sm z-30">
                <LayoutGrid size={14} className="text-cyan-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#1e294b] flex items-center justify-center shadow-sm z-20">
                <Search size={14} className="text-indigo-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-[#1e294b] flex items-center justify-center shadow-sm z-10">
                <span className="text-[10px] font-bold text-white">+7</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-600 flex items-center justify-center transition-colors text-slate-300 hover:text-white">
                <Heart size={14} />
              </button>
              <button className="w-9 h-9 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-600 flex items-center justify-center transition-colors text-slate-300 hover:text-white">
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
