import axios from 'axios';
import { toast } from 'react-toastify';

// If you already set baseURL elsewhere, keep that; otherwise:
const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: false,
});

// Attach token (from localStorage) for every request
http.interceptors.request.use((config) => {
    const raw = localStorage.getItem('auth');
    if (raw) {
        try {
            const { token } = JSON.parse(raw);
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch { }
    }
    return config;
});

// Global error handler -> friendly toasts
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        const message =
            err?.response?.data?.error ||
            err?.message ||
            'Something went wrong';

        // Don’t spam toasts on 401 for /auth/login
        const url: string = err?.config?.url || '';
        const isLogin = /\/auth\/login/i.test(url);

        if (status === 401 && !isLogin) {
            toast.error('Your session expired. Please sign in again.');
            // optional: redirect to login
            // window.location.href = '/login';
        } else if (status === 403) {
            toast.warning('You don’t have permission to perform that action.');
        } else if (status === 404) {
            toast.info('Not found.');
        } else {
            toast.error(message);
        }

        return Promise.reject(err);
    }
);

export default http;
