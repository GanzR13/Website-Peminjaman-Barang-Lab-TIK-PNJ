<template>
  <aside class="w-64 bg-slate-900 text-white h-full flex flex-col shadow-2xl shrink-0">
    <!-- Header -->
    <div class="p-6 text-xl font-bold border-b border-slate-800 flex items-center justify-between shrink-0">
      <div class="flex items-center space-x-3 min-w-0">
        <div class="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <span class="tracking-wide text-lg truncate">
          SI-LAB <span class="text-blue-400">Admin</span>
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
      <router-link
        to="/admin/dashboard"
        @click="emit('close-mobile')"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>

        <span class="font-medium text-sm">Dashboard</span>
      </router-link>

      <router-link
        to="/peminjaman"
        @click="emit('close-mobile')"
        class="flex items-center justify-between p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
      >
        <div class="flex items-center space-x-3 min-w-0">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>

          <span class="font-medium text-sm truncate">Data Peminjaman</span>
        </div>

        <span
          v-if="totalMenunggu > 0"
          class="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-red-900/40 animate-pulse"
          title="Peminjaman menunggu persetujuan"
        >
          {{ totalMenunggu > 99 ? '99+' : totalMenunggu }}
        </span>
      </router-link>

      <router-link
        to="/laporan-masalah"
        @click="emit('close-mobile')"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="!bg-orange-600 !text-white shadow-lg shadow-orange-900/50"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        <span class="font-medium text-sm">Kendala & Perbaikan</span>
      </router-link>

      <router-link
        to="/barang"
        @click="emit('close-mobile')"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>

        <span class="font-medium text-sm">Data Barang</span>
      </router-link>

      <!-- Super Admin Menu -->
      <template v-if="isSuperAdmin">
        <div class="pt-4 mt-2 mb-1">
          <p class="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Manajemen Pengguna
          </p>
        </div>

        <router-link
          to="/users/peminjam"
          @click="emit('close-mobile')"
          class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          <span class="font-medium text-sm">User Peminjam</span>
        </router-link>

        <router-link
          to="/users/pegawai"
          @click="emit('close-mobile')"
          class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>

          <span class="font-medium text-sm">Staff & Admin</span>
        </router-link>

        <router-link
          to="/admin/action-logs"
          @click="emit('close-mobile')"
          class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
            />
          </svg>

          <span class="font-medium text-sm">Log Action Admin</span>
        </router-link>

        <div class="pt-4 mt-2 mb-1">
          <p class="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Data Referensi
          </p>
        </div>

        <router-link
          to="/referensi/prodi"
          @click="emit('close-mobile')"
          class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l6.16-3.422A12.083 12.083 0 0118 13.5c0 2.485-2.686 4.5-6 4.5s-6-2.015-6-4.5c0-.985-.058-1.95-.16-2.922L12 14z"
            />
          </svg>

          <span class="font-medium text-sm">Referensi Prodi</span>
        </router-link>

        <router-link
          to="/referensi/kelas"
          @click="emit('close-mobile')"
          class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
            />
          </svg>

          <span class="font-medium text-sm">Referensi Kelas</span>
        </router-link>
      </template>

      <!-- Pengaturan -->
      <div class="pt-4 mt-2 mb-1">
        <p class="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Pengaturan
        </p>
      </div>

      <router-link
        to="/admin/profile"
        @click="emit('close-mobile')"
        class="flex items-center space-x-3 p-3 rounded-xl transition duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
        active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-900/50"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>

        <span class="font-medium text-sm">Profil Saya</span>
      </router-link>
    </nav>

    <!-- Logout -->
    <div class="p-4 border-t border-slate-800 shrink-0">
      <button
        @click="handleLogout"
        class="flex items-center space-x-3 p-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 group cursor-pointer"
      >
        <svg class="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>

        <span class="font-semibold text-sm">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useConfirm } from '../composables/useConfirm';
import api from '../plugins/axios';

const emit = defineEmits(['close-mobile']);

const authStore = useAuthStore();
const { showConfirm } = useConfirm();

const totalMenunggu = ref(0);
let notificationInterval = null;

const isSuperAdmin = computed(() => {
  return (
    authStore.user?.level_akses === 'super_admin' ||
    authStore.user?.level === 'super_admin' ||
    authStore.user?.role?.level_akses === 'super_admin' ||
    authStore.isSuperAdmin
  );
});

const fetchTotalMenunggu = async () => {
  if (!authStore.token) return;

  try {
    const response = await api.get('/admin/peminjaman/menunggu/count');
    totalMenunggu.value = response.data?.total || 0;
  } catch (error) {
    console.error('Gagal mengambil notifikasi peminjaman menunggu:', error);
    totalMenunggu.value = 0;
  }
};

const handleLogout = () => {
  showConfirm(
    'Apakah Anda yakin ingin keluar dari aplikasi?',
    () => {
      authStore.logout();
    },
    null,
    'Ya, Keluar',
    'red',
    'Konfirmasi Logout'
  );
};

onMounted(() => {
  fetchTotalMenunggu();

  notificationInterval = setInterval(() => {
    fetchTotalMenunggu();
  }, 30000);
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}
</style>