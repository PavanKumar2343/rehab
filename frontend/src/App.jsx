import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ShelterDashboard from './pages/ShelterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseAdoptions from './pages/BrowseAdoptions';
import ProfilePage from './pages/ProfilePage';
import { X, AlertCircle } from 'lucide-react';

const ToastAlert = () => {
  const { alertMessage, clearAlert } = useSocket();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (!alertMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '999',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: '12px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1.5px solid var(--primary)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 12px var(--primary-glow)',
      width: '320px',
      animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <AlertCircle size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700' }}>{alertMessage.title}</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{alertMessage.message}</p>
      </div>
      <button
        onClick={clearAlert}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignSelf: 'flex-start', padding: '2px' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <ToastAlert />
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adoptions" element={<BrowseAdoptions />} />

          {/* User Protected Routes */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Shelter Protected Routes */}
          <Route path="/shelter-dashboard" element={
            <ProtectedRoute allowedRoles={['shelter']}>
              <ShelterDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Profile Route accessible by logged in users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
