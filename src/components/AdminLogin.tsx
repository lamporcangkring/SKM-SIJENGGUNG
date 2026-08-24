import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2, AlertCircle, RefreshCw, Calculator } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToPublic: () => void;
}

export function AdminLogin({ onSuccess, onBackToPublic }: AdminLoginProps) {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Math Captcha State
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-' | '×'>('+');
  const [expectedAnswer, setExpectedAnswer] = useState<number>(0);

  const generateCaptcha = () => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 9) + 2;
    let n2 = Math.floor(Math.random() * 8) + 1;

    let ans = 0;
    if (chosenOp === '+') {
      ans = n1 + n2;
    } else if (chosenOp === '-') {
      // Pastikan hasil selalu positif
      if (n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
      ans = n1 - n2;
    } else {
      // Perkalian angka kecil
      n1 = Math.floor(Math.random() * 5) + 2;
      n2 = Math.floor(Math.random() * 5) + 2;
      ans = n1 * n2;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(chosenOp);
    setExpectedAnswer(ans);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validasi Captcha
    const parsedCaptcha = parseInt(captchaInput.trim(), 10);
    if (isNaN(parsedCaptcha) || parsedCaptcha !== expectedAnswer) {
      setError('⚠️ Jawaban verifikasi hitung salah. Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login gagal.');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top action bar */}
      <div className="absolute top-6 left-6 right-6 max-w-5xl mx-auto flex items-center justify-between z-20">
        <button
          onClick={onBackToPublic}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <ArrowLeft size={16} /> Kembali ke Web Publik
        </button>

        <ThemeToggle />
      </div>

      <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl relative z-10 transition-all ${
        isDark 
          ? 'bg-[#111936]/90 border-blue-500/30 shadow-blue-900/30' 
          : 'bg-white border-slate-200 shadow-slate-200/80'
      }`}>
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Portal Admin Desa</h1>
          <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pemerintah Desa Sijenggung
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Username */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
              <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-[#0a0f1c] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-[#0a0f1c] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* ── MATH CAPTCHA VERIFIKASI KEAMANAN ─────────────── */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0d1425] border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator size={14} className="text-cyan-500" />
                Verifikasi Keamanan
              </label>
              <button
                type="button"
                onClick={generateCaptcha}
                title="Ganti Soal Hitungan"
                className="text-[11px] font-bold text-blue-500 hover:text-blue-600 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Ganti Soal</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Soal Captcha Display */}
              <div className={`px-4 py-2.5 rounded-xl border font-mono font-black text-base sm:text-lg tracking-widest text-center select-none shrink-0 ${
                isDark 
                  ? 'bg-[#070b14] border-cyan-500/30 text-cyan-400 shadow-inner' 
                  : 'bg-white border-blue-200 text-blue-600 shadow-sm'
              }`}>
                {num1} {operator} {num2} = ?
              </div>

              {/* Input Jawaban */}
              <input
                type="number"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Hasil hitung..."
                className={`w-full border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-center focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-[#0a0f1c] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide mt-2 cursor-pointer hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              'Verifikasi & Masuk Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
