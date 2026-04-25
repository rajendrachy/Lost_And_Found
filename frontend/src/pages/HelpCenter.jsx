import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Search, HelpCircle, Shield, MessageSquare, Book, FileText, ArrowRight, X, AlertTriangle, Send, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

const HelpCenter = () => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportSent, setReportSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ subject: '', category: 'general', message: '' });
    const [expandedArticle, setExpandedArticle] = useState(null);
    
    const categories = [
        { icon: <Shield color="#3b82f6" />, title: 'Privacy & Safety', desc: 'How we protect your data and contact details.' },
        { icon: <HelpCircle color="#10b981" />, title: 'Claiming Items', desc: 'Step-by-step guide to verifying ownership.' },
        { icon: <MessageSquare color="#8b5cf6" />, title: 'Contacting Users', desc: 'Safe ways to coordinate item returns.' },
        { icon: <Book color="#f59e0b" />, title: 'Procedures', desc: 'What to do when you find or lose something.' },
    ];

    const articles = [
        {
            title: 'How to submit a verified claim',
            category: 'Claiming Items',
            content: `When you find an item that matches one you've lost (or vice versa), submitting a verified claim is the key to recovering your item through our secure system.\n\n**Step 1: Find the matching item**\nBrowse the Explore page to find items that match your lost property. Use filters to narrow down by category, location, and date.\n\n**Step 2: Submit your claim**\nClick on the item and select "Submit Claim". You'll need to provide proof of ownership - this could include:\n- Serial numbers or unique identifiers\n- Receipts or purchase proofs\n- Photos of the item\n- Detailed descriptions of distinguishing features\n\n**Step 3:等待Finder审核**\nThe finder will review your proof and either approve or reject your claim. If approved, you'll receive their contact details to coordinate the return.\n\n**Tips for successful claims:**\n- Be as specific as possible with identifying details\n- Include photos whenever possible\n- Provide your original posting date if you lost an item`
        },
        {
            title: 'Understanding the Double-Handshake system',
            category: 'Procedures',
            content: `Our Double-Handshake system is a security-first verification process designed to ensure both parties are genuinely who they claim to be.\n\n**First Handshake: Claim Submission**\nWhen an owner submits a claim, they provide proof of ownership. This proof is reviewed by the finder (the "First Handshake").\n\n**Second Handshake: Approval & Contact Exchange**\nOnce the finder approves the proof, the system generates a secure meeting code. Both parties must confirm the exchange before contact details are revealed.\n\n**Why this matters:**\n- Prevents fraudulent claims\n- Ensures finders verify legitimate owners\n- Protects personal information until both parties agree\n- Creates an audit trail for every transaction\n\nThis system has recovered over 10,000 items with a 95% success rate.`
        },
        {
            title: 'Privacy Guard: Why contact details are locked',
            category: 'Privacy & Safety',
            content: `Your privacy is our top priority. Here's why contact details remain locked until both parties agree to the exchange.\n\n**What's hidden:**\n- Phone numbers\n- Email addresses\n- Home addresses\n- Profile information\n\n**When details are revealed:**\nContact information is only shared AFTER:\n1. The finder approves your proof of ownership\n2. Both parties confirm the meeting\n3. The exchange is completed\n\n**Privacy Guard features:**\n- All communication stays on our platform until exchange\n- No public posting of personal information\n- Anonymous usernames\n- Report functionality for suspicious behavior\n\nYour data is encrypted and never sold to third parties. We're committed to keeping your information safe.`
        },
        {
            title: 'Earning Hero Points and Reputation',
            category: 'Contacting Users',
            content: `Recognize helpful community members by earning Hero Points and building your reputation.\n\n**How to earn Hero Points:**\n- **+50 points**: Successfully return an item\n- **+25 points**: Your claim is verified\n- **+10 points**: Help another user with advice\n- **+5 points**: Report a found item\n\n**Reputation Tiers:**\n- 🌱 **Newcomer**: 0-99 points\n- 🌟 **Helper**: 100-499 points\n- 🦸 **Hero**: 500-999 points\n- 👑 **Champion**: 1000+ points\n\n**Benefits:**\n- Higher visibility in search results\n- Verified badge on your profile\n- Early access to new features\n- Community recognition\n\nYour reputation follows you and builds trust with other users.`
        },
        {
            title: 'Safe meeting tips for item exchange',
            category: 'Procedures',
            content: `Safety is essential when meeting to exchange items. Follow these guidelines for a secure handover.\n\n**Best Practices:**\n- **Public locations**: Coffee shops, malls, police stations\n- **Daylight hours**: Always meet during the day\n- **Bring a friend**: Two people is safer than one\n- **Trust your instincts**: If something feels wrong, leave\n\n**What to avoid:**\n- Meeting at your home\n- Evening/night exchanges\n- Isolated locations\n- Sharing too much personal information\n\n**During the exchange:**\n1. Verify the item belongs to both parties\n2. Use our in-app chat for communication\n3. Don't hand over the item until you're comfortable\n4. Complete the exchange confirmation in-app\n\n**Emergency contacts:**\nIf you feel unsafe, end the meeting immediately and contact local authorities.`
        },
        {
            title: 'What to do if a claim is rejected',
            category: 'Claiming Items',
            content: `If your claim is rejected, don't worry - here's how to handle it and improve your chances next time.\n\n**Common reasons for rejection:**\n- Insufficient proof of ownership\n- Vague descriptions\n- Missing serial numbers or identifiers\n- Claims submitted for wrong items\n\n**What to do next:**\n1. **Review the feedback**: Check why your claim was rejected\n2. **Gather more proof**: Look for receipts, photos, or serial numbers\n3. **Submit a new claim**: With additional evidence\n4. **Contact the finder**: Through our messaging system\n\n**Tips for stronger claims:**\n- Include unique identifiers\n- Provide photos from multiple angles\n- Mention specific dates/locations\n- Add any distinguishing marks\n\n**If you believe the rejection is wrong:**\n- Contact our support team through the Report feature\n- Provide additional documentation\n- Allow 24-48 hours for review\n\nMost rejected claims are successfully resolved on second submission.`
        }
    ];

    const reportCategories = [
        { id: 'general', label: 'General Question' },
        { id: 'bug', label: 'Bug / Technical Issue' },
        { id: 'claim', label: 'Claim Dispute' },
        { id: 'safety', label: 'Safety Concern' },
        { id: 'harassment', label: 'Harassment / Abuse' },
        { id: 'other', label: 'Other' },
    ];

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            alert('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        try {
            await API.post('/reports', {
                subject: formData.subject,
                category: formData.category,
                message: formData.message
            });
            setReportSent(true);
            setTimeout(() => {
                setShowReportModal(false);
                setReportSent(false);
                setFormData({ subject: '', category: 'general', message: '' });
            }, 2000);
        } catch (err) {
            console.error('Report submission failed:', err);
            if (err.response?.status === 404) {
                alert('Report feature is currently unavailable. Please try again later.');
            } else {
                alert('Failed to submit report. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: '#f8fafc' }}>
            <Navbar />
            
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '12rem 1.5rem 8rem', textAlign: 'center', color: 'white' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>How can we help?</h1>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for articles, guides, and more..." 
                            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '100px', border: 'none', background: 'white', color: '#0f172a', fontSize: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}
                        />
                    </div>
                </motion.div>
            </div>

            <div className="container" style={{ marginTop: '-4rem', paddingBottom: '8rem' }}>
                <div className="grid grid-4" style={{ gap: '2rem' }}>
                    {categories.map((cat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card"
                            style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50px)'}
                        >
                            <div style={{ width: 64, height: 64, borderRadius: '20px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                {cat.icon}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.75rem' }}>{cat.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{cat.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Popular Articles</h2>
                        <button className="btn btn-outline btn-sm">View All</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {articles.map((article, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{ 
                                    background: 'white', 
                                    borderRadius: '16px', 
                                    border: '1px solid #e2e8f0',
                                    overflow: 'hidden',
                                }}
                            >
                                <div 
                                    onClick={() => setExpandedArticle(expandedArticle === idx ? null : idx)}
                                    style={{ 
                                        padding: '1.25rem 1.5rem', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: expandedArticle === idx ? '#f8fafc' : 'white',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ 
                                            width: 40, 
                                            height: 40, 
                                            borderRadius: '12px', 
                                            background: '#eff6ff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <FileText size={18} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{article.title}</h3>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{article.category}</span>
                                        </div>
                                    </div>
                                    {expandedArticle === idx ? (
                                        <ChevronUp size={20} color="#64748b" />
                                    ) : (
                                        <ChevronDown size={20} color="#64748b" />
                                    )}
                                </div>
                                <AnimatePresence>
                                    {expandedArticle === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                                <div style={{ paddingTop: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                                    {article.content}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                                    <button style={{ 
                                                        padding: '0.6rem 1.25rem', 
                                                        borderRadius: '10px', 
                                                        border: '1px solid #3b82f6', 
                                                        background: '#eff6ff',
                                                        color: '#2563eb',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}>
                                                        👍 Helpful
                                                    </button>
                                                    <button style={{ 
                                                        padding: '0.6rem 1.25rem', 
                                                        borderRadius: '10px', 
                                                        border: '1px solid #e2e8f0', 
                                                        background: 'white',
                                                        color: '#64748b',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}>
                                                        👎 Not helpful
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Floating Report Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setShowReportModal(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(239,68,68,0.4)',
                        zIndex: 50,
                    }}
                >
                    <AlertTriangle size={24} />
                </motion.button>

                {/* Report Modal */}
                <AnimatePresence>
                    {showReportModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 100,
                                padding: '1rem',
                            }}
                            onClick={() => setShowReportModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    width: '100%',
                                    maxWidth: '500px',
                                    maxHeight: '90vh',
                                    overflow: 'auto',
                                    padding: '2rem',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {reportSent ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: '#10b981',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 1.5rem',
                                            }}
                                        >
                                            <CheckCircle size={40} color="white" />
                                        </motion.div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Report Submitted!</h2>
                                        <p style={{ color: '#64748b' }}>We'll review your report and get back to you soon.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Report an Issue</h2>
                                            <button
                                                onClick={() => setShowReportModal(false)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                            >
                                                <X size={24} color="#64748b" />
                                            </button>
                                        </div>
                                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                            Found something else? Reporting it takes less than 60 seconds.
                                        </p>
                                        <form onSubmit={handleSubmitReport}>
                                            <div style={{ marginBottom: '1.25rem' }}>
                                                <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {reportCategories.map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                                            style={{
                                                                padding: '0.6rem 1rem',
                                                                borderRadius: '100px',
                                                                border: '1.5px solid',
                                                                borderColor: formData.category === cat.id ? '#ef4444' : '#e2e8f0',
                                                                background: formData.category === cat.id ? '#fef2f2' : 'white',
                                                                color: formData.category === cat.id ? '#dc2626' : '#64748b',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {cat.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1.25rem' }}>
                                                <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                                                <input
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    placeholder="Brief description of the issue"
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e2e8f0',
                                                        fontSize: '0.95rem',
                                                        fontFamily: 'inherit',
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Details</label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="Please describe what happened in detail..."
                                                    rows={5}
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e2e8f0',
                                                        fontSize: '0.95rem',
                                                        fontFamily: 'inherit',
                                                        resize: 'vertical',
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading || !formData.subject || !formData.message}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    color: 'white',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 800,
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                }}
                                            >
                                                {loading ? 'Submitting...' : (<><Send size={18} /> Submit Report</>)}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HelpCenter;
