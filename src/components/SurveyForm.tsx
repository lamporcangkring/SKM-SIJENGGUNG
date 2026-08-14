import React, { useState, useRef, useEffect } from 'react';
import { SKM_QUESTIONS, PERILAKU_QUESTIONS, IMPLEMENTASI_QUESTIONS, KEPUASAN_QUESTIONS, Question } from '../data/surveyQuestions';
import { useSurvey } from '../context/SurveyContext';
import { CheckCircle2, FileText, Send, AlertTriangle, X } from 'lucide-react';

type DemografiKey = 'jenisKelamin' | 'usia' | 'pendidikan' | 'pekerjaan' | 'jenisLayanan';

export function SurveyForm() {
  const { addResponse } = useSurvey();
  const [skmValues, setSkmValues] = useState<Record<string, number>>({});
  const [perilakuValues, setPerilakuValues] = useState<Record<string, number>>({});
  const [implementasiValues, setImplementasiValues] = useState<Record<string, number>>({});
  const [kepuasanValues, setKepuasanValues] = useState<Record<string, number>>({});
  const [demografi, setDemografi] = useState<Record<DemografiKey, string>>({
    jenisKelamin: '',
    usia: '',
    pendidikan: '',
    pekerjaan: '',
    jenisLayanan: ''
  });
  const [komentar, setKomentar] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emptySkm, setEmptySkm] = useState<Set<string>>(new Set());
  const [emptyPerilaku, setEmptyPerilaku] = useState<Set<string>>(new Set());
  const [emptyImplementasi, setEmptyImplementasi] = useState<Set<string>>(new Set());
  const [emptyKepuasan, setEmptyKepuasan] = useState<Set<string>>(new Set());
  const [emptyDemografi, setEmptyDemografi] = useState<Set<DemografiKey>>(new Set());

  const firstEmptyRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const demografiRefs = useRef<Record<DemografiKey, HTMLElement | null>>({
    jenisKelamin: null, usia: null, pendidikan: null, pekerjaan: null, jenisLayanan: null
  });

  useEffect(() => {
    if (firstEmptyRef.current) {
      firstEmptyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstEmptyRef.current = null;
    }
  }, [emptySkm, emptyPerilaku, emptyImplementasi, emptyKepuasan, emptyDemografi, error]);

  const handleValueChange = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, id: string, value: number, resetEmpty: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setter(prev => ({ ...prev, [id]: value }));
    resetEmpty(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setError(null);
  };

  const handleDemografiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemografi(prev => ({ ...prev, [name]: value }));
    setEmptyDemografi(prev => {
      const next = new Set(prev);
      next.delete(name as DemografiKey);
      return next;
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missingSkm = new Set(SKM_QUESTIONS.filter(q => !(q.id in skmValues)).map(q => q.id));
    const missingPerilaku = new Set(PERILAKU_QUESTIONS.filter(q => !(q.id in perilakuValues)).map(q => q.id));
    const missingImplementasi = new Set(IMPLEMENTASI_QUESTIONS.filter(q => !(q.id in implementasiValues)).map(q => q.id));
    const missingKepuasan = new Set(KEPUASAN_QUESTIONS.filter(q => !(q.id in kepuasanValues)).map(q => q.id));
    const missingDemografi = new Set<DemografiKey>();
    (Object.keys(demografi) as DemografiKey[]).forEach(k => {
      if (!demografi[k]) missingDemografi.add(k);
    });

    setEmptySkm(missingSkm);
    setEmptyPerilaku(missingPerilaku);
    setEmptyImplementasi(missingImplementasi);
    setEmptyKepuasan(missingKepuasan);
    setEmptyDemografi(missingDemografi);

    let first: HTMLElement | null = null;
    for (const k of (['jenisKelamin', 'usia', 'pendidikan', 'pekerjaan', 'jenisLayanan'] as DemografiKey[])) {
      if (missingDemografi.has(k) && demografiRefs.current[k]) {
        first = first ?? demografiRefs.current[k];
        break;
      }
    }
    for (const q of SKM_QUESTIONS) {
      if (missingSkm.has(q.id) && sectionRefs.current[q.id]) { first = first ?? sectionRefs.current[q.id]; break; }
    }
    for (const q of PERILAKU_QUESTIONS) {
      if (missingPerilaku.has(q.id) && sectionRefs.current[q.id]) { first = first ?? sectionRefs.current[q.id]; break; }
    }
    for (const q of IMPLEMENTASI_QUESTIONS) {
      if (missingImplementasi.has(q.id) && sectionRefs.current[q.id]) { first = first ?? sectionRefs.current[q.id]; break; }
    }
    for (const q of KEPUASAN_QUESTIONS) {
      if (missingKepuasan.has(q.id) && sectionRefs.current[q.id]) { first = first ?? sectionRefs.current[q.id]; break; }
    }
    firstEmptyRef.current = first;

    const totalMissing =
      missingSkm.size + missingPerilaku.size + missingImplementasi.size +
      missingKepuasan.size + missingDemografi.size;

    if (totalMissing > 0) {
      setError(`⚠️ Ada ${totalMissing} pertanyaan/data yang belum diisi. Silakan lengkapi field yang ditandai merah di bawah.`);
      return;
    }

    addResponse({
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
      komentar
    });
    setSubmitted(true);

    setTimeout(() => {
      setSkmValues({});
      setPerilakuValues({});
      setImplementasiValues({});
      setKepuasanValues({});
      setDemografi({ jenisKelamin: '', usia: '', pendidikan: '', pekerjaan: '', jenisLayanan: '' });
      setKomentar('');
      setSubmitted(false);
      setError(null);
      setEmptySkm(new Set());
      setEmptyPerilaku(new Set());
      setEmptyImplementasi(new Set());
      setEmptyKepuasan(new Set());
      setEmptyDemografi(new Set());
    }, 3000);
  };

  const clearGlobalError = () => setError(null);

  const renderRadioGroup = (
    id: string,
    value: number | undefined,
    onChange: (id: string, val: number) => void,
    options: Question['options'],
    isEmpty: boolean
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-2 mt-3 w-full">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex-1 flex items-center justify-start lg:justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-left lg:text-center ${
            value === opt.value
              ? 'border-blue-500 bg-blue-500/20 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              : isEmpty
              ? 'border-red-500/60 bg-red-950/20 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:border-red-400'
              : 'border-slate-700 bg-[#0f172a]/50 hover:border-blue-400/50 hover:bg-[#1e294b] text-slate-300'
          }`}
        >
          <input type="radio" name={id} value={opt.value} checked={value === opt.value} onChange={() => onChange(id, opt.value)} className="hidden" />
          <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
            value === opt.value ? 'border-blue-400' : isEmpty ? 'border-red-400' : 'border-slate-500'
          }`}>
            {value === opt.value && <div className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
          </div>
          <span className="font-semibold text-xs leading-tight">{opt.label}</span>
        </label>
      ))}
    </div>
  );

  const CardWrapper: React.FC<{
    children: React.ReactNode;
    emptySet: Set<string>;
    id: string;
    baseBorder: string;
  }> = ({ children, emptySet, id, baseBorder }) => {
    const isEmpty = emptySet.has(id);
    return (
      <div
        ref={(el) => (sectionRefs.current[id] = el)}
        className={`bg-[#1e294b]/60 backdrop-blur-sm p-6 rounded-2xl border-2 shadow-sm transition-all duration-300 ${
          isEmpty
            ? `border-red-500 bg-red-950/15 shadow-[0_0_25px_rgba(239,68,68,0.15)] animate-pulse-once ring-2 ring-red-500/40 ring-offset-2 ring-offset-[#0d1425]`
            : baseBorder
        }`}
      >
        {children}
      </div>
    );
  };

  const QuestionHeader: React.FC<{
    index: number;
    color: string;
    label: string;
    isEmpty: boolean;
  }> = ({ index, color, label, isEmpty }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
      <div className="font-bold text-slate-200">
        <span className={`${color} mr-2`}>{index}.</span> {label}
      </div>
      {isEmpty && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase tracking-wide shrink-0 self-start">
          <AlertTriangle size={12} /> Belum Terisi
        </div>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Terima Kasih!</h2>
        <p className="text-blue-200/80 font-medium max-w-md">Tanggapan Anda telah berhasil disimpan dan sangat berarti bagi peningkatan layanan Pemerintah Desa Sijenggung.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3 flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-cyan-400 border border-blue-500/30 rounded-lg">
            <FileText size={24} />
          </div>
          Formulir Survei
        </h1>
        <p className="text-blue-200/80 font-medium text-lg leading-relaxed">
          Mohon kesediaan Anda memberikan penilaian terhadap kinerja pelayanan publik dan perilaku aparatur Desa Sijenggung.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {error && (
          <div className="bg-red-950/60 border-2 border-red-500/60 text-red-300 p-4 rounded-2xl text-sm font-semibold shadow-[0_0_25px_rgba(239,68,68,0.15)] sticky top-3 z-30 backdrop-blur-xl flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button type="button" onClick={clearGlobalError} className="text-red-400 hover:text-red-300 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Demografi Section */}
        <section>
          <div className="border-b border-cyan-500/20 pb-4 mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Data Responden</h2>
              <p className="text-cyan-200/60 mt-1">Data ini digunakan untuk keperluan statistik dan tidak akan dipublikasikan.</p>
            </div>
            {emptyDemografi.size > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wide shrink-0">
                <AlertTriangle size={12} /> {emptyDemografi.size} Data Belum Lengkap
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              { key: 'jenisKelamin' as DemografiKey, label: 'Jenis Kelamin', options: [
                { value: '', label: 'Pilih Jenis Kelamin' },
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' },
              ]},
              { key: 'usia' as DemografiKey, label: 'Usia', options: [
                { value: '', label: 'Pilih Usia' },
                { value: '18-25', label: '18 - 25 Tahun' },
                { value: '26-35', label: '26 - 35 Tahun' },
                { value: '36-45', label: '36 - 45 Tahun' },
                { value: '46-55', label: '46 - 55 Tahun' },
                { value: '>55', label: '> 55 Tahun' },
              ]},
              { key: 'pendidikan' as DemografiKey, label: 'Pendidikan Terakhir', options: [
                { value: '', label: 'Pilih Pendidikan' },
                { value: 'SD', label: 'SD/Sederajat' },
                { value: 'SMP', label: 'SMP/Sederajat' },
                { value: 'SMA', label: 'SMA/Sederajat' },
                { value: 'D3/S1', label: 'D3/S1' },
                { value: 'S2/S3', label: 'S2/S3' },
              ]},
              { key: 'pekerjaan' as DemografiKey, label: 'Pekerjaan Utama', options: [
                { value: '', label: 'Pilih Pekerjaan' },
                { value: 'Petani', label: 'Petani/Pekebun' },
                { value: 'PNS', label: 'PNS/TNI/Polri' },
                { value: 'Wiraswasta', label: 'Wiraswasta/Pedagang' },
                { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
                { value: 'Pelajar/Mahasiswa', label: 'Pelajar/Mahasiswa' },
                { value: 'Lainnya', label: 'Lainnya' },
              ]},
              { key: 'jenisLayanan' as DemografiKey, label: 'Jenis Layanan yang Diakses', options: [
                { value: '', label: 'Pilih Jenis Layanan' },
                { value: 'Administrasi Umum', label: 'Administrasi Umum (SKTM, Surat Pengantar, dll)' },
                { value: 'Kependudukan', label: 'Kependudukan (KTP, KK, Akta Kelahiran, dll)' },
                { value: 'Perizinan', label: 'Perizinan (Keterangan Usaha, dll)' },
                { value: 'Pertanahan', label: 'Pertanahan (Keterangan Tanah, dll)' },
                { value: 'Kesejahteraan Sosial', label: 'Kesejahteraan Sosial (Bansos, dll)' },
              ], span: true },
            ] as { key: DemografiKey; label: string; options: { value: string; label: string }[]; span?: boolean }[]).map((f) => {
              const missing = emptyDemografi.has(f.key);
              return (
                <div
                  key={f.key}
                  ref={(el) => (demografiRefs.current[f.key] = el)}
                  className={`backdrop-blur-sm p-4 rounded-2xl border-2 shadow-sm transition-all duration-300 ${f.span ? 'md:col-span-2' : ''} ${
                    missing
                      ? 'bg-red-950/10 border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.15)] ring-2 ring-red-500/30 ring-offset-2 ring-offset-[#0d1425]'
                      : 'bg-[#1e294b]/60 border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <label className={`block text-sm font-bold ${missing ? 'text-red-300' : 'text-slate-300'}`}>
                      {f.label}
                    </label>
                    {missing && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-bold uppercase tracking-wide">
                        <AlertTriangle size={10} /> Wajib
                      </div>
                    )}
                  </div>
                  <select
                    name={f.key}
                    value={demografi[f.key]}
                    onChange={handleDemografiChange}
                    className={`w-full border-2 text-white rounded-xl p-3 focus:outline-none transition-all ${
                      missing
                        ? 'bg-red-950/20 border-red-500/60 focus:border-red-400 text-red-100 placeholder-red-300/60'
                        : 'bg-[#0f172a]/50 border-slate-600 focus:border-cyan-400'
                    }`}
                  >
                    {f.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </section>

        {/* SKM Section */}
        <section>
          <div className="border-b border-blue-500/20 pb-4 mb-6 mt-12 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">A. Kualitas Pelayanan (SKM)</h2>
              <p className="text-blue-200/60 mt-1">Pendapat responden tentang pelayanan pemerintah desa.</p>
            </div>
            {emptySkm.size > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wide shrink-0">
                <AlertTriangle size={12} /> {emptySkm.size} Pertanyaan Belum Terjawab
              </div>
            )}
          </div>
          <div className="space-y-8">
            {SKM_QUESTIONS.map((q, idx) => (
              <CardWrapper key={q.id} emptySet={emptySkm} id={q.id} baseBorder="border-blue-500/20">
                <QuestionHeader index={idx + 1} color="text-cyan-400" label={q.label} isEmpty={emptySkm.has(q.id)} />
                {renderRadioGroup(q.id, skmValues[q.id], (id, val) => handleValueChange(setSkmValues, id, val, setEmptySkm), q.options, emptySkm.has(q.id))}
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Perilaku Section */}
        <section>
          <div className="border-b border-indigo-500/20 pb-4 mb-6 mt-12 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">B. Survei Perilaku Antikorupsi</h2>
              <p className="text-indigo-200/60 mt-1">Pendapat responden tentang perilaku antikorupsi di desa Sijenggung.</p>
            </div>
            {emptyPerilaku.size > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wide shrink-0">
                <AlertTriangle size={12} /> {emptyPerilaku.size} Pertanyaan Belum Terjawab
              </div>
            )}
          </div>
          <div className="space-y-8">
            {PERILAKU_QUESTIONS.map((q, idx) => (
              <CardWrapper key={q.id} emptySet={emptyPerilaku} id={q.id} baseBorder="border-indigo-500/20">
                <QuestionHeader index={idx + 1} color="text-indigo-400" label={q.label} isEmpty={emptyPerilaku.has(q.id)} />
                {renderRadioGroup(q.id, perilakuValues[q.id], (id, val) => handleValueChange(setPerilakuValues, id, val, setEmptyPerilaku), q.options, emptyPerilaku.has(q.id))}
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Implementasi Section */}
        <section>
          <div className="border-b border-emerald-500/20 pb-4 mb-6 mt-12 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">C. Implementasi Nilai Antikorupsi</h2>
              <p className="text-emerald-200/60 mt-1">Pendapat responden tentang implementasi nilai antikorupsi dalam masyarakat.</p>
            </div>
            {emptyImplementasi.size > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wide shrink-0">
                <AlertTriangle size={12} /> {emptyImplementasi.size} Pertanyaan Belum Terjawab
              </div>
            )}
          </div>
          <div className="space-y-8">
            {IMPLEMENTASI_QUESTIONS.map((q, idx) => (
              <CardWrapper key={q.id} emptySet={emptyImplementasi} id={q.id} baseBorder="border-emerald-500/20">
                <QuestionHeader index={idx + 1} color="text-emerald-400" label={q.label} isEmpty={emptyImplementasi.has(q.id)} />
                {renderRadioGroup(q.id, implementasiValues[q.id], (id, val) => handleValueChange(setImplementasiValues, id, val, setEmptyImplementasi), q.options, emptyImplementasi.has(q.id))}
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Kepuasan Section */}
        <section>
          <div className="border-b border-amber-500/20 pb-4 mb-6 mt-12 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">D. Peran Serta Masyarakat & Kepuasan</h2>
              <p className="text-amber-200/60 mt-1">Tingkat kepuasan terhadap pelayanan Pemerintah Desa Sijenggung.</p>
            </div>
            {emptyKepuasan.size > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wide shrink-0">
                <AlertTriangle size={12} /> {emptyKepuasan.size} Pertanyaan Belum Terjawab
              </div>
            )}
          </div>
          <div className="space-y-8">
            {KEPUASAN_QUESTIONS.map((q, idx) => (
              <CardWrapper key={q.id} emptySet={emptyKepuasan} id={q.id} baseBorder="border-amber-500/20">
                <QuestionHeader index={idx + 1} color="text-amber-400" label={q.label} isEmpty={emptyKepuasan.has(q.id)} />
                {renderRadioGroup(q.id, kepuasanValues[q.id], (id, val) => handleValueChange(setKepuasanValues, id, val, setEmptyKepuasan), q.options, emptyKepuasan.has(q.id))}
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Komentar Section */}
        <section>
          <div className="border-b border-purple-500/20 pb-4 mb-6 mt-12">
            <h2 className="text-2xl font-bold text-white">E. Saran & Masukan (Opsional)</h2>
            <p className="text-purple-200/60 mt-1">Berikan saran atau masukan Anda untuk peningkatan layanan kami.</p>
          </div>
          <div className="bg-[#1e294b]/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 shadow-sm">
            <label className="block text-sm font-bold text-slate-300 mb-2">Komentar/Saran</label>
            <textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tuliskan saran, kritik, atau masukan Anda di sini..."
              className="w-full bg-[#0f172a]/50 border border-slate-600 text-white rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-purple-400 custom-scrollbar"
            />
          </div>
        </section>

        <div className="pt-6 border-t border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium">
            🔒 Data Anda akan disimpan secara anonim & hanya untuk keperluan evaluasi internal desa.
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400 flex items-center gap-3 transition-colors text-lg hover:scale-[1.02] active:scale-100">
            Kirim Tanggapan <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
