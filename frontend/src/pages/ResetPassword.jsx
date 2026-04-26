import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password');
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Password Reset!</h1>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Your password has been reset successfully.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-lg btn-block">
              Go to Login
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
            Create new password.
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Enter a new secure password for your account.
          </p>
        </motion.div>
      </div>
      
      <div className="auth-split-right">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="auth-form-container">
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="auth-title">New Password</h1>
            <p className="auth-subtitle">Enter your new password below.</p>
          </div>

          {error && <div className="alert alert-error"><AlertCircle size={16} style={{ marginRight: '8px' }} />{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="relative">
                <Lock size={16} className="form-input-icon" />
                <input 
                  type="password" 
                  required 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="form-input" 
                  style={{ background: 'white' }} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="form-input-icon" />
                <input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="form-input" 
                  style={{ background: 'white' }} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem', padding: '1.25rem' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;