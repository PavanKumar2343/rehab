import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dog, Cat, Bird, HelpCircle, Smile, MessageSquare, Phone, Send, Info, Filter } from 'lucide-react';

const BrowseAdoptions = () => {
  const { user, authFetch } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Application Modal state
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', 'Dog', 'Cat', 'Cow', 'Ox', 'Bull', 'Horse', 'Donkey', 'Birds', 'Other'];

  const fetchAdoptables = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'All' 
        ? '/api/animals/adoptable' 
        : `/api/animals?status=Available For Adoption&category=${selectedCategory}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAnimals(data.data);
      } else {
        setAnimals([]);
      }
    } catch (err) {
      console.error('Error fetching adoptable animals:', err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptables();
  }, [selectedCategory]);

  const handleOpenModal = (animal) => {
    setSelectedAnimal(animal);
    setMessage('');
    setContactPhone(user?.phone || '');
    setModalError(null);
    setModalSuccess(false);
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    if (!message || !contactPhone) {
      setModalError('Please fill in both the proposal message and contact phone number.');
      return;
    }

    setSubmitting(true);
    setModalError(null);

    try {
      const res = await authFetch('/api/adoptions', {
        method: 'POST',
        body: JSON.stringify({
          animalId: selectedAnimal._id,
          message,
          contactPhone
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setModalSuccess(true);
        // Refresh local listings after brief pause
        setTimeout(() => {
          setSelectedAnimal(null);
          fetchAdoptables();
        }, 2000);
      } else {
        setModalError(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      setModalError('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: 'white', marginBottom: '8px' }}>
          Find Your New Best Friend
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse animals that have successfully recovered under shelter treatment and are ready for adoption.
        </p>
      </div>

      {/* Category Filters */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
          <Filter size={14} /> Filter by Animal Category
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-input)',
                color: selectedCategory === cat ? 'var(--text-inverse)' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <span className="pulse-indicator" style={{ width: '24px', height: '24px', display: 'inline-block' }}></span>
          <p style={{ marginTop: '12px' }}>Loading adoptable listings...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Smile size={48} style={{ marginBottom: '16px', color: 'var(--primary)' }} />
          <h3>No Animals Found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>There are no animals listed under this category right now. Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {animals.map(animal => (
            <div key={animal._id} className="glass-panel glass-panel-interactive" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              <div style={{ height: '200px', backgroundColor: '#0f172a', overflow: 'hidden', position: 'relative' }}>
                {animal.photos && animal.photos.length > 0 ? (
                  <img
                    src={animal.photos[animal.photos.length - 1]}
                    alt={animal.category}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '6px' }}>
                    {animal.category === 'Dog' ? <Dog size={48} style={{ opacity: 0.4 }} /> : animal.category === 'Cat' ? <Cat size={48} style={{ opacity: 0.4 }} /> : animal.category === 'Birds' ? <Bird size={48} style={{ opacity: 0.4 }} /> : <HelpCircle size={48} style={{ opacity: 0.4 }} />}
                    <span style={{ fontSize: '0.8rem' }}>{animal.category}</span>
                  </div>
                )}
                <span className="status-badge status-AvailableForAdoption" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {animal.category}
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Case ID: ...{animal._id.slice(-6)}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {animal.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sanctuary: <strong style={{ color: 'white' }}>{animal.assignedShelter?.shelterName || 'Fauna Clinic'}</strong>
                  </div>
                  
                  <button
                    onClick={() => handleOpenModal(animal)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Adopt Me
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Adoption Request Modal Popup */}
      {selectedAnimal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '300',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '30px', backgroundColor: 'rgba(15, 23, 42, 0.98)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'white' }}>Apply to Adopt</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Request for {selectedAnimal.category} (ID: ...{selectedAnimal._id.slice(-6)})
                </span>
              </div>
              <button
                onClick={() => setSelectedAnimal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {!user ? (
              <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  You must have a logged-in account to apply for adoptions.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <Link to="/login" onClick={() => setSelectedAnimal(null)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
                  <Link to="/register" onClick={() => setSelectedAnimal(null)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Register</Link>
                </div>
              </div>
            ) : modalSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  ✓
                </div>
                <h4 style={{ color: 'white', fontSize: '1.1rem' }}>Application Sent!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  The shelter has been notified. We will update you in real-time on approval status.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdoptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {modalError && (
                  <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.8rem' }}>
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="form-label" htmlFor="adoption-proposal">Why do you want to adopt this animal?</label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      id="adoption-proposal"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share some details about your home environment, experience with animals, and care plans..."
                      className="form-input"
                      style={{ paddingLeft: '40px', resize: 'vertical' }}
                      required
                    />
                    <MessageSquare size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="adoption-phone">Best Contact Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="adoption-phone"
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                    <Phone size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedAnimal(null)}
                    className="btn btn-secondary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem', gap: '8px' }}
                  >
                    {submitting ? 'Sending...' : (
                      <>
                        <Send size={14} /> Send Proposal
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default BrowseAdoptions;
