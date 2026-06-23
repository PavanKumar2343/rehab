import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from '../components/InteractiveMap';
import { User, Shield, AlertTriangle, CheckCircle, Mail, Key, Phone, FileText, MapPin, Globe } from 'lucide-react';

const Register = () => {
  const { register, registerShelter } = useAuth();
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'shelter'
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Common Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Shelter specific Fields
  const [shelterName, setShelterName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(37.7749); // default SF
  const [longitude, setLongitude] = useState(-122.4194);
  const [radiusPreference, setRadiusPreference] = useState(10);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(false);
  };

  const handleLocationSelect = (coords) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!name || !email || !password || !phone) {
      setError('Please fill in all common required fields.');
      setSubmitting(false);
      return;
    }

    try {
      let result;
      if (activeTab === 'user') {
        result = await register(name, email, password, phone);
      } else if (activeTab === 'shelter') {
        if (!shelterName || !licenseNumber || !address) {
          setError('Please fill in all shelter details.');
          setSubmitting(false);
          return;
        }
        result = await registerShelter({
          name, email, password, phone,
          shelterName, licenseNumber, address,
          longitude, latitude,
          radiusPreferenceKm: radiusPreference
        });
      }

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', padding: '40px 24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: activeTab === 'shelter' ? '860px' : '480px', padding: '36px 30px', transition: 'var(--transition-smooth)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Register to join the animal rehabilitation network.
          </p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: 'var(--bg-input)', padding: '4px', marginBottom: '28px', gap: '4px' }}>
          <button
            type="button"
            onClick={() => handleTabChange('user')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'user' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'user' ? 'var(--text-inverse)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <User size={14} /> User
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('shelter')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'shelter' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'shelter' ? 'var(--text-inverse)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Globe size={14} /> Shelter Partner
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.85rem', marginBottom: '24px' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.85rem', marginBottom: '24px' }}>
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>Account created successfully! Loading your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'shelter' ? '1fr 1fr' : '1fr', gap: '24px' }}>
            
            {/* Left Column: Personal info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'white', marginBottom: '4px' }}>
                Account Information
              </h4>
              
              <div>
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <User size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="register-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <Mail size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="register-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                    minLength={6}
                  />
                  <Key size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="register-phone">Contact Phone</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <Phone size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Right Column: Shelter details (if shelter tab is active) */}
            {activeTab === 'shelter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'white', marginBottom: '4px' }}>
                  Shelter Profile Details
                </h4>

                <div>
                  <label className="form-label" htmlFor="shelter-name">Official Shelter Name</label>
                  <input
                    id="shelter-name"
                    type="text"
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    placeholder="e.g. Springfield Sanctuary"
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" htmlFor="license-number">Operating License #</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="license-number"
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="VET-LIC-XXXXX"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="notify-radius">Dispatch Radius Preference (KM)</label>
                    <input
                      id="notify-radius"
                      type="number"
                      value={radiusPreference}
                      onChange={(e) => setRadiusPreference(Math.max(1, parseInt(e.target.value)))}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="shelter-address">Street Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="shelter-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter street physical address"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <MapPin size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Map Location pinpointing for geospatial coordinates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label">Pinpoint Shelter Location on Map</label>
                  <InteractiveMap
                    selectionMode={true}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              </div>
            )}
            
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
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-hover)', textDecoration: 'none', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
