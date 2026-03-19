import axios from 'axios';

// Buat instance axios
const instance = axios.create({
  // Mengambil URL dari file .env (VITE_API_URL)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR REQUEST ---
// Gunanya: Otomatis menempelkan Token di setiap request
instance.interceptors.request.use(
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
// Gunanya: Menangani error secara global (misal: Token Expired)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token tidak valid atau expired, paksa logout
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;