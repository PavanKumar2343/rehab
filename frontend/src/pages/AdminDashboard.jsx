import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import { Shield, Users, Globe, Activity, Heart, Check, X, Trash2, Printer, FileText, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const { authFetch } = useAuth();
  
  // Subtabs: 'shelters_queue' | 'users_list' | 'shelters_list' | 'reports'
  const [activeTab, setActiveTab] = useState('shelters_queue');
  const [analytics, setAnalytics] = useState(null);
  const [pendingShelters, setPendingShelters] = useState([]);
  const [users, setUsers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Report modal state
  const [reportText, setReportText] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch analytics
      const analRes = await authFetch('/api/admin/analytics');
      const analData = await analRes.json();
      if (analData.success) {
        setAnalytics(analData.data);
      }

      // 2. Fetch pending shelter approvals
      const pendRes = await authFetch('/api/admin/shelters/pending');
      const pendData = await pendRes.json();
      if (pendData.success) {
        setPendingShelters(pendData.data);
      }

      // 3. Fetch users list
      const userRes = await authFetch('/api/admin/users');
      const userData = await userRes.json();
      if (userData.success) {
        setUsers(userData.data);
      }

      // 4. Fetch all shelters list
      const sheRes = await authFetch('/api/admin/shelters');
      const sheData = await sheRes.json();
      if (sheData.success) {
        setShelters(sheData.data);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const handleVerifyShelter = async (shelterId, decision) => {
    if (!confirm(`Are you sure you want to set shelter verification status to: ${decision}?`)) return;
    try {
      const res = await authFetch(`/api/admin/shelters/${shelterId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ status: decision })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Shelter registration set to ${decision.toLowerCase()} successfully.`);
        fetchAdminData();
      } else {
        alert(data.message || 'Error processing request');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Warning: Deleting a user will permanently clear their account details. Continue?')) return;
    try {
      const res = await authFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('User profile deleted.');
        fetchAdminData();
      } else {
        alert(data.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await authFetch('/api/admin/report-generate');
      const data = await res.json();
      if (data.success) {
        setReportText(data.reportText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield style={{ color: 'var(--secondary)' }} /> Admin Controls
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Global administrative metrics and validation logs.</p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', gap: '6px' }}
        >
          <Printer size={16} /> Compile Platform Report
        </button>
      </div>

      {/* Metrics breakdown widgets */}
      {analytics && (
        <div className="analytics-grid" style={{ marginBottom: '32px' }}>
          <MetricCard
            title="Total Users"
            value={analytics.users.total}
            icon={Users}
            description={`${analytics.users.normalUsers} regular, ${analytics.users.shelters} shelters`}
          />
          <MetricCard
            title="Active Rescues"
            value={analytics.rescues.active}
            icon={Activity}
            description={`Pending: ${analytics.rescues.pending} reported`}
          />
          <MetricCard
            title="Adoptions Pending"
            value={analytics.adoptions.pending}
            icon={Heart}
            description={`Approved so far: ${analytics.adoptions.approved}`}
          />
          <MetricCard
            title="Registered Animals"
            value={analytics.animals.total}
            icon={Globe}
            description={`Recovered: ${analytics.animals.healthStatuses.Recovered + analytics.animals.healthStatuses.AvailableForAdoption + analytics.animals.healthStatuses.Adopted}`}
          />
        </div>
      )}

      {/* Tab controls */}
      <div className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('shelters_queue')}
          className="btn"
          style={{
            fontSize: '0.8rem',
            padding: '8px 16px',
            backgroundColor: activeTab === 'shelters_queue' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'shelters_queue' ? 'var(--text-inverse)' : 'var(--text-main)'
          }}
        >
          Approvals Queue ({pendingShelters.length})
        </button>
        <button
          onClick={() => setActiveTab('users_list')}
          className="btn"
          style={{
            fontSize: '0.8rem',
            padding: '8px 16px',
            backgroundColor: activeTab === 'users_list' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'users_list' ? 'var(--text-inverse)' : 'var(--text-main)'
          }}
        >
          User Accounts Directory ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('shelters_list')}
          className="btn"
          style={{
            fontSize: '0.8rem',
            padding: '8px 16px',
            backgroundColor: activeTab === 'shelters_list' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'shelters_list' ? 'var(--text-inverse)' : 'var(--text-main)'
          }}
        >
          Shelters Registry ({shelters.length})
        </button>
      </div>

      {/* Core panels */}
      <div>
        {/* TAB: Approvals Queue */}
        {activeTab === 'shelters_queue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Pending Verification Requests</h3>
            
            {loading ? (
              <div>Loading queue...</div>
            ) : pendingShelters.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Check size={36} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                <p>All shelter verification queues are cleared!</p>
              </div>
            ) : (
              pendingShelters.map(sh => (
                <div key={sh.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'white' }}>{sh.shelterName}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>Address: <strong>{sh.address}</strong></span>
                      <span>License ID: <strong>{sh.licenseNumber}</strong></span>
                      <span>Contact Officer: {sh.userId?.name} ({sh.userId?.email} • {sh.userId?.phone})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleVerifyShelter(sh.id, 'Approved')}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '4px' }}
                    >
                      <Check size={14} /> Approve Registration
                    </button>
                    <button
                      onClick={() => handleVerifyShelter(sh.id, 'Rejected')}
                      className="btn btn-danger"
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

        {/* TAB: Users List */}
        {activeTab === 'users_list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>User Accounts Directory</h3>

            <div className="glass-panel" style={{ overflowX: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Name</th>
                    <th style={{ padding: '12px 8px' }}>Email</th>
                    <th style={{ padding: '12px 8px' }}>Phone</th>
                    <th style={{ padding: '12px 8px' }}>Role</th>
                    <th style={{ padding: '12px 8px' }}>Registered Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 8px', color: 'white', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '12px 8px' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>{u.phone}</td>
                      <td style={{ padding: '12px 8px', textTransform: 'capitalize' }}>{u.role}</td>
                      <td style={{ padding: '12px 8px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Shelters List */}
        {activeTab === 'shelters_list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Shelters Registry</h3>

            <div className="glass-panel" style={{ overflowX: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Shelter Name</th>
                    <th style={{ padding: '12px 8px' }}>License Number</th>
                    <th style={{ padding: '12px 8px' }}>Address</th>
                    <th style={{ padding: '12px 8px' }}>Dispatch Radius (KM)</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Owner Details</th>
                  </tr>
                </thead>
                <tbody>
                  {shelters.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 8px', color: 'white', fontWeight: '500' }}>{s.shelterName}</td>
                      <td style={{ padding: '12px 8px' }}>{s.licenseNumber}</td>
                      <td style={{ padding: '12px 8px' }}>{s.address}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>{s.radiusPreferenceKm} KM</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={`status-badge status-${s.status}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{s.userId?.name || 'Unlinked'} ({s.userId?.phone})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Report preformatted popup window modal */}
      {reportText && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '30px', backgroundColor: 'rgba(15, 23, 42, 0.98)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} style={{ color: 'var(--primary)' }} /> Compiled Platform Summary Report
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System generated values</span>
              </div>
              <button
                onClick={() => setReportText(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px',
              maxHeight: '360px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: '#a5f3fc',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4'
              }}>
                {reportText}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reportText);
                  alert('Report copied to clipboard.');
                }}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setReportText(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
