import { createRouter, createWebHistory } from 'vue-router';

// 1. Import Layout Topbar
import UserLayout from '../layouts/UserLayout.vue'; 

// 2. Import Views
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';
import CatalogBarang from '../views/CatalogBarang.vue';
import RiwayatPeminjaman from '../views/RiwayatPeminjaman.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },

  // ==========================================
  // RUTE GUEST (Berdiri Sendiri / Tanpa Layout)
  // ==========================================
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },

  // ==========================================
  // RUTE USER (Dibungkus dengan UserLayout)
  // ==========================================
  {
    path: '/',
    component: UserLayout, // Menggunakan Topbar
    meta: { requiresAuth: true }, // Semua children otomatis butuh login
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: 'catalog',
        name: 'Catalog',
        component: CatalogBarang,
      },
      {
        path: 'riwayat',
        name: 'RiwayatPeminjaman',
        component: RiwayatPeminjaman,
      }
    ]
  },

  // CATCH ALL (Jika user mengetik URL ngawur)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ==========================================
// NAVIGATION GUARD (Satpam Rute)
// ==========================================
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;

  // Mahasiswa biasanya Role ID 5 (Jika dosen juga peminjam, bisa ubah jadi >= 4)
  const isPeminjam = user.role_id === 5;

  // 1. Jika rute butuh auth tapi user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  // 2. Jika Admin mencoba masuk ke portal Mahasiswa
  if (to.meta.requiresAuth && isAuthenticated && !isPeminjam) {
    localStorage.clear(); // Bersihkan sesi
    alert("Silakan gunakan Portal Admin untuk akun Pegawai.");
    return { name: 'Login' };
  }

  // 3. Jika user SUDAH login tapi mencoba buka halaman Login / Register
  if (to.meta.guestOnly && isAuthenticated && isPeminjam) {
    return { name: 'Dashboard' }; // Kembalikan ke dashboard
  }

  return true; // Jika aman, izinkan masuk
});

export default router;