import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell, LogOut, User, Menu, X, Shield, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    await markAsRead(notif._id);
    setShowNotifications(false);
    
    // Redirect based on notification relation if applicable
    if (notif.type === 'Rescue') {
      if (user.role === 'shelter') {
        navigate('/shelter-dashboard');
      } else if (user.role === 'user') {
        navigate('/user-dashboard');
      }
    } else if (notif.type === 'Adoption') {
      if (user.role === 'shelter') {
        navigate('/shelter-dashboard');
      } else if (user.role === 'user') {
        navigate('/profile');
      }
    } else if (notif.type === 'Verification') {
      navigate('/profile');
    }
  };

  const activeStyle = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: '0', zIndex: '100', padding: '12px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🐾 FaunaRescue
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <NavLink to="/" className={activeStyle} end>Home</NavLink>
          <NavLink to="/adoptions" className={activeStyle}>Adopt</NavLink>

          {user && user.role === 'user' && (
            <NavLink to="/user-dashboard" className={activeStyle}>Dashboard</NavLink>
          )}

          {user && user.role === 'shelter' && (
            <NavLink to="/shelter-dashboard" className={activeStyle}>Shelter Panel</NavLink>
          )}

          {user && user.role === 'admin' && (
            <NavLink to="/admin-dashboard" className={activeStyle}>Admin Panel</NavLink>
          )}

          {user && (
            <NavLink to="/profile" className={activeStyle}>My Profile</NavLink>
          )}
        </div>

        {/* Notification Bell & Profile Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', position: 'relative', padding: '6px' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: '200',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.98)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Notifications Log</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No notifications logged.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: notif.isRead ? 'transparent' : 'rgba(255,255,255,0.03)',
                          borderLeft: notif.isRead ? '2px solid transparent' : '2px solid var(--primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'var(--transition-smooth)'
                        }}
                        className="notif-item-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                          <span style={{ color: notif.isRead ? 'var(--text-main)' : 'white' }}>{notif.title}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineBreak: 'anywhere' }}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Profile Avatar / Sign In link */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.8rem' }} className="desktop-links">
                <span style={{ fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {user.name}
                  {user.role === 'admin' && <Shield size={12} style={{ color: 'var(--secondary)' }} />}
                  {user.role === 'shelter' && <Award size={12} style={{ color: 'var(--primary)' }} />}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role === 'shelter' ? `${user.role} (${user.shelter?.status || 'Pending'})` : user.role}
                </span>
              </div>
              <Link to="/profile" style={{ display: 'flex' }}>
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="avatar"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
                  />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border-color)', color: 'var(--primary)' }}>
                    <User size={18} />
                  </div>
                )}
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Register</Link>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {showMobileMenu && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', padding: '12px 0', borderTop: '1px solid var(--border-color)' }} className="mobile-menu-links">
          <Link to="/" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Home</Link>
          <Link to="/adoptions" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Adopt</Link>
          {user && user.role === 'user' && (
            <Link to="/user-dashboard" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link>
          )}
          {user && user.role === 'shelter' && (
            <Link to="/shelter-dashboard" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Shelter Dashboard</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin-dashboard" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Admin Panel</Link>
          )}
          {user && (
            <Link to="/profile" onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>My Profile</Link>
          )}
        </div>
      )}

      {/* Embed media/screen query helper directly in CSS styles below for responsive nav toggle */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        .notif-item-hover:hover {
          background-color: rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
