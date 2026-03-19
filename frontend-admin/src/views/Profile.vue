<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />

    <div class="flex-1 flex flex-col">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
        <div class="flex items-center space-x-2">
          <router-link to="/admin/dashboard" class="text-gray-400 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-xl font-bold text-gray-800">Profil Saya</h1>
        </div>
      </header>

      <main class="p-8">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="h-32 bg-linear-to-r from-blue-600 to-indigo-700"></div>
            
            <div class="px-8 pb-8">
              <div class="relative flex justify-between items-end -mt-12 mb-6">
                <div class="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg">
                  <div class="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black border border-blue-50">
                    {{ authStore.user?.nama?.charAt(0) || 'A' }}
                  </div>
                </div>
                <button class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 cursor-pointer">
                  Edit Profil
                </button>
              </div>

              <div class="mb-8">
                <h2 class="text-2xl font-black text-gray-900">{{ authStore.user?.nama || 'Administrator' }}</h2>
                <p class="text-gray-500 font-medium">{{ authStore.user?.email }}</p>
                <div class="flex mt-3 space-x-2">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ authStore.user?.level || 'Admin' }}
                  </span>
                  <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    Aktif
                  </span>
                </div>
              </div>

              <hr class="border-gray-100 mb-8" />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Informasi Personal</h3>
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 font-bold uppercase">NIP / Kode Pegawai</span>
                      <span class="text-gray-700 font-semibold">{{ authStore.user?.nip || '-' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 font-bold uppercase">Nomor Telepon</span>
                      <span class="text-gray-700 font-semibold">{{ authStore.user?.no_telepon || '-' }}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Keamanan Akun</h3>
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 font-bold uppercase">Status Verifikasi</span>
                      <div class="flex items-center text-green-600 font-bold text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Terverifikasi
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 font-bold uppercase">Password</span>
                      <button class="text-blue-600 font-bold text-sm hover:underline text-left cursor-pointer">
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
              <p class="text-red-600/70 text-sm">Hapus semua cache dan keluar dari sistem.</p>
            </div>
            <button 
              @click="handleLogout"
              class="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';

const authStore = useAuthStore();
const router = useRouter();

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me'); 
    if (response.data.status === 'success') {
      const userData = response.data.data;
      authStore.user = {
        ...authStore.user,
        nama: userData.nama_lengkap || userData.nama,
        nip: userData.pegawai?.nip || userData.nip,
        no_telepon: userData.no_telepon,
        level: userData.Role?.nama_role || authStore.user.level
      };
      localStorage.setItem("user", JSON.stringify(authStore.user));
    }
  } catch (error) {
    console.error("Gagal menarik data profil:", error);
  }
};

onMounted(async () => {
  await authStore.fetchMe(); // Tarik data terbaru dari server
});

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    authStore.logout();
    router.replace('/admin/login'); 
  }
};
</script>