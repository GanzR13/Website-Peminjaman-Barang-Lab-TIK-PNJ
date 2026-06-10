<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
        <div class="max-w-xl w-full space-y-8 bg-white p-10 rounded-4xl shadow-xl border border-slate-100">

            <div class="text-center">
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Daftar Akun</h2>
                <p class="mt-2 text-sm text-slate-500 font-medium">Lengkapi data diri sesuai identitas mahasiswa/dosen
                    PNJ</p>
            </div>

            <div class="flex p-1.5 bg-slate-100 rounded-2xl shadow-inner mb-6">
                <button @click="gantiKategori('Mahasiswa')" type="button"
                    :class="form.kategori === 'Mahasiswa' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'"
                    class="flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer">
                    Mahasiswa
                </button>
                <button @click="gantiKategori('Dosen')" type="button"
                    :class="form.kategori === 'Dosen' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'"
                    class="flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer">
                    Dosen
                </button>
            </div>

            <form class="space-y-4" @submit.prevent="handleRegister" novalidate>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div class="md:col-span-2">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama
                            Lengkap <span class="text-red-500">*</span></label>

                        <input v-model="form.nama_lengkap"
                            @input="form.nama_lengkap = form.nama_lengkap.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())"
                            type="text"
                            :class="errors.nama_lengkap ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                            placeholder="Masukkan Nama Lengkap" />

                        <p v-if="errors.nama_lengkap"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.nama_lengkap }}</p>
                    </div>

                    <div v-if="form.kategori === 'Mahasiswa'" key="nim-input">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">NIM
                            <span class="text-red-500">*</span></label>
                        <input v-model="form.nim" @input="form.nim = form.nim.replace(/\D/g, '')" type="text"
                            maxlength="11"
                            :class="errors.nim ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                            placeholder="2207..." />
                        <p v-if="errors.nim"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.nim }}</p>
                    </div>

                    <div v-else class="md:col-span-1" key="nip-input">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">NIP
                            <span class="text-red-500">*</span></label>
                        <input v-model="form.nip" @input="form.nip = form.nip.replace(/\D/g, '')" type="text"
                            maxlength="18"
                            :class="errors.nip ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                            placeholder="1907..." />
                        <p v-if="errors.nip"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.nip }}</p>
                    </div>

                    <div>
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">No.
                            WhatsApp <span class="text-red-500">*</span></label>
                        <input v-model="form.no_telepon" @input="form.no_telepon = form.no_telepon.replace(/\D/g, '')"
                            type="text" maxlength="14"
                            :class="errors.no_telepon ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                            placeholder="0812..." />
                        <p v-if="errors.no_telepon"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.no_telepon }}</p>
                    </div>

                    <template v-if="form.kategori === 'Mahasiswa'">
                        <div class="md:col-span-1 relative custom-select">
                            <label
                                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Program
                                Studi <span class="text-red-500">*</span></label>
                            <button type="button" @click.stop="toggleDropdown('prodi')"
                                :class="errors.prodi_id ? 'border-red-400' : 'border-slate-200'"
                                class="w-full flex items-center justify-between px-4 py-3.5 border rounded-xl bg-slate-50 hover:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span :class="!form.prodi_id ? 'text-slate-400' : 'text-slate-900'">
                                    {{ref_prodi.find((p) => p.id === form.prodi_id)?.nama_prodi || "Pilih Prodi"}}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-slate-400 transition-transform"
                                    :class="activeDropdown === 'prodi' ? 'rotate-180' : ''" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <p v-if="errors.prodi_id" class="text-[11px] font-bold text-red-500 mt-1.5 ml-1">{{
                                errors.prodi_id }}</p>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'prodi'"
                                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 z-30 max-h-60 overflow-y-auto">
                                    <button v-for="p in ref_prodi" :key="p.id" type="button" @click="pilihProdi(p)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.prodi_id === p.id ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 font-medium'">{{
                                            p.nama_prodi }}</button>
                                </div>
                            </transition>
                        </div>

                        <div class="md:col-span-1 relative custom-select">
                            <label
                                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Angkatan
                                <span class="text-red-500">*</span></label>
                            <button type="button" @click.stop="toggleDropdown('angkatan')"
                                class="w-full flex items-center justify-between px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span class="text-slate-900">{{ form.angkatan }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-slate-400 transition-transform"
                                    :class="activeDropdown === 'angkatan' ? 'rotate-180' : ''" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'angkatan'"
                                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 z-30">
                                    <button v-for="year in years" :key="year" type="button" @click="pilihAngkatan(year)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.angkatan === year ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 font-medium'">{{
                                            year }}</button>
                                </div>
                            </transition>
                        </div>

                        <div class="md:col-span-2 relative custom-select">
                            <label
                                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kelas
                                <span class="text-red-500">*</span></label>
                            <button type="button" @click.stop="toggleDropdown('kelas')"
                                :class="errors.kelas_id ? 'border-red-400' : 'border-slate-200'"
                                class="w-full flex items-center justify-between px-4 py-3.5 border rounded-xl bg-slate-50 hover:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span :class="!form.kelas_id ? 'text-slate-400' : 'text-slate-900'">
                                    {{ref_kelas.find((k) => k.id === form.kelas_id)?.nama_kelas || "Pilih Kelas"}}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-slate-400 transition-transform"
                                    :class="activeDropdown === 'kelas' ? 'rotate-180' : ''" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <p v-if="errors.kelas_id" class="text-[11px] font-bold text-red-500 mt-1.5 ml-1">{{
                                errors.kelas_id }}</p>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'kelas'"
                                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 z-30 max-h-60 overflow-y-auto">
                                    <button v-for="k in ref_kelas" :key="k.id" type="button" @click="pilihKelas(k)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.kelas_id === k.id ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 font-medium'">{{
                                            k.nama_kelas }}</button>
                                </div>
                            </transition>
                        </div>
                    </template>

                    <div class="md:col-span-2">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email
                            Institusi
                            <span class="text-red-500">*</span></label>

                        <input v-model="form.email" @input="form.email = form.email.toLowerCase()" type="email"
                            :class="errors.email ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                            placeholder="user@pnj.ac.id" />

                        <p v-if="errors.email"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.email }}</p>
                    </div>

                    <div class="md:col-span-2 relative">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password
                            <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'"
                                :class="errors.password ? 'border-red-400 focus:ring-red-50 focus:border-red-500' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'"
                                class="w-full pl-4 pr-12 py-3.5 bg-slate-50 border rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-sm font-medium"
                                placeholder="Minimal 6 karakter" />
                            <button type="button" @click="isPasswordVisible = !isPasswordVisible"
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                                <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            </button>
                        </div>
                        <p v-if="errors.password"
                            class="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1"><span
                                class="w-1 h-1 rounded-full bg-red-500"></span>{{ errors.password }}</p>
                    </div>
                </div>

                <button type="submit" :disabled="authStore.loading || hasErrors"
                    class="w-full py-4 mt-2 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer text-sm">
                    {{ authStore.loading ? 'Sedang Memproses...' : 'Buat Akun Sekarang' }}
                </button>

                <p class="text-center text-xs font-medium text-slate-500 mt-6">
                    Sudah punya akun?
                    <router-link to="/login" class="text-blue-600 font-bold">Masuk di sini</router-link>
                </p>
                <p class="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
                    © 2026 LAB PLP TIK Politeknik Negeri Jakarta
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import api from "../plugins/axios";
import { useAlert } from "../composables/useAlert";

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();

const ref_prodi = ref([]);
const ref_kelas = ref([]);
const activeDropdown = ref(null);
const isPasswordVisible = ref(false);

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

// --- STATE FORM ---
const currentYear = new Date().getFullYear();
const years = computed(() => {
    const list = [];
    for (let i = currentYear; i >= currentYear - 4; i--) list.push(i);
    return list;
});

const form = reactive({
    kategori: "Mahasiswa",
    nama_lengkap: "",
    email: "",
    password: "",
    no_telepon: "",
    nim: "",
    nip: "",
    angkatan: currentYear,
    prodi_id: "",
    kelas_id: "",
});

// --- STATE ERROR UNTUK INLINE VALIDATION ---
const errors = reactive({
    nama_lengkap: "",
    nim: "",
    nip: "",
    no_telepon: "",
    email: "",
    password: "",
    prodi_id: "",
    kelas_id: ""
});

// Mengecek apakah ada error yang sedang aktif di form
const hasErrors = computed(() => {
    return Object.values(errors).some(err => err !== "");
});

// --- WATCHERS UNTUK REAL-TIME VALIDATION ---
watch(() => form.nim, (val) => {
    if (form.kategori === 'Mahasiswa') {
        if (val.length > 0 && val.length < 10) {
            errors.nim = "NIM minimal terdiri dari 10 digit.";
        } else {
            errors.nim = "";
        }
    }
});

watch(() => form.nip, (val) => {
    if (form.kategori === 'Dosen') {
        if (val.length > 0 && val.length < 9) {
            errors.nip = "NIP minimal terdiri dari 9 digit.";
        } else {
            errors.nip = "";
        }
    }
});

watch(() => form.no_telepon, (val) => {
    if (val.length < 10) {
        errors.no_telepon = "Nomor Telepon minimal 10 digit.";
    } else if (val.length > 13) {
        errors.no_telepon = "Nomor Telepon maksimal 13 digit.";
    } else {
        errors.no_telepon = "";
    }
});

watch(() => form.password, (val) => {
    if (val.length > 0 && val.length < 6) {
        errors.password = "Password minimal 6 karakter.";
    } else {
        errors.password = "";
    }
});

watch(() => form.email, (val) => {
    // 1. Regex dasar untuk format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val.length === 0) {
        errors.email = "";
    } else if (!emailRegex.test(val)) {
        errors.email = "Format email tidak valid";
    }
    // 2. Validasi Khusus PNJ
    else if (!val.toLowerCase().endsWith('pnj.ac.id')) {
        errors.email = "Wajib menggunakan email institusi pnj.ac.id";
    } else {
        errors.email = ""; // Error hilang jika valid
    }
});

const pilihProdi = (p) => { form.prodi_id = p.id; errors.prodi_id = ""; activeDropdown.value = null; };
const pilihKelas = (k) => { form.kelas_id = k.id; errors.kelas_id = ""; activeDropdown.value = null; };
const pilihAngkatan = (y) => { form.angkatan = y; activeDropdown.value = null; };

const gantiKategori = (kategoriBaru) => {
    // 1. Mencegah error jika user mengklik tombol yang sudah aktif
    if (form.kategori === kategoriBaru) return;

    form.kategori = kategoriBaru;

    // 2. Kosongkan semua data yang spesifik dengan role
    form.nim = "";
    form.nip = "";
    form.prodi_id = "";
    form.kelas_id = "";
    form.angkatan = currentYear;

    // 3. Reset semua pesan error saat pindah kategori
    Object.keys(errors).forEach(key => errors[key] = "");

    activeDropdown.value = null;
};

onMounted(async () => {
    try {
        const [resProdi, resKelas] = await Promise.all([api.get("/ref/prodi"), api.get("/ref/kelas")]);

        // PERBAIKAN: Ambil properti 'data' di dalam 'data' (jika backend mengirim { status: "success", data: [...] })
        // Gunakan fallback (|| resProdi.data) untuk berjaga-jaga jika backend memang mengirim Array secara langsung
        ref_prodi.value = resProdi.data.data || resProdi.data || [];
        ref_kelas.value = resKelas.data.data || resKelas.data || [];

    } catch (err) {
        console.error("Gagal memuat data referensi:", err);
        // Pastikan nilainya tetap array agar template tidak crash saat API gagal
        ref_prodi.value = [];
        ref_kelas.value = [];
    }

    window.addEventListener("click", (e) => {
        if (!e.target.closest(".custom-select")) activeDropdown.value = null;
    });
});

// --- SUBMIT HANDLING ---
const handleRegister = async () => {
    // 1. Validasi manual sebelum submit jika ada kolom yang masih kosong (belum diisi)
    let isFormValid = true;

    if (!form.nama_lengkap.trim()) { errors.nama_lengkap = "Nama Lengkap wajib diisi."; isFormValid = false; }
    else { errors.nama_lengkap = ""; }

    if (form.kategori === 'Mahasiswa') {
        if (!form.nim) { errors.nim = "NIM wajib diisi."; isFormValid = false; }
        if (!form.prodi_id) { errors.prodi_id = "Program Studi wajib dipilih."; isFormValid = false; }
        if (!form.kelas_id) { errors.kelas_id = "Kelas wajib dipilih."; isFormValid = false; }
    } else {
        if (!form.nip) { errors.nip = "NIP wajib diisi."; isFormValid = false; }
    }

    if (!form.no_telepon) { errors.no_telepon = "Nomor Telepon wajib diisi."; isFormValid = false; }
    if (!form.email) { errors.email = "Email Institusi wajib diisi."; isFormValid = false; }
    if (!form.password) { errors.password = "Password wajib diisi."; isFormValid = false; }

    // Jika ada validasi yang gagal (baik karena format salah atau kosong)
    if (!isFormValid || hasErrors.value) {
        showAlert("Silakan perbaiki isian form yang berwarna merah terlebih dahulu.", "error");
        return;
    }

    try {
        // MENDAPATKAN TANGGAL HARI INI (FORMAT YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        const payload = {
            ...form,
            role_id: form.kategori === "Mahasiswa" ? 5 : 4,
            tanggal_daftar: today // <--- INJEKSI TANGGAL DAFTAR DI SINI
        };

        await authStore.register(payload);

        // Alert sukses menggunakan Toast Global
        showAlert("Registrasi berhasil! Silakan masuk dengan akun Anda.", "success");

        // Langsung arahkan kembali ke halaman login (tanpa mampir ke verify-notice)
        router.push("/login");

    } catch (err) {
        // Jika Backend menolak (misal Email sudah terdaftar)
        showAlert(authStore.error || "Pendaftaran gagal, silakan periksa data Anda.", "error");
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>