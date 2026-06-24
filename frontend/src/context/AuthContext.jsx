import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Import dummy firebase config
import * as firebaseConfig from '../config/firebase';
let auth = firebaseConfig.auth;
let googleProvider = firebaseConfig.googleProvider;
let signInWithPopup = firebaseConfig.signInWithPopup;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user details if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  // Unified fetch helper injecting auth header and handling 401
  const authFetch = async (url, options = {}) => {
    const headers = options.headers || {};
    
    // Do not set Content-Type header if body is FormData (for file uploads)
    const isFormData = options.body instanceof FormData;
    
    const requestHeaders = {
      ...headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {})
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers: requestHeaders
      });

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      return res;
    } catch (err) {
      console.error(`authFetch Error on ${url}:`, err);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'shelter') {
          navigate('/shelter-dashboard');
        } else {
          navigate('/user-dashboard');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error' };
    }
  };

  const googleLogin = async () => {
    try {
      if (!signInWithPopup) {
        return { success: false, message: 'Google sign in not available' };
      }
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'shelter') {
          navigate('/shelter-dashboard');
        } else {
          navigate('/user-dashboard');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Google login error:', err);
      return { success: false, message: 'Google sign in failed' };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        navigate('/user-dashboard');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error' };
    }
  };

  const registerShelter = async (formData) => {
    try {
      const res = await fetch('/api/auth/register-shelter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        navigate('/shelter-dashboard');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error' };
    }
  };

  const registerAdmin = async (formData) => {
    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        navigate('/admin-dashboard');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updateProfile = async (formData) => {
    try {
      const res = await authFetch('/api/auth/update', {
        method: 'PUT',
        body: formData // Must be FormData
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, authFetch, login, googleLogin, register, registerShelter, registerAdmin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
