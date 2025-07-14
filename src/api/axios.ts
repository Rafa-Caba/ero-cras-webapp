import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    timeout: 10000
});

api.interceptors.response.use((res) => res, async (err) => {
    const originalRequest = err.config;

    // Solo intentar refresh una vez
    if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token disponible');

            const res = await api.post('/login/refresh', { token: refreshToken });
            const nuevoToken = res.data?.accessToken;

            if (!nuevoToken) throw new Error('Token inválido del refresh');

            // Guardar el nuevo token
            localStorage.setItem('token', nuevoToken);

            // Actualizar headers globales y del request original
            api.defaults.headers.common['Authorization'] = `Bearer ${nuevoToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${nuevoToken}`;

            return api(originalRequest);
        } catch (e) {
            // Si falla el refresh, limpiar sesión y redirigir
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('tema-admin');

            delete api.defaults.headers.common['Authorization'];

            console.warn('Token expirado. Cerrando sesión...');

            redirectToLoginSafely();

            return Promise.reject(e);
        }
    }

    return Promise.reject(err);
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            // Asegura que headers exista
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const publicApi = axios.create({
    baseURL: (import.meta.env.VITE_API_URL + '/api') || 'http://localhost:10000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

function redirectToLoginSafely() {
    if (window.location.pathname !== '/admin/login') {
        window.location.replace('/admin/login');
    }
}

export default api;