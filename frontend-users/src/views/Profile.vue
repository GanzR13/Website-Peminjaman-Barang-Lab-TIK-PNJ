<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto font-sans animate-fade-in">
    <div class="p-6 md:p-8 flex-1">
      <div class="max-w-4xl mx-auto">

        <div class="mb-6">
          <router-link to="/dashboard"
            class="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group w-fit cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div
                  class="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl md:text-5xl font-black border border-blue-50 uppercase shadow-inner">
                  {{ authStore.user?.nama?.charAt(0) || 'U' }}
                </div>
              </div>
              <button
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 cursor-pointer active:scale-95 flex items-center gap-2">
                <PencilIcon class="w-4 h-4" />
                Edit Profil
              </button>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {{ authStore.user?.nama || 'NamaPengguna' }}
              </h2>
              <p class="text-gray-500 font-medium text-sm md:text-base mt-1">
                {{ authStore.user?.email || '-' }}
              </p>
              <div class="flex mt-3.5 space-x-2">
                <!-- FIX: Tampilkan role_name bukan level -->
                <span
                  class="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-blue-100 shadow-sm">
                  {{ authStore.user?.role_name || 'User' }}
                </span>
                <span
                  class="px-3.5 py-1.5 bg-green-50 text-green-600 rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-green-100 shadow-sm">
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
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                      <!-- FIX: Label dinamis NIM atau NIP -->
                      <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        {{ authStore.user?.nim ? 'NIM' : 'NIP' }}
                      </span>
                      <span class="text-gray-900 font-bold font-mono tracking-tight text-sm">
                        {{ authStore.user?.identitas || '-' }}
                      </span>
                    </div>
                    <div
                      class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                      <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        Nomor Telepon
                      </span>
                      <span class="text-gray-900 font-bold text-sm truncate" :title="authStore.user?.no_telepon">
                        {{ authStore.user?.no_telepon || 'Belum diatur' }}
                      </span>
                    </div>
                  </div>

                  <!-- FIX: Deteksi mahasiswa pakai role_name atau nim, bukan level -->
                  <template v-if="isMahasiswa">
                    <div
                      class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                      <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        Program Studi
                      </span>
                      <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.prodi || '-' }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                        <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                          Kelas
                        </span>
                        <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.kelas || '-' }}</span>
                      </div>
                      <div
                        class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                        <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                          Angkatan
                        </span>
                        <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.angkatan || '-' }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </section>

              <section>
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <LockClosedIcon class="w-4 h-4 text-gray-400" /> Keamanan Akun
                </h3>
                <div class="space-y-4">
                  <div
                    class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                      Status Verifikasi
                    </span>
                    <div class="flex items-center text-green-600 font-bold text-sm mt-0.5">
                      <CheckCircleIcon class="h-4 w-4 mr-1.5" />
                      Terverifikasi
                    </div>
                  </div>
                  <div
                    class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                      Password
                    </span>
                    <button
                      class="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors text-left cursor-pointer w-fit mt-0.5">
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div v-if="!isLoading"
          class="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h4 class="text-gray-900 font-bold">Keluar dari Sesi</h4>
            <p class="text-gray-500 text-sm mt-0.5">Hapus semua cache kredensial dan keluar dari sistem.</p>
          </div>
          <button @click="handleLogout"
            class="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm cursor-pointer active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Logout Akun
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';
import { PencilIcon, UserIcon, LockClosedIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();

const isLoading = ref(true);

// FIX: Computed deteksi mahasiswa — pakai nim atau role_name
// Tidak lagi pakai level string yang tidak konsisten
const isMahasiswa = computed(() => {
  return !!authStore.user?.nim || authStore.user?.role_name?.toLowerCase() === 'mahasiswa';
});

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    // FIX: Gunakan fetchMe() dari authStore langsung
    // agar mapping data konsisten di satu tempat (auth.js)
    await authStore.fetchMe();
  } catch (error) {
    console.error("Gagal menarik data profil dari server:", error);
    if (error.response?.status === 401) {
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

.overflow-y-auto::-webkit-scrollbar { width: 5px; }
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>