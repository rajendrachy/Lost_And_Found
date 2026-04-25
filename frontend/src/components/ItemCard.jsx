import React from 'react';
import { MapPin, Clock, ArrowRight, Shield, Zap, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeUtils';

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const imgSrc = item?.image || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=800&q=80';

  if (!item) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
        <img 
          src={imgSrc} 
          alt={item.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' }}></div>
        
        {/* Badges */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '0.5rem 0.85rem', 
            borderRadius: '12px', 
            background: item.type === 'lost' ? '#ef4444' : '#10b981', 
            color: 'white', 
            fontSize: '0.65rem', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Zap size={10} fill="white" /> {item.type}
          </span>
          
          {item.status === 'resolved' && (
            <span style={{ 
              padding: '0.5rem 0.85rem', 
              borderRadius: '12px', 
              background: 'white', 
              color: '#10b981', 
              fontSize: '0.65rem', 
              fontWeight: 900, 
              boxShadow: '0 8px 15px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle size={10} fill="#10b981" color="white" /> RESOLVED
            </span>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
           <span style={{ 
              padding: '0.4rem 0.75rem', 
              borderRadius: '100px', 
              background: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800
           }}>
             {formatTimeAgo(item.createdAt || item.date)}
           </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
           <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</div>
           {item.status === 'active' && <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>}
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.2, height: '2.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {item.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
             <MapPin size={16} color="#94a3b8" /> {item.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
             <Clock size={16} color="#94a3b8" /> {new Date(item.date).toLocaleDateString()}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
           {!user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.7rem', fontWeight: 900, marginBottom: '1rem', background: '#fff1f2', padding: '0.6rem', borderRadius: '10px' }}>
                 <Shield size={14} /> SECURITY CLEARANCE REQUIRED
              </div>
           ) : null}
           
           <button 
             onClick={() => {
                if (!user) {
                   navigate('/explore');
                   return;
                }
                navigate(`/item/${item._id}`);
             }}
             style={{ 
                width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                background: user ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#f1f5f9',
                color: user ? 'white' : '#94a3b8',
                fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
             }}
           >
              {user ? (
                <>View Recovery Details <ArrowRight size={18} /></>
              ) : (
                <>Login to View <Search size={16} /></>
              )}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
