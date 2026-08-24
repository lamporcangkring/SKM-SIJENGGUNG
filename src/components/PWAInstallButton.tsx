import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, X } from 'lucide-react';

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <CheckCircle size={13} /> Aplikasi Terpasang
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Pasang aplikasi di Smartphone / Desktop"
        className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 font-bold text-xs rounded-full border border-cyan-500/40 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:scale-105"
      >
        <Smartphone size={14} />
        <span>Pasang di HP</span>
      </button>

      {/* Modal panduan jika browser tidak mendukung auto-prompt */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111936] border border-blue-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <Download size={26} />
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-2">Pasang di Smartphone (PWA)</h3>
            <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">
              Anda dapat menginstal aplikasi ini langsung di layar utama HP Anda tanpa melalui Play Store:
            </p>

            <div className="bg-[#0a0f1c] p-4 rounded-2xl text-xs space-y-3 text-slate-300 border border-slate-700/50 mb-5">
              <div className="flex gap-2">
                <span className="font-bold text-cyan-400 shrink-0">Android (Chrome):</span>
                <span>Ketuk ikon menu titik 3 (⋮) di kanan atas browser, lalu pilih <strong>"Tambahkan ke Layar Utama" / "Install App"</strong>.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-cyan-400 shrink-0">iPhone (Safari):</span>
                <span>Ketuk ikon <strong>Share</strong> (kotak panah ke atas) di bawah, lalu pilih <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
