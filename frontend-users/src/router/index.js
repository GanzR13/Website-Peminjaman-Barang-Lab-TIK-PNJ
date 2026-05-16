import { createRouter, createWebHistory } from 'vue-router';

// 1. Import Layout Topbar
import UserLayout from '../layouts/UserLayout.vue'; 

// 2. Import Views (HomePage dihapus)
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Beranda from '../views/Beranda.vue';
import Profile from '../views/Profile.vue';
import CatalogBarang from '../views/CatalogBarang.vue';
import RiwayatPeminjaman from '../views/RiwayatPeminjaman.vue';

const routes = [
  // ==========================================
  // RUTE AWAL (Mengarahkan langsung ke Beranda)
  // ==========================================
  {
    path: '/',
    redirect: '/beranda' // Langsung arahkan ke beranda saat web pertama dibuka
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
    path: '/user', 
    component: UserLayout, 
    meta: { requiresAuth: true }, // Semua children otomatis butuh login
    children: [
      {
        path: '/beranda', 
        name: 'Beranda',
        component: Beranda,
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
    redirect: '/beranda' // Arahkan kembali ke Beranda
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

  // Mahasiswa (5) dan Dosen/Teknisi (4) masuk sebagai peminjam
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
      return { name: 'Beranda' }; // PERBAIKAN: Sesuaikan dengan nama rute 'Beranda'
    } else {
      // Jika ternyata admin yang iseng buka /login milik user, usir kembali
      localStorage.clear();
      return { name: 'Login' };
    }
  }

  return true; // Jika aman, izinkan masuk
});

export default router;