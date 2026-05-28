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
      // Cek apakah user sedang berada di halaman login/register (baik user biasa maupun admin)
      const path = window.location.pathname;
      const isAuthPage = path === '/login' || path === '/register' || path === '/admin/login';

      // Hanya lakukan auto-logout / tendang ke halaman login JIKA BUKAN berada di halaman auth
      if (!isAuthPage) {
        localStorage.clear();
        
        // Arahkan ke login yang sesuai (Admin ke admin, User ke user)
        if (path.startsWith('/admin')) {
            window.location.href = '/admin/login';
        } else {
            window.location.href = '/login';
        }
      }
      // Jika di halaman auth, diam saja dan biarkan error diteruskan agar banner merah muncul
    }
    return Promise.reject(error);
  }
);

export default api;