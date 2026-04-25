import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, Tag, FileText, Send, CheckCircle, Shield, Search, Activity } from 'lucide-react';
import API from '../api';

const PostItem = () => {
  const navigate = useNavigate();
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
      setTimeout(() => navigate('/'), 10000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page" style={{ background: '#f8fafc' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '8rem', maxWidth: '600px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: '3rem', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '24px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>Report Published!</h2>
            <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '3rem' }}>Your {formData.type} report is now live across the community database.</p>

            {/* NEXT STEPS TIMELINE */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
               {/* Line */}
               <div style={{ position: 'absolute', left: '19px', top: '24px', bottom: '24px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

               {[
                 { title: 'Item Published', desc: 'Your report is visible to everyone.', icon: <CheckCircle size={18} />, status: 'completed' },
                 { title: 'Community Matching', desc: 'We are scanning new reports for potential matches.', icon: <Search size={18} />, status: 'active' },
                 { title: 'Identity Verification', desc: 'Verify ownership through our secure desk.', icon: <Shield size={18} />, status: 'upcoming' },
                 { title: 'Final Handshake', desc: 'Arrange a safe return and earn Hero Points.', icon: <Activity size={18} />, status: 'upcoming' },
               ].map((step, idx) => (
                 <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '12px', 
                      background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? '#3b82f6' : 'white', 
                      color: step.status === 'upcoming' ? '#cbd5e1' : 'white',
                      border: step.status === 'upcoming' ? '2px solid #f1f5f9' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: step.status === 'active' ? '0 0 15px rgba(59,130,246,0.5)' : 'none'
                    }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: step.status === 'upcoming' ? '#94a3b8' : '#0f172a' }}>{step.title}</h4>
                        {step.status === 'active' && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>IN PROGRESS</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '0.2rem' }}>{step.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '3.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <button className="btn btn-primary btn-block" onClick={() => navigate('/')}>Return to Dashboard</button>
               <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Auto-redirecting in 10 seconds...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />

      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', padding: '8rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Report an Item</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Help the community by providing accurate details.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="card post-form">
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="type-toggle">
                  <button type="button"
                    className={`type-toggle-btn ${formData.type === 'lost' ? 'type-toggle-lost' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'lost' })}>
                    I Lost Something
                  </button>
                  <button type="button"
                    className={`type-toggle-btn ${formData.type === 'found' ? 'type-toggle-found' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'found' })}>
                    I Found Something
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Item Title</label>
                  <div className="relative">
                    <Tag size={16} className="form-input-icon" />
                    <input type="text" required placeholder="e.g. Blue Wallet, iPhone 13 Pro"
                      className="form-input" value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
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
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <div className="relative">
                      <Calendar size={16} className="form-input-icon" />
                      <input type="date" required className="form-input" value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="form-input-icon" />
                    <input type="text" required placeholder="Where was it lost/found?"
                      className="form-input" value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <div className="relative">
                    <FileText size={16} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#cbd5e1' }} />
                    <textarea required rows="4" placeholder="Provide details like color, brand, unique marks..."
                      className="form-textarea" value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Photo (Optional)</label>
                  <div className="upload-area" onClick={() => fileRef.current.click()}>
                    <input type="file" ref={fileRef} accept="image/*" onChange={handleImageChange} />
                    {preview ? (
                      <img src={preview} alt="Preview" className="upload-preview" />
                    ) : (
                      <>
                        <Camera size={40} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
                        <p style={{ fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Click to upload photo</p>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>JPEG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg btn-block">
                  <Send size={18} />
                  {isSubmitting ? 'Posting...' : 'Submit Report'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
