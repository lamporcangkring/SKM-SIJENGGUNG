import React, { useState, useRef } from 'react';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS, Question } from '../data/surveyQuestions';
import { useSurvey } from '../context/SurveyContext';
import { useTheme } from '../context/ThemeContext';
import { 
  CheckCircle2, FileText, Send, AlertTriangle, X, Loader2, 
  ArrowRight, ArrowLeft, User, Award, ShieldCheck, HeartHandshake,
  Smile, Frown, Meh, Sparkles, Check
} from 'lucide-react';

type DemografiKey = 'jenisKelamin' | 'usia' | 'pendidikan' | 'pekerjaan' | 'jenisLayanan';

const DEMOGRAFI_FIELDS: { key: DemografiKey; label: string; options: { value: string; label: string }[]; span?: boolean }[] = [
  { key: 'jenisKelamin', label: 'Jenis Kelamin', options: [
    { value: '', label: 'Pilih Jenis Kelamin' },
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
  ]},
  { key: 'usia', label: 'Usia', options: [
    { value: '', label: 'Pilih Usia' },
    { value: '18-25', label: '18 - 25 Tahun' },
    { value: '26-35', label: '26 - 35 Tahun' },
    { value: '36-45', label: '36 - 45 Tahun' },
    { value: '46-55', label: '46 - 55 Tahun' },
    { value: '>55', label: '> 55 Tahun' },
  ]},
  { key: 'pendidikan', label: 'Pendidikan Terakhir', options: [
    { value: '', label: 'Pilih Pendidikan' },
    { value: 'SD', label: 'SD / Sederajat' },
    { value: 'SMP', label: 'SMP / Sederajat' },
    { value: 'SMA', label: 'SMA / Sederajat' },
    { value: 'D3/S1', label: 'D3 / S1' },
    { value: 'S2/S3', label: 'S2 / S3' },
  ]},
  { key: 'pekerjaan', label: 'Pekerjaan Utama', options: [
    { value: '', label: 'Pilih Pekerjaan' },
    { value: 'Petani', label: 'Petani / Pekebun' },
    { value: 'PNS', label: 'PNS / TNI / Polri' },
    { value: 'Wiraswasta', label: 'Wiraswasta / Pedagang' },
    { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
    { value: 'Pelajar/Mahasiswa', label: 'Pelajar / Mahasiswa' },
    { value: 'Lainnya', label: 'Lainnya' },
  ]},
  { key: 'jenisLayanan', label: 'Jenis Layanan yang Diakses', options: [
    { value: '', label: 'Pilih Jenis Layanan' },
    { value: 'Administrasi Umum', label: 'Administrasi Umum (SKTM, Surat Pengantar, dll)' },
    { value: 'Kependudukan', label: 'Kependudukan (KTP, KK, Akta Kelahiran, dll)' },
    { value: 'Perizinan', label: 'Perizinan (Keterangan Usaha, dll)' },
    { value: 'Pertanahan', label: 'Pertanahan (Keterangan Tanah, dll)' },
    { value: 'Kesejahteraan Sosial', label: 'Kesejahteraan Sosial (Bansos, dll)' },
  ], span: true },
];

const EMOJIS = [
  { val: 1, icon: '😠', labelColor: 'text-red-500', bgSelected: 'border-red-500 bg-red-500/15' },
  { val: 2, icon: '😐', labelColor: 'text-orange-500', bgSelected: 'border-orange-500 bg-orange-500/15' },
  { val: 3, icon: '😊', labelColor: 'text-blue-500', bgSelected: 'border-blue-500 bg-blue-500/15' },
  { val: 4, icon: '🤩', labelColor: 'text-emerald-500', bgSelected: 'border-emerald-500 bg-emerald-500/15' },
];

export function SurveyForm() {
  const { addResponse } = useSurvey();
  const { isDark } = useTheme();

  // Wizard step: 1 (Profil), 2 (SKM), 3 (SPAK), 4 (Kepuasan & Saran)
  const [currentStep, setCurrentStep] = useState(1);

  const [skmValues, setSkmValues] = useState<Record<string, number>>({});
  const [perilakuValues, setPerilakuValues] = useState<Record<string, number>>({});
  const [implementasiValues, setImplementasiValues] = useState<Record<string, number>>({});
  const [kepuasanValues, setKepuasanValues] = useState<Record<string, number>>({});
  const [demografi, setDemografi] = useState<Record<DemografiKey, string>>({
    jenisKelamin: '', usia: '', pendidikan: '', pekerjaan: '', jenisLayanan: ''
  });
  const [komentar, setKomentar] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const formTopRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDemografiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemografi(prev => ({ ...prev, [name]: value }));
    setStepError(null);
  };

  const handleOptionChange = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, id: string, val: number) => {
    setter(prev => ({ ...prev, [id]: val }));
    setStepError(null);
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      const unfilled = (Object.keys(demografi) as DemografiKey[]).filter(k => !demografi[k]);
      if (unfilled.length > 0) {
        setStepError(`Mohon lengkapi seluruh ${unfilled.length} data profil Anda sebelum melanjutkan.`);
        return false;
      }
    } else if (currentStep === 2) {
      const missing = SKM_QUESTIONS.filter(q => !(q.id in skmValues));
      if (missing.length > 0) {
        setStepError(`Ada ${missing.length} pertanyaan pelayanan SKM yang belum dijawab.`);
        return false;
      }
    } else if (currentStep === 3) {
      const missing = PERILAKU_QUESTIONS.filter(q => !(q.id in perilakuValues));
      if (missing.length > 0) {
        setStepError(`Ada ${missing.length} pertanyaan perilaku integritas yang belum dijawab.`);
        return false;
      }
    } else if (currentStep === 4) {
      const missingImp = IMPLEMENTASI_QUESTIONS.filter(q => !(q.id in implementasiValues));
      const missingKep = KEPUASAN_QUESTIONS.filter(q => !(q.id in kepuasanValues));
      const totalMissing = missingImp.length + missingKep.length;
      if (totalMissing > 0) {
        setStepError(`Ada ${totalMissing} pertanyaan yang belum Anda nilai.`);
        return false;
      }
    }
    setStepError(null);
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      scrollToTop();
    }
  };

  const prevStep = () => {
    setStepError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await addResponse({
        skm: skmValues,
        perilaku: perilakuValues,
        implementasi: implementasiValues,
        kepuasan: kepuasanValues,
        demografi: {
          jenisKelamin: demografi.jenisKelamin,
          usia: demografi.usia,
          pendidikan: demografi.pendidikan,
          pekerjaan: demografi.pekerjaan,
          jenisLayanan: demografi.jenisLayanan
        },
        komentar: komentar.trim() || undefined
      });

      setSubmitted(true);
      scrollToTop();
    } catch (err: any) {
      setStepError(err.message || 'Gagal menyimpan jawaban. Periksa koneksi internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSkmValues({});
    setPerilakuValues({});
    setImplementasiValues({});
    setKepuasanValues({});
    setDemografi({ jenisKelamin: '', usia: '', pendidikan: '', pekerjaan: '', jenisLayanan: '' });
    setKomentar('');
    setCurrentStep(1);
    setSubmitted(false);
    setStepError(null);
  };

  // ── Success View ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className={`p-8 sm:p-14 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl border transition-all ${
        isDark 
          ? 'bg-[#111936] border-emerald-500/30 text-white' 
          : 'bg-white border-emerald-200 text-slate-900'
      }`}>
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in">
          <CheckCircle2 size={50} />
        </div>
        <h2 className="text-3xl font-black mb-3">Terima Kasih Banyak!</h2>
        <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Penilaian dan masukan Anda telah <strong>berhasil tersimpan ke sistem database</strong>. Partisipasi Anda sangat berarti demi mewujudkan Desa Sijenggung yang lebih maju dan berintegritas.
        </p>
        <button
          onClick={resetForm}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          Isi Survei Baru Lagi
        </button>
      </div>
    );
  }

  const stepsInfo = [
    { num: 1, title: 'Profil Anda', icon: User },
    { num: 2, title: 'Kinerja Pelayanan (SKM)', icon: Award },
    { num: 3, title: 'Perilaku Antikorupsi', icon: ShieldCheck },
    { num: 4, title: 'Kepuasan & Saran', icon: HeartHandshake },
  ];

  return (
    <div ref={formTopRef} className="w-full space-y-6 sm:space-y-8">
      
      {/* ── Header Title & Step Indicator (Full Width) ──────── */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
        isDark 
          ? 'bg-[#111936]/90 border-blue-500/20 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Formulir Resmi
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Survei Kepuasan Masyarakat (SKM)
            </h1>
            <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pemerintah Desa Sijenggung — Tahun {new Date().getFullYear()}
            </p>
          </div>

          <div className={`text-right px-5 py-2.5 rounded-2xl border ${
            isDark ? 'bg-[#0d1425] border-slate-700/50' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tahapan Pengisian</div>
            <div className="text-xl font-black text-cyan-500">Langkah {currentStep} <span className="text-xs font-semibold text-slate-400">dari 4</span></div>
          </div>
        </div>

        {/* Wizard Progress Stepper */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500 rounded-full shadow-md"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Step Pill Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {stepsInfo.map(s => {
              const Icon = s.icon;
              const isCurrent = currentStep === s.num;
              const isDone = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md'
                      : isDone
                      ? (isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                      : (isDark ? 'bg-[#0a0f1c]/50 text-slate-500' : 'bg-slate-100 text-slate-400')
                  }`}
                >
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs ${
                    isCurrent ? 'bg-white text-blue-600 font-black' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'
                  }`}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <span className="truncate">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Error Banner ────────────────────────────────────── */}
      {stepError && (
        <div className="bg-red-500/10 border-2 border-red-500/40 text-red-500 dark:text-red-300 p-4 rounded-3xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-shake">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0" />
            <span>{stepError}</span>
          </div>
          <button onClick={() => setStepError(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── STEP CONTENT (Full Width & Spacious) ────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ── STEP 1: PROFIL RESPONDEN ──────────────────────── */}
        {currentStep === 1 && (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-all ${
            isDark ? 'bg-[#111936]/80 border-blue-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className="border-b pb-4 dark:border-slate-800 border-slate-200">
              <h2 className="text-xl font-black flex items-center gap-2.5">
                <User className="text-cyan-500" size={24} />
                Langkah 1: Data Profil Singkat
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Data ini murni untuk keperluan statistik agregat tanpa mencatat identitas nama/pribadi (100% Anonim).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMOGRAFI_FIELDS.map(f => (
                <div 
                  key={f.key} 
                  className={`p-5 rounded-2xl border transition-all ${f.span ? 'md:col-span-2' : ''} ${
                    isDark 
                      ? 'bg-[#0d1425]/70 border-slate-700/70 focus-within:border-cyan-400' 
                      : 'bg-slate-50/80 border-slate-200 focus-within:border-blue-500 shadow-inner'
                  }`}
                >
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                    {f.label} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name={f.key}
                    value={demografi[f.key]}
                    onChange={handleDemografiChange}
                    className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-cyan-400'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 shadow-sm'
                    }`}
                  >
                    {f.options.map(o => (
                      <option key={o.value} value={o.value} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: SKM (9 UNSUR PELAYANAN) ───────────────── */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
              isDark ? 'bg-[#111936]/80 border-blue-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <h2 className="text-xl font-black flex items-center gap-2.5">
                <Award className="text-blue-500" size={24} />
                Langkah 2: Kualitas Pelayanan (9 Unsur SKM)
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Berikan penilaian jujur Anda terhadap 9 pilar standar pelayanan kantor desa.
              </p>
            </div>

            <div className="space-y-4">
              {SKM_QUESTIONS.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`p-6 sm:p-7 rounded-3xl border shadow-md transition-all ${
                    isDark ? 'bg-[#111936]/70 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-5">
                    <span className="w-8 h-8 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/25 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="font-bold text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100">
                      {q.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {q.options.map(opt => {
                      const isSelected = skmValues[q.id] === opt.value;
                      const emojiData = EMOJIS.find(e => e.val === opt.value);
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => handleOptionChange(setSkmValues, q.id, opt.value)}
                          className={`p-4 rounded-2xl border-2 text-left sm:text-center transition-all flex sm:flex-col items-center justify-start sm:justify-center gap-3 cursor-pointer ${
                            isSelected
                              ? `${emojiData?.bgSelected} shadow-lg font-black ring-2 ring-blue-500/30 scale-[1.02]`
                              : isDark
                              ? 'bg-[#0d1425]/50 border-slate-800 hover:border-slate-600 text-slate-300'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700 shadow-sm'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl">{emojiData?.icon}</span>
                          <span className="text-xs font-bold leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: SPAK (7 PERILAKU ANTIKORUPSI) ─────────── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
              isDark ? 'bg-[#111936]/80 border-indigo-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <h2 className="text-xl font-black flex items-center gap-2.5">
                <ShieldCheck className="text-indigo-500" size={24} />
                Langkah 3: Persepsi Perilaku Antikorupsi (SPAK)
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Bagaimana penilaian Anda terhadap situasi integritas dan pencegahan korupsi/pungutan di lingkungan desa?
              </p>
            </div>

            <div className="space-y-4">
              {PERILAKU_QUESTIONS.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`p-6 sm:p-7 rounded-3xl border shadow-md transition-all ${
                    isDark ? 'bg-[#111936]/70 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-5">
                    <span className="w-8 h-8 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="font-bold text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100">
                      {q.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {q.options.map(opt => {
                      const isSelected = perilakuValues[q.id] === opt.value;
                      const emojiData = EMOJIS.find(e => e.val === opt.value);
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => handleOptionChange(setPerilakuValues, q.id, opt.value)}
                          className={`p-4 rounded-2xl border-2 text-left sm:text-center transition-all flex sm:flex-col items-center justify-start sm:justify-center gap-3 cursor-pointer ${
                            isSelected
                              ? `${emojiData?.bgSelected} shadow-lg font-black ring-2 ring-indigo-500/30 scale-[1.02]`
                              : isDark
                              ? 'bg-[#0d1425]/50 border-slate-800 hover:border-slate-600 text-slate-300'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700 shadow-sm'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl">{emojiData?.icon}</span>
                          <span className="text-xs font-bold leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: IMPLEMENTASI, KEPUASAN & SARAN ────────── */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
              isDark ? 'bg-[#111936]/80 border-emerald-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <h2 className="text-xl font-black flex items-center gap-2.5">
                <HeartHandshake className="text-emerald-500" size={24} />
                Langkah 4: Tingkat Kepuasan & Saran Warga
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Penilaian kepuasan menyeluruh dan aspirasi kritik/saran Anda untuk Pemerintah Desa Sijenggung.
              </p>
            </div>

            {/* KEPUASAN QUESTION (Highlight Card) */}
            {KEPUASAN_QUESTIONS.map(q => (
              <div 
                key={q.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl transition-all ${
                  isDark ? 'bg-[#111936]/90 border-amber-500/40' : 'bg-amber-50/60 border-amber-300'
                }`}
              >
                <div className="text-base sm:text-lg font-black mb-5 text-center text-slate-900 dark:text-white">
                  ⭐ {q.label}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {q.options.map(opt => {
                    const isSelected = kepuasanValues[q.id] === opt.value;
                    const emojiData = EMOJIS.find(e => e.val === opt.value);
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => handleOptionChange(setKepuasanValues, q.id, opt.value)}
                        className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black scale-105'
                            : isDark
                            ? 'bg-[#0d1425]/70 border-slate-800 hover:border-slate-600 text-slate-300'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700 shadow-sm'
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl">{emojiData?.icon}</span>
                        <span className="text-xs sm:text-sm font-extrabold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* IMPLEMENTASI QUESTIONS */}
            <div className="space-y-4">
              {IMPLEMENTASI_QUESTIONS.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`p-6 rounded-3xl border shadow-md transition-all ${
                    isDark ? 'bg-[#111936]/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="font-bold text-sm leading-relaxed text-slate-900 dark:text-slate-100">
                      {q.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {q.options.map(opt => {
                      const isSelected = implementasiValues[q.id] === opt.value;
                      const emojiData = EMOJIS.find(e => e.val === opt.value);
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => handleOptionChange(setImplementasiValues, q.id, opt.value)}
                          className={`p-3 rounded-2xl border-2 text-left sm:text-center transition-all flex sm:flex-col items-center justify-start sm:justify-center gap-2 cursor-pointer ${
                            isSelected
                              ? `${emojiData?.bgSelected} font-black shadow-md ring-2 ring-emerald-500/30`
                              : isDark
                              ? 'bg-[#0d1425]/50 border-slate-800 hover:border-slate-600 text-slate-300'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-700'
                          }`}
                        >
                          <span className="text-xl">{emojiData?.icon}</span>
                          <span className="text-xs font-bold">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* SARAN & MASUKAN TEXTAREA */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
              isDark ? 'bg-[#111936]/80 border-purple-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-purple-500">
                💬 Saran, Kritik, atau Aspirasi Warga (Opsional)
              </label>
              <textarea
                value={komentar}
                onChange={e => setKomentar(e.target.value)}
                placeholder="Tuliskan saran perbaikan pelayanan atau apresiasi Anda untuk Pemerintah Desa Sijenggung..."
                className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none transition-all min-h-[120px] ${
                  isDark
                    ? 'bg-[#0a0f1c] border-slate-700 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                }`}
              />
            </div>

          </div>
        )}

        {/* ── STEP NAVIGATION BUTTONS (Full Width Action Bar) ── */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 shadow-sm"
            >
              <ArrowLeft size={16} /> Sebelumnya
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 sm:px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Langkah {currentStep + 1}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105 flex items-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Menyimpan Jawaban...</span>
                </>
              ) : (
                <>
                  <span>Kirim Seluruh Jawaban Survei</span>
                  <Send size={18} />
                </>
              )}
            </button>
          )}
        </div>

      </form>

    </div>
  );
}
