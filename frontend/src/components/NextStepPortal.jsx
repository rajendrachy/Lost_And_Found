import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Shield, MessageSquare, Search, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

const NextStepPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [nextStep, setNextStep] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setNextStep(null);
      return;
    }

    // Don't show next step portal for admin users - they have their own dashboard
    if (user.role === 'admin') {
      setNextStep(null);
      return;
    }

    const determineNextStep = async () => {
      try {
        setLoading(true);
        // Don't show if we are on login/register pages
        if (['/login', '/register'].includes(location.pathname)) {
          setNextStep(null);
          return;
        }

        const [resMy, resClaims] = await Promise.all([
          API.get('/items/my'),
          API.get('/items/my-claims')
        ]);
        const myItems = resMy.data;
        const mySubmittedClaims = resClaims.data;

        // 1. Check for pending claims to verify (High Priority - Finder side)
        const itemsWithPendingClaims = myItems.filter(i => i.claims?.some(c => c.status === 'pending') && i.status === 'active');
        if (itemsWithPendingClaims.length > 0) {
          setNextStep({
            id: 'verify',
            title: 'Verify Ownership',
            desc: `${itemsWithPendingClaims.length} people claimed your found item. Review their proof now.`,
            action: 'Review Claims',
            link: '/profile?tab=claims',
            icon: <Shield size={18} />,
            color: '#10b981'
          });
          return;
        }

        // 2. Check for approved claims you submitted (Owner side)
        const approvedClaims = mySubmittedClaims.filter(item => {
           const myClaim = item.claims?.find(c => c.user?._id === user?._id || c.user === user?._id);
           return myClaim?.status === 'approved' && !item.confirmedByOwner;
        });

        if (approvedClaims.length > 0) {
           const item = approvedClaims[0];
           setNextStep({
             id: 'coordinate',
             title: 'Claim Approved!',
             desc: `The finder approved your claim for ${item.title}. Contact them and confirm receipt.`,
             action: 'Coordinate Return',
             link: `/item/${item._id}`,
             icon: <CheckCircle size={18} />,
             color: '#10b981'
           });
           return;
        }

        // 2. Check for recent active reports with no claims yet
        const activeReports = myItems.filter(i => i.status === 'active' && i.claims?.length === 0);
        if (activeReports.length > 0) {
           const latestReport = activeReports[0];
           if (latestReport.type === 'lost') {
              setNextStep({
                id: 'search',
                title: 'Find Your Item',
                desc: `You reported a lost ${latestReport.title}. Search the database for matches!`,
                action: 'Search Matches',
                link: '/explore',
                icon: <Search size={18} />,
                color: '#ef4444'
              });
           } else {
              setNextStep({
                id: 'wait',
                title: 'Wait for Owners',
                desc: `Your found ${latestReport.title} is live. We'll notify you of any claims.`,
                action: 'View Report',
                link: `/item/${latestReport._id}`,
                icon: <Clock size={18} />,
                color: '#10b981'
              });
           }
           return;
        }

        // 3. Just logged in / No posts?
        if (myItems.length === 0) {
           setNextStep({
             id: 'explore',
             title: 'Start Helping',
             desc: 'New items were reported near you. See if you recognize anything!',
             action: 'Browse Database',
             link: '/explore',
             icon: <Search size={18} />,
             color: '#3b82f6'
           });
           return;
        }

        // 4. Default: Share success or post more
        setNextStep({
            id: 'post',
            title: 'Keep it up!',
            desc: 'Found something else? Reporting it takes less than 60 seconds.',
            action: 'Post New Item',
            link: '/post',
            icon: <Star size={18} />,
            color: '#7c3aed'
        });

      } catch (err) {
        console.error('Failed to determine next step');
      } finally {
        setLoading(false);
      }
    };

    determineNextStep();
  }, [user, location.pathname]);

  if (!nextStep || loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        exit={{ y: 100, x: '-50%', opacity: 0 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          zIndex: 10000, // Boosted z-index
          width: 'calc(100% - 2.5rem)',
          maxWidth: '480px'
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '1.25rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          border: `1.5px solid ${nextStep.color}22`,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          overflow: 'hidden',
          flexWrap: 'wrap' // Allow wrapping on very small screens
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: `${nextStep.color}15`,
            color: nextStep.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {nextStep.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
               <span style={{ fontSize: '0.65rem', fontWeight: 900, color: nextStep.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Task</span>
               <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#e2e8f0' }}></span>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>{new Date().toLocaleDateString()}</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextStep.title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextStep.desc}</p>
          </div>

          <button 
            onClick={() => navigate(nextStep.link)}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              background: nextStep.color,
              borderColor: nextStep.color,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {nextStep.action} <ArrowRight size={16} />
          </button>

          <button 
            onClick={() => setNextStep(null)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              border: 'none',
              background: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NextStepPortal;
