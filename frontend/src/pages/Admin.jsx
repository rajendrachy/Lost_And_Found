import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import { 
  Users, Box, Trash2, Search, ArrowLeft, ShieldCheck, CheckCircle, MapPin, AlertTriangle,
  Menu, X, RefreshCw, AlertCircle, TrendingUp, LogOut
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportDrawer, setReportDrawer] = useState(null);
  const [stats, setStats] = useState({ users: 0, items: 0, resolved: 0 });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, itemsRes, reportsRes] = await Promise.all([
        API.get('/admin/stats').catch(() => ({ data: { users: 0, items: 0, resolved: 0 } })),
        API.get('/admin/users').catch(() => ({ data: [] })),
        API.get('/admin/items').catch(() => ({ data: [] })),
        API.get('/reports').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
      setReports(reportsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user and all their items?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch { alert('Failed to delete'); }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await API.delete(`/admin/items/${id}`);
        setItems(items.filter(i => i._id !== id));
      } catch { alert('Failed to delete'); }
    }
  };

  const handleReportAction = async (id, status) => {
    try {
      await API.put(`/reports/${id}/status`, { status });
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
      setReportDrawer(null);
    } catch { alert('Failed'); }
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredItems = items.filter(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'items', label: 'Items', icon: '📦' },
    { id: 'reports', label: 'Reports', icon: '🚨', badge: pendingReports },
  ];

  const StatCard = ({ title, value, change, icon, gradient, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {change && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', background: '#d1fae5', padding: '0.25rem 0.5rem', borderRadius: 9999 }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginTop: '0.25rem' }}>{title}</div>
    </motion.div>
  );

  const UserCard = ({ u }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      style={{ background: 'white', borderRadius: 12, padding: '1rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${u.role === 'admin' ? '#1e40af' : '#3b82f6'}, ${u.role === 'admin' ? '#1e3a8a' : '#2563eb'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem', flexShrink: 0 }}>
        {u.name?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111827' }}>{u.name}</div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
      </div>
      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 600, background: u.role === 'admin' ? '#1f2937' : '#f3f4f6', color: u.role === 'admin' ? 'white' : '#4b5563' }}>
        {u.role}
      </span>
      <button onClick={() => handleDeleteUser(u._id)} disabled={u.role === 'admin'} 
        style={{ padding: '0.5rem', borderRadius: 8, background: u.role === 'admin' ? '#f3f4f6' : '#fee2e2', border: 'none', color: u.role === 'admin' ? '#9ca3af' : '#ef4444', cursor: u.role === 'admin' ? 'not-allowed' : 'pointer' }}>
        <Trash2 size={18} />
      </button>
    </motion.div>
  );

  const ItemCard = ({ i }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      style={{ background: 'white', borderRadius: 12, padding: '1rem', border: '1px solid #e5e7eb', display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ width: 64, height: 64, borderRadius: 10, background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
        {i.image ? <img src={i.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Box size={24} color="#9ca3af" style={{ margin: 20 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, background: i.type === 'lost' ? '#fee2e2' : '#d1fae5', color: i.type === 'lost' ? '#dc2626' : '#059669' }}>{i.type}</span>
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, background: i.status === 'resolved' ? '#d1fae5' : '#fef3c7', color: i.status === 'resolved' ? '#059669' : '#d97706' }}>{i.status}</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.title}</div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><MapPin size={12} /> {i.location}</div>
      </div>
      <button onClick={() => handleDeleteItem(i._id)} style={{ padding: '0.5rem', borderRadius: 8, background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', alignSelf: 'center' }}>
        <Trash2 size={18} />
      </button>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Mobile Menu */}
      <motion.div initial={{ x: -300 }} animate={{ x: mobileMenuOpen ? 0 : -300 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, bottom: 0, left: 0, width: '80%', maxWidth: 280, background: '#111827', zIndex: 200, padding: '1.5rem', display: mobileMenuOpen ? 'block' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} color="#3b82f6" />
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); setSearchQuery(''); }} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: 10, border: 'none',
              background: activeTab === tab.id ? '#1f2937' : 'transparent', color: activeTab === tab.id ? '#60a5fa' : '#d1d5db',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem',
            }}>
              <span>{tab.icon}</span> {tab.label}
              {tab.badge > 0 && <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '0.1rem 0.4rem', borderRadius: 9999, fontSize: '0.7rem' }}>{tab.badge}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate('/'); }} style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', borderRadius: 10, border: 'none', background: '#374151', color: '#d1d5db', fontWeight: 600, cursor: 'pointer' }}>
          <LogOut size={18} /> Logout
        </button>
      </motion.div>
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />}

      {/* Report Modal */}
      {reportDrawer && (
        <>
          <div onClick={() => setReportDrawer(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '24px 24px 0 0', padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto', zIndex: 301 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Report Details</h3>
              <button onClick={() => setReportDrawer(null)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <span style={{ padding: '0.25rem 0.6rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, background: '#fef3c7', color: '#d97706', marginBottom: '0.75rem', display: 'inline-block' }}>{reportDrawer.category}</span>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>{reportDrawer.subject}</h4>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, background: '#f3f4f6', padding: '1rem', borderRadius: 10, marginBottom: '1rem' }}>{reportDrawer.message}</p>
            {reportDrawer.status === 'pending' && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => handleReportAction(reportDrawer._id, 'resolved')} style={{ flex: 1, padding: '0.875rem', borderRadius: 10, border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', padding: '0.5rem', borderRadius: 8, background: '#f3f4f6', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} color="#4b5563" />
          </button>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>{navItems.find(n => n.id === activeTab)?.label}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Online</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }} style={{
              padding: '0.75rem 1.25rem', borderRadius: 10, border: 'none',
              background: activeTab === tab.id ? '#1f2937' : 'white', color: activeTab === tab.id ? 'white' : '#4b5563',
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
            }}>
              <span>{tab.icon}</span> {tab.label}
              {tab.badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.4rem', borderRadius: 9999, fontSize: '0.7rem' }}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'overview' && (
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', background: 'white' }} />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <RefreshCw size={32} color="#3b82f6" className="animate-spin" />
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Welcome back</div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Dashboard Overview</h2>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Manage your platform from here</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
                      <TrendingUp size={24} color="#10b981" />
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>+12%</div>
                      <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>This week</div>
                    </div>
                  </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StatCard title="Total Users" value={stats.users} change="+3" icon={<Users size={22} color="white" />} gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)" />
                  <StatCard title="Active Items" value={stats.items} change="+8" icon={<Box size={22} color="white" />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
                  <StatCard title="Resolved" value={stats.resolved} change="+5" icon={<CheckCircle size={22} color="white" />} gradient="linear-gradient(135deg, #10b981, #059669)" />
                  <StatCard title="Pending Reports" value={pendingReports} icon={<AlertTriangle size={22} color="white" />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Activity</h3>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Past 7 days</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={[{d:'Mon',u:12,i:8},{d:'Tue',u:19,i:12},{d:'Wed',u:15,i:10},{d:'Thu',u:25,i:18},{d:'Fri',u:22,i:15},{d:'Sat',u:30,i:20},{d:'Sun',u:28,i:22}]}>
                        <defs><linearGradient id="c1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="u" stroke="#3b82f6" strokeWidth={2} fill="url(#c1)" name="Users" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Item Types</h3>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Distribution</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={[{n:'Lost',v:items.filter(i=>i.type==='lost').length||45},{n:'Found',v:items.filter(i=>i.type==='found').length||55}]} innerRadius={50} outerRadius={80} dataKey="v">
                          <Cell fill="#ef4444" /><Cell fill="#10b981" />
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div>
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No users found</div>
                ) : (
                  filteredUsers.map(u => <UserCard key={u._id} u={u} />)
                )}
              </div>
            )}

            {/* ITEMS */}
            {activeTab === 'items' && (
              <div>
                {filteredItems.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No items found</div>
                ) : (
                  filteredItems.map(i => <ItemCard key={i._id} i={i} />)
                )}
              </div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <div>
                {reports.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No reports found</div>
                ) : (
                  reports.map(r => (
                    <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      style={{ background: 'white', borderRadius: 12, padding: '1rem', border: '1px solid #e5e7eb', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{r.subject}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.message?.substring(0, 100)}...</div>
                        </div>
                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>{r.category}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 600, background: r.status === 'pending' ? '#fee2e2' : '#d1fae5', color: r.status === 'pending' ? '#dc2626' : '#059669' }}>{r.status}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setReportDrawer(r)} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: '#f3f4f6', border: 'none', color: '#4b5563', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>View</button>
                          {r.status === 'pending' && <button onClick={() => handleReportAction(r._id, 'resolved')} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: '#10b981', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Resolve</button>}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; } @media (max-width: 1024px) { .admin-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 768px) { header button { display: block !important; } .desktop-grid { display: none !important; } }`}</style>
    </div>
  );
};

export default Admin;