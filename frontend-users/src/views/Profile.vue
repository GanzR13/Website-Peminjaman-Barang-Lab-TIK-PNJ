<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto font-sans animate-fade-in">
    <div class="p-6 md:p-8 flex-1">
      <div class="max-w-4xl mx-auto">
        
        <div class="mb-6">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group w-fit cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </router-link>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p class="text-gray-500 font-bold text-sm animate-pulse">Memuat data profil...</p>
        </div>

        <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div class="h-32 bg-linear-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>
          
          <div class="px-6 md:px-8 pb-8">
            <div class="relative flex justify-between items-end -mt-12 mb-6 gap-4 flex-wrap">
              <div class="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white p-1.5 shadow-lg shrink-0">
                <div class="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl md:text-5xl font-black border border-blue-50 uppercase shadow-inner">
                  {{ authStore.user?.nama?.charAt(0) || 'U' }}
                </div>
              </div>
              <button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 cursor-pointer active:scale-95 flex items-center gap-2">
                <PencilIcon class="w-4 h-4" />
                Edit Profil
              </button>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{{ authStore.user?.nama || 'Nama Pengguna' }}</h2>
              <p class="text-gray-500 font-medium text-sm md:text-base mt-1">{{ authStore.user?.email || 'email@pnj.ac.id' }}</p>
              <div class="flex mt-3.5 space-x-2">
                <span class="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-blue-100 shadow-sm">
                  {{ authStore.user?.level || 'User' }}
                </span>
                <span class="px-3.5 py-1.5 bg-green-50 text-green-600 rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-green-100 shadow-sm">
                  Aktif
                </span>
              </div>
            </div>

            <hr class="border-gray-100 mb-8" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <UserIcon class="w-4 h-4 text-gray-400" /> Informasi Personal
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">NIM / NIP</span>
                    <span class="text-gray-900 font-bold font-mono tracking-tight text-sm">{{ authStore.user?.identitas || '-' }}</span>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">Nomor Telepon</span>
                    <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.no_telepon || 'Belum diatur' }}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <LockClosedIcon class="w-4 h-4 text-gray-400" /> Keamanan Akun
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">Status Verifikasi</span>
                    <div class="flex items-center text-green-600 font-bold text-sm mt-0.5">
                      <CheckCircleIcon class="h-4 w-4 mr-1.5" />
                      Terverifikasi
                    </div>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">Password</span>
                    <button class="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors text-left cursor-pointer w-fit mt-0.5">
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div v-if="!isLoading" class="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h4 class="text-gray-900 font-bold">Keluar dari Sesi</h4>
            <p class="text-gray-500 text-sm mt-0.5">Hapus semua cache kredensial dan keluar dari sistem.</p>
          </div>
          <button 
            @click="handleLogout"
            class="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm cursor-pointer active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Logout Akun
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';
import { PencilIcon, UserIcon, LockClosedIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert'; // 1. Import useAlert

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert(); // 2. Ekstrak showAlert

const isLoading = ref(true);

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/auth/me'); 
    
    if (response.data && response.data.status === 'success') {
      const userData = response.data.data;
      
      authStore.user = {
        ...authStore.user,
        id: userData.id,
        nama: userData.nama_lengkap || userData.nama,
        email: userData.email,
        no_telepon: userData.no_telepon,
        identitas: userData.mahasiswa?.nim || userData.pegawai?.nip || userData.nip || userData.nim, 
        level: userData.Role?.nama_role || authStore.user.level || 'Mahasiswa'
      };
      
      localStorage.setItem("user", JSON.stringify(authStore.user));
    }
  } catch (error) {
    console.error("Gagal menarik data profil dari server:", error);
    
    if (error.response && error.response.status === 401) {
      // Tidak perlu alert panjang di sini jika 401, karena authStore akan melempar langsung ke login
      authStore.logout();
    } else {
      // 3. Tampilkan alert error jika server bermasalah (bukan 401)
      showAlert("Gagal memuat profil terbaru. Periksa koneksi Anda.", "error");
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});

// 4. Perbarui fungsi handleLogout
const handleLogout = () => {
  // Panggil mode 'confirm' dengan teks pesan dan callback (fungsi yang dijalankan jika di-klik "Ya")
  showAlert(
    "Apakah Anda yakin ingin keluar dari sistem?", 
    "confirm", 
    () => {
      authStore.logout(); // authStore.logout() sudah meng-handle localStorage.clear() dan redirect!
    }
  );
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.overflow-y-auto::-webkit-scrollbar { width: 5px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
</style>