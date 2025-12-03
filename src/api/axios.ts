import axios from 'axios';

// Create the main instance
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:10000') + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
});

export const publicApi = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:10000') + '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. REQUEST INTERCEPTOR (Always define this first)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available');

                const { data } = await publicApi.post('/auth/refresh-token', {
                    refreshToken
                });

                const newAccessToken = data.accessToken;

                localStorage.setItem('token', newAccessToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                console.warn('Session expired. Logging out...');
                localStorage.clear();

                if (window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;