<template>
    <div class="p-8 h-full flex flex-col">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Manajemen Pegawai</h2>
                <p class="text-gray-600 mt-1 text-sm">Kelola data, profil, dan otoritas akses staf pengelola laboratorium.</p>
            </div>
            
            <button
                @click="fetchUsers"
                class="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all shadow-sm shrink-0 font-semibold text-sm"
                title="Refresh Data">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :class="{ 'animate-spin': isLoading }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">Refresh Data</span>
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-125">
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Daftar Pengelola Lab</h2>
                    <p class="text-sm text-gray-500">
                        Total <span class="font-bold text-blue-600">{{ totalItems }}</span> pengelola terdaftar
                    </p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari di halaman ini..."
                        class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 transition-all" 
                    />
                    <button
                        @click="openAddModal"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 shrink-0">
                        + Tambah Pegawai
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="p-20 text-center flex-1 flex flex-col items-center justify-center">
                <div class="animate-spin inline-block w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p class="text-gray-500 font-medium italic">Menarik data dari server...</p>
            </div>

            <div v-else class="flex-1 flex flex-col">
                <div class="overflow-x-auto flex-1">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest border-b border-gray-100">
                                <th class="px-8 py-4 font-black">Profil Pegawai</th>
                                <th class="px-8 py-4 font-black">Kontak Institusi</th>
                                <th class="px-8 py-4 font-black">Otoritas & Akses</th>
                                <th class="px-8 py-4 font-black text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-blue-50/30 transition">
                                <td class="px-8 py-5">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold mr-4 text-sm shadow-md shadow-blue-200 uppercase">
                                            {{ user.nama_lengkap?.charAt(0) || "?" }}
                                        </div>
                                        <div>
                                            <span class="font-bold text-gray-900 block leading-tight mb-1">{{ user.nama_lengkap || "Belum Ada Profil" }}</span>
                                            <span class="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">NIP: {{ user.nip || "-" }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-sm text-gray-600 font-medium">
                                    {{ user.user?.email || "Email tidak tersedia" }}
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="font-bold text-gray-800 text-sm">{{ user.user?.Role?.nama_role || "Pegawai" }}</span>
                                        <span
                                            class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide"
                                            :class="
                                                user.user?.Role?.level_akses === 'super_admin'
                                                    ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                                                    : 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                                            ">
                                            {{ user.user?.Role?.level_akses?.replace("_", " ") || "N/A" }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-center">
                                    <div class="flex justify-center items-center gap-2">
                                        <button @click="openDetailModal(user)" class="text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors">
                                            Detail
                                        </button>
                                        <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                                            Edit
                                        </button>
                                        <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-700 font-semibold text-sm hover:underline bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="filteredUsers.length === 0" class="p-20 text-center">
                        <p class="text-gray-400 font-medium">Data pegawai tidak ditemukan.</p>
                    </div>
                </div>

                <div v-if="totalItems > 0 && !searchQuery" class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span class="hidden sm:inline font-medium">Tampilkan:</span>
                        <div class="relative custom-select-limit">
                            <button
                                @click.stop="toggleLimitDropdown"
                                class="flex items-center justify-between w-28 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-blue-400 transition-all outline-none">
                                <span>{{ limit }} Data</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform" :class="{ 'rotate-180': isLimitOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="fade">
                                <div v-if="isLimitOpen" class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30">
                                    <button
                                        v-for="opt in [5, 10, 25, 50]"
                                        :key="opt"
                                        @click="selectLimit(opt)"
                                        class="w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors"
                                        :class="limit === opt ? 'text-blue-600 font-black bg-blue-50/50' : 'text-gray-600 font-medium'">
                                        {{ opt }} Data
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="flex items-center gap-6">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Halaman <span class="text-blue-600">{{ currentPage }}</span> / {{ totalPages }}
                        </span>

                        <div class="flex gap-2">
                            <button @click="prevPage" :disabled="currentPage === 1" class="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7-7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden transform transition-all">
                <div class="bg-linear-to-r from-blue-600 to-indigo-600 p-6 flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-inner border border-white/30 uppercase">
                        {{ detailUser.nama_lengkap?.charAt(0) || "?" }}
                    </div>
                    <div class="text-white">
                        <h3 class="text-xl font-bold leading-tight">{{ detailUser.nama_lengkap }}</h3>
                        <p class="text-blue-100 text-sm opacity-90 uppercase tracking-wider mt-1 text-[10px] font-bold">
                            {{ detailUser.user?.Role?.level_akses?.replace("_", " ") || "PENGELOLA" }}
                        </p>
                    </div>
                </div>

                <div class="p-6 space-y-3">
                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Induk Pegawai (NIP)</p>
                        <p class="text-gray-900 font-medium font-mono">{{ detailUser.nip || "-" }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Institusi</p>
                        <p class="text-gray-900 font-medium">{{ detailUser.user?.email || "-" }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">No. Telepon / WA</p>
                            <p class="text-gray-900 font-medium">{{ detailUser.user?.no_telepon || "Belum diisi" }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Email</p>
                            <span v-if="detailUser.user?.email_verified" class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-700">Terverifikasi</span>
                            <span v-else class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide bg-orange-100 text-orange-700">Unverified</span>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Otoritas Jabatan</p>
                            <p class="text-gray-900 font-bold capitalize">{{ detailUser.user?.Role?.nama_role || "Pegawai" }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Level Akses</p>
                            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide" :class="detailUser.user?.Role?.level_akses === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                                {{ detailUser.user?.Role?.level_akses?.replace("_", " ") || "N/A" }}
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button @click="closeDetailModal" class="px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition">Tutup Detail</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden transform transition-all">
                <h3 class="text-xl font-bold text-gray-900 mb-4">{{ isEditMode ? "Edit Data Pegawai" : "Tambah Pegawai Baru" }}</h3>

                <form @submit.prevent="saveData" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                        <input v-model="formData.nama_lengkap" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">NIP</label>
                        <input v-model="formData.nip" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input v-model="formData.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" :disabled="isEditMode" />
                    </div>
                    <div v-if="!isEditMode">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <div class="relative">
                            <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10" />
                            <button type="button" @click="togglePassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <button type="button" @click="closeModal" class="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Batal</button>
                        <button type="submit" class="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition">Simpan Data</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAlert } from '../composables/useAlert';

const users = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const error = ref(null);
const { showAlert } = useAlert();

// Paginasi
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

// State Modal CRUD
const showModal = ref(false);
const isEditMode = ref(false);
const showPassword = ref(false);
const formData = ref({ id: null, nama_lengkap: "", nip: "", email: "", password: "" });

// State Modal Detail
const showDetailModal = ref(false);
const detailUser = ref({});

// Pencarian
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const term = searchQuery.value.toLowerCase();
    return users.value.filter((user) => {
        const nama = user.nama_lengkap?.toLowerCase() || "";
        const nip = user.nip?.toLowerCase() || "";
        const email = user.user?.email?.toLowerCase() || "";
        return nama.includes(term) || nip.includes(term) || email.includes(term);
    });
});

const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await axios.get(
            `http://localhost:3000/api/users/pegawai?page=${currentPage.value}&limit=${limit.value}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        users.value = response.data?.data || [];
        if (response.data?.pagination) {
            totalPages.value = response.data.pagination.totalPages;
            totalItems.value = response.data.pagination.totalItems;
            currentPage.value = response.data.pagination.currentPage;
        }
    } catch (err) {
        error.value = "Koneksi ke server terputus.";
        console.error("Fetch Error:", err);
    } finally {
        isLoading.value = false;
    }
};

const changeLimit = () => { currentPage.value = 1; fetchUsers(); };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchUsers(); } };
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchUsers(); } };

const openDetailModal = (user) => { detailUser.value = user; showDetailModal.value = true; };
const closeDetailModal = () => { showDetailModal.value = false; detailUser.value = {}; };

const togglePassword = () => { showPassword.value = !showPassword.value; };
const openAddModal = () => { isEditMode.value = false; showPassword.value = false; formData.value = { id: null, nama_lengkap: "", nip: "", email: "", password: "" }; showModal.value = true; };
const openEditModal = (user) => { isEditMode.value = true; formData.value = { id: user.id, nama_lengkap: user.nama_lengkap || "", nip: user.nip || "", email: user.user?.email || "", password: "" }; showModal.value = true; };
const closeModal = () => { showModal.value = false; };

const saveData = async () => {
    try {
        if (isEditMode.value) showAlert("Fungsi Update Frontend berjalan! (Menunggu Backend)");
        else showAlert("Fungsi Create Frontend berjalan! (Menunggu Backend)");
        closeModal();
    } catch (err) { showAlert("Gagal menyimpan data"); }
};

const deleteUser = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) {
        try { showAlert("Fungsi Delete Frontend berjalan! (Menunggu Backend)"); } catch (err) {}
    }
};

const isLimitOpen = ref(false);
const toggleLimitDropdown = () => { isLimitOpen.value = !isLimitOpen.value; };
const selectLimit = (newLimit) => { limit.value = newLimit; currentPage.value = 1; isLimitOpen.value = false; fetchUsers(); };

onMounted(() => {
    window.addEventListener("click", (e) => {
        if (!e.target.closest(".custom-select-limit")) isLimitOpen.value = false;
    });
    fetchUsers();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>