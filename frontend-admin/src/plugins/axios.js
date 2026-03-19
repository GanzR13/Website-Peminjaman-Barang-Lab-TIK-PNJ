import axios from 'axios';

const api = axios.create({
  // Mengambil URL dari .env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR REQUEST ---
// Otomatis tempelkan Token di setiap request ke Backend
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

// --- INTERCEPTOR RESPONSE ---
// Menangani jika tiba-tiba token expired atau tidak valid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika error 401 (Unauthorized), hapus data & tendang ke login
      localStorage.clear();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;