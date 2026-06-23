import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0b0f19' }}>
        <div className="pulse-indicator" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect role-specific defaults
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'shelter') return <Navigate to="/shelter-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
