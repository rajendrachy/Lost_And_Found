import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userData = await login(email, password);
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
            Welcome back to the community.
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Thousands of items are recovered every month. Log in to check your active reports or help someone find what they've lost.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex' }}>
              {['A', 'P', 'R'].map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: ['#3b82f6', '#ec4899', '#f59e0b'][i], border: '2px solid rgba(255,255,255,0.2)', marginLeft: i > 0 ? '-10px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 900 }}>
                  {c}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
              Join 5,000+ verified members
            </div>
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
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to access your account.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="form-input-icon" />
                <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="name@example.com" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="form-input-icon" />
                <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••" className="form-input" style={{ background: 'white' }} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem', padding: '1.25rem' }}>
              {isSubmitting ? 'Authenticating...' : 'Sign In to Account'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one for free</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
