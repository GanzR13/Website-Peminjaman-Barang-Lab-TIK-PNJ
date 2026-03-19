import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';

const routes = [
  { 
    path: '/', 
    redirect: '/admin/login' 
  },
  { 
    path: '/admin/login', 
    name: 'AdminLogin', 
    component: Login 
  },
  { 
    path: '/admin/dashboard', 
    name: 'AdminDashboard', 
    component: () => import('../views/Dashboard.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/users/pegawai',
    name: 'ManagementPegawai', 
    component: () => import('../views/ManagementPegawai.vue'), 
    meta: { requiresAuth: true } 
  },
  {
    path: '/users/peminjam', 
    name: 'ManagementPeminjam', 
    component: () => import('../views/ManagementPeminjam.vue'), 
    meta: { requiresAuth: true } 
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
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

  // Cek apakah user adalah Admin/Pegawai (Role ID 1 s/d 4 biasanya Pegawai/Admin)
  const isAdmin = user.role_id <= 4; 

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  // VALIDASI TAMBAHAN: Jika dia login pakai akun Mahasiswa di web Admin, tendang balik!
  if (to.meta.requiresAuth && isAuthenticated && !isAdmin) {
    localStorage.clear(); // Hapus token mahasiswa yang nyasar
    alert("Akses Ditolak: Halaman ini hanya untuk Admin/Pegawai");
    return { name: 'Login' };
  }

  if (to.path === '/login' && isAuthenticated && isAdmin) {
    return { name: 'Dashboard' };
  }

  return true;
});

export default router;