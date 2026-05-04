import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';

const routes = [
  // 1. Rute Redirect Awal
  { 
    path: '/', 
    redirect: '/admin/login' 
  },

  // 2. Rute Bebas Layout (Halaman Login Berdiri Sendiri)
  { 
    path: '/admin/login', 
    name: 'AdminLogin', 
    component: Login 
  },

  // 3. Rute Utama (Menggunakan SidebarOnlyLayout untuk semua halaman)
  {
    path: '/',
    component: () => import('../layouts/SidebarOnlyLayout.vue'),
    meta: { requiresAuth: true }, // Semua children di dalamnya otomatis butuh login
    children: [
      { 
        path: '/admin/dashboard', 
        name: 'AdminDashboard', 
        component: () => import('../views/Dashboard.vue')
      },
      { 
        path: '/users/pegawai',
        name: 'DataPegawai', 
        component: () => import('../views/DataPegawai.vue')
      },
      {
        path: '/users/peminjam', 
        name: 'DataPeminjam', 
        component: () => import('../views/DataPeminjam.vue')
      },
      {
        path: '/admin/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: '/barang',
        name: 'Barang',
        component: () => import('../views/Barang.vue')
      },
      {
        path: '/peminjaman',
        name: 'ManagementPeminjam',
        component: () => import('../views/ManagementPeminjam.vue')
      }

    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// NAVIGATION GUARD (Satpam Rute)
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!token;

  // Cek apakah user adalah Admin/Pegawai (Role ID 1 s/d 4)
  const isAdmin = user.role_id <= 4; 

  // Jika butuh login tapi belum ada token
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'AdminLogin' }; 
  }

  // Jika sudah login pakai akun Mahasiswa tapi mencoba masuk rute Admin
  if (to.meta.requiresAuth && isAuthenticated && !isAdmin) {
    localStorage.clear(); // Tendang tokennya
    ShowAlert("Akses Ditolak: Halaman ini hanya untuk Admin/Pegawai");
    return { name: 'AdminLogin' }; 
  }

  // Jika sudah login sebagai Admin, lalu mencoba buka halaman Login lagi
  if (to.path === '/admin/login' && isAuthenticated && isAdmin) { 
    return { name: 'AdminDashboard' }; // Langsung arahkan ke dashboard
  }

  return true; // Jika semua aman, izinkan masuk
});

export default router;