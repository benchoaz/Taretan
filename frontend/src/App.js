import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout       from './shared/Layout';
import LoginPage    from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SuratMasukPage from './pages/SuratMasukPage';
import SuratKeluarPage from './pages/SuratKeluarPage';
import DisposisiPage from './pages/DisposisiPage';
import MonitoringPage from './pages/MonitoringPage';
import LaporanPage  from './pages/LaporanPage';
import ArsipPage    from './pages/ArsipPage';
import AdminPage    from './pages/AdminPage';
import MobileDashboardPage from './pages/MobileDashboardPage';

// Protected route wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-6xl">🚫</div>
          <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
          <p className="text-slate-500 text-sm">Anda tidak memiliki hak akses ke halaman ini.</p>
          <button onClick={()=>window.history.back()} className="btn-secondary">← Kembali</button>
        </div>
      </Layout>
    );
  }
  return <Layout>{children}</Layout>;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/surat-masuk"  element={<PrivateRoute><SuratMasukPage /></PrivateRoute>} />
        <Route path="/surat-keluar" element={<PrivateRoute><SuratKeluarPage /></PrivateRoute>} />
        <Route path="/disposisi"    element={<PrivateRoute><DisposisiPage /></PrivateRoute>} />
        <Route path="/monitoring"   element={<PrivateRoute><MonitoringPage /></PrivateRoute>} />
        <Route path="/laporan"      element={<PrivateRoute><LaporanPage /></PrivateRoute>} />
        <Route path="/arsip"        element={<PrivateRoute><ArsipPage /></PrivateRoute>} />
        <Route path="/admin"
          element={
            <PrivateRoute allowedRoles={['kepala_dinas','operator']}>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route path="/field" element={<PrivateRoute><MobileDashboardPage /></PrivateRoute>} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

// Redirect logged-in users away from login
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

export default App;