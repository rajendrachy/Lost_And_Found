import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const stored = localStorage.getItem('user');
            if (token && stored) {
                setUser(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Failed to parse user from storage', err);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            return res.data;
        } catch (err) {
            const retryInfo = err.response?.data;
            const msg = retryInfo?.msg || 'Login failed';
            setError({
                message: msg,
                retryAfter: retryInfo?.retryAfter,
                remainingAttempts: retryInfo?.remainingAttempts,
                locked: retryInfo?.locked,
                type: retryInfo?.type,
                limit: retryInfo?.limit,
                upgrade: retryInfo?.upgrade
            });
            throw new Error(msg);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const res = await API.post('/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            return res.data;
        } catch (err) {
            const retryInfo = err.response?.data;
            const msg = retryInfo?.msg || 'Registration failed';
            setError({
                message: msg,
                retryAfter: retryInfo?.retryAfter,
                remainingAttempts: retryInfo?.remainingAttempts,
                locked: retryInfo?.locked,
                type: retryInfo?.type,
                limit: retryInfo?.limit,
                upgrade: retryInfo?.upgrade
            });
            throw new Error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const clearError = () => setError(null);

    const updateAvatar = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await API.post('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updatedUser = { ...user, avatar: res.data.avatar };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return res.data.avatar;
        } catch (err) {
            setError(err.response?.data?.msg || 'Upload failed');
            throw err;
        }
    };

    const updateUserData = async (data) => {
        try {
            const res = await API.put('/auth/profile', data);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Update failed');
            throw err;
        }
    };

    const changePassword = async (passwords) => {
        try {
            await API.put('/auth/password', passwords);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Password update failed');
            throw err;
        }
    };

    const refreshUser = async () => {
        try {
            const res = await API.get('/auth/profile');
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error('Failed to refresh user data');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError, updateAvatar, updateUserData, changePassword, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
