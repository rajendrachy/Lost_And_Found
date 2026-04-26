import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, Tag, FileText, Send, CheckCircle, Shield, Search, Activity, Star, Plus } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const PostItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type: 'lost', title: '', category: '', location: '', date: '', description: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('description', formData.description);
      if (imageFile) data.append('image', imageFile);

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => navigate(user?.role === 'admin' ? '/admin' : '/profile'), 8000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: '#f8fafc' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '640px' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: '3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: formData.type === 'lost' ? '#ef4444' : '#10b981' }}></div>
            
            <div style={{ width: 88, height: 88, borderRadius: '28px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 15px 30px rgba(16,185,129,0.15)' }}>
              <CheckCircle size={44} />
            </div>
            
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Report Live!</h2>
            <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '3.5rem', fontSize: '1.05rem' }}>Your {formData.type} report has been broadcasted to the community network.</p>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', padding: '0 1rem' }}>
               <div style={{ position: 'absolute', left: '29px', top: '24px', bottom: '24px', width: '2px', background: '#f1f5f9', zIndex: 0 }}></div>

               {[
                 { title: 'Public Broadcast', desc: 'Item is now searchable in the global database.', icon: <Star size={18} />, status: 'completed' },
                 { title: 'AI Matching', desc: 'Our algorithms are scanning for potential matches.', icon: <Search size={18} />, status: 'active' },
                 { title: 'Secure Handshake', desc: 'Owners will reach out through the verification desk.', icon: <Shield size={18} />, status: 'upcoming' },
               ].map((step, idx) => (
                 <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '14px', 
                      background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? '#3b82f6' : 'white', 
                      color: step.status === 'upcoming' ? '#cbd5e1' : 'white',
                      border: step.status === 'upcoming' ? '2px solid #f1f5f9' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: step.status === 'active' ? '0 10px 20px rgba(59,130,246,0.3)' : 'none'
                    }}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 900, color: step.status === 'upcoming' ? '#94a3b8' : '#0f172a' }}>{step.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>{step.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '4rem' }}>
               <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/profile')}>
                 {user?.role === 'admin' ? 'Go to Admin Panel' : 'Go to Dashboard'}
               </button>
               <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Redirecting in 8 seconds</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <Navbar />

      <div style={{ paddingTop: '8.5rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Security Handshake Enabled</span>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginTop: '0.5rem' }}>Report an Item</h1>
            </motion.div>
            <div style={{ padding: '0.75rem 1.25rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} className="pulse-dot"></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>Live Network Status</span>
            </div>
          </div>

          <div className="grid grid-12" style={{ gap: '2.5rem' }}>
            <div className="col-span-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', border: '1px solid #e2e8f0' }}>
                  {error && <div className="alert alert-error">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    {/* NEW CUSTOM TOGGLE */}
                    <div style={{ 
                      display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '18px', 
                      marginBottom: '3rem', position: 'relative' 
                    }}>
                      <motion.div 
                        animate={{ x: formData.type === 'lost' ? 0 : '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ 
                          position: 'absolute', top: '6px', bottom: '6px', left: '6px', 
                          width: 'calc(50% - 6px)', background: formData.type === 'lost' ? '#ef4444' : '#10b981', 
                          borderRadius: '14px', zIndex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <button type="button" onClick={() => setFormData({...formData, type: 'lost'})}
                        style={{ flex: 1, position: 'relative', zIndex: 2, padding: '1rem', border: 'none', background: 'transparent', color: formData.type === 'lost' ? 'white' : '#64748b', fontWeight: 900, cursor: 'pointer', transition: 'color 0.2s', fontSize: '0.85rem' }}>
                        I Lost Something
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, type: 'found'})}
                        style={{ flex: 1, position: 'relative', zIndex: 2, padding: '1rem', border: 'none', background: 'transparent', color: formData.type === 'found' ? 'white' : '#64748b', fontWeight: 900, cursor: 'pointer', transition: 'color 0.2s', fontSize: '0.85rem' }}>
                        I Found Something
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Descriptive Title</label>
                        <div className="relative">
                          <Tag size={18} className="form-input-icon" />
                          <input type="text" required placeholder="What are you reporting?"
                            className="form-input" value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                      </div>

                      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Category</label>
                          <select required className="form-select" value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Pets">Pets</option>
                            <option value="Documents">Documents</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Keys">Keys</option>
                            <option value="Bags">Bags</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Incident Date</label>
                          <div className="relative">
                            <Calendar size={18} className="form-input-icon" />
                            <input type="date" required className="form-input" value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Last Known Location</label>
                        <div className="relative">
                          <MapPin size={18} className="form-input-icon" />
                          <input type="text" required placeholder="e.g. Near City Center Mall"
                            className="form-input" value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Description & Unique Marks</label>
                        <div className="relative">
                          <FileText size={18} style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#94a3b8' }} />
                          <textarea required rows="5" placeholder="Mention scratches, lock screen photos, or internal contents..."
                            className="form-textarea" style={{ paddingLeft: '3.25rem', paddingTop: '1.25rem' }} value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg btn-block" style={{ height: '64px' }}>
                          <Send size={20} />
                          {isSubmitting ? 'Verifying & Posting...' : 'Publish Report'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>

            <div className="col-span-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Camera size={18} color="#3b82f6" /> Item Media
                  </h3>
                  <div className="upload-area" 
                    onClick={() => fileRef.current.click()}
                    style={{ 
                      aspectRatio: '1', display: 'flex', flexDirection: 'column', 
                      justifyContent: 'center', padding: '1rem', overflow: 'hidden',
                      border: '2px dashed #e2e8f0' 
                    }}>
                    <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleImageChange} />
                    {preview ? (
                      <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      <div style={{ color: '#94a3b8' }}>
                         <Plus size={32} style={{ margin: '0 auto 1rem' }} />
                         <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Add Photo</p>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1rem', textAlign: 'center', fontWeight: 600 }}>Optional but highly recommended for faster matching.</p>
                </div>

                <div className="card" style={{ padding: '2rem', background: '#0f172a', color: 'white', border: 'none' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Shield size={18} color="#60a5fa" /> Privacy First
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>
                    We never share your contact details directly. The owner must prove ownership through a secure handshake before identity is revealed.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
