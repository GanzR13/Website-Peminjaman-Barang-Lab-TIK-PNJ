<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="w-full px-6 md:px-10 lg:px-12">
        <div class="flex justify-between items-center h-16">
          
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-200">
              L
            </div>
            <span class="font-black text-gray-900 text-lg tracking-tight hidden sm:block">Lab TIK PNJ</span>
          </div>

          <nav class="hidden md:flex space-x-8 h-full">
            <router-link 
              to="/dashboard" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors text-gray-500 hover:text-gray-900 hover:border-gray-300"
              active-class="!border-blue-600 !text-blue-600"
            >
              Beranda
            </router-link>
            <router-link 
              to="/catalog" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors text-gray-500 hover:text-gray-900 hover:border-gray-300"
              active-class="!border-blue-600 !text-blue-600"
            >
              Katalog Alat
            </router-link>
            <router-link 
              to="/riwayat" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors text-gray-500 hover:text-gray-900 hover:border-gray-300"
              active-class="!border-blue-600 !text-blue-600"
            >
              Peminjaman Saya
            </router-link>
          </nav>

          <div class="flex items-center gap-3 md:gap-4">
            <div class="hidden md:flex flex-col text-right">
              <span class="text-sm font-bold text-gray-900 leading-tight">{{ authStore.user?.nama || 'Rizki' }}</span>
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ authStore.user?.level || 'Mahasiswa' }}</span>
            </div>
            
            <router-link 
              to="/profile" 
              class="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm uppercase shrink-0"
              title="Lihat Profil Saya"
            >
              {{ authStore.user?.nama?.charAt(0) || 'R' }}
            </router-link>

            <div class="hidden md:block w-px h-6 bg-gray-200 mx-1"></div>
            
            <button @click="handleLogout" class="hidden md:flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Keluar">
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>

            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ml-1">
               <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
               <XMarkIcon v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div class="px-4 pt-2 pb-4 space-y-1">
            <router-link @click="isMobileMenuOpen = false" to="/dashboard" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="bg-blue-50 text-blue-600">Beranda</router-link>
            <router-link @click="isMobileMenuOpen = false" to="/catalog" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="bg-blue-50 text-blue-600">Katalog Alat</router-link>
            <router-link @click="isMobileMenuOpen = false" to="/riwayat" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="bg-blue-50 text-blue-600">Peminjaman Saya</router-link>
            
            <div class="my-2 border-t border-gray-100"></div>
            
            <router-link @click="isMobileMenuOpen = false" to="/profile" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="bg-blue-50 text-blue-600">Profil Saya</router-link>
            <button @click="handleLogout" class="w-full text-left block px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">Keluar Aplikasi</button>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-1 w-full px-6 md:px-10 lg:px-12 py-8">
      <router-view />
    </main>

    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="w-full px-6 md:px-10 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p class="text-sm text-gray-500 font-medium">
          © 2026 Laboratorium PLP TIK Politeknik Negeri Jakarta.
        </p>
        <div class="flex gap-6 text-sm font-bold text-gray-400 justify-center md:justify-start">
          <a href="#" class="hover:text-blue-600 transition-colors">Bantuan</a>
          <a href="#" class="hover:text-blue-600 transition-colors">Panduan Peminjaman</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAlert } from '../composables/useAlert'; // 1. Import useAlert
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const { showAlert } = useAlert(); // 2. Ekstrak showAlert

const handleLogout = () => {
    // 3. Tutup menu mobile terlebih dahulu (jika sedang terbuka)
    isMobileMenuOpen.value = false;
    
    // 4. Tampilkan konfirmasi menggunakan Global Alert
    showAlert(
        "Apakah Anda yakin ingin keluar dari aplikasi?", 
        "confirm", 
        () => {
            authStore.logout(); // authStore akan otomatis menghapus localStorage dan redirect ke login
        }
    );
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>