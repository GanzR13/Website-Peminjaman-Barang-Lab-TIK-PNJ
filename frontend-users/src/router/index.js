import { createRouter, createWebHistory } from 'vue-router';

// 1. Tambahkan Import Register
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // <-- Tambahkan ini
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';
import CatalogBarang from '../views/CatalogBarang.vue';
import RiwayatPeminjaman from '../views/RiwayatPeminjaman.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  // 2. Daftarkan Rute Register
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true } // Sama seperti login, hanya untuk tamu
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: CatalogBarang,
    meta: { requiresAuth: true }
  },
  {
    path: '/riwayat', // Saya perpendek path-nya agar lebih cantik di URL
    name: 'RiwayatPeminjaman',
    component: RiwayatPeminjaman,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;

  // Mahasiswa biasanya Role ID 5
  const isPeminjam = user.role_id === 5;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  // Jika Admin mencoba login di portal Mahasiswa
  if (to.meta.requiresAuth && isAuthenticated && !isPeminjam) {
    localStorage.clear();
    alert("Silakan gunakan Portal Admin untuk akun Pegawai.");
    return { name: 'Login' };
  }

  return true;
});

export default router;