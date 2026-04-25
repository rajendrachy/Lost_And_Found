import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { Search, Shield, Zap, Heart, MapPin, FileText, CheckCircle, ArrowRight, ChevronRight, Star, Users, Clock, Eye, Quote } from 'lucide-react';
import SuccessStoryCard from '../components/SuccessStoryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const categories = [
  { name: 'Electronics', icon: '📱', color: '#3b82f6' },
  { name: 'Pets', icon: '🐕', color: '#f59e0b' },
  { name: 'Documents', icon: '📄', color: '#ef4444' },
  { name: 'Accessories', icon: '👜', color: '#8b5cf6' },
  { name: 'Keys', icon: '🔑', color: '#22c55e' },
  { name: 'Bags', icon: '🎒', color: '#ec4899' },
];

const testimonials = [
  { name: 'Anish Sharma', text: 'I lost my laptop bag near Thamel and posted here. Within 2 hours, someone contacted me — they found it at a nearby café. Incredible!', avatar: 'A' },
  { name: 'Priya Thapa', text: 'My golden retriever went missing. This platform connected me with the person who found her within a day. Forever grateful!', avatar: 'P' },
  { name: 'Rajesh KC', text: 'Lost my citizenship certificate and was panicking. A kind soul found it and reached out through Sajha Khoj. Best community ever.', avatar: 'R' },
];

function Home() {
  const [activeTab, setActiveTab] = useState('lost');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

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
    .filter(item => item.status === 'active') // ONLY ACTIVE IN FEED
    .filter(item => item.type === activeTab)
    .filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase()))
    .filter(item => !selectedCategory || item.category === selectedCategory);

  const resolvedItems = items.filter(item => item.status === 'resolved').slice(0, 3);

  return (
    <div style={{ background: 'white' }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ paddingBottom: '4rem' }}>
        <div className="hero-bg"></div>
        <div className="container">
          <div className="grid grid-2 items-center" style={{ gap: '4rem' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                <span className="hero-badge-text">Nepal's #1 Lost & Found Platform</span>
              </div>

              <h1 className="hero-title" style={{ textAlign: 'left' }}>
                Lose it. Post it.<br />
                <span className="gradient-text">Find it together.</span>
              </h1>

              <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
                We connect people who've lost items with those who've found them. Join thousands of Nepalis making a difference every day.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/post')}>
                  <FileText size={18} /> Report an Item
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => { document.getElementById('feed-section').scrollIntoView({ behavior: 'smooth' }) }}>
                  Browse Items <ChevronRight size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex' }}>
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map((c, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 900 }}>
                        {['A', 'P', 'R', 'S'][i]}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>5,000+ users</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>4.9 rating</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden-mobile">
              <img src="/images/premium_hero.png" alt="Lost and Found Community" style={{ width: '100%', borderRadius: '32px', boxShadow: '0 30px 60px rgba(37,99,235,0.12)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ background: 'var(--text)', padding: '2.5rem 1.5rem' }}>
        <div className="container">
          <div className="stats-grid" style={{ maxWidth: '100%' }}>
            {[
              { icon: <Search size={18} />, label: 'Active Reports', value: items.filter(i => i.status === 'active').length || '0' },
              { icon: <Users size={18} />, label: 'Community Members', value: '5,000+' },
              { icon: <Eye size={18} />, label: 'Items Found', value: items.filter(i => i.type === 'found').length || '0' },
              { icon: <Heart size={18} />, label: 'Successfully Reunited', value: items.filter(i => i.status === 'resolved').length || '0' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} style={{ textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>{stat.value}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="hero-badge" style={{ margin: '0 auto 1.5rem' }}>
              <span className="hero-badge-text">Simple Process</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>How Sajha Khoj Works</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, maxWidth: '500px', margin: '0 auto 4rem' }}>Three simple steps to reunite with your belongings</p>
          </motion.div>

          <div className="grid grid-3" style={{ gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { step: '01', icon: <FileText size={28} />, title: 'Report', desc: 'Post details about your lost or found item with photos and location.' },
              { step: '02', icon: <Search size={28} />, title: 'Discover', desc: 'Browse the feed or get notified when a matching item is reported.' },
              { step: '03', icon: <CheckCircle size={28} />, title: 'Reunite', desc: 'Connect with the finder/owner securely and get your item back.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 * i }}>
                <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>STEP {item.step}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 25px rgba(37,99,235,0.25)' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Browse by Category</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Find items faster by browsing specific categories</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            {categories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
                <div
                  className="card"
                  onClick={() => { setSelectedCategory(selectedCategory === cat.name ? '' : cat.name); document.getElementById('feed-section').scrollIntoView({ behavior: 'smooth' }); }}
                  style={{ padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', border: selectedCategory === cat.name ? `2px solid ${cat.color}` : undefined }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text)' }}>{cat.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ITEM FEED ═══ */}
      <section className="section" id="feed-section" style={{ background: 'white' }}>
        <div className="container">
          <div className="flex items-end justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title">Recent Reports</h2>
              <p className="section-subtitle">
                {selectedCategory ? `Showing: ${selectedCategory}` : 'All categories'}
                {selectedCategory && <button onClick={() => setSelectedCategory('')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginLeft: '0.75rem', fontSize: '0.85rem' }}>Clear filter</button>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: 10, border: '1px solid var(--border-light)', fontFamily: 'Outfit', fontWeight: 500, fontSize: '0.85rem', width: 180, outline: 'none' }} />
              </div>
              <div className="tabs">
                <button className={`tab ${activeTab === 'lost' ? 'tab-active' : ''}`} onClick={() => setActiveTab('lost')}>Lost</button>
                <button className={`tab ${activeTab === 'found' ? 'tab-active' : ''}`} onClick={() => setActiveTab('found')}>Found</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : filtered.length === 0 ? (
            <div className="card empty-state">
              <Search size={48} />
              <h3>No {activeTab} items {selectedCategory ? `in ${selectedCategory}` : ''}</h3>
              <p>Be the first to report a {activeTab} item!</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/post')}>Post Item</button>
            </div>
          ) : (
            <div className="grid grid-3" style={{ gap: '2rem' }}>
              <AnimatePresence mode="wait">
                {filtered.slice(0, 6).map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ═══ SUCCESS STORIES SECTION ═══ */}
      {resolvedItems.length > 0 && (
        <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(180deg, #f0fdf4 0%, transparent 100%)', pointerEvents: 'none' }}></div>
          <div className="container" style={{ position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="hero-badge" style={{ margin: '0 auto 1.25rem', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
                <Heart size={12} fill="#166534" style={{ marginRight: '0.25rem' }} />
                <span className="hero-badge-text" style={{ color: '#166534' }}>Recent Success Histories</span>
              </div>
              <h2 className="section-title">The Joy of Reunion</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500, maxWidth: '600px', margin: '0.5rem auto 0' }}>
                Every item returned is a story of honesty and community strength. Here are some of our latest heartwarming reunions.
              </p>
            </div>

            <div className="grid grid-3" style={{ gap: '2.5rem' }}>
               {resolvedItems.map((item, i) => (
                 <SuccessStoryCard key={item._id} item={item} index={i} />
               ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
               <button className="btn btn-outline" onClick={() => navigate('/explore')} style={{ background: 'white', borderColor: '#22c55e', color: '#166534', padding: '1rem 2rem' }}>
                 <Heart size={18} style={{ marginRight: '0.5rem' }} /> View All Success Stories <ArrowRight size={18} />
               </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section section-dark">
        <div className="container text-center">
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Loved by the Community</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '3rem' }}>Real stories from real people who found what they were looking for</p>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, fontSize: '0.95rem', flex: 1, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Member</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>Lost something today?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>Don't worry — post it now and let the community help you find it.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-lg" onClick={() => navigate('/post')} style={{ background: 'white', color: 'var(--primary)', fontWeight: 900, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                <FileText size={18} /> Report Now <ArrowRight size={18} />
              </button>
              <button className="btn btn-lg" onClick={() => navigate('/register')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                Join Community
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="flex items-center gap-3">
                <div className="navbar-logo-icon"><Search size={22} /></div>
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>Sajha<span style={{ color: '#60a5fa' }}>Khoj</span></span>
              </div>
              <p>Reuniting people with their lost belongings through technology and trust. Built with ❤️ in Nepal.</p>
            </div>
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: '1rem' }}>Platform</div>
                <div className="footer-links" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="/">Home</a>
                  <a href="/post">Report Item</a>
                  <a href="/register">Sign Up</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: '1rem' }}>Legal</div>
                <div className="footer-links" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Sajha Khoj. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
