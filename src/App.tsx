import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicPortal } from './components/PublicPortal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { FormalReportPrint } from './components/FormalReportPrint';

// Hilangkan badge "Powered by Netlify" (iframe nl-badge-frame)
const removeNetlifyBadge = () => {
  if (typeof document === 'undefined') return;
  const badgedIds = ['nl-badge-frame', 'nfsb'];
  badgedIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });
  document.querySelectorAll('iframe[src*="netlify"], iframe[src*="badge"]').forEach((el) => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
};

// Komponen Proteksi Halaman Admin
function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="print:hidden">
      <AdminDashboard />
    </div>
  );
}

// Wrapper Halaman Login
function AdminLoginWrapper() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLogin
      onSuccess={() => navigate('/admin')}
      onBackToPublic={() => navigate('/')}
    />
  );
}

export default function App() {
  useEffect(() => {
    removeNetlifyBadge();
    const t1 = window.setTimeout(removeNetlifyBadge, 300);
    const t2 = window.setTimeout(removeNetlifyBadge, 1500);
    const t3 = window.setTimeout(removeNetlifyBadge, 4000);

    let observer: MutationObserver | undefined;
    try {
      observer = new MutationObserver(() => {
        removeNetlifyBadge();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } catch {
      // noop
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SurveyProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Public Routes ───────────────────────────── */}
              <Route path="/" element={<div className="print:hidden"><PublicPortal /></div>} />
              <Route path="/survei" element={<div className="print:hidden"><PublicPortal /></div>} />
              <Route path="/laporan" element={<div className="print:hidden"><PublicPortal /></div>} />

              {/* ── Auth Route ──────────────────────────────── */}
              <Route path="/login" element={<AdminLoginWrapper />} />

              {/* ── Protected Admin Routes ──────────────────── */}
              <Route path="/admin" element={<ProtectedAdminRoute />} />
              <Route path="/admin/responden" element={<ProtectedAdminRoute />} />
              <Route path="/admin/laporan" element={<ProtectedAdminRoute />} />
              <Route path="/admin/demografi" element={<ProtectedAdminRoute />} />
              <Route path="/admin/feedback" element={<ProtectedAdminRoute />} />

              {/* ── Fallback 404 ────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Formal PDF Report (Hanya Muncul Saat Print/Cetak) */}
            <FormalReportPrint />
          </BrowserRouter>
        </SurveyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
