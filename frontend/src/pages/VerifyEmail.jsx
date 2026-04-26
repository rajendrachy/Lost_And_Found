import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        setVerified(true);
      } catch (err) {
        setError(err.response?.data?.msg || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '3rem', maxWidth: '480px', margin: '1rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertCircle size={40} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>Verification Failed</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
          <Link to="/register" className="btn btn-primary">
            Create New Account
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '3rem', maxWidth: '480px', margin: '1rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={40} color="#059669" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>Email Verified!</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Your email has been verified successfully. You can now login to your account.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          Go to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;