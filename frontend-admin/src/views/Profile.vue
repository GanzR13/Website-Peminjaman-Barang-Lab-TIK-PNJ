<template>
  <div class="h-full bg-slate-50 overflow-y-auto custom-scrollbar animate-fade-in">
    <div class="p-4 md:p-8">
      <div class="max-w-5xl mx-auto">
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

        <div v-if="isLoading" class="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div class="w-11 h-11 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-slate-500 font-bold text-sm animate-pulse">
            Memuat data profil admin...
          </p>
        </div>

        <template v-else>
          <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            <div class="h-32 md:h-44 bg-linear-to-r from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
              <div class="absolute top-0 right-0 -mt-12 -mr-12 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>
              <div class="absolute bottom-0 left-0 -mb-16 -ml-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div class="px-5 md:px-8 pb-8">
              <div
                class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 -mt-12 md:-mt-16 mb-7">
                <div class="flex flex-col sm:flex-row sm:items-end gap-4">
                  <div class="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-2 shadow-xl shrink-0">
                    <div
                      class="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 text-3xl md:text-5xl font-black border border-slate-200 uppercase">
                      {{ getInitial(authStore.user?.nama || authStore.user?.email) }}
                    </div>
                  </div>

                  <div class="pb-1 text-center sm:text-left">
                    <h2 class="text-xl md:text-3xl font-medium text-white leading-tight">
                      {{ authStore.user?.nama || 'Administrator' }}
                    </h2>
                    <p class="text-slate-500 font-bold text-sm mt-1 break-all">
                      {{ authStore.user?.email || '-' }}
                    </p>

                    <div class="flex flex-wrap justify-center sm:justify-start mt-3 gap-2">
                      <span
                        class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-slate-200">
                        {{ authStore.user?.level || 'Admin' }}
                      </span>

                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1"
                        :class="checkVerified(authStore.user?.email_verified)
                          ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                          : 'bg-red-50 text-red-600 ring-red-200'">
                        {{ checkVerified(authStore.user?.email_verified) ? 'Terverifikasi' : 'Belum Verifikasi' }}
                      </span>
                    </div>
                  </div>
                </div>

                <button type="button" @click="openEditProfile"
                  class="w-full lg:w-auto px-6 py-3 bg-slate-900 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-200 cursor-pointer active:scale-95 flex justify-center items-center gap-2">
                  <PencilIcon class="w-4 h-4" />
                  Edit Profil
                </button>
              </div>

              <hr class="border-slate-100 mb-7" />

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <section class="lg:col-span-2 space-y-5">
                  <div class="flex items-center gap-2">
                    <UserIcon class="w-4 h-4 text-slate-400" />
                    <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">
                      Informasi Personal
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span class="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                        NIP
                      </span>
                      <span class="text-slate-900 font-black font-mono wrap-break-word">
                        {{ authStore.user?.identitas || authStore.user?.nip || '-' }}
                      </span>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span class="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                        Nomor Telepon
                      </span>
                      <span class="text-slate-900 font-black wrap-break-word">
                        {{ authStore.user?.no_telepon || '-' }}
                      </span>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                      <span class="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                        Email Institusi
                      </span>
                      <span class="text-slate-900 font-black break-all">
                        {{ authStore.user?.email || '-' }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <span class="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                          Password
                        </span>
                        <p class="text-sm text-slate-500 font-medium">
                          Ubah kata sandi akun admin secara berkala untuk menjaga keamanan.
                        </p>
                      </div>

                      <button type="button" @click="openEditPassword"
                        class="px-4 py-2.5 bg-white border border-slate-200 text-blue-600 font-black text-sm rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer shrink-0">
                        Ubah
                      </button>
                    </div>
                  </div>
                </section>

                <section class="space-y-5">
                  <div class="flex items-center gap-2">
                    <PencilIcon class="w-4 h-4 text-slate-400" />
                    <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">
                      TTD Digital
                    </h3>
                  </div>

                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div class="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p class="text-sm font-black text-slate-800">
                          Tanda Tangan
                        </p>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">
                          Digunakan untuk dokumen digital.
                        </p>
                      </div>

                      <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1"
                        :class="authStore.user?.ttd_digital
                          ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                          : 'bg-slate-100 text-slate-500 ring-slate-200'">
                        {{ authStore.user?.ttd_digital ? 'Ada' : 'Belum Ada' }}
                      </span>
                    </div>

                    <div v-if="authStore.user?.ttd_digital"
                      class="bg-white border border-slate-200 rounded-2xl p-4 h-36 flex items-center justify-center">
                      <img :src="authStore.user.ttd_digital" alt="TTD Digital"
                        class="max-h-28 max-w-full object-contain" />
                    </div>

                    <div v-else
                      class="bg-white border border-dashed border-slate-200 rounded-2xl p-6 h-36 flex items-center justify-center text-center">
                      <p class="text-sm font-bold text-slate-400">
                        Belum ada TTD digital.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div
            class="mt-6 md:mt-8 bg-red-50 rounded-2xl p-5 md:p-6 border border-red-100 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 animate-fade-in">
            <div>
              <h4 class="text-red-800 font-black text-lg md:text-base">
                Keluar dari Sesi
              </h4>
              <p class="text-red-600/70 text-xs md:text-sm mt-0.5">
                Hapus semua cache kredensial dan keluar dari sistem.
              </p>
            </div>

            <button type="button" @click="handleLogout"
              class="w-full sm:w-auto px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95 flex justify-center items-center gap-2">
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
              Logout Akun
            </button>
          </div>
        </template>
      </div>
    </div>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="isEditProfileOpen"
          class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
          @click.self="closeEditProfile">
          
          <div class="w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 class="text-xl font-black text-slate-900">
                  Edit Profil
                </h3>
                <p class="text-sm text-slate-500 font-medium mt-1">
                  Perbarui data profil dan tanda tangan digital.
                </p>
              </div>

              <button type="button" @click="closeEditProfile"
                class="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer active:scale-95">
                ✕
              </button>
            </div>

            <form @submit.prevent="submitEditProfile" class="flex flex-col min-h-0 flex-1 overflow-hidden">
              
              <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-5 bg-white">
                
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    NIP / Identitas
                  </label>
                  <input v-model="editProfileForm.nip" 
                    @input="editProfileForm.nip = editProfileForm.nip.replace(/\D/g, '').slice(0, 18)" 
                    type="text" inputmode="numeric" placeholder="Masukkan NIP Anda"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold transition-all" />
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Nama Lengkap
                  </label>
                  <input v-model="editProfileForm.nama_lengkap" type="text"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold transition-all" />
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    No. WhatsApp
                  </label>
                  <input v-model="editProfileForm.no_telepon"
                    @input="editProfileForm.no_telepon = editProfileForm.no_telepon.replace(/\D/g, '').slice(0, 14)"
                    type="text" inputmode="numeric" maxlength="14" placeholder="Contoh: 081234567890"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold transition-all" />
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Upload TTD Digital
                  </label>

                  <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    <input ref="ttdInputRef" type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                      class="hidden" @change="handleTtdDigitalChange" />

                    <div v-if="ttdPreview"
                      class="bg-white border border-slate-200 rounded-2xl p-4 h-36 flex items-center justify-center mb-4">
                      <img :src="ttdPreview" alt="Preview TTD Digital" class="max-h-28 max-w-full object-contain" />
                    </div>

                    <div v-else-if="authStore.user?.ttd_digital"
                      class="bg-white border border-slate-200 rounded-2xl p-4 h-36 flex items-center justify-center mb-4">
                      <img :src="authStore.user.ttd_digital" alt="TTD Digital Saat Ini"
                        class="max-h-28 max-w-full object-contain" />
                    </div>

                    <div v-else
                      class="bg-white border border-dashed border-slate-200 rounded-2xl p-5 h-36 flex items-center justify-center text-center mb-4">
                      <p class="text-sm font-bold text-slate-400">
                        Belum ada file yang dipilih.
                      </p>
                    </div>

                    <button type="button" @click="ttdInputRef?.click()"
                      class="w-full px-4 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl text-sm font-black transition-all cursor-pointer">
                      Pilih File TTD Digital
                    </button>

                    <p class="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">
                      Format JPG, JPEG, PNG, atau WEBP. Maksimal ukuran file {{ MAX_TTD_SIZE_MB }} MB.
                    </p>

                    <button v-if="editProfileForm.ttd_digital_file || ttdPreview" type="button" @click="resetTtdDigital"
                      class="mt-3 text-xs font-black text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                      Hapus pilihan file
                    </button>
                  </div>
                </div>

                <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-2 items-start">
                  <InformationCircleIcon class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p class="text-[10px] text-blue-700 font-bold leading-relaxed">
                    Email institusi tidak dapat diubah secara mandiri. Silakan hubungi Super Admin jika terdapat kesalahan data email.
                  </p>
                </div>
              </div>

              <div class="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 rounded-b-3xl">
                <button type="button" @click="closeEditProfile"
                  class="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-black hover:bg-slate-100 transition-all cursor-pointer">
                  Batal
                </button>

                <button type="submit" :disabled="isSubmitting"
                  class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <span v-if="isSubmitting"
                    class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>

            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
    <transition name="fade">
      <div v-if="isEditPasswordOpen"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
        @click.self="isEditPasswordOpen = false">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
          <div class="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <h3 class="text-lg font-black text-slate-800">
              Ubah Kata Sandi
            </h3>

            <button type="button" @click="isEditPasswordOpen = false"
              class="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer outline-none">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="p-5 md:p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Kata Sandi Saat Ini
              </label>
              <input v-model="editPasswordForm.old_password" type="password"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold transition-all" />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Kata Sandi Baru
              </label>
              <input v-model="editPasswordForm.new_password" type="password"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold transition-all" />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Konfirmasi Sandi Baru
              </label>
              <input v-model="editPasswordForm.confirm_password" type="password"
                :class="passwordMismatch ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50'"
                class="w-full px-4 py-3 border rounded-xl focus:ring-4 outline-none text-sm font-bold transition-all" />
              <p v-if="passwordMismatch" class="text-[10px] text-red-500 font-bold mt-1 ml-1">
                Kata sandi baru tidak cocok.
              </p>
            </div>
          </div>

          <div class="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-2">
            <button type="button" @click="isEditPasswordOpen = false" :disabled="isSubmitting"
              class="w-full sm:w-auto px-4 py-2.5 text-sm font-black text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
              Batal
            </button>

            <button type="button" @click="submitEditPassword"
              :disabled="isSubmitting || passwordMismatch || !isPasswordFormValid"
              class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Perbarui Sandi
            </button>
          </div>
        </div>
      </div>
    </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import {
  PencilIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const isLoading = ref(true);
const isSubmitting = ref(false);

const MAX_TTD_SIZE_MB = 2;
const MAX_TTD_SIZE = MAX_TTD_SIZE_MB * 1024 * 1024;

const ttdInputRef = ref(null);
const ttdPreview = ref(null);

// --- STATE MODAL EDIT PROFIL ---
const isEditProfileOpen = ref(false);
const editProfileForm = reactive({
  nip: '', // Ditambahkan state NIP
  nama_lengkap: '',
  no_telepon: '',
  ttd_digital_file: null,
});

// --- STATE MODAL UBAH SANDI ---
const isEditPasswordOpen = ref(false);
const editPasswordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: '',
});

const passwordMismatch = computed(() => {
  if (!editPasswordForm.new_password || !editPasswordForm.confirm_password) return false;
  return editPasswordForm.new_password !== editPasswordForm.confirm_password;
});

const isPasswordFormValid = computed(() => {
  return editPasswordForm.old_password.length > 0 &&
    editPasswordForm.new_password.length >= 6 &&
    !passwordMismatch.value;
});

const getInitial = (value) => {
  if (!value) return 'A';
  return String(value).charAt(0).toUpperCase();
};

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

    if (response.data?.status === 'success') {
      const userData = response.data.data;

      authStore.user = {
        ...authStore.user,
        id: userData.id,
        nama: userData.nama_lengkap || userData.nama,
        email: userData.email,
        email_verified: userData.email_verified,
        no_telepon: userData.no_telepon,
        ttd_digital: userData.ttd_digital,
        identitas: userData.pegawai?.nip || userData.nip || userData.nim,
        level: userData.Role?.nama_role || userData.nama_role || authStore.user?.level || 'Admin',
      };

      localStorage.setItem('user', JSON.stringify(authStore.user));
    }
  } catch (error) {
    if (error.response?.status === 401) {
      authStore.logout();
      return;
    }

    showAlert('Gagal memuat profil terbaru.', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchUserProfile());

// --- FUNGSI UPDATE PROFIL ---
const openEditProfile = () => {
  editProfileForm.nip = authStore.user?.identitas || authStore.user?.nip || ''; // Ambil NIP
  editProfileForm.nama_lengkap = authStore.user?.nama || '';
  editProfileForm.no_telepon = authStore.user?.no_telepon || '';
  resetTtdDigital();
  isEditProfileOpen.value = true;
};

const closeEditProfile = () => {
  if (isSubmitting.value) return;
  resetTtdDigital();
  isEditProfileOpen.value = false;
};

const handleTtdDigitalChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    showAlert('Format TTD digital harus JPG, JPEG, PNG, atau WEBP.', 'error');
    resetTtdDigital();
    return;
  }

  if (file.size > MAX_TTD_SIZE) {
    showAlert(`Ukuran TTD digital maksimal ${MAX_TTD_SIZE_MB} MB.`, 'error');
    resetTtdDigital();
    return;
  }

  editProfileForm.ttd_digital_file = file;

  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
  }

  ttdPreview.value = URL.createObjectURL(file);
};

const resetTtdDigital = () => {
  editProfileForm.ttd_digital_file = null;

  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
    ttdPreview.value = null;
  }

  if (ttdInputRef.value) {
    ttdInputRef.value.value = '';
  }
};

const submitEditProfile = async () => {
  if (!editProfileForm.nip.trim()) {
    return showAlert('NIP/Identitas wajib diisi.', 'error');
  }
  if (!editProfileForm.nama_lengkap.trim()) {
    return showAlert('Nama lengkap wajib diisi.', 'error');
  }

  if (!editProfileForm.no_telepon.trim()) {
    return showAlert('Nomor telepon wajib diisi.', 'error');
  }

  if (editProfileForm.no_telepon.length < 10) {
    return showAlert('Nomor telepon minimal 10 digit.', 'error');
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();

    formData.append('nip', editProfileForm.nip.trim()); // Kirim NIP
    formData.append('nama_lengkap', editProfileForm.nama_lengkap.trim());
    formData.append('no_telepon', editProfileForm.no_telepon.trim());

    if (editProfileForm.ttd_digital_file) {
      formData.append('ttd_digital', editProfileForm.ttd_digital_file);
    }

    await api.put(`/users/${authStore.user.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showAlert('Profil berhasil diperbarui!', 'success');
    isEditProfileOpen.value = false;
    resetTtdDigital();
    await fetchUserProfile();
  } catch (error) {
    showAlert(error.response?.data?.message || 'Gagal memperbarui profil.', 'error');
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
      newPassword: editPasswordForm.new_password,
    });

    showAlert('Kata sandi berhasil diperbarui!', 'success');
    isEditPasswordOpen.value = false;
  } catch (error) {
    showAlert(error.response?.data?.message || 'Kata sandi lama salah atau terjadi kesalahan.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const handleLogout = () => {
  showConfirm(
    'Apakah Anda yakin ingin keluar dari sistem?',
    () => authStore.logout(),
    null,
    'Ya, Keluar',
    'red'
  );
};

onUnmounted(() => {
  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
  }
});
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
    transform: translateY(18px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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

.hidden-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>