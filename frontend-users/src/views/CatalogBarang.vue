<template>
    <div class="h-full flex flex-col relative animate-fade-in">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">Katalog Alat Lab</h2>
                <p class="text-gray-500 mt-2 text-sm max-w-2xl">
                    Cari dan temukan komponen elektronik, alat ukur, atau modul untuk keperluan praktikum dan proyekmu.
                </p>
            </div>
        </div>

        <div
            class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex gap-4 items-center relative z-10">
            <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Cari alat di halaman ini..."
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-medium text-gray-800" />
            </div>

            <button @click="isCartOpen = true"
                class="relative flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all shrink-0 cursor-pointer active:scale-95">
                <ShoppingCartIcon class="w-5 h-5" />
                <span class="hidden sm:inline">Keranjang</span>
                <span v-if="cart.length > 0"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce-short">
                    {{ cart.length }}
                </span>
            </button>
        </div>

        <div class="flex-1 flex flex-col">
            <div v-if="isLoading" class="text-center py-24">
                <div
                    class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-gray-500 font-bold">Memuat katalog alat dari server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                <CubeTransparentIcon class="w-24 h-24 text-gray-200 mx-auto mb-6" />
                <h3 class="text-xl font-bold text-gray-900">Alat Tidak Ditemukan</h3>
                <p class="text-gray-500 mt-2 text-sm">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative overflow-hidden">
                    <div v-if="isInCart(barang.id)"
                        class="absolute -right-10 top-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 shadow-sm z-10">
                        Dipilih
                    </div>

                    <div
                        class="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-50 mb-5 border border-gray-100">
                        <img :src="getImageUrl(barang.gambar)"
                            :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div class="flex-1 flex flex-col">
                        <div class="flex items-center justify-between mb-2">
                            <span
                                class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{{
                                barang.kategori }}</span>
                            <span class="text-xs font-mono text-gray-400 font-bold">{{ barang.kode_barang }}</span>
                        </div>

                        <h3
                            class="text-lg font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">
                            {{ barang.nama_barang }}</h3>

                        <div class="flex items-center gap-2 mb-3 mt-1">
                            <span v-if="barang.stok > 0"
                                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Tersedia: {{
                                barang.stok }} Unit
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                                <XMarkIcon class="w-3 h-3" /> Stok Habis
                            </span>
                        </div>

                        <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-auto">{{ barang.deskripsi ||
                            'Tidak ada spesifikasi tercatat.' }}</p>
                    </div>

                    <div class="mt-6 pt-5 border-t border-gray-100">
                        <button
                            class="w-full py-2.5 bg-gray-50 text-blue-700 font-bold text-sm rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                            Lihat Detail
                            <ArrowRightIcon
                                class="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isLoading && totalPages > 1"
                class="flex items-center justify-center border-t border-gray-200 pt-8 mt-auto mb-8">
                <div class="flex items-center gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === 1 ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer'">
                        Sebelumnya
                    </button>
                    <div
                        class="px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-black rounded-xl border border-blue-100">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === totalPages ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer'">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <transition name="modal-scale">
                <div v-if="isDetailOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" @click="closeDetailModal">
                    </div>

                    <div
                        class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
                        <button @click="closeDetailModal"
                            class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                            <XMarkIcon class="w-5 h-5" />
                        </button>

                        <div class="flex-1 overflow-y-auto">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-full">
                                <div
                                    class="bg-gray-50 p-8 md:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                                    <div
                                        class="w-full aspect-square max-w-md rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative">
                                        <img :src="getImageUrl(selectedBarang.gambar)"
                                            :alt="selectedBarang.nama_barang" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div class="p-8 md:p-12 flex flex-col">
                                    <div class="mb-6">
                                        <h1 class="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{{
                                            selectedBarang.nama_barang }}</h1>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 mb-8">
                                        <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                            <p
                                                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <CubeIcon class="w-3.5 h-3.5" /> Stok Gudang
                                            </p>
                                            <p class="text-3xl font-black"
                                                :class="selectedBarang.stok > 0 ? 'text-gray-900' : 'text-red-600'">{{
                                                selectedBarang.stok }} <span
                                                    class="text-sm font-medium text-gray-500">Unit</span></p>
                                        </div>
                                    </div>
                                    <div class="mb-8">
                                        <h3
                                            class="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                                            Spesifikasi Alat</h3>
                                        <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{{
                                            selectedBarang.deskripsi || 'Belum ada detail spesifikasi yang ditambahkan.'
                                            }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 border-t border-gray-100 bg-white shrink-0">
                            <template v-if="selectedBarang.stok > 0">
                                <button v-if="!isInCart(selectedBarang.id)" @click="addToCart(selectedBarang)"
                                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer text-base">
                                    <PlusCircleIcon class="w-6 h-6" /> Tambah ke Keranjang
                                </button>
                                <button v-else @click="removeFromCart(selectedBarang.id)"
                                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl border border-red-200 hover:bg-red-100 transition-all active:scale-95 cursor-pointer text-base">
                                    <TrashIcon class="w-5 h-5" /> Hapus dari Keranjang
                                </button>
                            </template>
                            <button v-else disabled
                                class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed text-base">
                                <XCircleIcon class="w-6 h-6" /> Stok Alat Sedang Kosong
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

        <Teleport to="body">
            <div>
                <transition name="fade">
                    <div v-if="isCartOpen" class="fixed inset-0 z-1000 bg-black/60 backdrop-blur-md cursor-pointer"
                        @click="isCartOpen = false"></div>
                </transition>

                <transition name="slide-right">
                    <div v-if="isCartOpen"
                        class="fixed inset-y-0 right-0 z-1000 w-full max-w-md bg-white shadow-2xl flex flex-col">
                        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                    <ShoppingCartIcon class="w-6 h-6" />
                                </div>
                                <h2 class="text-xl font-black text-gray-900">Keranjang Pinjam</h2>
                            </div>
                            <button @click="isCartOpen = false"
                                class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div v-if="cart.length === 0"
                                class="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <ShoppingCartIcon class="w-20 h-20 text-gray-200" />
                                <div>
                                    <p class="font-bold text-gray-900">Keranjang masih kosong</p>
                                    <p class="text-sm text-gray-500">Silakan pilih alat dari katalog.</p>
                                </div>
                                <button @click="isCartOpen = false"
                                    class="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl mt-2 hover:bg-blue-100 transition-colors">Mulai
                                    Memilih</button>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="item in cart" :key="item.id"
                                    class="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:border-blue-100 transition-colors">
                                    <img :src="getImageUrl(item.gambar)"
                                        class="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                                    <div class="flex-1">
                                        <h4 class="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{{
                                            item.nama_barang }}</h4>
                                    </div>
                                    <button @click="removeFromCart(item.id)"
                                        class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit transition-colors">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="cart.length > 0" class="p-6 border-t border-gray-100 bg-white shrink-0">
                            <button @click="openCheckoutModal"
                                class="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer text-base">
                                Lanjut Isi Form Peminjaman
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </Teleport>

        <Teleport to="body">
            <transition name="modal-scale">
            </transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import {
    MagnifyingGlassIcon, CubeTransparentIcon, XMarkIcon,
    ArrowRightIcon, CubeIcon, PlusCircleIcon, XCircleIcon,
    ShoppingCartIcon, TrashIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline';

// --- 1. DEKLARASI SEMUA STATE (VARIABEL) DI PALING ATAS ---
const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref(''); // <--- PINDAHKAN KE SINI
let searchTimeout = null;

const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(12);

const cart = ref([]);
const isCartOpen = ref(false);
const isDetailOpen = ref(false);
const selectedBarang = ref({});
const isCheckoutOpen = ref(false);
const formCheckout = ref({
    kategori_kebutuhan: 'Akademik',
    tujuan_peminjaman: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    nama_acara: '',
    organisasi_penyelenggara: '',
    dosen_penanggung_jawab: ''
});

// --- 2. WATCHER ---
// Sekarang watch bisa membaca searchQuery karena sudah dideklarasikan di atas
watch(searchQuery, () => {
    clearTimeout(searchTimeout); 
    
    searchTimeout = setTimeout(() => {
        currentPage.value = 1; 
        fetchBarang();
    }, 500);
});

// --- 3. COMPUTED PROPERTIES ---
const filteredBarang = computed(() => {
  return barangList.value; 
});

// --- 4. FUNGSI-FUNGSI ---
const fetchBarang = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/barang', {
            params: {
                page: currentPage.value,
                limit: limit.value,
                search: searchQuery.value,
            }
        });

        if (response.data.status === 'success') {
            barangList.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
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

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBarang();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const addToCart = (barang) => { if (!isInCart(barang.id)) cart.value.push(barang); };
const removeFromCart = (id) => { cart.value = cart.value.filter(item => item.id !== id); };
const isInCart = (id) => cart.value.some(item => item.id === id);

const openDetailModal = (barang) => { selectedBarang.value = barang; isDetailOpen.value = true; };
const closeDetailModal = () => isDetailOpen.value = false;

const openCheckoutModal = () => {
    isCartOpen.value = false;
    setTimeout(() => { isCheckoutOpen.value = true; }, 300);
};

const submitPeminjaman = () => {
    console.log("Data Peminjam:", formCheckout.value, "Alat yang dipinjam:", cart.value);
    alert(`Berhasil! Silakan cek console log untuk melihat data yang siap dikirim ke backend transaksi.`);
};

// --- 5. LIFECYCLE HOOKS ---
onMounted(() => {
    fetchBarang();
});
</script>

<style scoped>
/* (Style dibiarkan sama persis dengan punyamu) */
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

.animate-bounce-short {
    animation: bounceShort 0.5s ease-in-out 1;
}

@keyframes bounceShort {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-3px) scale(1.1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(100%);
}
</style>