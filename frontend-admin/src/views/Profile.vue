<template>
  <div class="flex flex-col h-full bg-slate-50 overflow-y-auto animate-fade-in custom-scrollbar">
    <div class="p-4 md:p-8 flex-1">
      <div class="max-w-4xl mx-auto">

        <div class="mb-4 md:mb-6">
          <router-link to="/admin/dashboard"
            class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </router-link>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div
            class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
          </div>
          <p class="text-slate-500 font-bold text-sm animate-pulse">Memuat data profil admin...</p>
        </div>

        <div v-else
          class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in relative z-10">
          <div class="h-28 md:h-36 bg-linear-to-r from-slate-800 to-slate-700 relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>

          <div class="px-5 md:px-8 pb-8">
            <div class="relative flex flex-col sm:flex-row justify-between sm:items-end -mt-12 sm:-mt-16 mb-6 gap-4">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-2 shadow-lg z-20">
                <div
                  class="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 text-3xl md:text-5xl font-black border border-slate-200 uppercase">
                  {{ authStore.user?.nama?.charAt(0) || 'A' }}
                </div>
              </div>

              <button @click="openEditProfile"
                class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200 cursor-pointer active:scale-95 flex justify-center items-center gap-2">
                <PencilIcon class="w-4 h-4" />
                Edit Profil
              </button>
            </div>

            <div class="mb-8 text-center sm:text-left">
              <h2 class="text-xl md:text-2xl font-black text-slate-900">{{ authStore.user?.nama || 'Administrator' }}
              </h2>
              <p class="text-slate-500 font-medium">{{ authStore.user?.email }}</p>
              <div class="flex flex-wrap justify-center sm:justify-start mt-3 gap-2">
                <span
                  class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-slate-200">
                  {{ authStore.user?.level || 'Admin' }}
                </span>
                <span
                  class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-emerald-200">
                  Aktif
                </span>
              </div>
            </div>

            <hr class="border-slate-100 mb-8" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <section>
                <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <UserIcon class="w-4 h-4 text-slate-400" /> Informasi Personal
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">NIP</span>
                    <span class="text-slate-900 font-bold font-mono">{{ authStore.user?.identitas || authStore.user?.nip || '-' }}</span>
                  </div>
                  <div class="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Nomor
                      Telepon</span>
                    <span class="text-slate-900 font-bold">{{ authStore.user?.no_telepon || '-' }}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <LockClosedIcon class="w-4 h-4 text-slate-400" /> Keamanan Akun
                </h3>
                <div class="space-y-4">
                  <div class="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status
                      Verifikasi</span>
                    <div v-if="checkVerified(authStore.user?.email_verified)"
                      class="flex items-center text-emerald-600 font-bold text-sm mt-0.5">
                      <CheckCircleIcon class="w-5 h-5 mr-1.5" /> Terverifikasi
                    </div>
                    <div v-else class="flex items-center text-red-500 font-bold text-sm mt-0.5">
                      <XCircleIcon class="w-5 h-5 mr-1.5" /> Belum Verifikasi
                    </div>
                  </div>

                  <div class="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Password</span>
                    <button @click="openEditPassword"
                      class="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors text-left cursor-pointer w-fit mt-0.5 outline-none">
                      Ubah Kata Sandi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div v-if="!isLoading"
          class="mt-6 md:mt-8 bg-red-50 rounded-2xl p-5 md:p-6 border border-red-100 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 animate-fade-in">
          <div>
            <h4 class="text-red-800 font-bold text-lg md:text-base">Keluar dari Sesi</h4>
            <p class="text-red-600/70 text-xs md:text-sm mt-0.5">Hapus semua cache kredensial dan keluar dari sistem.
            </p>
          </div>
          <button @click="handleLogout"
            class="w-full sm:w-auto px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 flex justify-center items-center gap-2">
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Logout Akun
          </button>
        </div>

      </div>
    </div>

    <!-- MODAL EDIT PROFIL -->
    <transition name="fade">
      <div v-if="isEditProfileOpen"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
          <div class="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-black text-slate-800">Edit Profil</h3>
            <button @click="isEditProfileOpen = false"
              class="text-slate-400 hover:text-red-500 transition-colors cursor-pointer outline-none">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="p-5 md:p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama
                Lengkap</label>
              <input v-model="editProfileForm.nama_lengkap" type="text"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">No.
                WhatsApp</label>
              <input v-model="editProfileForm.no_telepon"
                @input="editProfileForm.no_telepon = editProfileForm.no_telepon.replace(/\D/g, '')" type="text"
                maxlength="14"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium transition-all" />
            </div>
            <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-2 items-start mt-2">
              <InformationCircleIcon class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p class="text-[10px] text-blue-700 font-medium leading-relaxed">Email institusi dan NIP/NIM tidak dapat
                diubah secara mandiri. Silakan hubungi Super Admin jika terdapat kesalahan data.</p>
            </div>
          </div>
          <div class="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-2">
            <button @click="isEditProfileOpen = false" :disabled="isSubmitting"
              class="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
            <button @click="submitEditProfile" :disabled="isSubmitting"
              class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MODAL UBAH KATA SANDI -->
    <transition name="fade">
      <div v-if="isEditPasswordOpen"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
          <div class="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-black text-slate-800">Ubah Kata Sandi</h3>
            <button @click="isEditPasswordOpen = false"
              class="text-slate-400 hover:text-red-500 transition-colors cursor-pointer outline-none">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="p-5 md:p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata
                Sandi Saat Ini</label>
              <input v-model="editPasswordForm.old_password" type="password"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata
                Sandi Baru</label>
              <input v-model="editPasswordForm.new_password" type="password"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium transition-all" />
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Konfirmasi
                Sandi Baru</label>
              <input v-model="editPasswordForm.confirm_password" type="password"
                :class="passwordMismatch ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50'"
                class="w-full px-4 py-2.5 border rounded-xl focus:ring-4 outline-none text-sm font-medium transition-all" />
              <p v-if="passwordMismatch" class="text-[10px] text-red-500 font-bold mt-1 ml-1">Kata sandi baru tidak
                cocok.</p>
            </div>
          </div>
          <div class="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-2">
            <button @click="isEditPasswordOpen = false" :disabled="isSubmitting"
              class="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
            <button @click="submitEditPassword" :disabled="isSubmitting || passwordMismatch || !isPasswordFormValid"
              class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Perbarui Sandi
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm'; // 1. IMPORT CONFIRM BARU
import {
  PencilIcon, UserIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon,
  ArrowRightOnRectangleIcon, XMarkIcon, InformationCircleIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();
const { showConfirm } = useConfirm(); // 2. EKSTRAK showConfirm

const isLoading = ref(true);
const isSubmitting = ref(false);

// --- STATE MODAL EDIT PROFIL ---
const isEditProfileOpen = ref(false);
const editProfileForm = reactive({
  nama_lengkap: '',
  no_telepon: ''
});

// --- STATE MODAL UBAH SANDI ---
const isEditPasswordOpen = ref(false);
const editPasswordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
});

const passwordMismatch = computed(() => {
  if (!editPasswordForm.new_password || !editPasswordForm.confirm_password) return false;
  return editPasswordForm.new_password !== editPasswordForm.confirm_password;
});

const isPasswordFormValid = computed(() => {
  return editPasswordForm.old_password.length > 0 && editPasswordForm.new_password.length >= 6 && !passwordMismatch.value;
});

const checkVerified = (val) => {
  if (val === true || val === 1) return true;

  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();

    return normalized === 'true' ||
      normalized === '1' ||
      normalized === 'verified' ||
      normalized === 'terverifikasi';
  }

  return false;
};

// --- FUNGSI FETCH DATA ---
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
        email_verified: userData.email_verified,
        no_telepon: userData.no_telepon,
        identitas: userData.pegawai?.nip || userData.nip || userData.nim,
        level: userData.Role?.nama_role || authStore.user.level || 'Admin'
      };
      localStorage.setItem("user", JSON.stringify(authStore.user));
    }
  } catch (error) {
    if (error.response?.status === 401) authStore.logout();
    else showAlert("Gagal memuat profil terbaru.", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchUserProfile());

// --- FUNGSI UPDATE PROFIL ---
const openEditProfile = () => {
  editProfileForm.nama_lengkap = authStore.user?.nama || '';
  editProfileForm.no_telepon = authStore.user?.no_telepon || '';
  isEditProfileOpen.value = true;
};

const submitEditProfile = async () => {
  if (!editProfileForm.nama_lengkap.trim() || !editProfileForm.no_telepon.trim()) {
    return showAlert("Semua kolom harus diisi.", "error");
  }
  isSubmitting.value = true;
  try {
    await api.put(`/users/${authStore.user.id}`, {
      nama_lengkap: editProfileForm.nama_lengkap,
      no_telepon: editProfileForm.no_telepon
    });

    showAlert("Profil berhasil diperbarui!", "success");
    isEditProfileOpen.value = false;
    await fetchUserProfile();
  } catch (error) {
    showAlert(error.response?.data?.message || "Gagal memperbarui profil.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// --- FUNGSI UPDATE PASSWORD ---
const openEditPassword = () => {
  editPasswordForm.old_password = '';
  editPasswordForm.new_password = '';
  editPasswordForm.confirm_password = '';
  isEditPasswordOpen.value = true;
};

const submitEditPassword = async () => {
  isSubmitting.value = true;
  try {
    await api.put('/auth/change-password', {
      oldPassword: editPasswordForm.old_password,
      newPassword: editPasswordForm.new_password
    });

    showAlert("Kata sandi berhasil diperbarui!", "success");
    isEditPasswordOpen.value = false;
  } catch (error) {
    showAlert(error.response?.data?.message || "Kata sandi lama salah atau terjadi kesalahan.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// 3. UBAH PEMANGGILAN LOGOUT MENGGUNAKAN useConfirm
const handleLogout = () => {
  showConfirm(
    "Apakah Anda yakin ingin keluar dari sistem?",
    () => authStore.logout(),
    null,
    "Ya, Keluar",
    "red"
  );
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>