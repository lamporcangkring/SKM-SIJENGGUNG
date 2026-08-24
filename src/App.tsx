import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicPortal } from './components/PublicPortal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { FormalReportPrint } from './components/FormalReportPrint';

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
