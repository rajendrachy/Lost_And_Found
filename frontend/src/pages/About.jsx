import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Heart, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section style={{ position: 'relative', paddingTop: '10rem', paddingBottom: '6rem', background: '#f8fafc', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid grid-2 items-center" style={{ gap: '4rem' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#eff6ff', borderRadius: '100px', border: '1px solid #dbeafe', marginBottom: '1.5rem' }}>
                <Heart size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)' }}>Our Mission</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Connecting people.<br/>
                <span className="gradient-text">Restoring hope.</span>
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '500px' }}>
                Sajha Khoj was built on a simple belief: that the community is inherently good, and technology can bridge the gap between losing something precious and finding it again.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/images/about_hero.png" alt="Community Network" style={{ width: '100%', maxWidth: '550px', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.08)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>The Story Behind Sajha Khoj</h2>
            
            <div className="card" style={{ padding: '3rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 500 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--text)', fontSize: '1.2rem' }}>Losing something valuable is a universal experience.</strong> Whether it's a wallet with your life's documents, a phone holding precious memories, or a beloved pet that wandered off — the panic is the same.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                In Nepal, when something was lost, the traditional method was relying on local word-of-mouth or pasting paper flyers on telephone poles. While effective in small neighborhoods, it failed in busy cities. There was no centralized, reliable digital platform where good Samaritans could post items they found, or where those who lost items could reach out for help.
              </p>
              <p>
                We built <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Sajha Khoj</span> (Shared Search) to solve this. By harnessing the power of community and modern web technology, we've created a dedicated space where strangers help strangers, and lost belongings find their way back home.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══ */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">Our Core Values</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>The principles that guide everything we build.</p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {[
              { icon: <Globe size={28} />, title: 'Radical Accessibility', desc: 'Helping someone shouldn\'t be hard. Our platform is completely free to use, without any hidden premium features or paywalls.' },
              { icon: <Shield size={28} />, title: 'Uncompromising Privacy', desc: 'We protect our users. From secure data encryption to masking phone numbers, your safety dictates our engineering decisions.' },
              { icon: <Users size={28} />, title: 'Community Driven', desc: 'We are just the infrastructure; the real heroes are the everyday people taking time out of their day to report what they found.' }
            ].map((value, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', height: '100%' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1.5rem' }}>
                    {value.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text)' }}>{value.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '6rem 1.5rem', background: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Be Part of the Solution</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Whether you've lost something or found something, your action matters. Join the community today.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Join Sajha Khoj <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default About;
