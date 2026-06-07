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
          <div
            class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
          </div>
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

              <button @click="openEditProfile"
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
                      <span
                        class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        {{ authStore.user?.nim ? 'NIM' : 'NIP' }}
                      </span>
                      <span class="text-gray-900 font-bold font-mono tracking-tight text-sm">
                        {{ authStore.user?.identitas || '-' }}
                      </span>
                    </div>
                    <div
                      class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                      <span
                        class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        Nomor Telepon
                      </span>
                      <span class="text-gray-900 font-bold text-sm truncate" :title="authStore.user?.no_telepon">
                        {{ authStore.user?.no_telepon || 'Belum diatur' }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span
                          class="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                          TTD Digital
                        </span>
                        <p class="text-xs font-bold text-gray-500">
                          Tanda tangan digital untuk dokumen/surat peminjaman.
                        </p>
                      </div>

                      <span
                        v-if="authStore.user?.ttd_digital"
                        class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase tracking-widest shrink-0">
                        Ada
                      </span>

                      <span
                        v-else
                        class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-black uppercase tracking-widest shrink-0">
                        Belum
                      </span>
                    </div>

                    <div
                      v-if="authStore.user?.ttd_digital"
                      class="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-center min-h-28">
                      <img
                        :src="authStore.user.ttd_digital"
                        alt="TTD Digital"
                        class="max-h-24 max-w-full object-contain" />
                    </div>

                    <div
                      v-else
                      class="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                      <p class="text-sm font-bold text-gray-400">
                        Belum ada TTD digital.
                      </p>
                    </div>
                  </div>

                  <template v-if="isMahasiswa">
                    <div
                      class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                      <span
                        class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                        Program Studi
                      </span>
                      <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.prodi || '-' }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                        <span
                          class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                          Kelas
                        </span>
                        <span class="text-gray-900 font-bold text-sm">{{ authStore.user?.kelas || '-' }}</span>
                      </div>
                      <div
                        class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                        <span
                          class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
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
                    <span
                      class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                      Status Verifikasi Email
                    </span>
                    <div v-if="checkVerified(authStore.user?.email_verified)"
                      class="flex items-center text-emerald-600 font-bold text-sm mt-0.5">
                      <CheckCircleIcon class="h-4 w-4 mr-1.5" />
                      Terverifikasi
                    </div>
                    <div v-else class="flex items-center text-red-500 font-bold text-sm mt-0.5">
                      <XCircleIcon class="h-4 w-4 mr-1.5" />
                      Belum Verifikasi
                    </div>
                  </div>
                  <div
                    class="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-50 transition-colors group">
                    <span
                      class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500">
                      Password
                    </span>
                    <button @click="openEditPassword"
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

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isProfileModalOpen"
          class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
          @click.self="closeProfileModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden relative flex flex-col">
            <div class="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <h3 class="text-xl font-black text-gray-900">Edit Profil Anda</h3>
                <p class="text-xs font-medium text-gray-500 mt-1">
                  Perbarui informasi dasar profil dan TTD digital Anda.
                </p>
              </div>

              <button
                type="button"
                @click="closeProfileModal"
                class="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
                title="Tutup"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="submitProfile" class="flex-1 overflow-y-auto hidden-scrollbar px-6 py-5 space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="profileForm.nama_lengkap"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-gray-50 focus:bg-white font-medium text-sm"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                  Nomor Telepon
                </label>
                <input
                  v-model="profileForm.no_telepon"
                  type="text"
                  inputmode="numeric"
                  maxlength="13"
                  placeholder="Contoh: 081234567890"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-gray-50 focus:bg-white font-medium text-sm"
                  @input="profileForm.no_telepon = profileForm.no_telepon.replace(/\D/g, '').slice(0, 13)"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                  Upload TTD Digital
                </label>

                <div class="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <input
                    ref="ttdInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    class="hidden"
                    @change="handleTtdDigitalChange"
                  />

                  <div v-if="ttdPreview" class="mb-4">
                    <img
                      :src="ttdPreview"
                      alt="Preview TTD Digital"
                      class="h-28 max-w-full object-contain bg-white border border-gray-200 rounded-xl p-2 mx-auto"
                    />
                  </div>

                  <div v-else-if="authStore.user?.ttd_digital" class="mb-4">
                    <img
                      :src="authStore.user.ttd_digital"
                      alt="TTD Digital Saat Ini"
                      class="h-28 max-w-full object-contain bg-white border border-gray-200 rounded-xl p-2 mx-auto"
                    />
                  </div>

                  <div v-else class="mb-4 rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
                    <p class="text-sm font-bold text-gray-400">
                      Belum ada TTD digital.
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="ttdInputRef?.click()"
                    class="w-full px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-xl text-sm font-black transition-all cursor-pointer"
                  >
                    Pilih File TTD Digital
                  </button>

                  <p class="text-[10px] text-gray-400 font-bold mt-2 leading-relaxed">
                    Format JPG, JPEG, PNG, atau WEBP. Maksimal {{ MAX_TTD_SIZE_MB }} MB.
                  </p>

                  <button
                    v-if="profileForm.ttd_digital_file || ttdPreview"
                    type="button"
                    @click="resetTtdDigital"
                    class="mt-3 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Hapus pilihan file
                  </button>
                </div>
              </div>

              <div class="sticky bottom-0 -mx-6 -mb-5 px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  @click="closeProfileModal"
                  class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition cursor-pointer active:scale-95"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  :disabled="isSubmittingProfile"
                  class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span
                    v-if="isSubmittingProfile"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                  </span>
                  {{ isSubmittingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="isPasswordModalOpen"
          class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="isPasswordModalOpen = false">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden relative">
            <button @click="isPasswordModalOpen = false"
              class="absolute top-5 right-5 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer active:scale-95">
              <XMarkIcon class="w-5 h-5" />
            </button>

            <h3 class="text-xl font-black text-gray-900 mb-1 pr-10">Ubah Kata Sandi</h3>
            <p class="text-xs font-medium text-gray-500 mb-6">Pastikan kata sandi baru Anda kuat dan aman.</p>

            <form @submit.prevent="submitPassword" class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Password Lama <span
                    class="text-red-500">*</span></label>
                <div class="relative">
                  <input :type="showOldPassword ? 'text' : 'password'" v-model="passwordForm.password_lama" required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-10 bg-gray-50 focus:bg-white text-sm transition-colors" />
                  <button type="button" @click="showOldPassword = !showOldPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                    <EyeIcon v-if="!showOldPassword" class="h-4 w-4" />
                    <EyeSlashIcon v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Password Baru <span
                    class="text-red-500">*</span></label>
                <div class="relative">
                  <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.password_baru" required
                    minlength="6"
                    class="w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none pr-10 bg-gray-50 focus:bg-white text-sm transition-colors"
                    :class="(passwordForm.password_baru && passwordForm.password_baru.length < 6) ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'" />
                  <button type="button" @click="showNewPassword = !showNewPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                    <EyeIcon v-if="!showNewPassword" class="h-4 w-4" />
                    <EyeSlashIcon v-else class="h-4 w-4" />
                  </button>
                </div>
                <p v-if="passwordForm.password_baru && passwordForm.password_baru.length < 6"
                  class="text-[10px] font-bold text-red-500 mt-1.5 ml-1">
                  * Kata sandi minimal 6 karakter.
                </p>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Konfirmasi Password Baru
                  <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.konfirmasi_password"
                    required minlength="6"
                    class="w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none pr-10 bg-gray-50 focus:bg-white text-sm transition-colors"
                    :class="(passwordForm.konfirmasi_password && passwordForm.password_baru !== passwordForm.konfirmasi_password) ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'" />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                    <EyeIcon v-if="!showConfirmPassword" class="h-4 w-4" />
                    <EyeSlashIcon v-else class="h-4 w-4" />
                  </button>
                </div>
                <p v-if="passwordForm.konfirmasi_password && passwordForm.password_baru !== passwordForm.konfirmasi_password"
                  class="text-[10px] font-bold text-red-500 mt-1.5 ml-1">
                  * Konfirmasi kata sandi tidak cocok.
                </p>
              </div>

              <div class="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-50">
                <button type="button" @click="isPasswordModalOpen = false"
                  class="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition cursor-pointer active:scale-95">
                  Batal
                </button>
                <button type="submit"
                  :disabled="isSubmittingPassword || (passwordForm.password_baru.length > 0 && passwordForm.password_baru.length < 6) || (passwordForm.konfirmasi_password.length > 0 && passwordForm.password_baru !== passwordForm.konfirmasi_password)"
                  class="px-6 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-lg shadow-slate-200 transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2">
                  <span v-if="isSubmittingPassword"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Ubah Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../plugins/axios';
import {
  PencilIcon,
  UserIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const isLoading = ref(true);

// === STATE UNTUK MODAL EDIT PROFIL ===
const isProfileModalOpen = ref(false);
const isSubmittingProfile = ref(false);
const MAX_TTD_SIZE_MB = 2;
const MAX_TTD_SIZE = MAX_TTD_SIZE_MB * 1024 * 1024;
const ttdInputRef = ref(null);
const ttdPreview = ref(null);

const profileForm = ref({
  nama_lengkap: '',
  no_telepon: '',
  ttd_digital_file: null
});

// === STATE UNTUK MODAL KATA SANDI ===
const isPasswordModalOpen = ref(false);
const isSubmittingPassword = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordForm = ref({
  password_lama: '',
  password_baru: '',
  konfirmasi_password: ''
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

const isMahasiswa = computed(() => {
  return !!authStore.user?.nim || authStore.user?.role_name?.toLowerCase() === 'mahasiswa';
});

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
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

onUnmounted(() => {
  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
  }
});

const handleLogout = () => {
  showConfirm(
    'Apakah Anda yakin ingin keluar dari sistem?',
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

// === FUNGSI EDIT PROFIL ===
const resetTtdDigital = () => {
  profileForm.value.ttd_digital_file = null;

  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
    ttdPreview.value = null;
  }

  if (ttdInputRef.value) {
    ttdInputRef.value.value = '';
  }
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

  profileForm.value.ttd_digital_file = file;

  if (ttdPreview.value) {
    URL.revokeObjectURL(ttdPreview.value);
  }

  ttdPreview.value = URL.createObjectURL(file);
};

const closeProfileModal = () => {
  if (isSubmittingProfile.value) return;

  isProfileModalOpen.value = false;
  resetTtdDigital();
};

const openEditProfile = () => {
  profileForm.value = {
    nama_lengkap: authStore.user?.nama || '',
    no_telepon: authStore.user?.no_telepon || '',
    ttd_digital_file: null
  };

  resetTtdDigital();
  isProfileModalOpen.value = true;
};

const submitProfile = async () => {
  if (isSubmittingProfile.value) return;

  if (!profileForm.value.nama_lengkap.trim()) {
    showAlert('Nama lengkap wajib diisi.', 'error');
    return;
  }

  if (profileForm.value.no_telepon && profileForm.value.no_telepon.length < 10) {
    showAlert('Nomor telepon minimal 10 digit.', 'error');
    return;
  }

  isSubmittingProfile.value = true;

  try {
    const formData = new FormData();

    formData.append('nama_lengkap', profileForm.value.nama_lengkap.trim());
    formData.append('no_telepon', profileForm.value.no_telepon || '');

    if (profileForm.value.ttd_digital_file) {
      formData.append('ttd_digital', profileForm.value.ttd_digital_file);
    }

    await api.put(`/users/${authStore.user?.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    showAlert("Profil berhasil diperbarui!", "success");
    isProfileModalOpen.value = false;
    resetTtdDigital();

    await fetchUserProfile();
  } catch (error) {
    console.error("Error update profile:", error);
    showAlert(error.response?.data?.message || "Gagal memperbarui profil.", "error");
  } finally {
    isSubmittingProfile.value = false;
  }
};

// === FUNGSI EDIT PASSWORD ===
const openEditPassword = () => {
  passwordForm.value = {
    password_lama: '',
    password_baru: '',
    konfirmasi_password: ''
  };
  showOldPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  isPasswordModalOpen.value = true;
};

const submitPassword = async () => {
  // 1. Validasi Frontend Dasar
  if (!passwordForm.value.password_lama) {
    showAlert("Password lama wajib diisi!", "error");
    return;
  }

  if (passwordForm.value.password_baru.length < 6) {
    showAlert("Kata sandi baru minimal 6 karakter!", "error");
    return;
  }

  if (passwordForm.value.password_baru !== passwordForm.value.konfirmasi_password) {
    showAlert("Konfirmasi kata sandi baru tidak cocok!", "error");
    return;
  }

  if (passwordForm.value.password_lama === passwordForm.value.password_baru) {
    showAlert("Kata sandi baru tidak boleh sama dengan kata sandi lama!", "error");
    return;
  }

  // 2. Cegah Double Submit
  if (isSubmittingPassword.value) return;
  isSubmittingPassword.value = true;

  try {
    // 3. Tembak API Backend
    await api.put(`/users/password/${authStore.user?.id}`, {
      old_password: passwordForm.value.password_lama,
      new_password: passwordForm.value.password_baru
    });

    showAlert("Kata sandi berhasil diubah!", "success");
    isPasswordModalOpen.value = false;

    // 4. Bersihkan Form setelah sukses agar aman
    passwordForm.value = { password_lama: '', password_baru: '', konfirmasi_password: '' };
    showOldPassword.value = false;
    showNewPassword.value = false;
    showConfirmPassword.value = false;

  } catch (error) {
    console.error("Error update password:", error);

    // PERBAIKAN KRUSIAL: Menangkap respons dari express-validator
    // Backend mengirim pesan error spesifik di dalam objek "errors", bukan "message"
    const errorMessage = error.response?.data?.errors
      || error.response?.data?.message
      || "Gagal mengubah kata sandi. Pastikan password lama benar.";

    showAlert(errorMessage, "error");
  } finally {
    isSubmittingPassword.value = false;
  }
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

.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}


.hidden-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Modal Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>