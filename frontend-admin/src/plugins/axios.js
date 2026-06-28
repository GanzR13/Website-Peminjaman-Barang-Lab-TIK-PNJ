import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Menangani jika tiba-tiba token expired atau tidak valid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      const path = window.location.pathname;
      const isAuthPage = path === '/login' || path === '/register' || path === '/admin/login';

      if (!isAuthPage) {
        localStorage.clear();
        
        if (path.startsWith('/admin')) {
            window.location.href = '/admin/login';
        } else {
            window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;