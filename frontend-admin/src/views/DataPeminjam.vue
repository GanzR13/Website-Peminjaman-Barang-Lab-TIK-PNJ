<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in bg-slate-50 tracking-tight">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
                <h2 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Peminjam</h2>
                <p class="text-slate-500 mt-1 text-xs md:text-sm font-medium">
                    Kelola data, profil, dan kategori peminjam laboratorium (Mahasiswa & Dosen).
                </p>
            </div>

            <button @click="fetchUsers"
                class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 text-slate-600 bg-white border border-slate-200 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl transition-all shadow-sm shrink-0 font-bold text-sm cursor-pointer active:scale-95"
                title="Refresh Data">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isLoading }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Segarkan Data</span>
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-125">

            <div
                class="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="w-full text-center md:text-left">
                    <h2 class="text-lg font-bold text-slate-800">Daftar Peminjam Lab</h2>
                    <p class="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">
                        Total <span class="font-bold text-emerald-600">{{ totalItems }}</span> peminjam terdaftar
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div class="relative w-full sm:w-64">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input v-model="searchQuery" type="text" placeholder="Cari nama, NIM/NIP..."
                            class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" />
                    </div>
                    <button @click="openAddModal"
                        class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200 shrink-0 cursor-pointer active:scale-95 flex justify-center items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Peminjam
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center">
                <div
                    class="animate-spin inline-block w-10 h-10 border-[3px] border-emerald-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-slate-500 font-medium italic">Menarik data dari server...</p>
            </div>

            <div v-else class="flex-1 flex flex-col">

                <div v-if="filteredUsers.length === 0"
                    class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-300 mb-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p class="text-slate-400 font-medium">Data peminjam tidak ditemukan.</p>
                </div>

                <div v-if="filteredUsers.length > 0" class="md:hidden flex flex-col gap-3 p-4 bg-slate-50/50">
                    <div v-for="user in filteredUsers" :key="user.id"
                        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ring-1"
                                :class="user.user?.Role?.nama_role === 'Dosen' ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-teal-100 text-teal-700 ring-teal-200'">
                                {{ user.user?.Role?.nama_role || "Peminjam" }}
                            </span>

                            <span v-if="checkVerified(user.user?.email_verified)"
                                class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">
                                Terverifikasi
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-wider">
                                Belum Verif
                            </span>

                        </div>
                        

                        <div class="flex items-center gap-4 mb-4">
                            <div
                                class="w-12 h-12 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md uppercase shrink-0">
                                {{ user.nama_lengkap?.charAt(0) || "?" }}
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <h3 class="font-bold text-slate-900 leading-tight truncate">{{ user.nama_lengkap }}</h3>
                                <p class="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{{ user.nim ? "NIM: " +
                                    user.nim : "NIP: " + user.nip }}</p>
                            </div>
                        </div>

                        <div class="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100">
                            <div class="flex flex-col gap-1 text-xs">
                                <span
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                                <span class="font-medium text-slate-700 break-all">{{ user.user?.email || "-" }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <button @click="openDetailModal(user)"
                                class="py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors active:scale-95">Detail</button>
                            <button @click="openEditModal(user)"
                                class="py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs hover:bg-blue-100 transition-colors active:scale-95">Edit</button>
                            <button @click="handleDelete(user.id)"
                                class="py-2 bg-red-50 text-red-600 font-bold rounded-lg text-xs hover:bg-red-100 transition-colors active:scale-95">Hapus</button>
                        </div>
                    </div>
                </div>

                <div v-if="filteredUsers.length > 0" class="hidden md:block overflow-x-auto flex-1">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest border-y border-slate-200">
                                <th class="px-6 py-4 font-bold">Profil Peminjam</th>
                                <th class="px-6 py-4 font-bold">Kontak Institusi</th>
                                <th class="px-6 py-4 font-bold">Kategori</th>
                                <th class="px-6 py-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="user in filteredUsers" :key="user.id"
                                class="hover:bg-emerald-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-200 uppercase shrink-0">
                                            {{ user.nama_lengkap?.charAt(0) || "?" }}
                                        </div>
                                        <div>
                                            <span class="font-bold text-slate-900 block leading-tight mb-1">{{
                                                user.nama_lengkap }}</span>
                                            <span
                                                class="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {{ user.nim ? "NIM: " + user.nim : "NIP: " + user.nip }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="text-sm text-slate-700 font-medium">{{ user.user?.email || "-"
                                            }}</span>

                                        <span v-if="checkVerified(user.user?.email_verified)"
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            Terverifikasi
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-wider">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            Belum Verifikasi
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <span
                                        class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ring-1"
                                        :class="user.user?.Role?.nama_role === 'Dosen' ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-teal-100 text-teal-700 ring-teal-200'">
                                        {{ user.user?.Role?.nama_role || "Peminjam" }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center items-center gap-2">
                                        <button @click="openDetailModal(user)"
                                            class="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Detail
                                        </button>
                                        <button @click="openEditModal(user)"
                                            class="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Edit
                                        </button>
                                        <button @click="handleDelete(user.id)"
                                            class="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="totalItems > 0 && !searchQuery"
                    class="bg-slate-50 px-4 md:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between mt-auto gap-4">

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 text-sm text-slate-600">
                        <span class="hidden sm:inline font-bold text-xs">Tampilkan:</span>
                        <div class="relative custom-select w-full sm:w-auto">
                            <button @click.stop="toggleDropdown('limit')"
                                class="flex items-center justify-between w-full sm:w-28 px-4 sm:px-3 py-2.5 sm:py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-emerald-400 transition-all outline-none cursor-pointer shadow-sm">
                                <span>{{ limit }} Data</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4 text-slate-400 transition-transform"
                                    :class="{ 'rotate-180': activeDropdown === 'limit' }" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'limit'"
                                    class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-30">
                                    <button v-for="opt in [5, 10, 25, 50]" :key="opt" @click="pilihLimit(opt)"
                                        class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 cursor-pointer"
                                        :class="limit === opt ? 'text-emerald-600 font-extrabold bg-emerald-50/50' : 'text-slate-600 font-bold'">
                                        {{ opt }} Data
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span
                            class="text-xs font-bold text-slate-500 uppercase tracking-widest text-center flex-1 sm:flex-none">
                            Hal <span class="text-emerald-600 font-extrabold">{{ currentPage }}</span> / {{ totalPages
                            }}
                        </span>

                        <div class="flex gap-2 shrink-0">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="p-2 sm:px-3 sm:py-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                                <span class="hidden sm:inline text-xs font-bold">Prev</span>
                            </button>

                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="p-2 sm:px-3 sm:py-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1">
                                <span class="hidden sm:inline text-xs font-bold">Next</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalDataPeminjam :isOpen="isModalOpen" :mode="modalMode" :isEditMode="isEditMode" :detailUser="detailUser"
            :initialFormData="formData" :refProdi="ref_prodi" :refKelas="ref_kelas" :refRoles="ref_roles" :years="years"
            @close="isModalOpen = false" @save="saveData" />

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
import api from "../plugins/axios";
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import ModalDataPeminjam from '../components/ModalDataPeminjam.vue';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

// DATA STATE
const users = ref([]);
const ref_prodi = ref([]);
const ref_kelas = ref([]);
const ref_roles = ref([]); // PERBAIKAN: Menambahkan state untuk role
const searchQuery = ref("");
const isLoading = ref(true);
const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(10);

// Helper Check Verified
const checkVerified = (val) => {
    return val === true || val === 1 || val === '1' || val === 'true';
};

// UI & MODAL STATE
const activeDropdown = ref(null);
const isModalOpen = ref(false);
const modalMode = ref('form');
const isEditMode = ref(false);
const detailUser = ref({});
const formData = reactive({
    id: null,
    kategori: "Mahasiswa",
    nama_lengkap: "",
    nim: "",
    nip: "",
    angkatan: new Date().getFullYear(),
    prodi_id: "",
    kelas_id: "",
    role_id: "",
    email: "",
    email_verified: false,
    no_telepon: "",
    password: "",
});

const currentYear = new Date().getFullYear();
const years = computed(() => {
    const list = [];
    for (let i = currentYear; i >= currentYear - 5; i--) list.push(i);
    return list;
});

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

const pilihLimit = (newLimit) => {
    limit.value = newLimit;
    currentPage.value = 1;
    activeDropdown.value = null;
    fetchUsers();
};

const closeAllDropdowns = (e) => {
    if (!e.target.closest(".custom-select")) activeDropdown.value = null;
};

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        const res = await api.get(`/users/peminjam?page=${currentPage.value}&limit=${limit.value}`);
        users.value = res.data.data;
        totalItems.value = res.data.pagination.totalItems;
        totalPages.value = res.data.pagination.totalPages;
    } catch (err) {
        console.error("Fetch Error:", err);
        showAlert("Gagal menarik data dari server", "error");
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    fetchUsers();
    try {
        // PERBAIKAN: Ekstraksi data yang aman & penambahan fetch role
        // Menambahkan catch pada masing-masing request agar jika salah satu gagal, yang lain tetap jalan
        const [resProdi, resKelas, resRoles] = await Promise.all([
            api.get("/ref/prodi").catch(() => ({ data: [] })),
            api.get("/ref/kelas").catch(() => ({ data: [] })),
            api.get("/ref/role").catch(() => ({ data: [] })) // Ganti /ref/role jika endpoint kamu berbeda
        ]);

        // Mencegah error mapping data (handling jika backend merespon { data: [...] } di dalam Axios)
        ref_prodi.value = resProdi.data?.data || resProdi.data || [];
        ref_kelas.value = resKelas.data?.data || resKelas.data || [];
        ref_roles.value = resRoles.data?.data || resRoles.data || [];

    } catch (err) {
        console.error("Gagal memuat referensi:", err);
    }
    window.addEventListener("click", closeAllDropdowns);
});

onUnmounted(() => {
    window.removeEventListener("click", closeAllDropdowns);
});

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const term = searchQuery.value.toLowerCase();
    return users.value.filter(
        (u) =>
            u.nama_lengkap?.toLowerCase().includes(term) ||
            (u.nim || u.nip || "").toLowerCase().includes(term) ||
            u.user?.email?.toLowerCase().includes(term),
    );
});

// MODAL CONTROLS
const openAddModal = () => {
    isEditMode.value = false;
    modalMode.value = 'form';
    Object.assign(formData, {
        id: null,
        kategori: "Mahasiswa",
        nama_lengkap: "",
        nim: "",
        nip: "",
        angkatan: currentYear,
        prodi_id: "",
        kelas_id: "",
        role_id: "",
        email: "",
        email_verified: false,
        no_telepon: "",
        password: "",
    });
    isModalOpen.value = true;
};

const openEditModal = (user) => {
    isEditMode.value = true;
    modalMode.value = 'form';

    // Cek kategori secara aman (Jika ada NIM, otomatis dia Mahasiswa)
    const isMahasiswa = (user.nim && user.nim.length > 0) || user.user?.Role?.nama_role === "Mahasiswa";
    const kategoriSekarang = isMahasiswa ? "Mahasiswa" : "Dosen";

    Object.assign(formData, {
        id: user.id,
        kategori: kategoriSekarang,
        nama_lengkap: user.nama_lengkap || "",
        nim: user.nim || "",
        nip: user.nip || "",
        angkatan: user.angkatan || currentYear,
        prodi_id: user.prodi_id || "",
        kelas_id: user.kelas_id || "",
        role_id: user.user?.role_id || "", // Tangkap role_id asli dari database
        email: user.user?.email || "",
        email_verified: checkVerified(user.user?.email_verified),
        no_telepon: user.user?.no_telepon || "",
        password: "", // Selalu kosongkan form password saat edit
    });

    isModalOpen.value = true;
};

const openDetailModal = (user) => {
    detailUser.value = {
        ...user,
        // Mapping relasi prodi/kelas antisipasi Sequelize (huruf besar vs kecil)
        nama_prodi: user.nama_prodi || user.Prodi?.nama_prodi || user.prodi?.nama_prodi || "-",
        nama_kelas: user.nama_kelas || user.Kelas?.nama_kelas || user.kelas?.nama_kelas || "-",
        user: {
            ...user.user,
            email_verified: checkVerified(user.user?.email_verified)
        }
    };
    modalMode.value = 'detail';
    isModalOpen.value = true;
};

const saveData = async (payloadData) => {
    try {
        // Copy payload agar tidak mengubah data form secara langsung
        const payload = { ...payloadData };

        // Tentukan Role ID dengan benar (Jangan memaksakan angka 4)
        if (payload.kategori === "Mahasiswa") {
            payload.role_id = 5; // Mahasiswa pasti role 5
        } else {
            // Jika Dosen/Pegawai, ambil dari pilihan dropdown, jika belum milih set ke 4
            payload.role_id = payload.role_id || 4;
        }

        // Bersihkan kolom yang berlawanan kategori agar database rapi
        if (payload.kategori === "Dosen") {
            payload.nim = null;
            payload.prodi_id = null;
            payload.kelas_id = null;
            payload.angkatan = null;
        } else {
            payload.nip = null;
        }

        // HAPUS PASSWORD DARI PAYLOAD JIKA KOSONG SAAT EDIT
        if (isEditMode.value && (!payload.password || payload.password.trim() === "")) {
            delete payload.password;
        }

        // Buang atribut kategori karena tidak ada kolomnya di database
        delete payload.kategori;

        // Eksekusi API
        if (isEditMode.value) {
            await api.put(`/users/${payload.id}`, payload);
            showAlert("Data peminjam berhasil diupdate!", "success");
        } else {
            await api.post("/users", payload);
            showAlert("Pengguna baru berhasil ditambahkan!", "success");
        }

        isModalOpen.value = false;
        fetchUsers(); // Refresh tabel otomatis
    } catch (err) {
        console.error("Gagal Save Data:", err);
        showAlert(err.response?.data?.message || err.response?.data?.errors || "Terjadi kesalahan saat menyimpan data", "error");
    }
};

const handleDelete = (id) => {
    showConfirm(
        'Yakin ingin menghapus data peminjam ini? Data yang sudah dihapus tidak dapat dikembalikan.',
        async () => {
            try {
                await api.delete(`/users/${id}`);
                showAlert('Data peminjam berhasil dihapus.', 'success');
                await fetchUsers();
            } catch (error) {
                console.error('Gagal menghapus peminjam:', error.response?.data || error);
                showAlert(error.response?.data?.message || 'Gagal menghapus data peminjam.', 'error');
            }
        },
        null,
        'Ya, Hapus',
        'red',
        'Konfirmasi Hapus'
    );
};

const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchUsers(); } };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchUsers(); } };
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>