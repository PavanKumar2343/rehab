import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Award, ArrowRight, Activity, Smile, Home } from 'lucide-react';

const LandingPage = () => {
  const [stats, setStats] = useState({ rescued: 24, treating: 8, adopted: 12 });
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load stats and gallery
  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const res = await fetch('/api/animals/adoptable');
        const data = await res.json();
        if (data.success) {
          setGallery(data.data.slice(0, 3)); // show top 3 adoptable
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLandingData();
  }, []);

  return (
    <div className="hero-gradient" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-hover)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
          <span className="pulse-indicator"></span> Real-time Stray Rescue Network
        </div>
        <h1 className="glow-text" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
          Healing Strives,<br />New Homes Thrive
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '36px', lineHeight: '1.6' }}>
          Connect injured stray animals with local shelters instantly. Track their veterinary treatment, witness their recovery, and apply to give them a permanent, loving home.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/user-dashboard" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Report Injured Animal <ArrowRight size={18} />
          </Link>
          <Link to="/adoptions" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Browse Adoptions
          </Link>
        </div>
      </section>

      {/* Realtime Stats Counters */}
      <section style={{ padding: '40px 24px', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--status-reported)', marginBottom: '8px' }}>
              <Activity size={28} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'white' }}>{stats.rescued + stats.treating + stats.adopted}+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Animals Rescued</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} className="stat-border-responsive">
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--status-treatment)', marginBottom: '8px' }}>
              <Heart size={28} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'white' }}>{stats.treating}+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Under Medical Treatment</div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--status-recovered)', marginBottom: '8px' }}>
              <Smile size={28} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'white' }}>{stats.adopted}+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Happily Adopted</div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section style={{ padding: '60px 24px', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px', fontFamily: 'var(--font-display)' }}>How FaunaRescue Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#f59e0b', justifyContent: 'center', marginBottom: '16px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>1. Report Instantly</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Pinpoint location on our interactive map using automatic GPS. Upload pictures and describe the case so responders know what to expect.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#3b82f6', justifyContent: 'center', marginBottom: '16px' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>2. GPS Dispatch</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              MongoDB Geospatial index identifies verified shelters within standard radius (5km, 10km, 20km). Shelters receive instant chimes to accept.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#10b981', justifyContent: 'center', marginBottom: '16px' }}>
              <Home size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>3. Treatment & Adoption</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Follow recovery progress, inspect photo updates, and apply to adopt the animal to prevent strays from returning to dangerous streets.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Animals Gallery */}
      <section style={{ padding: '60px 24px', maxWidth: '1100px', width: '100%', margin: '0 auto', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Meet Our Recovered Buddies</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>These animals have completed their rehabilitation and are waiting for you.</p>
          </div>
          <Link to="/adoptions" className="nav-link" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All Adoptable Animals <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading gallery...</div>
        ) : gallery.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No animals currently listed for adoption. Register or check back later!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {gallery.map(animal => (
              <div key={animal._id} className="glass-panel glass-panel-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative', backgroundColor: '#0f172a' }}>
                  {animal.photos && animal.photos.length > 0 ? (
                    <img
                      src={animal.photos[animal.photos.length - 1]} // show newest recovery photo
                      alt={animal.category}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                      className="gallery-image-hover"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '8px' }}>
                      <Smile size={36} />
                      <span>Photo Pending</span>
                    </div>
                  )}
                  <span className="status-badge status-AvailableForAdoption" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    Recovered
                  </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{animal.category} Rescue Case</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {animal.description}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Hosted by: <strong>{animal.assignedShelter?.shelterName || 'Partner Shelter'}</strong>
                    </span>
                    <Link to="/adoptions" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                      Adopt Me
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Embedded styles for local testing animations */}
      <style>{`
        .gallery-image-hover:hover {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .stat-border-responsive {
            border-left: none !important;
            border-right: none !important;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 20px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
