import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setError(null);
    const result = await googleLogin();
    setGoogleSubmitting(false);
    if (!result.success) {
      setError(result.message || 'Google sign in failed');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '36px 30px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🔑</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Access Rehabitat, the stray animal rehabilitation platform.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'white',
            color: '#1f2937',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: googleSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          {googleSubmitting ? (
            <span className="pulse-indicator" style={{ width: '12px', height: '12px', backgroundColor: '#1f2937' }}></span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.8409H13.8436C13.635 11.97 13.0009 12.9232 12.1064 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.1064 13.5614C11.3045 14.1014 10.2423 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71L1.06364 12.8795V15.8195C2.55273 18.7841 5.52 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.1932 3.68182 9.65318 3.68182 9.09545C3.68182 8.53773 3.78409 7.99773 3.96409 7.48091V4.54091H1.06364C0.398182 5.87591 0 7.39909 0 9.09545C0 10.7918 0.398182 12.315 1.06364 13.65L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.55909C10.3295 3.55909 11.5159 4.03364 12.4445 4.92273L15.0273 2.34C13.46 0.891818 11.4259 0 9 0C5.52 0 2.55273 0.784091 1.06364 2.34L3.96409 4.78091C4.67182 2.65364 6.65591 1.07045 9 1.07045C9 1.07045 9 3.55909 9 3.55909Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
          <span style={{ padding: '0 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" htmlFor="password-input" style={{ marginBottom: 0 }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {submitting ? (
              <span className="pulse-indicator" style={{ width: '12px', height: '12px' }}></span>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-hover)', textDecoration: 'none', fontWeight: '600' }}>
            Register Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
