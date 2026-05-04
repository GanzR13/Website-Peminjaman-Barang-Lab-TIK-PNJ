<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto animate-fade-in">
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

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p class="text-gray-500 font-bold text-sm animate-pulse">Memuat data profil admin...</p>
        </div>

        <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div class="h-32 bg-linear-to-r from-slate-800 to-slate-700 relative overflow-hidden">
             <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>
          
          <div class="px-8 pb-8">
            <div class="relative flex justify-between items-end -mt-12 mb-6">
              <div class="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg">
                <div class="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 text-4xl font-black border border-slate-200 uppercase">
                  {{ authStore.user?.nama?.charAt(0) || 'A' }}
                </div>
              </div>
              
              <button class="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200 cursor-pointer active:scale-95 flex items-center gap-2">
                <PencilIcon class="w-4 h-4" />
                Edit Profil
              </button>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-black text-gray-900">{{ authStore.user?.nama || 'Administrator' }}</h2>
              <p class="text-gray-500 font-medium">{{ authStore.user?.email }}</p>
              <div class="flex mt-3 space-x-2">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-slate-200">
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
                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <UserIcon class="w-4 h-4 text-gray-400" /> Informasi Personal
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">NIP / Kode Pegawai</span>
                    <span class="text-gray-900 font-bold font-mono">{{ authStore.user?.identitas || authStore.user?.nip || '-' }}</span>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Nomor Telepon</span>
                    <span class="text-gray-900 font-bold">{{ authStore.user?.no_telepon || '-' }}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <LockClosedIcon class="w-4 h-4 text-gray-400" /> Keamanan Akun
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status Verifikasi</span>
                    <div class="flex items-center text-green-600 font-bold text-sm mt-0.5">
                      <CheckCircleIcon class="w-5 h-5 mr-1.5" />
                      Terverifikasi
                    </div>
                  </div>
                  <div class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Password</span>
                    <button class="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors text-left cursor-pointer w-fit mt-0.5">
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div v-if="!isLoading" class="mt-8 bg-red-50 rounded-2xl p-6 border border-red-100 flex items-center justify-between animate-fade-in">
          <div>
            <h4 class="text-red-800 font-bold">Keluar dari Sesi</h4>
            <p class="text-red-600/70 text-sm mt-0.5">Hapus semua cache kredensial dan keluar dari sistem.</p>
          </div>
          <button 
            @click="handleLogout"
            class="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
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
import { useAlert } from '../composables/useAlert';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();

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
        identitas: userData.pegawai?.nip || userData.nip || userData.nim, 
        level: userData.Role?.nama_role || authStore.user.level || 'Admin'
      };
      
      localStorage.setItem("user", JSON.stringify(authStore.user));
    }
  } catch (error) {
    console.error("Gagal menarik data profil dari server:", error);
    
    if (error.response && error.response.status === 401) {
      authStore.logout();
    } else {
      showAlert("Gagal memuat profil terbaru. Periksa koneksi Anda.", "error");
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});

const handleLogout = () => {
  showAlert(
    "Apakah Anda yakin ingin keluar dari sistem?", 
    "confirm", 
    () => {
      authStore.logout(); 
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
</style>