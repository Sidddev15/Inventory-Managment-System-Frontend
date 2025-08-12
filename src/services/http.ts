import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/',
    timeout: 15000
});

// on boot, set the default header if a token already exist
const bootToken = localStorage.getItem('auth-item');
if (bootToken) {
    http.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
}

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;
