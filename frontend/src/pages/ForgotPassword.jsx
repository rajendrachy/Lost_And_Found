import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Search, Unlock, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-split">
        <div className="auth-split-right" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-form-container">
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={40} color="#059669" />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Check Your Email</h1>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Click the link in the email to reset your password. The link expires in 1 hour.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-lg btn-block">
              Back to Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-split">
      <div className="auth-split-left hidden-mobile">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Search size={24} /></div>
          <span className="auth-logo-text">Sajha<span style={{ color: '#60a5fa' }}>Khoj</span></span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="auth-split-content">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
            Reset your password.
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Enter your email and we'll send you a link to create a new password.
          </p>
        </motion.div>
      </div>
      
      <div className="auth-split-right">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="auth-form-container">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Enter your email to receive a reset link.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="form-input-icon" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="form-input" 
                  style={{ background: 'white' }} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem', padding: '1.25rem' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            Remember your password? <Link to="/login">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;