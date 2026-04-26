import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Box, Trash2, Search, 
  ArrowLeft, Activity, ShieldCheck, CheckCircle, MapPin, AlertTriangle,
  Menu, X, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const Admin = () => {
  const { user } = useAuth();
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
  const [error, setError] = useState(null);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const [statsRes, usersRes, itemsRes, reportsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/items'),
        API.get('/reports')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch { alert('Failed'); }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await API.delete(`/admin/items/${id}`);
        setItems(items.filter(i => i._id !== id));
      } catch { alert('Failed'); }
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
  const filteredItems = items.filter(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase()) || i.category?.toLowerCase().includes(searchQuery.toLowerCase()));

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'items', label: 'Items' },
    { id: 'reports', label: 'Reports' },
  ];

  const StatCard = ({ title, value, change, icon, gradient }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
      background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: gradient, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        {change && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: 100 }}>{change}</span>}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{title}</div>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'fixed', top: 0, bottom: 0, width: '85%', maxWidth: '300px', background: '#0f172a', padding: '1.5rem', zIndex: 201 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color="white" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Admin</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 12, border: 'none',
                    background: activeTab === tab.id ? 'rgba(59,130,246,0.2)' : 'transparent', color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
                    fontWeight: activeTab === tab.id ? 800 : 500, cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem',
                  }}>{tab.label}</button>
                ))}
              </nav>
              <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} 
                style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                <ArrowLeft size={18} /> Back to Site
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {reportDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} onClick={() => setReportDrawer(null)} />
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '24px 24px 0 0', padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto', zIndex: 301 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Report Details</h3>
                <button onClick={() => setReportDrawer(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <span style={{ padding: '0.25rem 0.6rem', borderRadius: 100, fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', marginBottom: '1rem' }}>{reportDrawer.category?.toUpperCase()}</span>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>{reportDrawer.subject}</h4>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, marginBottom: '1rem' }}>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>{reportDrawer.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {reportDrawer.status === 'pending' && (
                  <>
                    <button onClick={() => handleReportAction(reportDrawer._id, 'reviewed')} 
                      style={{ flex: 1, padding: '1rem', borderRadius: 12, border: 'none', background: '#fef3c7', color: '#d97706', fontWeight: 800, cursor: 'pointer' }}>Mark Reviewed</button>
                    <button onClick={() => handleReportAction(reportDrawer._id, 'resolved')} 
                      style={{ flex: 1, padding: '1rem', borderRadius: 12, border: 'none', background: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer' }}>Resolve</button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setMobileMenuOpen(true)} style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu size={20} color="#475569" />
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Admin Panel</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{navItems.find(n => n.id === activeTab)?.label}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}></div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22c55e' }}>Active</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '5rem 1rem 2rem 1rem' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {navItems.map(tab => (
            <motion.button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }} whileTap={{ scale: 0.95 }} style={{
              padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid', borderColor: activeTab === tab.id ? '#3b82f6' : '#e2e8f0',
              background: activeTab === tab.id ? '#eff6ff' : 'white', color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === tab.id ? 800 : 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {tab.label}
              {tab.id === 'reports' && reports.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 6, background: '#ef4444', color: 'white', padding: '0.1rem 0.4rem', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900 }}>
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'overview' && (
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <RefreshCw size={32} color="#3b82f6" className="animate-spin" />
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#fef2f2', borderRadius: 16 }}>
            <AlertCircle size={48} color="#ef4444" />
            <h3 style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</h3>
            <button onClick={fetchData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Retry</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome Banner */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Welcome back, Admin</div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Dashboard Overview</h2>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Here's what's happening with your platform</p>
                    </div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#22c55e' }}>+12%</div><div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>This Week</div></div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StatCard title="Total Users" value={stats.users} change="+3" icon={<Users size={22} />} gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" />
                  <StatCard title="Active Items" value={stats.items} change="+8" icon={<Box size={22} />} gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
                  <StatCard title="Resolved" value={stats.resolved} change="+5" icon={<CheckCircle size={22} />} gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                  <StatCard title="Pending Reports" value={reports.filter(r => r.status === 'pending').length} icon={<AlertTriangle size={22} />} gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* Activity Chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
                    style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Activity Overview</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Past 7 days</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={[{day:'Mon',users:12,items:8},{day:'Tue',users:19,items:12},{day:'Wed',users:15,items:10},{day:'Thu',users:25,items:18},{day:'Fri',users:22,items:15},{day:'Sat',users:30,items:20},{day:'Sun',users:28,items:22}]}>
                        <defs>
                          <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                          <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fill="url(#gu)" name="Users" />
                        <Area type="monotone" dataKey="items" stroke="#f59e0b" strokeWidth={3} fill="url(#gi)" name="Items" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Pie Chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
                    style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Item Distribution</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Lost vs Found</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={[{name:'Lost',value:items.filter(i=>i.type==='lost').length||45},{name:'Found',value:items.filter(i=>i.type==='found').length||55}]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                          <Cell fill="#ef4444" /><Cell fill="#10b981" />
                        </Pie>
                        <Tooltip />
                        <Legend formatter={v => <span style={{ color: '#64748b', fontSize: 12 }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
                  style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Weekly Resolution</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Posts vs Resolved</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[{name:'Mon',posts:8,resolved:5},{name:'Tue',posts:12,resolved:9},{name:'Wed',posts:10,resolved:7},{name:'Thu',posts:18,resolved:14},{name:'Fri',posts:15,resolved:11},{name:'Sat',posts:20,resolved:16},{name:'Sun',posts:22,resolved:18}]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="posts" fill="#3b82f6" radius={[6,6,0,0]} name="Posts" />
                      <Bar dataKey="resolved" fill="#10b981" radius={[6,6,0,0]} name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Quick Actions */}
                <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[{id:'users',l:'Manage Users',c:users.length},{id:'items',l:'Moderate Items',c:items.length},{id:'reports',l:'Reports',c:reports.filter(r=>r.status==='pending').length,h:true},{id:'logs',l:'View Logs',c:0}].map(item => (
                    <motion.button key={item.id} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(item.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: 14, border: '1px solid', borderColor: item.h&&item.c>0?'#ef4444':'#e2e8f0',
                      background: item.h&&item.c>0?'#fef2f2':'white', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.l}</div>
                        {item.c > 0 && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{item.c} items</div>}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredUsers.map(u => (
                  <motion.div key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#3b82f6', fontSize: '1.25rem' }}>
                      {u.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                      <span style={{ marginTop: '0.5rem', padding: '0.2rem 0.5rem', borderRadius: 100, fontSize: '0.65rem', background: u.role==='admin'?'#0f172a':'#f1f5f9', color: u.role==='admin'?'white':'#475569' }}>{u.role}</span>
                    </div>
                    <button onClick={() => handleDeleteUser(u._id)} disabled={u.role==='admin'} 
                      style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', border: 'none', color: '#ef4444', cursor: u.role==='admin'?'not-allowed':'pointer', opacity: u.role==='admin'?0.3:1 }}>
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
                {filteredUsers.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No users found</div>}
              </div>
            )}

            {/* ITEMS TAB */}
            {activeTab === 'items' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredItems.map(i => (
                  <motion.div key={i._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                      {i.image ? <img src={i.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Box size={24} color="#94a3b8" style={{ margin: 18 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: 100, fontSize: '0.65rem', background: i.type==='lost'?'#fef2f2':'#ecfdf5', color: i.type==='lost'?'#dc2626':'#16a34a' }}>{i.type}</span>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: 100, fontSize: '0.65rem', background: i.status==='resolved'?'#ecfdf5':'#fef3c7', color: i.status==='resolved'?'#16a34a':'#d97706' }}>{i.status}</span>
                      </div>
                      <div style={{ fontWeight: 800 }}>{i.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> {i.location}</div>
                    </div>
                    <button onClick={() => handleDeleteItem(i._id)} style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', alignSelf: 'center' }}>
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
                {filteredItems.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No items found</div>}
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map(r => (
                  <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1, marginRight: '0.5rem' }}>
                        <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{r.subject}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>{r.message?.length > 80 ? r.message.substring(0, 80) + '...' : r.message}</div>
                      </div>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: 100, fontSize: '0.6rem', background: '#fef3c7', color: '#d97706' }}>{r.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: 100, fontSize: '0.65rem', background: r.status==='pending'?'#fef2f2':'#ecfdf5', color: r.status==='pending'?'#dc2626':'#16a34a' }}>{r.status}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setReportDrawer(r)} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: '#f1f5f9', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>View</button>
                        {r.status === 'pending' && <button onClick={() => handleReportAction(r._id, 'resolved')} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: '#10b981', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Resolve</button>}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {reports.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No reports found</div>}
              </div>
            )}

          </motion.div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

export default Admin;