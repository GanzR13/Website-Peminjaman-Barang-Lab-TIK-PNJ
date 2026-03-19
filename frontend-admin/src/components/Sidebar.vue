<template>
  <aside class="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
    <div class="p-6 text-xl font-bold border-b border-slate-800 flex items-center space-x-3">
      <div class="bg-blue-600 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <span>Admin <span class="text-blue-400">PLP</span></span>
    </div>

    <nav class="flex-1 p-4 space-y-2 mt-4">
      <router-link to="/admin/dashboard" 
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800"
        active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        <span class="font-medium">Dashboard</span>
      </router-link>

      <router-link to="/users/pegawai" 
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="bg-blue-600 text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <span class="font-medium">Manajemen Pegawai</span>
      </router-link>

      <router-link to="/users/peminjam" 
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="bg-blue-600 text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <span class="font-medium">Manajemen Peminjam</span>
      </router-link>

      <router-link to="/barang" 
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="bg-blue-600 text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        <span class="font-medium">Data Barang</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button @click="handleLogout" class="flex items-center space-x-3 p-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition duration-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        <span class="font-semibold">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/admin/login');
};
</script>