import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { 
  Shield, Search, Clock, Heart, Star, Users, Award, 
  Zap, CheckCircle, MapPin, Instagram, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhyChoose = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: React.createElement(Shield, { size: 32 }),
      title: 'Verified Community',
      desc: 'Every member is verified through phone & email. No fake accounts or anonymity.',
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    {
      icon: React.createElement(Search, { size: 32 }),
      title: 'Smart Search',
      desc: 'Find items instantly with our AI-powered search. Filter by location, category, date & more.',
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      icon: React.createElement(Clock, { size: 32 }),
      title: 'Real-Time Alerts',
      desc: 'Get instant notifications when items matching your search are posted. Never miss a match.',
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      icon: React.createElement(Heart, { size: 32 }),
      title: 'Proven Track Record',
      desc: '5000+ successful reunions. Our community has helped thousands reconnect with their belongings.',
      color: '#ef4444',
      bg: '#fef2f2'
    },
    {
      icon: React.createElement(Star, { size: 32 }),
      title: 'Earn Rewards',
      desc: 'Post a found item with a reward. Finders get recognized, owners recover faster.',
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      icon: React.createElement(Users, { size: 32 }),
      title: 'Trusted Platform',
      desc: 'Rated by thousands of users. Build your reputation by helping others.',
      color: '#06b6d4',
      bg: '#cffafe'
    }
  ];

  const comparisons = [
    { facebook: 'Posts get buried in feeds within hours', sajha: 'Items stay visible until matched' },
    { facebook: 'No search = endless scrolling', sajha: 'Smart filters find matches instantly' },
    { facebook: 'Random people with no verification', sajha: 'Every user is phone-verified' },
    { facebook: 'No tracking of posts', sajha: 'Full history & notifications' },
    { facebook: 'Messaged by everyone', sajha: 'Structured claim system' },
    { facebook: 'No accountability', sajha: 'Rating & reputation system' }
  ];

  const stats = [
    { value: '5,000+', label: 'Items Reunited' },
    { value: '12,000+', label: 'Active Users' },
    { value: '98%', label: 'Success Rate' },
    { value: '24hrs', label: 'Avg. Recovery Time' }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#eff6ff', borderRadius: '100px', border: '1px solid #dbeafe', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#3b82f6' }}>Why Sajha Khoj</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, color: '#0f172a' }}>
              Why Choose <span style={{ color: '#3b82f6' }}>Sajha Khoj</span> Over Facebook Groups?
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2rem' }}>
              Thousands have already switched. Here's why our community is the smarter choice for recovering lost items.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/explore')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
                Browse Items <Search size={18} />
              </button>
              <button onClick={() => navigate('/register')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                Join Community
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ background: '#0f172a', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
              The Sajha Khoj Advantage
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Built specifically for lost & found - not a social network repurposed.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: benefit.bg, color: benefit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{benefit.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'white', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
              Sajha Khoj vs Facebook Groups
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {comparisons.map((comp, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Instagram size={20} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{comp.facebook}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Zap size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>{comp.sajha}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
            Ready to Find What You've Lost?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2rem' }}>
            Join thousands who trust Sajfa Khoj to help recover their precious items.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/explore')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
              Explore Database <Search size={18} />
            </button>
            <button onClick={() => navigate('/post')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
              Post Item <Send size={18} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default WhyChoose;