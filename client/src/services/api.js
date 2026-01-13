import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach token if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
