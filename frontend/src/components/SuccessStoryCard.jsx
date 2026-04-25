import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Quote, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { formatTimeAgo } from '../utils/timeUtils';

const SuccessStoryCard = ({ item, index }) => {
  // Determine finder and owner names
  let finderName = 'Anonymous Hero';
  let ownerName = 'Verified Owner';
  
  if (item.type === 'found') {
    finderName = item.poster?.name || 'A Finder';
    // The owner is the one who claimed it, but if we don't have that easily, 
    // we can use a generic "Community Member" or find the approved claim
    ownerName = item.claims?.find(c => c.status === 'approved')?.user?.name || 'Community Member';
  } else {
    ownerName = item.poster?.name || 'An Owner';
    finderName = item.returnedBy?.name || 'A Finder';
  }

  const finderAvatar = finderName.charAt(0).toUpperCase();
  const storyText = item.resolutionStory || `Successfully reunited ${item.title} with its owner at ${item.location}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card success-story-card"
      style={{
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '24px'
      }}
    >
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
        <Heart size={120} color="var(--primary)" fill="var(--primary)" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #60a5fa, #2563eb)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(37,99,235,0.2)'
          }}>
            {finderAvatar}
          </div>
          <div style={{ 
            position: 'absolute', 
            bottom: '-4px', 
            right: '-4px', 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            background: '#22c55e', 
            border: '3px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Heart size={10} fill="white" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={12} /> Reunited By
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{finderName}</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem', flex: 1 }}>
        <Quote size={24} style={{ position: 'absolute', top: -5, left: -10, color: '#e2e8f0', zIndex: 0 }} />
        <p style={{ 
          color: 'var(--text-muted)', 
          fontWeight: 500, 
          lineHeight: 1.7, 
          fontSize: '0.95rem', 
          position: 'relative', 
          zIndex: 1,
          fontStyle: 'italic'
        }}>
          "{storyText}"
        </p>
      </div>

      <div style={{ 
        paddingTop: '1.5rem', 
        borderTop: '1px dashed #e2e8f0', 
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="#64748b" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>
             <Clock size={12} /> {formatTimeAgo(item.updatedAt || item.createdAt)}
          </div>
        </div>
        
        <div style={{ 
          background: '#f8fafc', 
          padding: '0.75rem 1rem', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Returned To</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>{ownerName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Item</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>{item.title}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessStoryCard;
