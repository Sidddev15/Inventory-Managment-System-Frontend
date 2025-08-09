import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/',
    timeout: 15000
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;
