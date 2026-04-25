import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Clock, User, ArrowLeft, ShieldCheck, Copy, CheckCircle, AlertTriangle, Search, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeUtils';
import API from '../api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showContact, setShowContact] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState('');
  const [showHandshakeForm, setShowHandshakeForm] = useState(false);
  const [resolutionStory, setResolutionStory] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchItem = async () => {
      if (!id) {
        setError("Invalid item ID provided.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await API.get(`/items/${id}`);
        if (isMounted) {
          if (res.data) {
            setItem(res.data);
          } else {
            setError("The item data is empty.");
          }
        }
      } catch (err) {
        console.error("Fetch Item Error:", err);
        if (isMounted) {
          setError(err.response?.data?.msg || "Item not found or server error.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItem();
    return () => { isMounted = false; };
  }, [id]);

  // Defensive calculations
  const { isOwner, approvedClaim, hasClaimed, imgSrc } = useMemo(() => {
    if (!item) return { isOwner: false, approvedClaim: null, hasClaimed: false, imgSrc: '' };

    const posterId = item.poster?._id || item.poster;
    const currentUserId = currentUser?._id;
    
    const owner = currentUserId && posterId && String(currentUserId) === String(posterId);
    
    const approved = item.claims?.find(c => {
      const claimUserId = c?.user?._id || c?.user;
      return claimUserId && currentUserId && String(claimUserId) === String(currentUserId) && c?.status === 'approved';
    }) || null;

    const claimed = item.claims?.some(c => {
      const claimUserId = c?.user?._id || c?.user;
      return claimUserId && currentUserId && String(claimUserId) === String(currentUserId);
    }) || false;

    const image = item.image || (item.type === 'found' 
      ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' 
      : 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=800&q=80');

    return { isOwner: owner, approvedClaim: approved, hasClaimed: claimed, imgSrc: image };
  }, [item, currentUser]);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');
    setIsClaiming(true);
    try {
      await API.post(`/items/${id}/claim`, { message: claimMessage });
      setClaimStatus('Claim submitted successfully! Please wait for verification.');
      // Refresh item data
      const res = await API.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      setClaimStatus(err.response?.data?.msg || 'Failed to submit claim');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleConfirmRecovery = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/items/${id}/confirm-recovery`, { story: resolutionStory });
      alert('Handshake complete! The finder has been awarded Hero Points. Thank you for using Sajha Khoj!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to confirm recovery');
    }
  };

  if (loading) return <div className="loading-page"><Navbar /><div className="spinner"></div></div>;

  if (error || !item) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '10rem', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fef2f2', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
               <AlertTriangle size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>
              {error || "We encountered an error while loading the item details."}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'white' }}>
      <Navbar />

      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
            <ArrowLeft size={18} /> Back
          </button>

          <div className="grid grid-2" style={{ gap: '3rem' }}>
            {/* LEFT COLUMN: IMAGE & META */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative' }}>
              <div className="detail-image" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
                <img src={imgSrc} alt={item?.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <span className={`badge ${item?.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                   {item?.type?.toUpperCase() || 'ITEM'}
                </span>
                {item?.status === 'resolved' && (
                  <span className="badge" style={{ background: '#10b981', color: 'white' }}>RESOLVED</span>
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div className="card" style={{ padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', marginBottom: '0.4rem' }}><MapPin size={16} /></div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Location</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{item?.location || 'Unknown'}</div>
                 </div>
                 <div className="card" style={{ 
                   padding: '1.25rem', 
                   background: item.type === 'lost' ? '#fef2f2' : '#f0fdf4', 
                   border: item.type === 'lost' ? '1px solid #fecaca' : '1px solid #bbf7d0' 
                 }}>
                    <div style={{ color: item.type === 'lost' ? '#ef4444' : '#22c55e', marginBottom: '0.4rem' }}>
                      <Clock size={16} />
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: item.type === 'lost' ? '#f87171' : '#4ade80', textTransform: 'uppercase' }}>
                      Posted {formatTimeAgo(item.createdAt || item.date)}
                    </div>
                    <div style={{ fontWeight: 800, color: item.type === 'lost' ? '#991b1b' : '#166534' }}>
                      {item?.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: CONTENT & ACTIONS */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item?.category || 'General'}</div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.1 }}>{item?.title || 'Untitled Report'}</h1>
                <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>{item?.description}</p>
              </div>

              {/* HANDSHAKE SECTION */}
              {approvedClaim && !item?.confirmedByOwner && (
                <div className="card" style={{ padding: '2rem', background: '#f0fdf4', border: '1px solid #10b981', marginBottom: '2rem' }}>
                   {!showHandshakeForm ? (
                     <button onClick={() => setShowHandshakeForm(true)} className="btn btn-primary btn-block" style={{ background: '#059669', borderColor: '#059669' }}>
                        I've Received My Item (Complete Handshake)
                     </button>
                   ) : (
                     <form onSubmit={handleConfirmRecovery}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1rem' }}>Final Recovery Story</h3>
                        <textarea 
                          className="form-input"
                          placeholder="Tell us how you got it back..."
                          value={resolutionStory}
                          onChange={(e) => setResolutionStory(e.target.value)}
                          required
                          style={{ minHeight: '100px', marginBottom: '1rem', padding: '1rem' }}
                        />
                        <button type="submit" className="btn btn-primary btn-block">Submit & Award Points</button>
                     </form>
                   )}
                </div>
              )}

              {/* SUCCESS STORY DISPLAY */}
              {item?.status === 'resolved' && item?.resolutionStory && (
                <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <CheckCircle size={18} /> Community Success Story
                   </div>
                   <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.9rem' }}>"{item.resolutionStory}"</p>
                </div>
              )}

              {/* CLAIM SYSTEM */}
              {item?.type === 'found' && item?.status === 'active' && !isOwner && !hasClaimed && (
                 <div className="card" style={{ padding: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem' }}>Is this yours?</h3>
                    <form onSubmit={handleClaim}>
                       <textarea 
                         className="form-input" 
                         placeholder="Provide proof of ownership (e.g. unique marks, what's inside, etc.)" 
                         value={claimMessage}
                         onChange={(e) => setClaimMessage(e.target.value)}
                         required
                         style={{ minHeight: '100px', marginBottom: '1rem', padding: '1rem' }}
                       />
                       <button type="submit" disabled={isClaiming} className="btn btn-primary btn-block">
                         {isClaiming ? 'Submitting...' : 'Submit Claim'}
                       </button>
                    </form>
                    {claimStatus && <div style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 700, color: claimStatus.includes('success') ? '#10b981' : '#ef4444' }}>{claimStatus}</div>}
                 </div>
              )}


              {/* PROGRESS TRACKER (FOR OWNER ONLY) */}
              {isOwner && item?.status !== 'resolved' && (
                <div className="card" style={{ padding: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Activity size={18} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Report Lifecycle</h3>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: '2px', background: '#e2e8f0' }}></div>
                      
                      {[
                        { title: 'Report Published', status: 'completed', icon: <CheckCircle size={14} /> },
                        { title: 'Community Matching', status: item?.claims?.length === 0 ? 'active' : 'completed', icon: <Search size={14} /> },
                        { title: 'Identity Verification', status: (item?.claims?.length > 0 && !approvedClaim) ? 'active' : (approvedClaim ? 'completed' : 'upcoming'), icon: <Shield size={14} /> },
                        { title: 'Safe Return & Handshake', status: (approvedClaim && !item.confirmedByOwner) ? 'active' : 'upcoming', icon: <Activity size={14} /> }
                      ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                           <div style={{ 
                             width: 32, height: 32, borderRadius: '50%', 
                             background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? '#3b82f6' : 'white',
                             color: step.status === 'upcoming' ? '#cbd5e1' : 'white',
                             border: step.status === 'upcoming' ? '2px solid #e2e8f0' : 'none',
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             boxShadow: step.status === 'active' ? '0 0 10px rgba(59,130,246,0.3)' : 'none'
                           }}>
                             {step.icon}
                           </div>
                           <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: step.status === 'upcoming' ? '#94a3b8' : '#0f172a' }}>{step.title}</div>
                              {step.status === 'active' && (
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                   <div className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}></div> Current Step
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* CONTACT DETAILS */}
              <div className="card" style={{ padding: '1.5rem', background: 'white', border: '1px solid #e2e8f0' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <User size={20} color="#64748b" />
                    </div>
                    <div>
                       <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{item?.poster?.name || 'Anonymous User'}</div>
                       <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Reporter</div>
                    </div>
                 </div>

                 {!showContact ? (
                   <button 
                    onClick={() => {
                      if (item?.type === 'found' && !isOwner && !approvedClaim) {
                        alert('Contact details are locked until your claim is approved.');
                        return;
                      }
                      setShowContact(true);
                    }} 
                    className="btn btn-primary btn-block"
                   >
                     Show Contact Details
                   </button>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8' }}>PHONE</div>
                            <div style={{ fontWeight: 800 }}>{item?.poster?.phone || 'Not provided'}</div>
                         </div>
                         <button onClick={() => { navigator.clipboard.writeText(item?.poster?.phone || ''); alert('Copied!'); }} style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Copy size={16} /></button>
                      </div>
                      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8' }}>EMAIL</div>
                            <div style={{ fontWeight: 800 }}>{item?.poster?.email || 'Not provided'}</div>
                         </div>
                         <button onClick={() => { navigator.clipboard.writeText(item?.poster?.email || ''); alert('Copied!'); }} style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Copy size={16} /></button>
                      </div>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
