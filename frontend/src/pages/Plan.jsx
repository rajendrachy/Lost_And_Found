import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Clock, Zap, Shield, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API, { getPlanStatus, requestPlan } from '../api';

const Plan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [planStatus, setPlanStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPlanStatus();
  }, []);

  const fetchPlanStatus = async () => {
    try {
      const res = await getPlanStatus();
      setPlanStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestPlan(message || 'I want to buy the premium plan for unlimited features.');
      setSuccess('Your plan request has been submitted. Admin will contact you soon.');
      fetchPlanStatus();
    } catch (err) {
      setSuccess(err.response?.data?.msg || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const isPremium = planStatus?.isPremium;
  const hasPending = planStatus?.planRequest?.status === 'pending';

  return (
    <div className="page-container">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Crown size={32} style={{ color: '#f59e0b' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)' }}>Premium Plan</h1>
          </div>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '500px', margin: '0 auto' }}>
            Get unlimited access to all features with our premium plan
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: planStatus?.plan === 'free' ? '2px solid #3b82f6' : '2px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Shield size={24} style={{ color: '#3b82f6' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Free Plan</h2>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Rs. 0 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ lifetime</span></div>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>Basic features for casual users</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Items per day', min: 1, max: 12 },
                { label: 'Login per day', min: 1, max: 12 },
                { label: 'Features: Basic item listing', min: '-', max: 'Yes' },
                { label: 'Notifications: Email', min: '-', max: 'Yes' }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{feature.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6' }}>MIN {feature.min} - MAX {feature.max}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Crown size={24} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Premium Plan</h2>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Rs. 200 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ year</span></div>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>Unlimited everything</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Items per day', min: 'UNLIMITED', max: '∞' },
                { label: 'Login per day', min: 'UNLIMITED', max: '∞' },
                { label: 'Features', min: 'All', max: 'Premium' },
{ label: 'Support', min: 'Priority', max: '24/7' }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{feature.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fef3c7' }}>MIN {feature.min} - MAX {feature.max}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {isPremium ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', padding: '2rem', color: 'white', textAlign: 'center' }}>
            <Crown size={48} style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>You are a Premium Member!</h2>
            <p style={{ opacity: 0.9 }}>Your plan is active until {planStatus?.planEndDate ? new Date(planStatus.planEndDate).toLocaleDateString() : 'N/A'}</p>
          </motion.div>
        ) : hasPending ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <Clock size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#92400e' }}>Request Pending</h2>
            <p style={{ opacity: 0.8, marginBottom: '1rem', color: '#92400e' }}>
              Your request was submitted on {planStatus?.planRequest?.requestedAt ? new Date(planStatus.planRequest.requestedAt).toLocaleDateString() : 'N/A'}
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, color: '#b45309' }}>Admin will review your request soon. We'll notify you once approved.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>Request Premium Plan</h3>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>Fill the form below and admin will contact you after payment.</p>
            
            {success && (
              <div className={success.includes('submitted') ? 'alert alert-success' : 'alert alert-error'} style={{ marginBottom: '1rem' }}>
                {success}
              </div>
            )}
            
            <form onSubmit={handleRequest}>
              <div className="form-group">
                <label className="form-label">Your Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us why you want the premium plan..."
                  className="form-input"
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
              
              <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem' }}>
                {submitting ? 'Submitting...' : 'Request Premium Plan'}
                {!submitting && <Zap size={18} />}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Plan;