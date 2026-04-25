import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { Search, Filter, MapPin, Tag, Box, ArrowUpDown, Clock, CheckCircle, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';

const categories = ['All', 'Electronics', 'Pets', 'Documents', 'Accessories', 'Keys', 'Bags', 'Others'];

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState(searchParams.get('status') || 'active');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error('Failed to fetch items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filtered = items
    .filter(item => {
      if (!item) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (type !== 'all' && item.type !== type) return false;
      if (category !== 'All' && item.category !== category) return false;
      if (search && !item.title?.toLowerCase().includes(search.toLowerCase()) && !item.location?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: '6rem' }}>
        {/* ═══ ADVANCED HEADER ═══ */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: 'clamp(1.5rem, 5vw, 4rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}></div>
          <div className="container relative">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(1.5rem, 5vw, 4rem)', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 'clamp(36px, 8vw, 44px)', height: 'clamp(36px, 8vw, 44px)', borderRadius: '14px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59,130,246,0.1)' }}>
                    <Search size={22} />
                  </div>
                  <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1 }}>Explore <br /><span style={{ color: '#3b82f6' }}>Database</span></h1>
                </div>
                <p style={{ color: '#64748b', fontWeight: 500, fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', maxWidth: '500px', lineHeight: 1.6 }}>
                  Access our secure repository of reported items. Use advanced filters to narrow down results and find exactly what you need.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                 <div style={{ background: '#f1f5f9', padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                   <div style={{ marginBottom: '1.5rem' }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Global Search</label>
                     <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
                       <MapPin size={18} style={{ margin: '0 1rem', color: '#cbd5e1' }} />
                       <input 
                         type="text" 
                         placeholder="What are you looking for?" 
                         value={search} 
                         onChange={e => setSearch(e.target.value)}
                         style={{ flex: 1, border: 'none', outline: 'none', padding: '0.75rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', background: 'transparent' }} 
                       />
                     </div>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 140px', minWidth: '120px' }}>
                         <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Sort Order</label>
                         <select value={sort} onChange={e => setSort(e.target.value)} className="form-input" style={{ borderRadius: '14px', padding: '0.85rem', width: '100%' }}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                         </select>
                      </div>
                      <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '0.85rem 2rem', borderRadius: '14px' }}>Apply</button>
                   </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="container" style={{ padding: 'clamp(1.5rem, 4vw, 4rem) 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
            
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <button 
                onClick={() => setShowFilters(!showFilters)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
                  borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white',
                  fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', width: '100%', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'} ({filtered.length})
              </button>
            )}

            {/* Sidebar Filters */}
            {(!isMobile || showFilters) && (
              <aside style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? '0' : '7rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', border: '1px solid #e2e8f0', background: 'white' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Filter size={18} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>Advanced Filters</h3>
                   </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Status */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', display: 'block', marginBottom: '1.25rem' }}>Availability</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {[
                          { id: 'active', label: 'Active Reports', icon: <Clock size={16} /> },
                          { id: 'resolved', label: 'Resolved Cases', icon: <CheckCircle size={16} /> },
                          { id: 'all', label: 'Everything', icon: <Box size={16} /> }
                        ].map(s => (
                          <button key={s.id} onClick={() => setStatus(s.id)} style={{ 
                             textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '14px', border: '1.5px solid',
                             borderColor: status === s.id ? '#3b82f6' : '#f1f5f9',
                             background: status === s.id ? '#eff6ff' : 'white',
                             color: status === s.id ? '#1e40af' : '#64748b',
                             fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s'
                          }}>
                            {s.icon} {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', display: 'block', marginBottom: '1.25rem' }}>Item Type</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                         {['all', 'lost', 'found'].map(t => (
                           <button key={t} onClick={() => setType(t)} style={{ 
                              padding: '1rem', borderRadius: '14px', border: '1.5px solid',
                              borderColor: type === t ? '#0f172a' : '#f1f5f9',
                              background: type === t ? '#0f172a' : 'white',
                              color: type === t ? 'white' : '#64748b',
                              fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', gridColumn: t === 'all' ? 'span 2' : 'span 1', transition: 'all 0.2s'
                           }}>
                              {t.toUpperCase()}
                           </button>
                         ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', display: 'block', marginBottom: '1.25rem' }}>Category</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                         {categories.map(cat => (
                           <button key={cat} onClick={() => setCategory(cat)} style={{ 
                              padding: '0.65rem 1rem', borderRadius: '100px', border: '1.5px solid',
                              borderColor: category === cat ? '#3b82f6' : '#f1f5f9',
                              background: category === cat ? '#3b82f6' : 'white',
                              color: category === cat ? 'white' : '#64748b',
                              fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                           }}>
                              {cat}
                           </button>
                         ))}
                      </div>
                    </div>
                 </div>
</motion.div>
              </aside>
            )}

            {/* Main Content Area */}
            <main>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                 <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', fontWeight: 800, color: '#0f172a' }}>
                    {filtered.length} <span style={{ color: '#94a3b8', fontWeight: 600 }}>{filtered.length === 1 ? 'Report' : 'Reports'} Found</span>
                 </div>
              </div>

              {!user ? (
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 'clamp(2rem, 8vw, 5rem) 1.5rem', textAlign: 'center', border: '1px solid #fee2e2', background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 'clamp(56px, 15vw, 84px)', height: 'clamp(56px, 15vw, 84px)', borderRadius: '28px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 25px rgba(239,68,68,0.15)' }}>
                       <Shield size={isMobile ? 28 : 40} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', fontWeight: 900, color: '#991b1b', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Security Handshake Required</h2>
                    <p style={{ color: '#b91c1c', fontWeight: 500, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '450px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                       Access to the community database is restricted to verified members. Please sign in to search items and view recovery details.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                       <button className="btn btn-primary btn-lg" style={{ background: '#ef4444', borderColor: '#ef4444', padding: '1rem 2rem' }} onClick={() => navigate('/login')}>Login to Continue</button>
                       <button className="btn btn-outline btn-lg" style={{ borderColor: '#fecaca', color: '#ef4444', padding: '1rem 2rem' }} onClick={() => navigate('/register')}>Create Account</button>
                    </div>
                 </motion.div>
              ) : (
                <>
                  {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} style={{ height: 400, background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9' }}></div>
                       ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="card" style={{ padding: 'clamp(2rem, 8vw, 6rem) 1.5rem', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                       <Box size={isMobile ? 40 : 64} style={{ color: '#e2e8f0', marginBottom: '1.5rem' }} />
                       <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.5rem)', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>No results found</h3>
                       <p style={{ color: '#94a3b8', fontWeight: 600 }}>Try clearing your filters or searching for something else.</p>
                       <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => { setSearch(''); setType('all'); setCategory('All'); setStatus('active'); }}>Clear All Filters</button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      <AnimatePresence mode="popLayout">
                        {filtered.map((item) => (
                          <ItemCard key={item._id} item={item} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
