<template>
  <aside class="w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">

    <div class="p-6 border-b border-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </div>
        <span class="text-xl font-black text-gray-800 tracking-tight">SI-LAB</span>
      </div>

      <button @click="$emit('close-mobile')"
        class="md:hidden p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="p-4 bg-gray-50/50 m-4 rounded-2xl border border-gray-100 mb-2 hover:border-blue-100 transition-colors">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black uppercase shrink-0">
          {{ userInitial }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-bold text-gray-900 truncate" :title="userName">{{ userName }}</p>
          <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">
            {{ userRole }}
          </p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" @click="$emit('close-mobile')"
        class="flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group cursor-pointer text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        active-class="!bg-blue-600 !text-white shadow-lg shadow-blue-200">
        <component :is="item.icon" class="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-gray-100 shrink-0">
      <button @click="handleLogout"
        class="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer group active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-1"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout Sesi
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useConfirm } from '../composables/useConfirm';
import {
  UserCircleIcon,
  Squares2X2Icon,
  ArchiveBoxIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['close-mobile']);

const router = useRouter();
const authStore = useAuthStore();
const { showConfirm } = useConfirm();

const userName = computed(() => {
  return authStore.user?.nama || authStore.user?.nama_lengkap || 'Pengguna';
});

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase();
});

const userRole = computed(() => {
  return authStore.user?.role_name || authStore.user?.level || 'Peminjam';
});

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
  { name: 'Katalog Barang', path: '/catalog', icon: ArchiveBoxIcon },
  { name: 'Riwayat Pinjam', path: '/riwayat', icon: ClockIcon },
  { name: 'Profil', path: '/profile', icon: UserCircleIcon }
];

const handleLogout = () => {
  emit('close-mobile');

  showConfirm(
    'Apakah Anda yakin ingin mengakhiri sesi dan keluar dari sistem?',
    async () => {
      authStore.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart_peminjaman');

      await router.push('/login');
    },
    null,
    'Ya, Logout',
    'red',
    'Konfirmasi Logout'
  );
};
</script>

<style scoped>
/* Scrollbar yang lebih rapi (menyesuaikan tema) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>