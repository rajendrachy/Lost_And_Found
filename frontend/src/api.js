import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPlanStatus = () => API.get('/auth/plan-status');
export const requestPlan = (message) => API.post('/auth/request-plan', { message });
export const getAdminPlanRequests = () => API.get('/admin/plan-requests');
export const respondPlanRequest = (userId, action, response) => API.post(`/admin/plan-requests/${userId}`, { action, response });

export default API;
