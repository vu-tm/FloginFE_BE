import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (!window.tokenExpiredHandled) {
                window.tokenExpiredHandled = true;
                alert("phiên đã hết hạng")
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;