<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in">

        <!-- HEADER -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-slate-900 tracking-tight">Katalog Alat & Barang</h2>
                <p class="text-slate-500 mt-1 text-sm font-medium">Kelola detail, gambar, dan stok barang laboratorium.
                </p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
                <!-- Tombol Import CSV -->
                <button @click="triggerFileInput"
                    class="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 ring-1 ring-amber-200 transition-all duration-300 active:scale-95 shrink-0 cursor-pointer text-sm">
                    <ArrowUpTrayIcon class="w-4 h-4" />
                    Import CSV
                </button>
                <input type="file" ref="fileInput" @change="handleFileUpload" accept=".csv, .xlsx, .xls" class="hidden" />

                <!-- Tombol Export CSV -->
                <button @click="exportCSV"
                    class="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 ring-1 ring-emerald-200 transition-all duration-300 active:scale-95 shrink-0 cursor-pointer text-sm">
                    <ArrowDownTrayIcon class="w-4 h-4" />
                    Export CSV
                </button>

                <!-- Tombol Tambah Barang -->
                <button @click="openAddModal"
                    class="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 shrink-0 cursor-pointer text-sm">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Barang
                </button>
            </div>
        </div>

        <!-- STATISTIK -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
                class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5">
                <div class="p-3.5 rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/50">
                    <CubeIcon class="w-7 h-7" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Jenis Alat</p>
                    <p class="text-2xl font-black text-slate-800">{{ globalTotal }} <span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal">Keseluruhan</span>
                    </p>
                </div>
            </div>
            <div
                class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5">
                <div class="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100/50">
                    <CheckCircleIcon class="w-7 h-7" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Barang Tersedia</p>
                    <p class="text-2xl font-black text-slate-800">{{ globalTersedia }} <span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal">Jenis</span></p>
                </div>
            </div>
            <div
                class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5">
                <div class="p-3.5 rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100/50">
                    <ExclamationCircleIcon class="w-7 h-7" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stok Habis</p>
                    <p class="text-2xl font-black text-slate-800">{{ globalHabis }} <span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal">Jenis</span></p>
                </div>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="relative flex-1 w-full md:max-w-md group">
                <MagnifyingGlassIcon
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input v-model="searchQuery" type="text" placeholder="Cari nama barang di halaman ini..."
                    class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:bg-white" />
            </div>

            <div class="flex items-center gap-3">
                <span class="text-sm text-slate-500 font-bold whitespace-nowrap">Tampilkan:</span>
                <select v-model="limit"
                    class="pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm bg-slate-50 hover:bg-slate-100 transition-colors font-bold text-slate-700 cursor-pointer appearance-none">
                    <option :value="10">10 Baris</option>
                    <option :value="20">20 Baris</option>
                    <option :value="50">50 Baris</option>
                    <option :value="100">100 Baris</option>
                </select>
            </div>

            <div class="w-full md:w-56 shrink-0 relative">
                <select v-model="stockFilter"
                    class="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm bg-slate-50 hover:bg-slate-100 cursor-pointer appearance-none font-bold text-slate-700">
                    <option value="semua">Semua Status Stok</option>
                    <option value="tersedia">Stok Tersedia (>0)</option>
                    <option value="habis">Stok Habis (0)</option>
                </select>
                <ChevronDownIcon
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
        </div>

        <!-- GRID DATA -->
        <div class="flex-1 flex flex-col">
            <div v-if="isLoading" class="text-center py-24">
                <div
                    class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-slate-500 font-bold animate-pulse">Memuat data dari server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-24 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
                <CubeTransparentIcon class="w-20 h-20 text-slate-300 mx-auto" />
                <h3 class="text-xl font-bold text-slate-700 mt-6">Barang Tidak Ditemukan</h3>
                <p class="text-slate-500 mt-2 text-sm font-medium">Coba ubah kata kunci atau filter stok di atas.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative overflow-hidden">

                    <div
                        class="relative w-full h-44 rounded-xl overflow-hidden bg-slate-50 mb-5 border border-slate-100/80">
                        <img :src="getImageUrl(barang.gambar)" :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                        <div
                            class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>

                        <div class="absolute top-3 right-3">
                            <span v-if="barang.stok > 0"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-700 ring-1 ring-emerald-200/50 backdrop-blur-sm shadow-sm">
                                <CheckIcon class="w-3.5 h-3.5" /> Tersedia ({{ barang.stok }})
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-red-100/90 text-red-700 ring-1 ring-red-200/50 backdrop-blur-sm shadow-sm">
                                <XMarkIcon class="w-3.5 h-3.5" /> Habis
                            </span>
                        </div>
                    </div>

                    <div class="flex-1 mb-5 px-1">
                        <h3
                            class="text-base font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {{ barang.nama_barang }}
                        </h3>
                        <p class="text-xs text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">{{
                            barang.deskripsi || 'Tidak ada deskripsi.' }}</p>
                    </div>

                    <div class="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                        <button @click.stop="openEditModal(barang)"
                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:ring-1 hover:ring-blue-200 transition-all duration-200 active:scale-95 text-xs">
                            <PencilSquareIcon class="w-4 h-4" /> Edit
                        </button>
                        <button @click.stop="confirmDelete(barang)"
                            class="px-3.5 py-2.5 bg-white text-red-500 font-bold rounded-xl hover:bg-red-50 ring-1 ring-slate-200 hover:ring-red-200 transition-all duration-200 active:scale-95">
                            <TrashIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- PAGINASI -->
            <div v-if="!isLoading && totalItems > 0"
                class="flex items-center justify-between border-t border-slate-200 pt-6 mt-auto pb-4">
                <p class="text-sm text-slate-500 font-medium">
                    Total pencarian: <span class="font-black text-slate-800">{{ totalItems }}</span> barang
                </p>
                <div class="flex items-center gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border"
                        :class="currentPage === 1 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer hover:-translate-y-0.5'">
                        Sebelumnya
                    </button>
                    <div
                        class="px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-black rounded-xl border border-blue-100/50">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages || totalPages === 0"
                        class="px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border"
                        :class="currentPage === totalPages || totalPages === 0 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer hover:-translate-y-0.5'">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <ModalDetailBarang :isOpen="isDetailOpen" :data="selectedBarang" @close="isDetailOpen = false"
            @edit="openEditModal" />

        <ModalFormBarang :isOpen="isModalFormOpen" :isEditMode="isEditMode" :dataEdit="selectedBarang"
            @close="isModalFormOpen = false" @refresh-data="fetchBarang" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import {
    PlusIcon, CubeIcon, CheckCircleIcon, ExclamationCircleIcon, MagnifyingGlassIcon,
    PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon, CubeTransparentIcon, ChevronDownIcon,
    ArrowDownTrayIcon, ArrowUpTrayIcon
} from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert';
import ModalDetailBarang from '../components/ModalDetailBarang.vue';
import ModalFormBarang from '../components/ModalFormBarang.vue';
import * as XLSX from 'xlsx';

const { showAlert } = useAlert();

// --- STATE DATA ---
const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
let searchTimeout = null;
const stockFilter = ref('semua');
const fileInput = ref(null); // Ref untuk input file tersembunyi

// --- STATE PAGINASI & STATISTIK ---
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);
const globalTotal = ref(0);
const globalTersedia = ref(0);
const globalHabis = ref(0);

// --- STATE MODAL ---
const isDetailOpen = ref(false);
const isModalFormOpen = ref(false);
const isEditMode = ref(false);
const selectedBarang = ref(null);

// --- WATCHERS ---
watch(stockFilter, () => { currentPage.value = 1; });
watch(limit, () => { currentPage.value = 1; fetchBarang(); });

watch(searchQuery, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchBarang();
    }, 500);
});

// --- FETCH DATA ---
const fetchBarang = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/barang', {
            params: { page: currentPage.value, limit: limit.value, search: searchQuery.value }
        });

        if (response.data.status === 'success') {
            barangList.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
            totalItems.value = response.data.pagination.totalItems;

            if (response.data.summary) {
                globalTotal.value = response.data.summary.total;
                globalTersedia.value = response.data.summary.tersedia;
                globalHabis.value = response.data.summary.habis;
            }
        }
    } catch (error) {
        console.error("Gagal mengambil data katalog:", error);
        showAlert("Gagal memuat data barang. Periksa koneksi ke server.", "error");
    } finally {
        isLoading.value = false;
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`; 
};

onMounted(() => fetchBarang());

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBarang();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const filteredBarang = computed(() => {
    if (stockFilter.value === 'tersedia') return barangList.value.filter(b => b.stok > 0);
    if (stockFilter.value === 'habis') return barangList.value.filter(b => b.stok === 0);
    return barangList.value;
});

// --- FUNGSI MODAL ---
const openDetailModal = (barang) => {
    selectedBarang.value = barang;
    isDetailOpen.value = true;
};

const openAddModal = () => {
    isEditMode.value = false;
    selectedBarang.value = null;
    isModalFormOpen.value = true;
};

const openEditModal = (barang) => {
    isDetailOpen.value = false;
    isEditMode.value = true;
    selectedBarang.value = barang; 
    isModalFormOpen.value = true;
};

// --- FUNGSI HAPUS ---
const confirmDelete = (barang) => {
    showAlert(
        `Apakah Anda yakin ingin menghapus "${barang.nama_barang}" secara permanen?`,
        "confirm",
        async () => {
            try {
                await api.delete(`/barang/${barang.id}`);

                if (barangList.value.length === 1 && currentPage.value > 1) {
                    currentPage.value--;
                }

                await fetchBarang();
                showAlert('Data barang berhasil dihapus!', 'success');
            } catch (error) {
                showAlert('Gagal menghapus data barang. Barang mungkin sedang dipinjam.', 'error');
            }
        },
        null,
        "Ya, Hapus", // <-- Diperbaiki menjadi Ya, Hapus
        "red"
    );
};

// --- FUNGSI EXPORT CSV ---
const exportCSV = async () => {
    showAlert("Sedang menyiapkan file CSV...", "success");
    try {
        // Ambil semua data barang sekaligus (tanpa paginasi) untuk diekspor
        const response = await api.get('/barang', {
            params: { page: 1, limit: 10000 } // Limit besar untuk mengambil semua
        });

        if (response.data.status === 'success') {
            const allBarang = response.data.data;
            
            if (allBarang.length === 0) {
                showAlert('Tidak ada data barang untuk diekspor.', 'error');
                return;
            }

            // Memformat data agar rapi di excel/csv
            const dataToExport = allBarang.map(b => ({
                'id': b.id,
                'kode_barang': b.kode_barang || '-',
                'nama_barang': b.nama_barang,
                'stok': b.stok,
                'deskripsi': b.deskripsi || '-',
                'gambar': b.gambar ? getImageUrl(b.gambar) : '-',
                'kategori': b.kategori || '-',
                'createdAt': b.createdAt ? new Date(b.createdAt).toLocaleString('id-ID') : '-',
                'updatedAt': b.updatedAt ? new Date(b.updatedAt).toLocaleString('id-ID') : '-'
            }));

            // Membuat worksheet dan mendownloadnya
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Katalog_Barang");
            
            // Simpan sebagai CSV
            XLSX.writeFile(wb, `Katalog_Barang_${new Date().toISOString().split('T')[0]}.csv`, { bookType: 'csv' });
            showAlert('Export CSV berhasil!', 'success');
        }
    } catch (error) {
        console.error("Gagal export CSV:", error);
        showAlert('Terjadi kesalahan saat meng-export CSV.', 'error');
    }
};

// --- FUNGSI IMPORT CSV ---
const triggerFileInput = () => {
    // Memicu klik pada input file yang disembunyikan
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Cek ekstensi file (opsional, tapi disarankan)
    const validExtensions = ['csv', 'xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showAlert('Harap unggah file dengan format .csv, .xlsx, atau .xls', 'error');
        event.target.value = ''; // Reset input
        return;
    }

    // Konfirmasi sebelum upload
    showAlert(
        `Upload file "${file.name}" untuk menambahkan/memperbarui barang massal?`,
        "confirm",
        async () => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Pastikan backend Anda memiliki endpoint POST /barang/import
                const response = await api.post('/barang/import', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.status === 'success') {
                    showAlert('Berhasil mengimpor data barang!', 'success');
                    currentPage.value = 1;
                    await fetchBarang(); // Refresh tabel
                }
            } catch (error) {
                console.error("Gagal import file:", error);
                const msg = error.response?.data?.message || 'Gagal mengimpor file. Pastikan format CSV sesuai.';
                showAlert(msg, 'error');
            } finally {
                event.target.value = ''; // Reset input agar bisa upload file yang sama lagi
            }
        },
        () => {
            event.target.value = ''; // Reset input jika batal
        },
        "Ya, Import",
        "blue"
    );
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
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
</style>