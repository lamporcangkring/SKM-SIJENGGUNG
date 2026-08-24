import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
        isDark 
          ? 'bg-[#162039] text-amber-300 hover:text-amber-200 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
          : 'bg-white text-slate-800 hover:text-blue-600 border border-slate-300 shadow-sm hover:border-blue-400'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun size={15} className="text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline">Mode Gelap</span>
        </>
      ) : (
        <>
          <Moon size={15} className="text-indigo-600" />
          <span className="hidden sm:inline">Mode Terang</span>
        </>
      )}
    </button>
  );
}
