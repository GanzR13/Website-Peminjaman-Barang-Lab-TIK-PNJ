<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Katalog Alat & Barang</h2>
                <p class="text-gray-600 mt-1 text-sm">Kelola detail, gambar, dan stok barang laboratorium.</p>
            </div>
            <button @click="openAddModal"
                class="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 shrink-0 cursor-pointer">
                <PlusIcon class="w-5 h-5" />
                Tambah Barang
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <CubeIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Total Jenis Alat</p>
                    <p class="text-2xl font-bold text-gray-900">{{ globalTotal }} <span
                            class="text-xs font-normal text-gray-400">Keseluruhan</span></p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Barang Tersedia</p>
                    <p class="text-2xl font-bold text-gray-900">{{ globalTersedia }} <span
                            class="text-xs font-normal text-gray-400">Jenis</span></p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="p-3 rounded-xl bg-red-50 text-red-600">
                    <ExclamationCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Stok Habis</p>
                    <p class="text-2xl font-bold text-gray-900">{{ globalHabis }} <span
                            class="text-xs font-normal text-gray-400">Jenis</span></p>
                </div>
            </div>
        </div>

        <div
            class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="relative flex-1 w-full md:max-w-md">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Cari nama barang di halaman ini..."
                    class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition text-sm" />
            </div>

            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 font-bold whitespace-nowrap">Tampilkan:</span>
                <select v-model="limit"
                    class="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-gray-50 font-bold text-gray-700 cursor-pointer appearance-none">
                    <option :value="10">10 Baris</option>
                    <option :value="20">20 Baris</option>
                    <option :value="50">50 Baris</option>
                    <option :value="100">100 Baris</option>
                </select>
            </div>

            <div class="w-full md:w-56 shrink-0 relative">
                <select v-model="stockFilter"
                    class="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition text-sm bg-gray-50 cursor-pointer appearance-none font-bold text-gray-700">
                    <option value="semua">Semua Status Stok</option>
                    <option value="tersedia">Stok Tersedia (>0)</option>
                    <option value="habis">Stok Habis (0)</option>
                </select>
                <ChevronDownIcon
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
        </div>

        <div class="flex-1 flex flex-col">
            <div v-if="isLoading" class="text-center py-20">
                <div
                    class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-gray-500 font-bold">Memuat data dari server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <CubeTransparentIcon class="w-20 h-20 text-gray-300 mx-auto" />
                <h3 class="text-xl font-bold text-gray-800 mt-6">Barang Tidak Ditemukan</h3>
                <p class="text-gray-500 mt-2 text-sm">Coba ubah kata kunci atau filter stok di atas.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col group hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div class="relative w-full h-40 rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                        <img :src="getImageUrl(barang.gambar)"
                            :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div class="absolute top-2 right-2">
                            <span v-if="barang.stok > 0"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 shadow-sm">
                                <CheckIcon class="w-3 h-3" /> Tersedia ({{ barang.stok }})
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 ring-1 ring-red-200 shadow-sm">
                                <XMarkIcon class="w-3 h-3" /> Habis
                            </span>
                        </div>
                    </div>

                    <div class="flex-1 mb-5">
                        <h3
                            class="text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700">
                            {{ barang.nama_barang }}</h3>
                        <p class="text-xs text-gray-500 mt-1.5 line-clamp-2">{{ barang.deskripsi || 'Tidak ada deskripsi.' }}</p>
                    </div>

                    <div class="flex items-center gap-2 border-t border-gray-100 pt-4 mt-auto">
                        <button @click.stop="openEditModal(barang)"
                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition active:scale-95 text-xs border border-gray-200">
                            <PencilSquareIcon class="w-3.5 h-3.5" /> Edit
                        </button>
                        <button @click.stop="confirmDelete(barang)"
                            class="px-3 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 border border-gray-200 hover:border-red-200 transition active:scale-95">
                            <TrashIcon class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isLoading && totalItems > 0"
                class="flex items-center justify-between border-t border-gray-200 pt-6 mt-auto">
                <p class="text-sm text-gray-500 font-medium">
                    Total: <span class="font-bold text-gray-900">{{ totalItems }}</span> barang
                </p>
                <div class="flex items-center gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === 1 ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'">
                        Sebelumnya
                    </button>
                    <div
                        class="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-black rounded-xl border border-blue-100">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages || totalPages === 0"
                        class="px-4 py-2 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === totalPages || totalPages === 0 ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <transition name="modal-fade">
                <div v-if="isDetailOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" @click="closeDetailModal">
                    </div>

                    <div
                        class="modal-box bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
                        <button @click="closeDetailModal"
                            class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6" />
                        </button>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
                            <div
                                class="lg:col-span-5 bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center justify-center min-h-75">
                                <div
                                    class="w-full aspect-square rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative">
                                    <img :src="getImageUrl(selectedBarang.gambar)"
                                        class="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div class="lg:col-span-7 p-8 md:p-10 flex flex-col">
                                <h1 class="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">
                                    {{ selectedBarang.nama_barang }}
                                </h1>

                                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 w-fit pr-10 mb-6">
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stok
                                        Gudang</p>
                                    <p class="text-2xl font-black"
                                        :class="selectedBarang.stok > 0 ? 'text-gray-900' : 'text-red-600'">
                                        {{ selectedBarang.stok }} <span
                                            class="text-xs font-medium text-gray-500">Unit</span>
                                    </p>
                                </div>

                                <div class="mb-8">
                                    <h3
                                        class="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">
                                        Deskripsi & Spesifikasi</h3>
                                    <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{{
                                        selectedBarang.deskripsi || 'Belum ada deskripsi yang ditulis.' }}</p>
                                </div>

                                <div class="mt-auto pt-4 border-t border-gray-100">
                                    <button @click="openEditModal(selectedBarang); closeDetailModal()"
                                        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition active:scale-95 text-sm">
                                        <PencilSquareIcon class="w-4 h-4" /> Edit Data Barang Ini
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

        <Teleport to="body">
            <transition name="modal-fade">
                <div v-if="isModalOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" @click="closeModal"></div>

                    <div
                        class="modal-box bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 relative z-10 flex flex-col max-h-[90vh] overflow-y-auto">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-black text-gray-900">
                                {{ isEditMode ? 'Edit Barang' : 'Tambah Barang Baru' }}</h2>
                            <button @click="closeModal"
                                class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>

                        <form @submit.prevent="saveBarang" class="space-y-5">
                            <div>
                                <label
                                    class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Foto/Gambar
                                    Barang</label>
                                <div class="flex items-center gap-4">
                                    <img :src="form.gambarPreview || 'https://placehold.co/150x150/f1f5f9/94a3b8?text=Upload+Gambar'"
                                        class="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm bg-gray-50" />
                                    <div class="flex-1">
                                        <input type="file" @change="onFileChange" accept="image/webp"
                                            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div class="md:col-span-2">
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Nama
                                        Barang <span class="text-red-500">*</span></label>
                                    <input v-model="form.nama_barang" type="text" required
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                        placeholder="Misal: Monitor Dell 24 Inch" />
                                </div>

                                <div class="md:col-span-2">
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Jumlah
                                        Stok Fisik <span class="text-red-500">*</span></label>
                                    <input v-model.number="form.stok" type="number" min="0" required
                                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                        placeholder="0" />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Deskripsi
                                    & Spesifikasi</label>
                                <textarea v-model="form.deskripsi" rows="3"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                    placeholder="Jelaskan detail spesifikasi barang..."></textarea>
                            </div>

                            <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                                <button type="button" @click="closeModal"
                                    class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition cursor-pointer">Batal</button>
                                <button type="submit"
                                    class="px-6 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95">
                                    {{ isEditMode ? 'Simpan Perubahan' : 'Upload Barang Baru' }}
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
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import {
    PlusIcon, CubeIcon, CheckCircleIcon, ExclamationCircleIcon, MagnifyingGlassIcon,
    PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon, CubeTransparentIcon, ChevronDownIcon
} from '@heroicons/vue/24/outline';

// --- STATE DATA ---
const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
let searchTimeout = null;
const stockFilter = ref('semua');

// --- STATE PAGINASI ---
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

watch(searchQuery, () => {
    clearTimeout(searchTimeout); // Batalkan pencarian sebelumnya jika user masih mengetik
    
    // Tunggu 500ms (0.5 detik) setelah ketikan terakhir, baru tembak API
    searchTimeout = setTimeout(() => {
        currentPage.value = 1; // Wajib reset ke halaman 1 setiap kali mencari
        fetchBarang();
    }, 500);
});

watch(limit, () => {
    currentPage.value = 1;
    fetchBarang();
});

const globalTotal = ref(0);
const globalTersedia = ref(0);
const globalHabis = ref(0);

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
    } finally {
        isLoading.value = false;
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    if (imagePath.startsWith('http')) return imagePath; // Untuk data baru dari Cloudinary
    return `http://localhost:5000${imagePath}`; // Untuk sisa data lama lokal
};

onMounted(() => {
    fetchBarang();
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBarang();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const filteredBarang = computed(() => {
  return barangList.value; 
});

const isDetailOpen = ref(false);
const selectedBarang = ref({});

const openDetailModal = (barang) => {
    selectedBarang.value = barang;
    isDetailOpen.value = true;
};
const closeDetailModal = () => isDetailOpen.value = false;

// --- MODAL FORM ---
const isModalOpen = ref(false);
const isEditMode = ref(false);
const defaultForm = { id: null, nama_barang: '', stok: 0, deskripsi: '', gambar: null, gambarPreview: null, fileUpload: null };
const form = ref({ ...defaultForm });

const openAddModal = () => {
    isEditMode.value = false;
    form.value = { ...defaultForm };
    isModalOpen.value = true;
};

const openEditModal = (barang) => {
    isEditMode.value = true;
    form.value = {
        id: barang.id,
        nama_barang: barang.nama_barang,
        stok: barang.stok,
        deskripsi: barang.deskripsi,
        gambarPreview: getImageUrl(barang.gambar),
        fileUpload: null
    };
    isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.value.fileUpload = file;
        form.value.gambarPreview = URL.createObjectURL(file);
    }
};

const saveBarang = async () => {
    const formData = new FormData();
    formData.append('nama_barang', form.value.nama_barang);
    formData.append('stok', form.value.stok);
    formData.append('deskripsi', form.value.deskripsi || '');

    if (form.value.fileUpload) {
        formData.append('gambar', form.value.fileUpload);
    }

    try {
        if (isEditMode.value) {
            await api.put(`/barang/${form.value.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Data barang berhasil diperbarui!');
        } else {
            await api.post('/barang', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Barang baru berhasil ditambahkan!');
            currentPage.value = 1;
            searchQuery.value = '';
            stockFilter.value = 'semua';
        }

        closeModal();
        await fetchBarang();

    } catch (error) {
        if (error.response) {
            alert(`Gagal menyimpan! Pesan Server: ${error.response.data.message || 'Terjadi kesalahan'}`);
        } else {
            alert('Terjadi kesalahan koneksi atau sistem.');
        }
    }
};

const confirmDelete = async (barang) => {
    if (confirm(`Peringatan: Apakah Anda yakin ingin menghapus "${barang.nama_barang}" secara permanen?`)) {
        try {
            await api.delete(`/barang/${barang.id}`);
            if (barangList.value.length === 1 && currentPage.value > 1) {
                currentPage.value--;
            }
            fetchBarang();
        } catch (error) {
            alert('Gagal menghapus data.');
        }
    }
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

/* 1. Transisi untuk Wrapper Utama (Latar Belakang Hitam memudar/Fade) */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* 2. Transisi Khusus untuk Kotak Modal Putih (Membesar/Scale) */
.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
    /* cubic-bezier memberikan efek animasi yang 'bouncy' dan mulus */
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
    /* Kotak mulai dari ukuran sedikit lebih kecil dan posisinya sedikit ke bawah */
    transform: scale(0.95) translateY(15px);
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>