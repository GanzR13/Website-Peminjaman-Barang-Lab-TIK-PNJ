<template>
    <div class="p-8 h-full flex flex-col relative">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Manajemen Peminjam</h2>
                <p class="text-gray-600 mt-1 text-sm">Kelola data, profil, dan kategori peminjam laboratorium (Mahasiswa
                    & Dosen).</p>
            </div>

            <button @click="fetchUsers"
                class="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl transition-all shadow-sm shrink-0 font-semibold text-sm"
                title="Refresh Data">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isLoading }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">Refresh Data</span>
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-125">
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Daftar Peminjam Lab</h2>
                    <p class="text-sm text-gray-500">
                        Total <span class="font-bold text-emerald-600">{{ totalItems }}</span> peminjam terdaftar
                    </p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <input v-model="searchQuery" type="text" placeholder="Cari nama, NIM/NIP, email..."
                        class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 transition-all" />
                    <button @click="openAddModal"
                        class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200 shrink-0 cursor-pointer">
                        + Tambah Peminjam
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="p-20 text-center flex-1 flex flex-col items-center justify-center">
                <div class="animate-spin inline-block w-10 h-10 border-[3px] border-emerald-600 border-t-transparent rounded-full mb-4"></div>
                <p class="text-gray-500 font-medium italic">Menarik data dari server...</p>
            </div>

            <div v-else class="flex-1 flex flex-col">
                <div class="overflow-x-auto flex-1">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest border-b border-gray-100">
                                <th class="px-8 py-4 font-black">Profil Peminjam</th>
                                <th class="px-8 py-4 font-black">Kontak Institusi</th>
                                <th class="px-8 py-4 font-black">Kategori</th>
                                <th class="px-8 py-4 font-black text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-emerald-50/30 transition">
                                <td class="px-8 py-5">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold mr-4 text-sm shadow-md shadow-emerald-200 uppercase">
                                            {{ user.nama_lengkap?.charAt(0) || "?" }}
                                        </div>
                                        <div>
                                            <span class="font-bold text-gray-900 block leading-tight mb-1">{{ user.nama_lengkap }}</span>
                                            <span class="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                                {{ user.nim ? "NIM: " + user.nim : "NIP: " + user.nip }}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-sm text-gray-600 font-medium">
                                    {{ user.user?.email || "-" }}
                                </td>
                                <td class="px-8 py-5">
                                    <span class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide ring-1"
                                        :class="user.user?.Role?.nama_role === 'Dosen' ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-teal-100 text-teal-700 ring-teal-200'">
                                        {{ user.user?.Role?.nama_role || "Peminjam" }}
                                    </span>
                                </td>
                                <td class="px-8 py-5 text-center">
                                    <div class="flex justify-center items-center gap-2">
                                        <button @click="openDetailModal(user)" class="text-emerald-600 hover:text-emerald-800 font-semibold text-sm hover:underline bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
                                            Detail
                                        </button>
                                        <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
                                            Edit
                                        </button>
                                        <button @click="handleDelete(user.id)" class="text-red-500 hover:text-red-700 font-semibold text-sm hover:underline bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="filteredUsers.length === 0" class="p-20 text-center">
                        <p class="text-gray-400 font-medium">Data peminjam tidak ditemukan.</p>
                    </div>
                </div>

                <div v-if="totalItems > 0 && !searchQuery" class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span class="hidden sm:inline font-medium">Tampilkan:</span>
                        <div class="relative custom-select">
                            <button @click.stop="toggleDropdown('limit')" class="flex items-center justify-between w-28 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:border-emerald-400 transition-all">
                                <span>{{ limit }} Data</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform" :class="{ 'rotate-180': activeDropdown === 'limit' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'limit'" class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30">
                                    <button v-for="opt in [5, 10, 25, 50]" :key="opt" @click="pilihLimit(opt)" class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 cursor-pointer" :class="limit === opt ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-gray-600'">
                                        {{ opt }} Data
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <div class="flex items-center gap-6">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Hal <span class="text-emerald-600">{{ currentPage }}</span> / {{ totalPages }}
                        </span>
                        <div class="flex gap-2">
                            <button @click="prevPage" :disabled="currentPage === 1" class="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 cursor-pointer hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 cursor-pointer hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7-7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalDataPeminjam 
            :isOpen="isModalOpen" 
            :mode="modalMode" 
            :isEditMode="isEditMode"
            :detailUser="detailUser"
            :initialFormData="formData"
            :refProdi="ref_prodi"
            :refKelas="ref_kelas"
            :years="years"
            @close="isModalOpen = false"
            @save="saveData"
        />

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
import api from "../plugins/axios";
import { useAlert } from '../composables/useAlert';
import ModalDataPeminjam from '../components/ModalDataPeminjam.vue';

const { showAlert } = useAlert();

// DATA STATE
const users = ref([]);
const ref_prodi = ref([]);
const ref_kelas = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(10);

// UI & MODAL STATE
const activeDropdown = ref(null);
const isModalOpen = ref(false);
const modalMode = ref('form'); // 'form' atau 'detail'
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
    email: "",
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
        const [resProdi, resKelas] = await Promise.all([
            api.get("/ref/prodi"),
            api.get("/ref/kelas"),
        ]);
        ref_prodi.value = resProdi.data;
        ref_kelas.value = resKelas.data;
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
        email: "",
        no_telepon: "",
        password: "",
    });
    isModalOpen.value = true;
};

const openEditModal = (user) => {
    isEditMode.value = true;
    modalMode.value = 'form';
    const namaRole = user.user?.Role?.nama_role;
    const kategoriSekarang = namaRole === "Mahasiswa" ? "Mahasiswa" : "Dosen";

    Object.assign(formData, {
        id: user.id,
        kategori: kategoriSekarang,
        nama_lengkap: user.nama_lengkap,
        nim: user.nim || "",
        nip: user.nip || "",
        angkatan: user.angkatan || currentYear,
        prodi_id: user.prodi_id || "",
        kelas_id: user.kelas_id || "",
        email: user.user?.email || "",
        no_telepon: user.user?.no_telepon || "",
    });
    isModalOpen.value = true;
};

const openDetailModal = (user) => {
    detailUser.value = { ...user };
    modalMode.value = 'detail';
    isModalOpen.value = true;
};

const saveData = async (payloadData) => {
    try {
        const payload = { ...payloadData, role_id: payloadData.kategori === "Mahasiswa" ? 5 : 4 };

        if (payload.kategori === "Dosen") {
            payload.nim = null;
            payload.prodi_id = null;
            payload.kelas_id = null;
            payload.angkatan = null;
        } else {
            payload.nip = null;
        }

        if (isEditMode.value) {
            await api.put(`/users/${payload.id}`, payload);
            showAlert("Data berhasil diupdate!", "success");
        } else {
            await api.post("/users", payload);
            showAlert("Pengguna baru berhasil ditambahkan!", "success");
        }

        isModalOpen.value = false;
        fetchUsers();
    } catch (err) {
        showAlert(err.response?.data?.message || "Gagal menyimpan data", "error");
    }
};

const handleDelete = (id) => {
    showAlert(
        "Apakah anda yakin ingin menghapus peminjam ini secara permanen?",
        "confirm",
        async () => {
            try {
                await api.delete(`/users/${id}`);
                showAlert("Peminjam berhasil dihapus dari sistem", "success");
                fetchUsers();
            } catch (err) {
                showAlert("Gagal menghapus data", "error");
            }
        }
    );
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchUsers();
    }
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchUsers();
    }
};
</script>

<style scoped>
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>