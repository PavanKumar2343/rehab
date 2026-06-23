import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from '../components/InteractiveMap';
import { MapPin, Upload, FileText, AlertCircle, Compass, List, Heart, Calendar } from 'lucide-react';

const UserDashboard = () => {
  const { authFetch } = useAuth();
  
  // Tabs: 'reports' | 'report_new' | 'adoptions'
  const [activeSubTab, setActiveSubTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New report form state
  const [category, setCategory] = useState('Dog');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [reporting, setReporting] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  // Detailed view state (active rescue request selection)
  const [selectedRescue, setSelectedRescue] = useState(null);
  const [rescueLoading, setRescueLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch reported cases
      const repRes = await authFetch('/api/animals/my-reports');
      const repData = await repRes.json();
      if (repData.success) {
        setReports(repData.data);
      }

      // 2. Fetch adoption requests
      const adoptRes = await authFetch('/api/adoptions/my-requests');
      const adoptData = await adoptRes.json();
      if (adoptData.success) {
        setAdoptions(adoptData.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeSubTab]);

  const handleLocationSelect = (coords) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const previews = files.map(file => {
      return URL.createObjectURL(file);
    });
    setPhotoPreviews(previews);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReporting(true);
    setReportResult(null);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      const res = await authFetch('/api/animals/report', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setReportResult({
          success: true,
          message: `Successfully reported! Notified ${data.data.notifiedShelters?.length || 0} shelters nearby.`,
          shelters: data.data.notifiedShelters
        });
        
        // Reset form
        setCategory('Dog');
        setDescription('');
        setPhotos([]);
        setPhotoPreviews([]);
        
        // Move back to reports listing after delay
        setTimeout(() => {
          setReportResult(null);
          setActiveSubTab('reports');
        }, 3000);
      } else {
        setReportResult({
          success: false,
          message: data.message || 'Failed to report animal.'
        });
      }
    } catch (err) {
      setReportResult({
        success: false,
        message: 'Server error connection failed.'
      });
    } finally {
      setReporting(false);
    }
  };

  const handleViewRescueDetails = async (animalId) => {
    setRescueLoading(true);
    setSelectedRescue(null);
    try {
      // Find rescue linked to animal
      const res = await authFetch(`/api/rescues/my-history`);
      const data = await res.json();
      if (data.success) {
        const rescue = data.data.find(r => r.animalId?._id === animalId);
        if (rescue) {
          // Fetch complete logs mapping from rescue endpoint
          const detailRes = await authFetch(`/api/rescues/${rescue._id}`);
          const detailData = await detailRes.json();
          if (detailData.success) {
            setSelectedRescue(detailData.data);
          }
        } else {
          alert('Rescue details not log-synced yet.');
        }
      }
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setRescueLoading(false);
    }
  };

  const getStatusPercentage = (status) => {
    const stages = ['Reported', 'Rescue Accepted', 'Rescued', 'Under Treatment', 'Recovered', 'Available For Adoption', 'Adopted'];
    const idx = stages.indexOf(status);
    if (idx === -1) return 10;
    return Math.round(((idx + 1) / stages.length) * 100);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'white' }}>User Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Report injured cases, track recoveries, and view your adoptions.</p>
        </div>
        
        {/* Toggle buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setActiveSubTab('reports'); setSelectedRescue(null); }}
            className="btn"
            style={{
              fontSize: '0.85rem',
              backgroundColor: activeSubTab === 'reports' ? 'var(--primary)' : 'var(--bg-input)',
              color: activeSubTab === 'reports' ? 'var(--text-inverse)' : 'var(--text-main)',
              border: '1px solid var(--border-color)'
            }}
          >
            My Reports
          </button>
          <button
            onClick={() => { setActiveSubTab('report_new'); setSelectedRescue(null); }}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            + Report Injured Animal
          </button>
          <button
            onClick={() => { setActiveSubTab('adoptions'); setSelectedRescue(null); }}
            className="btn"
            style={{
              fontSize: '0.85rem',
              backgroundColor: activeSubTab === 'adoptions' ? 'var(--primary)' : 'var(--bg-input)',
              color: activeSubTab === 'adoptions' ? 'var(--text-inverse)' : 'var(--text-main)',
              border: '1px solid var(--border-color)'
            }}
          >
            My Adoptions
          </button>
        </div>
      </div>

      {/* Primary Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRescue ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT/MAIN column */}
        <div>
          {/* Subtab: My Reports List */}
          {activeSubTab === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>Active Reports List</h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Fetching your logs...</div>
              ) : reports.length === 0 ? (
                <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <List size={40} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <p>You have not reported any animal cases yet.</p>
                  <button onClick={() => setActiveSubTab('report_new')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '12px' }}>
                    Report First Case
                  </button>
                </div>
              ) : (
                reports.map(report => (
                  <div
                    key={report._id}
                    className="glass-panel glass-panel-interactive"
                    onClick={() => handleViewRescueDetails(report._id)}
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: selectedRescue?.animalId?._id === report._id ? '4px solid var(--primary)' : '1px solid var(--border-color)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', color: 'white' }}>{report.category} Report</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Reported on {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`status-badge status-${report.healthStatus.replace(/\s+/g, '')}`}>
                        {report.healthStatus}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{report.description}</p>

                    {/* Progress indicator bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Rescue Lifecycle</span>
                        <span>{getStatusPercentage(report.healthStatus)}% Completed</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${getStatusPercentage(report.healthStatus)}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          boxShadow: '0 0 8px var(--primary-glow)',
                          transition: 'var(--transition-smooth)'
                        }}></div>
                      </div>
                    </div>

                    {report.assignedShelter && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                        Assigned to: <strong style={{ color: 'white' }}>{report.assignedShelter.shelterName}</strong> ({report.assignedShelter.address})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Subtab: New Report Form */}
          {activeSubTab === 'report_new' && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'white', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '20px' }}>
                Report Injured Stray Animal
              </h3>

              {reportResult && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: reportResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: reportResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  color: reportResult.success ? '#34d399' : '#f87171',
                  fontSize: '0.85rem',
                  marginBottom: '24px'
                }}>
                  <strong>{reportResult.message}</strong>
                  {reportResult.shelters && reportResult.shelters.length > 0 && (
                    <ul style={{ marginTop: '8px', paddingLeft: '16px', listStyleType: 'disc' }}>
                      {reportResult.shelters.map((s, i) => (
                        <li key={i}>{s.name} ({s.distance} km away)</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="form-label" htmlFor="report-category">Animal Category</label>
                    <select
                      id="report-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-input"
                    >
                      {['Dog', 'Cat', 'Cow', 'Ox', 'Bull', 'Horse', 'Donkey', 'Birds', 'Other'].map(cat => (
                        <option key={cat} value={cat} style={{ backgroundColor: 'var(--bg-card-solid)', color: 'white' }}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="gps-coordinates-select">Coordinates Selected</label>
                    <div id="gps-coordinates-select" style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-main)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Latitude: <strong style={{ color: 'white' }}>{latitude}</strong> • Longitude: <strong style={{ color: 'white' }}>{longitude}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="report-description">Injury Description & Visual State</label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      id="report-description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Specify animal health status (e.g. bleeding ear, fractured limb, trapped inside well) so responders can fetch suitable tools..."
                      className="form-input"
                      style={{ paddingLeft: '40px', resize: 'vertical' }}
                      required
                    />
                    <FileText size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Interactive map coordinates selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label">Mark Location on Interactive Map</label>
                  <InteractiveMap
                    selectionMode={true}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                {/* Upload Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label">Upload Animal Photos (Max 5)</label>
                  <div style={{
                    border: '1.5px dashed var(--border-color)',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'var(--transition-smooth)'
                  }} className="notif-item-hover">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click or drag images to upload</p>
                  </div>

                  {/* Photo previews list */}
                  {photoPreviews.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {photoPreviews.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt="preview"
                          style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={reporting}
                  className="btn btn-primary"
                  style={{ width: 'fit-content', padding: '12px 30px', marginTop: '10px' }}
                >
                  {reporting ? 'Reporting stray animal...' : 'Submit Animal Report'}
                </button>

              </form>
            </div>
          )}

          {/* Subtab: My Adoption Requests List */}
          {activeSubTab === 'adoptions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>My Adoption Proposals</h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading adoptions...</div>
              ) : adoptions.length === 0 ? (
                <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Heart size={40} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <p>You have not applied for any adoptions yet.</p>
                </div>
              ) : (
                adoptions.map(adopt => (
                  <div key={adopt._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: 'white', fontSize: '1.05rem' }}>{adopt.animalId?.category || 'Animal'} Proposal</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Submitted: {new Date(adopt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: adopt.status === 'Pending' ? 'rgba(245,158,11,0.1)' : adopt.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: adopt.status === 'Pending' ? '#f59e0b' : adopt.status === 'Approved' ? '#10b981' : '#ef4444',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}>
                        {adopt.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Your Message:</strong> {adopt.message}</p>
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Shelter Sponsor: <strong>{adopt.shelterId?.shelterName}</strong> • Phone: {adopt.contactPhone}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Chronological logs tracking details */}
        {selectedRescue && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Live Rescue Tracking</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Case ID: ...{selectedRescue._id.slice(-6)}
                </span>
              </div>
              <button
                onClick={() => setSelectedRescue(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Display Animal details */}
            <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', marginBottom: '20px' }}>
              {selectedRescue.animalId?.photos && selectedRescue.animalId.photos.length > 0 ? (
                <img
                  src={selectedRescue.animalId.photos[selectedRescue.animalId.photos.length - 1]}
                  alt="animal status"
                  style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '6px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  No photo
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                <div>Category: <strong style={{ color: 'white' }}>{selectedRescue.animalId?.category}</strong></div>
                <div>Status: <span className={`status-badge status-${selectedRescue.status.replace(/\s+/g, '')}`} style={{ padding: '2px 8px', fontSize: '0.65rem' }}>{selectedRescue.status}</span></div>
                {selectedRescue.assignedShelterId && (
                  <div>Sanctuary: <strong style={{ color: 'white' }}>{selectedRescue.assignedShelterId.shelterName}</strong></div>
                )}
              </div>
            </div>

            {/* Chronological Logs Timeline */}
            <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '14px' }}>Rehabilitation Logs</h4>
            
            <div className="timeline">
              {selectedRescue.logs.map((log, index) => {
                let logColor = 'var(--text-muted)';
                if (log.status === 'Reported') logColor = 'var(--status-reported)';
                if (log.status === 'Rescue Accepted') logColor = 'var(--status-accepted)';
                if (log.status === 'Rescued') logColor = 'var(--status-rescued)';
                if (log.status === 'Under Treatment') logColor = 'var(--status-treatment)';
                if (log.status === 'Recovered') logColor = 'var(--status-recovered)';
                if (log.status === 'Available For Adoption') logColor = 'var(--status-adoptable)';
                if (log.status === 'Adopted') logColor = 'var(--status-adopted)';

                return (
                  <div key={index} className="timeline-item">
                    <span className="timeline-dot" style={{ backgroundColor: logColor }}></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: logColor }}>{log.status}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '2px' }}>{log.remarks}</p>
                      
                      {/* Attached progress photo */}
                      {log.photo && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={log.photo}
                            alt="progress state"
                            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
