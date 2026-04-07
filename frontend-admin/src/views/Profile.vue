<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto">
    <div class="p-8 flex-1">
      <div class="max-w-4xl mx-auto">
        
        <div class="mb-6">
          <router-link to="/admin/dashboard" class="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </router-link>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="h-32 bg-linear-to-r from-blue-600 to-indigo-700"></div>
          
          <div class="px-8 pb-8">
            <div class="relative flex justify-between items-end -mt-12 mb-6">
              <div class="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg">
                <div class="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black border border-blue-50 uppercase">
                  {{ authStore.user?.nama?.charAt(0) || 'A' }}
                </div>
              </div>
              <button class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 cursor-pointer active:scale-95">
                Edit Profil
              </button>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-black text-gray-900">{{ authStore.user?.nama || 'Administrator' }}</h2>
              <p class="text-gray-500 font-medium">{{ authStore.user?.email }}</p>
              <div class="flex mt-3 space-x-2">
                <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-blue-100">
                  {{ authStore.user?.level || 'Admin' }}
                </span>
                <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-green-100">
                  Aktif
                </span>
              </div>
            </div>

            <hr class="border-gray-100 mb-8" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Informasi Personal</h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">NIP / Kode Pegawai</span>
                    <span class="text-gray-900 font-bold font-mono">{{ authStore.user?.nip || '-' }}</span>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Nomor Telepon</span>
                    <span class="text-gray-900 font-bold">{{ authStore.user?.no_telepon || '-' }}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Keamanan Akun</h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status Verifikasi</span>
                    <div class="flex items-center text-green-600 font-bold text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      Terverifikasi
                    </div>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Password</span>
                    <button class="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors text-left cursor-pointer w-fit">
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div class="mt-8 bg-red-50 rounded-2xl p-6 border border-red-100 flex items-center justify-between">
          <div>
            <h4 class="text-red-800 font-bold">Keluar dari Sesi</h4>
            <p class="text-red-600/70 text-sm">Hapus semua cache kredensial dan keluar dari sistem.</p>
          </div>
          <button 
            @click="handleLogout"
            class="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Logout Akun
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Pastikan store auth kamu memiliki fungsi fetchMe() untuk menarik data user terbaru
  if(typeof authStore.fetchMe === 'function') {
    await authStore.fetchMe(); 
  }
});

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
    authStore.logout();
    router.replace('/admin/login'); 
  }
};
</script>