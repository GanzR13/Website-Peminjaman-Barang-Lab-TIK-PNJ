import { createRouter, createWebHistory } from 'vue-router';

// 1. Import Layout Topbar
import UserLayout from '../layouts/UserLayout.vue'; 

// 2. Import Views
import Home from '../views/HomePage.vue'; // <-- IMPORT HOMEPAGE BARU
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';
import CatalogBarang from '../views/CatalogBarang.vue';
import RiwayatPeminjaman from '../views/RiwayatPeminjaman.vue';

const routes = [
  // ==========================================
  // RUTE PUBLIK (Bisa diakses siapa saja)
  // ==========================================
  {
    path: '/',
    name: 'Home',
    component: Home, 
    // Tidak pakai meta guestOnly agar user yang sudah login pun 
    // tetap bisa melihat landing page jika mereka mengetik URL '/'
  },

  // ==========================================
  // RUTE GUEST (Hanya untuk yang belum login)
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
    path: '/user', // Opsional: Diberi prefix agar rapi, tapi path children tetap
    component: UserLayout, 
    meta: { requiresAuth: true }, // Semua children otomatis butuh login
    children: [
      {
        path: '/dashboard', // Menggunakan '/' di awal agar URL tetap /dashboard
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: '/catalog',
        name: 'Catalog',
        component: CatalogBarang,
      },
      {
        path: '/riwayat',
        name: 'RiwayatPeminjaman',
        component: RiwayatPeminjaman,
      }
    ]
  },

  // CATCH ALL (Jika user mengetik URL ngawur)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/' // Arahkan ke Homepage, bukan dashboard
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

  // PERBAIKAN: Mahasiswa (5) dan Dosen/Teknisi (4) masuk sebagai peminjam
  // Admin dan Super Admin biasanya memiliki Role ID 1, 2, atau 3.
  const isPeminjam = user.role_id === 4 || user.role_id === 5;

  // 1. Jika rute butuh auth tapi user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  // 2. Jika Admin/Staff (Role 1-3) mencoba masuk ke portal Peminjam
  if (to.meta.requiresAuth && isAuthenticated && !isPeminjam) {
    // Bersihkan sesi agar mereka login ulang lewat portal admin
    localStorage.clear(); 
    alert("Akses Ditolak: Silakan gunakan Portal Admin untuk mengelola sistem.");
    return { name: 'Login' };
  }

  // 3. Jika user SUDAH login tapi mencoba buka halaman Login / Register
  if (to.meta.guestOnly && isAuthenticated) {
    if (isPeminjam) {
      return { name: 'Dashboard' }; // Kembalikan ke dashboard user
    } else {
      // Jika ternyata admin yang iseng buka /login milik user, usir kembali
      localStorage.clear();
      return { name: 'Login' };
    }
  }

  return true; // Jika aman, izinkan masuk
});

export default router;