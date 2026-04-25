import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  User, Mail, Phone, LogOut, Package, CheckCircle, 
  Clock, Trash2, Activity, Shield, Box, FileText, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

const VerificationDesk = () => {
  const { user, refreshUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get('/items/my');
        // Only show items with claims
        setItems(res.data.filter(i => i.claims?.length > 0));
      } catch (err) {
        console.error('Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const handleVerify = async (itemId, claimId) => {
    if (!window.confirm('Are you sure you want to approve this claim? This will resolve the report and share your contact details with the owner.')) return;
    setProcessing(claimId);
    try {
      await API.post(`/items/${itemId}/verify`, { claimId });
      // Refresh list
      const res = await API.get('/items/my');
      setItems(res.data.filter(i => i.claims?.length > 0));
      refreshUser();
      alert('Verification Successful! The item is now marked as Resolved and the owner has been notified.');
    } catch (err) {
      alert('Verification failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '0 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.75rem)', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>Verification Desk</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Compare proof of ownership and verify the rightful owner.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} color="#3b82f6" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af' }}>Secure Verification</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#cbd5e1' }}>
            <Shield size={40} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>No pending verifications</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '340px', margin: '0 auto', lineHeight: 1.6 }}>When someone claims an item you've found, their request and proof will appear here for your review.</p>
        </div>
      ) : (
        items.map(item => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={item._id} className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
               <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <img src={item.image} style={{ width: 56, height: 56, borderRadius: '12px', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} alt="" />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.category}</span>
                    </div>
                  </div>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{item.claims.filter(c => c.status === 'pending').length}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Claims</div>
               </div>
            </div>

            <div style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* TIPS / ADVICE */}
                <div style={{ padding: '1rem 1.25rem', background: '#fffbeb', borderRadius: '14px', border: '1px solid #fef3c7', display: 'flex', gap: '1rem' }}>
                  <div style={{ color: '#d97706', marginTop: '0.2rem' }}><Shield size={20} /></div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#92400e', marginBottom: '0.25rem' }}>Verification Checklist</div>
                    <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, lineHeight: 1.5 }}>
                      Does the message mention unique marks, contents, or passwords? Only approve if you are certain.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {item.claims.map(claim => (
                    <div key={claim._id} style={{ 
                      padding: '1.5rem', 
                      borderRadius: '20px', 
                      background: claim.status === 'approved' ? '#f0fdf4' : 'white', 
                      border: claim.status === 'approved' ? '2px solid #22c55e' : '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900 }}>
                                {claim.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{claim.user?.name || 'Verified User'}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>{new Date(claim.createdAt).toLocaleDateString()}</div>
                              </div>
                          </div>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Proof Message</div>
                          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9', color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                            "{claim.message}"
                          </div>
                        </div>
                        
                        {claim.status === 'pending' && item.status === 'active' && (
                          <button 
                              onClick={() => handleVerify(item._id, claim._id)} 
                              disabled={processing === claim._id}
                              className="btn btn-primary" 
                              style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '0.85rem' }}
                          >
                              {processing === claim._id ? 'Synchronizing...' : 'Approve & Reveal Identity'}
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

const SecuritySection = () => {
  const { changePassword } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({ type: 'error', msg: 'New passwords do not match' });
    }
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setStatus({ type: 'success', msg: 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
          <Shield size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Security & Privacy</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Manage your account security.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required placeholder="••••••••" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button type="submit" disabled={loading} className="btn btn-outline btn-block-mobile" style={{ padding: '0.8rem 2.5rem', borderColor: '#e2e8f0' }}>
            {loading ? 'Processing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const { user, logout, updateAvatar, updateUserData, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'active';
  
  const [activeTab, setActiveTab] = useState(initialTab); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeTab !== 'settings' && activeTab !== 'claims') {
      const fetchMyItems = async () => {
        try {
          const res = await API.get('/items/my');
          setItems(res.data);
        } catch (err) {
          console.error('Failed to fetch items');
        } finally {
          setLoading(false);
        }
      };
      fetchMyItems();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUserData(editData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.patch(`/items/${id}/status`);
      setItems(items.map(i => i._id === id ? res.data : i));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await updateAvatar(file);
      alert('Avatar updated successfully!');
    } catch (err) {
      alert('Failed to update avatar');
    } finally {
      setUploading(false);
    }
  };

  const filtered = (items || []).filter(p => p.status === activeTab);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <Navbar />

      {/* ═══ PERSONAL BANNER ═══ */}
      <section style={{ 
        minHeight: '260px', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
             <div style={{ position: 'relative' }}>
                <div style={{ width: 'clamp(90px, 25vw, 120px)', height: 'clamp(90px, 25vw, 120px)', borderRadius: '32px', border: '5px solid rgba(255,255,255,0.1)', background: 'white', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  {user?.avatar ? (
                    <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <User size={48} />
                    </div>
                  )}
                </div>
                <label style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: 40, height: 40, background: '#3b82f6', borderRadius: '14px', border: '4px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
                  {uploading ? <div className="spinner" style={{ width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent' }}></div> : <Activity size={18} />}
                  <input type="file" hidden onChange={handleAvatarChange} disabled={uploading} />
                </label>
             </div>
             <div style={{ color: 'white', flex: 1, minWidth: '280px' }}>
               <h1 style={{ 
                 fontSize: 'clamp(1.75rem, 8vw, 2.75rem)', 
                 fontWeight: 900, 
                 marginBottom: '0.5rem', 
                 letterSpacing: '-0.03em',
                 textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                 lineHeight: 1.1
               }}>
                 Welcome back, <span style={{ color: '#60a5fa' }}>{user?.name?.split(' ')[0] || 'User'}!</span>
               </h1>
               <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9, flexWrap: 'wrap' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {user?.email}</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={16} /> Verified Member</span>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* LEFT CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {/* STATS */}
             <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Community Impact</h3>
                   <div style={{ padding: '0.4rem 0.8rem', background: '#f0f9ff', color: '#0369a1', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>Level {(user?.rating || 0) > 5 ? 'Veteran' : 'Rookie'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{user?.reputationPoints || 0}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Hero Points</div>
                   </div>
                   <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{user?.totalResolved || 0}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Resolved</div>
                   </div>
                </div>
             </div>

             {/* NAVIGATION */}
             <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   {[
                     { id: 'active', label: 'Active Reports', icon: <Activity size={18} /> },
                     { id: 'resolved', label: 'Success Stories', icon: <CheckCircle size={18} /> },
                     { id: 'claims', label: 'Verification Desk', icon: <Shield size={18} /> },
                     { id: 'settings', label: 'Account Security', icon: <Package size={18} /> },
                   ].map(t => (
                     <button 
                       key={t.id}
                       onClick={() => setActiveTab(t.id)}
                       style={{ 
                         width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', 
                         borderRadius: '16px', border: 'none', background: activeTab === t.id ? '#eff6ff' : 'transparent',
                         color: activeTab === t.id ? '#3b82f6' : '#64748b', fontWeight: activeTab === t.id ? 800 : 600,
                         cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem'
                       }}
                     >
                       {t.icon} {t.label}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* RIGHT CONTENT */}
          <div style={{ gridColumn: 'span 2' }}>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
                {activeTab === 'claims' ? (
                  <VerificationDesk />
                ) : activeTab === 'settings' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                       <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Personal Identity</h2>
                       <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Update your profile information and contact details.</p>
                       <form onSubmit={handleUpdateProfile}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="form-group">
                               <label className="form-label">Display Name</label>
                               <input type="text" className="form-input" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                               <label className="form-label">Phone Reference</label>
                               <input type="text" className="form-input" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                            </div>
                         </div>
                         <button type="submit" disabled={isUpdating} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                            {isUpdating ? 'Synchronizing...' : 'Update Identity'}
                         </button>
                       </form>
                    </div>
                    <SecuritySection />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{activeTab === 'active' ? 'Live Reports' : 'Resolved Cases'}</h2>
                     </div>

                     {loading ? <div className="spinner"></div> : filtered.length === 0 ? (
                        <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                           <Box size={48} style={{ color: '#e2e8f0', marginBottom: '1.5rem' }} />
                           <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#94a3b8' }}>No items found</h3>
                        </div>
                     ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                           {filtered.map(post => (
                             <motion.div key={post._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                   <img src={post.image} style={{ width: 64, height: 64, borderRadius: '16px', objectFit: 'cover' }} alt="" />
                                   <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: post.type === 'lost' ? '#ef4444' : '#10b981' }}>{post.type.toUpperCase()}</div>
                                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{post.title}</h4>
                                   </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                   <button onClick={() => navigate(`/item/${post._id}`)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>View</button>
                                   {activeTab === 'active' && (
                                     <>
                                       {post.type === 'lost' ? (
                                         <button onClick={() => handleToggleStatus(post._id)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Resolve</button>
                                       ) : (
                                         <button onClick={() => setActiveTab('claims')} className="btn btn-primary btn-sm" style={{ flex: 1, background: '#10b981', borderColor: '#10b981' }}>Manage Claims</button>
                                       )}
                                       <button onClick={() => handleDelete(post._id)} style={{ padding: '0.5rem', borderRadius: '8px', background: '#fee2e2', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                                     </>
                                   )}
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     )}
                  </div>
                )}
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
