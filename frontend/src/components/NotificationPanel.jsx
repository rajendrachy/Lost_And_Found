import React, { useState, useEffect } from 'react';
import API from '../api';
import { Bell, X, Check, Shield, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await API.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error('Failed to delete notification');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'claim': return <Info size={16} color="#3b82f6" />;
            case 'approval': return <Shield size={16} color="#10b981" />;
            case 'handshake': return <Check size={16} color="#8b5cf6" />;
            default: return <Bell size={16} color="#64748b" />;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="card" 
            style={{ 
                position: 'absolute', top: '100%', right: 0, width: '380px', 
                marginTop: '1rem', zIndex: 1000, padding: '0', 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                maxHeight: '500px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
        >
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Notifications</h3>
                <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner"></div></div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}><Bell size={48} style={{ margin: '0 auto' }} /></div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>All caught up! No new notifications.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div 
                            key={n._id} 
                            onClick={() => {
                                handleMarkAsRead(n._id);
                                if (n.item) navigate(`/item/${n.item._id || n.item}`);
                                onClose();
                            }}
                            style={{ 
                                padding: '1.25rem', borderBottom: '1px solid #f1f5f9', 
                                background: n.read ? 'white' : '#eff6ff',
                                cursor: 'pointer', transition: 'all 0.2s',
                                position: 'relative', display: 'flex', gap: '1rem'
                            }}
                            className="notification-item"
                        >
                            <div style={{ 
                                width: '36px', height: '36px', borderRadius: '10px', 
                                background: 'white', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                flexShrink: 0
                            }}>
                                {getIcon(n.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: n.read ? '#94a3b8' : '#334155', 
                                    fontWeight: n.read ? 500 : 700, 
                                    lineHeight: 1.4, 
                                    marginBottom: '0.4rem',
                                    textDecoration: n.read ? 'line-through' : 'none',
                                    textDecorationColor: n.read ? '#ef4444' : 'transparent',
                                    transition: 'all 0.3s'
                                }}>
                                    {n.message}
                                </p>
                                <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>
                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <button 
                                onClick={(e) => handleDelete(e, n._id)}
                                style={{ 
                                    border: 'none', background: 'none', color: '#cbd5e1', 
                                    cursor: 'pointer', alignSelf: 'flex-start', padding: '0.25rem'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {notifications.length > 0 && (
                <div style={{ padding: '0.75rem', background: 'white', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                        View All Activity
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default NotificationPanel;
