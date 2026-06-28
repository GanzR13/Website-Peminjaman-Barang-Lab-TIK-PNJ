<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">

    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="w-full px-4 sm:px-6 md:px-8 lg:px-10 relative z-50 bg-white">
        <div class="flex justify-between items-center h-16 md:h-20">

          <div class="flex items-center gap-3 md:gap-4 shrink-0">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
              <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
              <XMarkIcon v-else class="w-6 h-6" />
            </button>
            <div>
              <img src="../assets/logo_pnj.png" alt="Logo PNJ" class="mx-auto h-8 sm:h-10 w-auto drop-shadow-md" />
            </div>
            <h1 class="font-black text-slate-800 text-lg tracking-tight">SI-LAB PLP TIK</h1>
          </div>

          <nav class="hidden md:flex space-x-6 lg:space-x-8 h-full">
            <router-link to="/dashboard"
              class="inline-flex items-center px-1 border-b-2 border-transparent text-sm font-bold transition-colors text-slate-500 hover:text-blue-600 hover:border-blue-600"
              active-class="!border-blue-600 !text-blue-600">
              Beranda
            </router-link>
            <router-link to="/catalog"
              class="inline-flex items-center px-1 border-b-2 border-transparent text-sm font-bold transition-colors text-slate-500 hover:text-blue-600 hover:border-blue-600"
              active-class="!border-blue-600 !text-blue-600">
              Katalog Barang
            </router-link>
            <router-link to="/riwayat"
              class="inline-flex items-center px-1 border-b-2 border-transparent text-sm font-bold transition-colors text-slate-500 hover:text-blue-600 hover:border-blue-600"
              active-class="!border-blue-600 !text-blue-600">
              Riwayat Peminjaman
            </router-link>
            <router-link v-if="isDosen" to="/approval-dosen"
              class="inline-flex items-center px-1 border-b-2 border-transparent text-sm font-bold transition-colors text-slate-500 hover:text-blue-600 hover:border-blue-600"
              active-class="!border-blue-600 !text-blue-600">
              Approval Dosen
            </router-link>
          </nav>

          <div class="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
            <div class="hidden md:flex flex-col text-right">
              <span class="text-sm font-bold text-slate-900 leading-tight">{{ authStore.user?.nama || 'Rizki' }}</span>
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ userDisplayRole }}</span>
            </div>

            <router-link to="/profile"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm uppercase shrink-0 active:scale-95"
              title="Lihat Profil Saya">
              {{ authStore.user?.nama?.charAt(0) || 'R' }}
            </router-link>

            <div class="hidden md:block w-px h-6 bg-slate-200 mx-1"></div>

            <button @click="handleLogout"
              class="hidden md:flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer active:scale-95"
              title="Keluar">
              <ArrowRightOnRectangleIcon class="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Backdrop Mobile Menu -->
      <transition name="fade-backdrop">
        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
          class="md:hidden fixed inset-0 top-16 bg-slate-900/30 backdrop-blur-sm z-40 cursor-pointer">
        </div>
      </transition>

      <!-- Dropdown Mobile Menu -->
      <transition name="dropdown">
        <div v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl overflow-hidden z-50">
          <div class="px-4 py-3 space-y-1.5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <router-link to="/dashboard"
              class="block px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors active:scale-95"
              active-class="bg-blue-50 !text-blue-600">Beranda</router-link>
            <router-link to="/catalog"
              class="block px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors active:scale-95"
              active-class="bg-blue-50 !text-blue-600">Katalog Barang</router-link>
            <router-link to="/riwayat"
              class="block px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors active:scale-95"
              active-class="bg-blue-50 !text-blue-600">Peminjaman Saya</router-link>
            <router-link v-if="isDosen" to="/approval-dosen"
              class="block px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors active:scale-95"
              active-class="bg-blue-50 !text-blue-600">
              Approval Dosen
            </router-link>

            <div class="my-2 border-t border-slate-100"></div>

            <router-link to="/profile"
              class="block px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors active:scale-95"
              active-class="bg-blue-50 !text-blue-600">Profil Saya</router-link>
            <button @click="handleLogout"
              class="w-full text-left block px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 bg-white hover:bg-red-50 transition-colors cursor-pointer active:scale-95">
              Keluar Aplikasi
            </button>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8">
      <router-view />
    </main>

    <footer class="bg-white border-t border-slate-200 mt-auto shrink-0">
      <div
        class="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-center md:text-left">
        <p class="text-xs md:text-sm text-slate-500 font-medium">
          © 2026 Laboratorium PLP TIK Politeknik Negeri Jakarta.
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useConfirm } from '../composables/useConfirm';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { showConfirm } = useConfirm();

const isMobileMenuOpen = ref(false);

const isDosen = computed(() => {
  const roleId = Number(authStore.user?.role_id || authStore.user?.role?.id);

  const roleName = String(
    authStore.user?.role_name ||
    authStore.user?.nama_role ||
    authStore.user?.role?.nama_role ||
    ''
  ).toLowerCase();

  const level = String(
    authStore.user?.level ||
    authStore.user?.level_akses ||
    authStore.user?.role?.level_akses ||
    ''
  ).toLowerCase();

  return roleId === 4 || roleName === 'dosen' || level === 'dosen';
});

const userDisplayRole = computed(() => {
  return (
    authStore.user?.role_name ||
    authStore.user?.nama_role ||
    authStore.user?.level ||
    'Mahasiswa'
  );
});

watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

const handleLogout = () => {
  isMobileMenuOpen.value = false;

  showConfirm(
    'Apakah Anda yakin ingin keluar dari aplikasi?',
    async () => {
      authStore.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart_peminjaman');

      await router.push('/login');
    },
    null,
    'Ya, Keluar',
    'red',
    'Konfirmasi Logout'
  );
};
</script>

<style scoped>
/* Transisi untuk Dropdown Mobile Menu */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transisi khusus untuk layar gelap (Backdrop) */
.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}
</style>