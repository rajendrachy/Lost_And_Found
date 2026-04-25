import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, MapPin, EyeOff, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Safety = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section style={{ position: 'relative', paddingTop: '10rem', paddingBottom: '6rem', background: 'var(--text)', color: 'white', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.1))', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid grid-2 items-center" style={{ gap: '4rem' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}>
                <ShieldCheck size={16} color="#60a5fa" />
                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#60a5fa' }}>Trust & Safety Center</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Your security is our <br/><span style={{ color: '#60a5fa' }}>highest priority.</span>
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '500px' }}>
                We've built Sajha Khoj with privacy and safety at its core. Follow these guidelines to ensure every exchange is secure, transparent, and successful.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => { document.getElementById('guidelines').scrollIntoView({ behavior: 'smooth' }) }}>
                Read Guidelines
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/images/safety_hero.png" alt="Safety and Trust" style={{ width: '100%', maxWidth: '500px', filter: 'drop-shadow(0 30px 40px rgba(37,99,235,0.3))' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ GUIDELINES ═══ */}
      <section id="guidelines" className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">The 4 Golden Rules of Exchange</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Please adhere to these rules when meeting someone to return or claim an item.</p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {[
              { icon: <MapPin size={28} />, title: 'Meet in Public Spaces', desc: 'Always arrange to meet the other party in a well-lit, busy public location such as a coffee shop, mall, or near a local police station. Never go to a secluded area or someone\'s private home.' },
              { icon: <EyeOff size={28} />, title: 'Protect Your Identity', desc: 'Only share necessary information. Do not share your home address, financial information, or sensitive documents. Our platform allows you to hide your phone number until you choose to reveal it.' },
              { icon: <CheckCircle size={28} />, title: 'Verify the Item', desc: 'If you lost an item, ask the finder to describe a specific detail that isn\'t visible in the photo before meeting them to ensure they actually have it (e.g., a specific scratch, or what\'s inside the wallet).' },
              { icon: <AlertTriangle size={28} />, title: 'Beware of Scams', desc: 'Sajha Khoj is completely free. If someone demands money, a "reward fee", or an advance payment before returning your item, report them immediately and do not proceed.' }
            ].map((rule, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                <div className="card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                    {rule.icon}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text)' }}>{rule.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 500, fontSize: '1rem' }}>{rule.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REPORTING BANNER ═══ */}
      <section style={{ padding: '4rem 1.5rem', background: '#fef2f2' }}>
        <div className="container">
          <div className="card" style={{ background: 'white', border: '1px solid #fecaca', padding: '3rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
              <Info size={40} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#991b1b', marginBottom: '0.5rem' }}>See something suspicious?</h3>
              <p style={{ color: '#b91c1c', fontWeight: 500, lineHeight: 1.6 }}>
                If a user violates our safety guidelines or makes you feel uncomfortable, please cease communication immediately and report the incident to our moderation team.
              </p>
            </div>
            <div>
              <button className="btn" style={{ background: '#ef4444', color: 'white' }}>Report an Issue</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Safety;
