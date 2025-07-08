import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    timeout: 10000
});

api.interceptors.response.use((res: any) => res, async (err: any) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const res = await api.post('/login/refresh', { token: refreshToken });
            localStorage.setItem('token', res.data.accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
            return api(originalRequest);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    return Promise.reject(err);
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const publicApi = axios.create({
    baseURL: (import.meta.env.VITE_API_URL + '/api') || 'http://localhost:10000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;