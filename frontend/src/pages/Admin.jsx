import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Box, Trash2, Search, 
  ArrowLeft, Activity, ShieldCheck, CheckCircle, MapPin 
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({ users: 0, items: 0, resolved: 0 });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await API.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'items') {
        const res = await API.get('/admin/items');
        setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user and all their items?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/admin/items/${id}`);
        setItems(items.filter(i => i._id !== id));
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      
      {/* ═══ PRO SIDEBAR ═══ */}
      <aside style={{ width: '280px', background: '#020617', color: 'white', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
              <ShieldCheck size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1 }}>Control</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Center</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem 1rem', flex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginBottom: '1.25rem', paddingLeft: '1rem' }}>Principal</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { id: 'overview', icon: <LayoutDashboard size={19} />, label: 'System Overview' },
              { id: 'users', icon: <Users size={19} />, label: 'User Directory' },
              { id: 'items', icon: <Box size={19} />, label: 'Item Archives' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '14px', 
                  border: 'none', background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent', 
                  color: activeTab === tab.id ? '#60a5fa' : '#94a3b8', 
                  fontWeight: activeTab === tab.id ? 800 : 500, cursor: 'pointer', 
                  transition: 'all 0.25s', textAlign: 'left' 
                }}
              >
                <span style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="active-pill" style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />}
              </button>
            ))}
          </nav>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2rem 1rem' }}></div>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginBottom: '1.25rem', paddingLeft: '1rem' }}>Resources</div>
          <button 
            onClick={() => setActiveTab('logs')} 
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '14px', 
              border: 'none', background: activeTab === 'logs' ? 'rgba(59,130,246,0.1)' : 'transparent', 
              color: activeTab === 'logs' ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' 
            }}
          >
             <Activity size={18} /> System Logs
          </button>
        </div>

        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Live Site
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, padding: '2.5rem 3.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Administrator Hub</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {activeTab === 'overview' && 'Global Insights'}
              {activeTab === 'users' && 'Manage Citizens'}
              {activeTab === 'items' && 'Moderation Queue'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {activeTab !== 'overview' && (
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '260px', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} 
                />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.4)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>Healthy</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}><div className="spinner"></div></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-3" style={{ gap: '2rem', marginBottom: '3rem' }}>
                  {[
                    { label: 'Total Members', value: stats.users, icon: <Users size={24} />, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Live Reports', value: stats.items, icon: <Box size={24} />, color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Resolved Cases', value: stats.resolved, icon: <CheckCircle size={24} />, color: '#10b981', bg: '#ecfdf5' },
                  ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.label}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
                      </div>
                      <div style={{ width: 60, height: 60, borderRadius: 16, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.icon}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-12" style={{ gap: '2rem' }}>
                  <div className="col-span-8">
                    <div className="card" style={{ padding: '2rem' }}>
                      <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem' }}>System Performance</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                          { label: 'Server Response', value: '98%', progress: 98, color: '#3b82f6' },
                          { label: 'DB Connectivity', value: '100%', progress: 100, color: '#10b981' },
                          { label: 'Storage Used', value: '14%', progress: 14, color: '#f59e0b' },
                        ].map((p, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{p.label}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: p.color }}>{p.value}</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', background: p.color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="card" style={{ padding: '2rem', background: '#0f172a', color: 'white' }}>
                      <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Notifications</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                          { title: 'New Admin Seeded', time: '1 hour ago' },
                          { title: 'Database Optimized', time: '4 hours ago' },
                          { title: 'System Backup Done', time: '12 hours ago' },
                        ].map((n, i) => (
                          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }}></div>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{n.title}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{n.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>User Profile</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>Permissions</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>Status</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900, textAlign: 'right' }}>Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                          <td style={{ padding: '1.25rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', overflow: 'hidden' }}>
                                {u.avatar ? <img src={u.avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : u.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{u.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, background: u.role === 'admin' ? '#0f172a' : '#f1f5f9', color: u.role === 'admin' ? 'white' : '#475569' }}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></div>
                               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Active</span>
                             </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                            <button 
                              onClick={() => handleDeleteUser(u._id)} 
                              disabled={u.role === 'admin'} 
                              style={{ 
                                background: 'transparent', color: '#ef4444', border: '1.5px solid #fee2e2', 
                                padding: '0.6rem', borderRadius: '10px', cursor: u.role === 'admin' ? 'not-allowed' : 'pointer', 
                                opacity: u.role === 'admin' ? 0.3 : 1, transition: 'all 0.2s' 
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>No users found matching your search.</div>
                  )}
                </div>
              </div>
            )}

            {/* ITEMS TAB */}
            {activeTab === 'items' && (
              <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>Item Details</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>Type & Category</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>Moderation Status</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: 900, textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(i => (
                        <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1.25rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                              <div style={{ width: 50, height: 50, borderRadius: '12px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                {i.image ? <img src={i.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Box size={20} color="#94a3b8" style={{ margin: '15px' }} />}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{i.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}><MapPin size={12} inline /> {i.location}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span style={{ fontWeight: 800, color: i.type === 'lost' ? '#ef4444' : '#10b981', fontSize: '0.75rem', textTransform: 'uppercase' }}>{i.type}</span>
                              <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{i.category}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, background: i.status === 'resolved' ? '#f0fdf4' : '#f8fafc', color: i.status === 'resolved' ? '#10b981' : '#64748b', border: '1px solid currentColor', borderOpacity: 0.2 }}>
                              {i.status === 'resolved' ? 'PUBLISHED (REUNITED)' : 'PENDING REVIEW'}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                            <button onClick={() => handleDeleteItem(i._id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredItems.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>No reports found.</div>
                  )}
                </div>
              </div>
            )}

            {/* LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Audit Trail</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>System-wide events and security logs.</p>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => alert('Logs exported to CSV')}>Export Logs</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { event: 'User Registration', detail: 'anish@gmail.com joined', time: '2 mins ago', type: 'info' },
                    { event: 'Security Alert', detail: 'Failed login attempt from IP 192.168.1.1', time: '15 mins ago', type: 'warning' },
                    { event: 'Database Sync', detail: 'Automatic backup successful', time: '1 hour ago', type: 'success' },
                    { event: 'Item Removed', detail: 'Admin deleted report ID #9822', time: '3 hours ago', type: 'danger' },
                    { event: 'Server Reboot', detail: 'System maintenance completed', time: '12 hours ago', type: 'info' },
                    { event: 'API Key Rotated', detail: 'Cloudinary credentials updated', time: '1 day ago', type: 'success' },
                  ].map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ 
                        width: 10, height: 10, borderRadius: '50%', 
                        background: log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : log.type === 'danger' ? '#ef4444' : '#3b82f6' 
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{log.event}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{log.time}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{log.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
