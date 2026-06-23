import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import InteractiveMap from '../components/InteractiveMap';
import { Activity, ShieldCheck, Heart, User, Check, X, FileText, Upload, Clock, Bell, MapPin, BarChart2 } from 'lucide-react';

const ShelterDashboard = () => {
  const { user, authFetch } = useAuth();
  
  // Tabs: 'incoming' | 'active' | 'adoptions' | 'analytics'
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRescues, setIncomingRescues] = useState([]);
  const [activeRescues, setActiveRescues] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status updates states
  const [selectedRescueForUpdate, setSelectedRescueForUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('Rescue Accepted');
  const [remarks, setRemarks] = useState('');
  const [progressPhoto, setProgressPhoto] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchShelterData = async () => {
    if (!user || user.role !== 'shelter' || user.shelter?.status !== 'Approved') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch incoming/unassigned matching radius requests
      const incRes = await authFetch('/api/rescues/incoming');
      const incData = await incRes.json();
      if (incData.success) {
        setIncomingRescues(incData.data);
      }

      // 2. Fetch active rescues
      const actRes = await authFetch('/api/rescues/active');
      const actData = await actRes.json();
      if (actData.success) {
        setActiveRescues(actData.data);
      }

      // 3. Fetch adoption applications
      const adoptRes = await authFetch('/api/adoptions/shelter');
      const adoptData = await adoptRes.json();
      if (adoptData.success) {
        setAdoptionRequests(adoptData.data);
      }
    } catch (err) {
      console.error('Error fetching shelter dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelterData();
  }, [user, activeTab]);

  const handleAcceptRescue = async (rescueId) => {
    try {
      const res = await authFetch(`/api/rescues/${rescueId}/accept`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        alert('Rescue request accepted. Proceeding to treatment.');
        fetchShelterData();
      } else {
        alert(data.message || 'Error accepting rescue request');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRescue = async (rescueId) => {
    if (!confirm('Are you sure you want to decline this rescue? This will hide the case from your dashboard.')) return;
    try {
      const res = await authFetch(`/api/rescues/${rescueId}/reject`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        fetchShelterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);

    const formData = new FormData();
    formData.append('status', newStatus);
    formData.append('remarks', remarks);
    if (progressPhoto) {
      formData.append('photo', progressPhoto);
    }

    try {
      const res = await authFetch(`/api/rescues/${selectedRescueForUpdate.id}/status`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert('Rescue status updated successfully.');
        setSelectedRescueForUpdate(null);
        setRemarks('');
        setProgressPhoto(null);
        fetchShelterData();
      } else {
        alert(data.message || 'Error updating status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateAdoption = async (requestId, decision) => {
    if (!confirm(`Are you sure you want to set application status to: ${decision}?`)) return;
    try {
      const res = await authFetch(`/api/adoptions/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: decision })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Application set to ${decision.toLowerCase()} successfully.`);
        fetchShelterData();
      } else {
        alert(data.message || 'Error modifying status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If user registered as a shelter but has not been verified by Admin
  if (user?.role === 'shelter' && user?.shelter?.status !== 'Approved') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '24px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
          <Clock size={48} style={{ color: 'var(--status-reported)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
            Account Pending Approval
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Thank you for registering as a partner shelter! Your application is currently awaiting administrator review. 
            Once verified, you will receive real-time dispatch chimes and can accept active rescues in your area.
          </p>
        </div>
      </div>
    );
  }

  // Map markers representation
  const shelterLat = user?.shelter?.coordinates[1] || 37.7749;
  const shelterLng = user?.shelter?.coordinates[0] || -122.4194;
  
  const mapMarkers = [
    // Include shelter marker
    { lat: shelterLat, lng: shelterLng, type: 'shelter', label: user?.shelter?.shelterName || 'Your Shelter' },
    // Include reported markers
    ...incomingRescues.map(req => ({
      lat: req.animalId?.location?.coordinates[1],
      lng: req.animalId?.location?.coordinates[0],
      type: 'reported',
      label: `${req.animalId?.category} (${req.distance}km)`
    })),
    // Include active rescues markers
    ...activeRescues.map(req => ({
      lat: req.animalId?.location?.coordinates[1],
      lng: req.animalId?.location?.coordinates[0],
      type: 'treatment',
      label: `${req.animalId?.category} (Active)`
    }))
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      
      {/* Dashboard Stats header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'white' }}>Shelter Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Clinic: <strong>{user?.shelter?.shelterName}</strong> • Verified Partner</p>
        </div>
        
        {/* Toggle selectors */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['incoming', 'active', 'adoptions', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedRescueForUpdate(null); }}
              className="btn"
              style={{
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--bg-input)',
                color: activeTab === tab ? 'var(--text-inverse)' : 'var(--text-main)',
                border: '1px solid var(--border-color)'
              }}
            >
              {tab === 'adoptions' ? 'Adoption Requests' : tab === 'incoming' ? `Incoming Requests (${incomingRescues.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid panels */}
      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'analytics' ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Map rendering (hides on analytics) */}
        {activeTab !== 'analytics' && (
          <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Location Navigation Map
            </h3>
            
            <InteractiveMap
              markers={mapMarkers}
              center={{ lat: shelterLat, lng: shelterLng }}
            />
          </div>
        )}

        {/* RIGHT/MAIN COLUMN */}
        <div style={{ gridColumn: activeTab === 'analytics' ? '1 / span 2' : 'auto' }}>
          
          {/* TAB: Incoming Rescue Requests */}
          {activeTab === 'incoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>Live Incoming Notifications</h3>
              
              {loading ? (
                <div>Loading rescues feed...</div>
              ) : incomingRescues.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Bell size={36} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                  <p>No new injured reports found within your {user?.shelter?.radiusPreferenceKm}km radius preference.</p>
                </div>
              ) : (
                incomingRescues.map(req => (
                  <div key={req.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem' }}>{req.animalId?.category} Reported</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Distance: <strong style={{ color: 'var(--primary-hover)' }}>{req.distance} KM</strong> away
                        </span>
                      </div>
                      <span className="status-badge status-Reported">Reported</span>
                    </div>

                    {/* Animal Photo */}
                    {req.animalId?.photos && req.animalId.photos.length > 0 && (
                      <div style={{ width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#0f172a' }}>
                        <img
                          src={req.animalId.photos[req.animalId.photos.length - 1]}
                          alt={`${req.animalId.category}`}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.animalId?.description}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reporter: <strong>{req.reporterId?.name}</strong> ({req.reporterId?.phone})
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={() => handleAcceptRescue(req.id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '4px' }}
                      >
                        <Check size={14} /> Accept Rescue
                      </button>
                      <button
                        onClick={() => handleRejectRescue(req.id)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '4px' }}
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Active Assigned Rescues */}
          {activeTab === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>Assigned Treatments</h3>

              {selectedRescueForUpdate ? (
                /* Status update form overlay/panel */
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ color: 'white' }}>Update Case Progress</h4>
                    <button onClick={() => setSelectedRescueForUpdate(null)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Cancel</button>
                  </div>

                  <form onSubmit={handleStatusUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="form-label" htmlFor="update-select-status">Choose Health Status</label>
                      <select
                        id="update-select-status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="form-input"
                      >
                        {['Rescue Accepted', 'Rescued', 'Under Treatment', 'Recovered', 'Available For Adoption', 'Adopted'].map(st => (
                          <option key={st} value={st} style={{ backgroundColor: 'var(--bg-card-solid)', color: 'white' }}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" htmlFor="update-remarks">Treatment Log Remarks</label>
                      <textarea
                        id="update-remarks"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add notes about surgery, medication, or recovery progress..."
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" htmlFor="update-recovery-photo">Upload Progress Image (Optional)</label>
                      <input
                        id="update-recovery-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProgressPhoto(e.target.files[0])}
                        className="form-input"
                      />
                    </div>

                    <button type="submit" disabled={updatingStatus} className="btn btn-primary" style={{ width: 'fit-content', padding: '10px 20px' }}>
                      {updatingStatus ? 'Updating status...' : 'Log Status Update'}
                    </button>
                  </form>
                </div>
              ) : activeRescues.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Heart size={36} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                  <p>You have no active rescue assignments under care.</p>
                </div>
              ) : (
                activeRescues.map(rescue => (
                  <div key={rescue.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: 'white', fontSize: '1.05rem' }}>{rescue.animalId?.category} Assignment</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Reporter: {rescue.reporterId?.name} ({rescue.reporterId?.phone})
                        </span>
                      </div>
                      <span className={`status-badge status-${rescue.status.replace(/\s+/g, '')}`}>
                        {rescue.status}
                      </span>
                    </div>

                    {/* Animal Photo */}
                    {rescue.animalId?.photos && rescue.animalId.photos.length > 0 && (
                      <div style={{ width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#0f172a' }}>
                        <img
                          src={rescue.animalId.photos[rescue.animalId.photos.length - 1]}
                          alt={`${rescue.animalId.category}`}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Progress Photos Log */}
                    {rescue.logs && rescue.logs.length > 0 && rescue.logs.some(log => log.photo) && (
                      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '8px 0' }}>
                        {rescue.logs.filter(log => log.photo).map((log, idx) => (
                          <div key={idx} style={{ flexShrink: 0, width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                            <img
                              src={log.photo}
                              alt={`Progress ${idx + 1}`}
                              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rescue.animalId?.description}</p>
                    
                    <button
                      onClick={() => { setSelectedRescueForUpdate(rescue); setNewStatus(rescue.status); }}
                      className="btn btn-secondary"
                      style={{ width: 'fit-content', padding: '6px 12px', fontSize: '0.75rem', marginTop: '6px' }}
                    >
                      Update Health Status
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Adoption Requests incoming */}
          {activeTab === 'adoptions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>Pending Adoption Applications</h3>
              
              {loading ? (
                <div>Loading applications...</div>
              ) : adoptionRequests.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Smile size={36} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                  <p>No adoption proposals submitted for your hosted animals.</p>
                </div>
              ) : (
                adoptionRequests.map(app => (
                  <div key={app.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: 'white', fontSize: '1.05rem' }}>Application for {app.animalId?.category || 'Animal'}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Case ID: ...{app.animalId?.id.slice(-6)}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        backgroundColor: app.status === 'Pending' ? 'rgba(245,158,11,0.1)' : app.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: app.status === 'Pending' ? '#f59e0b' : app.status === 'Approved' ? '#10b981' : '#ef4444'
                      }}>
                        {app.status}
                      </span>
                    </div>

                    {/* Animal Photo */}
                    {app.animalId?.photos && app.animalId.photos.length > 0 && (
                      <div style={{ width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#0f172a' }}>
                        <img
                          src={app.animalId.photos[app.animalId.photos.length - 1]}
                          alt={`${app.animalId.category}`}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '12px', margin: '4px 0' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{app.message}"</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      <div>
                        Applicant: <strong>{app.userId?.name}</strong> • Phone: {app.contactPhone}
                      </div>

                      {app.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateAdoption(app.id, 'Approved')}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateAdoption(app.id, 'Rejected')}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Shelter Analytics */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>Operational Statistics</h3>
              
              <div className="analytics-grid">
                <MetricCard
                  title="Incoming Notifications"
                  value={incomingRescues.length}
                  icon={Bell}
                  description="Cases currently waiting to be picked up"
                />
                <MetricCard
                  title="Active Treatments"
                  value={activeRescues.filter(r => r.status !== 'Adopted' && r.status !== 'Available For Adoption').length}
                  icon={Activity}
                  description="Stray cases undergoing vet treatment"
                />
                <MetricCard
                  title="Adoptable Animals"
                  value={activeRescues.filter(r => r.status === 'Available For Adoption').length}
                  icon={Heart}
                  description="Fully recovered animals awaiting homes"
                />
                <MetricCard
                  title="Adoptions Pending"
                  value={adoptionRequests.filter(a => a.status === 'Pending').length}
                  icon={User}
                  description="Adoption applicants waiting reviews"
                />
              </div>

              {/* Progress charts visualization */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 size={16} /> Rehabilitation Output Success Rate
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Active Recoveries Completed</span>
                      <span>{activeRescues.length > 0 ? Math.round((activeRescues.filter(r => r.status === 'Recovered' || r.status === 'Available For Adoption' || r.status === 'Adopted').length / activeRescues.length) * 100) : 0}% success rate</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${activeRescues.length > 0 ? (activeRescues.filter(r => r.status === 'Recovered' || r.status === 'Available For Adoption' || r.status === 'Adopted').length / activeRescues.length) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary)',
                        boxShadow: '0 0 8px var(--primary-glow)'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShelterDashboard;
