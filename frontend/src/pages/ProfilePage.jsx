import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, CheckCircle, Mail, Globe, MapPin, Award, Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [shelterName, setShelterName] = useState(user?.shelter?.shelterName || '');
  const [address, setAddress] = useState(user?.shelter?.address || '');
  const [radiusPreferenceKm, setRadiusPreferenceKm] = useState(user?.shelter?.radiusPreferenceKm || 10);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    
    if (selectedPhoto) {
      formData.append('profilePhoto', selectedPhoto);
    }

    if (user.role === 'shelter') {
      formData.append('shelterName', shelterName);
      formData.append('address', address);
      formData.append('radiusPreferenceKm', radiusPreferenceKm);
    }

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess(true);
        setSelectedPhoto(null);
      } else {
        setError(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred during update.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'white', marginBottom: '24px' }}>
        Profile Settings
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Profile Card & Photo Uploader */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header info / avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="profile preview"
                    style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                  />
                ) : (
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <User size={48} />
                  </div>
                )}
                
                <label
                  htmlFor="photo-upload"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-inverse)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  title="Upload avatar"
                >
                  +
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'white' }}>{user?.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  Role: <strong>{user?.role}</strong>
                </span>
                
                {user?.role === 'shelter' && (
                  <div style={{ marginTop: '8px' }}>
                    <span className={`status-badge status-${user?.shelter?.status}`}>
                      Account Status: {user?.shelter?.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.85rem' }}>
                Profile details updated successfully!
              </div>
            )}

            {/* Common Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <User size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="profile-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <Phone size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Shelter Specific preferences */}
            {user?.role === 'shelter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: 'white' }}>Shelter Configurations</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="form-label" htmlFor="profile-shelter-name">Shelter Brand Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="profile-shelter-name"
                        type="text"
                        value={shelterName}
                        onChange={(e) => setShelterName(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '40px' }}
                        required
                      />
                      <Globe size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="profile-radius">Active Rescue Dispatch Radius (KM)</label>
                    <input
                      id="profile-radius"
                      type="number"
                      value={radiusPreferenceKm}
                      onChange={(e) => setRadiusPreferenceKm(Math.max(1, parseInt(e.target.value)))}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="profile-address">Sanctuary Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="profile-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <MapPin size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: '#c7d2fe' }}>
                  License ID: <strong>{user?.shelter?.licenseNumber}</strong> • Coordinate Center: <strong>{user?.shelter?.coordinates?.join(', ')}</strong>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary"
              style={{ width: 'fit-content', padding: '12px 30px' }}
            >
              {updating ? 'Saving changes...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
