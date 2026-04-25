import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, User, LogOut, ShieldCheck, LayoutDashboard, Package, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationPanel from './NotificationPanel';
import API from '../api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch count');
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon"><Search size={22} /></div>
          <span className="navbar-logo-text">Sajha<span>Khoj</span></span>
        </Link>

        <div className="navbar-links hidden-mobile">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore Items</Link>
          <Link to="/safety">Safety Tips</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/post')}>
            <PlusCircle size={16} />
            <span className="hidden-mobile">Post Item</span>
          </button>

          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setUnreadCount(0); // Reset visual count when opened
                  }}
                  style={{ 
                    border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', 
                    padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', position: 'relative'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ 
                        position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', 
                        background: '#ef4444', color: 'white', borderRadius: '50%', 
                        fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', border: '2px solid white'
                      }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <NotificationPanel onClose={() => setShowNotifications(false)} />
                  )}
                </AnimatePresence>
              </div>

              {user.role === 'admin' && (
                <button className="btn btn-outline btn-sm hidden-mobile" onClick={() => navigate('/admin')}>
                  <ShieldCheck size={16} /> Admin
                </button>
              )}
              
              <div 
                ref={dropdownRef}
                className="navbar-avatar-container" 
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="navbar-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <User size={18} />
                  )}
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ 
                        position: 'absolute', top: '100%', right: 0, width: '220px', 
                        background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', 
                        padding: '1rem', zIndex: 100, border: '1px solid var(--border-light)',
                        marginTop: '0.75rem'
                      }}
                    >
                      <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <button className="dropdown-item" onClick={() => navigate('/profile')}>
                          <LayoutDashboard size={16} /> My Dashboard
                        </button>
                        <button className="dropdown-item" onClick={() => navigate('/post')}>
                          <Package size={16} /> Report Item
                        </button>
                        <button className="dropdown-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
