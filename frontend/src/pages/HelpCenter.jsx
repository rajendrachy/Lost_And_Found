import React from 'react';
import Navbar from '../components/Navbar';
import { Search, HelpCircle, Shield, MessageSquare, Book, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HelpCenter = () => {
    const categories = [
        { icon: <Shield color="#3b82f6" />, title: 'Privacy & Safety', desc: 'How we protect your data and contact details.' },
        { icon: <HelpCircle color="#10b981" />, title: 'Claiming Items', desc: 'Step-by-step guide to verifying ownership.' },
        { icon: <MessageSquare color="#8b5cf6" />, title: 'Contacting Users', desc: 'Safe ways to coordinate item returns.' },
        { icon: <Book color="#f59e0b" />, title: 'Procedures', desc: 'What to do when you find or lose something.' },
    ];

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
                    
                    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                        {[
                            'How to submit a verified claim',
                            'Understanding the Double-Handshake system',
                            'Privacy Guard: Why contact details are locked',
                            'Earning Hero Points and Reputation',
                            'Safe meeting tips for item exchange',
                            'What to do if a claim is rejected'
                        ].map((text, idx) => (
                            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, color: '#334155' }}>
                                    <FileText size={18} color="#94a3b8" /> {text}
                                </div>
                                <ArrowRight size={16} color="#cbd5e1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
