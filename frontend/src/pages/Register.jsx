import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userData = await register(formData);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      // handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-split-left hidden-mobile">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Search size={24} /></div>
          <span className="auth-logo-text">Sajha<span style={{ color: '#60a5fa' }}>Khoj</span></span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="auth-split-content">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
            Join the movement. Find what matters.
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Create a free account to report lost items, notify owners of found items, and communicate securely within our trusted network.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { title: 'Community Driven', desc: 'Thousands of users looking out for each other.' },
              { title: 'Secure & Private', desc: 'Your contact details are hidden until you share them.' },
              { title: '100% Free Forever', desc: 'No hidden fees. Just people helping people.' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <ShieldCheck size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="auth-split-right">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="auth-form-container">
          <div className="show-mobile" style={{ marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Search size={20} /></div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)' }}>Sajha<span style={{ color: 'var(--primary)' }}>Khoj</span></span>
            </Link>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the largest lost and found community.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={16} className="form-input-icon" />
                <input type="text" required value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="form-input-icon" />
                <input type="email" required value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@example.com" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div className="relative">
                <Phone size={16} className="form-input-icon" />
                <input type="text" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+977 98XXXXXXXX" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="form-input-icon" />
                <input type="password" required value={formData.password} onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min. 6 characters" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem', padding: '1.25rem' }}>
              {isSubmitting ? 'Creating Account...' : 'Create Free Account'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
