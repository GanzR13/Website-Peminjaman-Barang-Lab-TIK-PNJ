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
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // PERBAIKAN: Cek lokasi url saat ini
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

      // Hanya lakukan auto-logout / reload JIKA user BUKAN di halaman login
      if (!isAuthPage) {
        localStorage.clear();
        window.location.href = '/login';
      }
      // Jika user ada di halaman login, Interceptor diam saja. 
      // Biarkan error-nya diteruskan ke blok 'catch' di Login.vue
    }
    return Promise.reject(error);
  }
);

export default instance;