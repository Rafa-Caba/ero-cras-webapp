import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Cámbialo al pasar a producción
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    timeout: 10000 // tiempo máximo de espera (opcional)
});


api.interceptors.response.use(
    res => res,
    async err => {
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
                // Redirige a login o borra tokens
                return Promise.reject(e);
            }
        }
        return Promise.reject(err);
    }
);

export default api;