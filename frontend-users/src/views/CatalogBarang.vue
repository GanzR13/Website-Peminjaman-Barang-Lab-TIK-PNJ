<template>
    <div class="h-full flex flex-col relative animate-fade-in">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Katalog Alat Lab</h2>
                <p class="text-slate-500 mt-2 text-sm max-w-2xl font-medium">
                    Cari dan temukan komponen elektronik, alat ukur, atau modul untuk keperluan praktikum dan proyekmu.
                </p>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex gap-4 items-center relative z-10">
            <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input v-model="searchQuery" type="text" placeholder="Cari alat di halaman ini..."
                    class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-800" />
            </div>

            <button @click="isCartOpen = true"
                class="relative flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all shrink-0 cursor-pointer active:scale-95">
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
                <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p class="text-slate-500 font-bold animate-pulse">Memuat katalog alat dari server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-24 bg-white/50 rounded-3xl border border-slate-200 border-dashed mt-4">
                <CubeTransparentIcon class="w-24 h-24 text-slate-300 mx-auto mb-6" />
                <h3 class="text-xl font-bold text-slate-800">Alat Tidak Ditemukan</h3>
                <p class="text-slate-500 mt-2 text-sm font-medium">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col group hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    
                    <div v-if="isInCart(barang.id)" class="absolute -right-10 top-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 z-10 shadow-sm">
                        Dipilih
                    </div>

                    <div class="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 mb-5 border border-slate-100">
                        <img :src="getImageUrl(barang.gambar)" :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div class="flex-1 flex flex-col">

                        <h3 class="text-lg font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                            {{ barang.nama_barang }}
                        </h3>

                        <div class="flex items-center gap-2 mb-3 mt-1">
                            <span v-if="barang.stok > 0" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Tersedia: {{ barang.stok }}
                            </span>
                            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                                <XMarkIcon class="w-3 h-3" /> Stok Habis
                            </span>
                        </div>

                        <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed mt-auto">{{ barang.deskripsi || 'Tidak ada spesifikasi tercatat.' }}</p>
                    </div>

                    <div class="mt-6 pt-5 border-t border-slate-100">
                        <button class="w-full py-2.5 bg-slate-50 text-blue-700 font-bold text-sm rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                            Lihat Detail
                            <ArrowRightIcon class="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isLoading && totalPages > 1" class="flex items-center justify-center border-t border-slate-200 pt-8 mt-auto mb-8">
                <div class="flex items-center gap-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === 1 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer hover:-translate-y-0.5'">
                        Sebelumnya
                    </button>
                    <div class="px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-black rounded-xl border border-blue-100/50">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all border"
                        :class="currentPage === totalPages ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer hover:-translate-y-0.5'">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div>
                <transition name="fade">
                    <div v-if="isCartOpen" class="fixed inset-0 z-1000 bg-slate-900/40 backdrop-blur-sm cursor-pointer" @click="isCartOpen = false"></div>
                </transition>

                <transition name="slide-right">
                    <div v-if="isCartOpen" class="fixed inset-y-0 right-0 z-1001 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100">
                        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                            <div class="flex items-center gap-3">
                                <div class="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><ShoppingCartIcon class="w-6 h-6" /></div>
                                <h2 class="text-xl font-black text-slate-900">Keranjang</h2>
                            </div>
                            <button @click="isCartOpen = false" class="p-2.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"><XMarkIcon class="w-6 h-6" /></button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <ShoppingCartIcon class="w-20 h-20 text-slate-200" />
                                <div>
                                    <p class="font-bold text-slate-800">Keranjang masih kosong</p>
                                    <p class="text-sm text-slate-500 font-medium">Silakan pilih alat dari katalog.</p>
                                </div>
                                <button @click="isCartOpen = false" class="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl mt-2 hover:bg-blue-100 transition-colors">Mulai Memilih</button>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="item in cart" :key="item.id" class="flex flex-col gap-3 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-colors">
                                    <div class="flex gap-4">
                                        <img :src="getImageUrl(item.gambar)" class="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100" />
                                        <div class="flex-1">
                                            <h4 class="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{{ item.nama_barang }}</h4>
                                        </div>
                                        <button @click="removeFromCart(item.id)" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit transition-colors">
                                            <TrashIcon class="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <span class="text-xs font-bold text-slate-500 ml-2">Jumlah Pinjam:</span>
                                        <div class="flex items-center gap-3">
                                            <button @click="item.jumlah > 1 && item.jumlah--" class="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-600 font-bold hover:bg-slate-100">-</button>
                                            <span class="text-sm font-black w-4 text-center">{{ item.jumlah }}</span>
                                            <button @click="item.jumlah < item.stok && item.jumlah++" class="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-600 font-bold hover:bg-slate-100">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="cart.length > 0" class="p-6 border-t border-slate-100 bg-white shrink-0">
                            <button @click="openCheckoutModal"
                                class="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer text-base">
                                Lanjut Formulir Peminjaman
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </Teleport>

        <ModalDetailAlat 
            :isOpen="isDetailOpen" 
            :barang="selectedBarang" 
            :isInCart="isInCart(selectedBarang.id)"
            @close="isDetailOpen = false"
            @add="addToCart"
            @remove="removeFromCart"
        />

        <ModalCheckout 
            :isOpen="isCheckoutOpen" 
            :cart="cart"
            @close="isCheckoutOpen = false"
            @back="isCheckoutOpen = false; isCartOpen = true"
            @success="onCheckoutSuccess"
        />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import {
    MagnifyingGlassIcon, CubeTransparentIcon, XMarkIcon,
    ArrowRightIcon, ShoppingCartIcon, TrashIcon
} from '@heroicons/vue/24/outline';

import ModalDetailAlat from '../components/ModalDetailAlat.vue';
import ModalCheckout from '../components/ModalCheckout.vue';

const { showAlert } = useAlert();

const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
let searchTimeout = null;

const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(12);

const cart = ref([]);
const isCartOpen = ref(false);
const isDetailOpen = ref(false);
const selectedBarang = ref({});
const isCheckoutOpen = ref(false);

// State untuk fungsi submitPeminjaman (jika masih digunakan di komponen ini)
const isSubmitting = ref(false);
const formCheckout = ref({});

watch(searchQuery, () => {
    clearTimeout(searchTimeout); 
    searchTimeout = setTimeout(() => {
        currentPage.value = 1; 
        fetchBarang();
    }, 500);
});

const filteredBarang = computed(() => barangList.value);

const fetchBarang = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/barang', {
            params: { page: currentPage.value, limit: limit.value, search: searchQuery.value }
        });
        if (response.data.status === 'success') {
            barangList.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
        }
    } catch (error) {
        showAlert('Gagal memuat katalog', 'error');
    } finally {
        isLoading.value = false;
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    if (imagePath.startsWith('http')) return imagePath; 
    // Menggunakan port 3000 menyesuaikan backend Anda
    return `http://localhost:3000${imagePath}`; 
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBarang();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const addToCart = (barang) => { 
    if (!isInCart(barang.id)) {
        cart.value.push({ ...barang, jumlah: 1 }); 
        showAlert('Barang ditambahkan ke keranjang', 'success');
    }
};
const removeFromCart = (id) => { cart.value = cart.value.filter(item => item.id !== id); };
const isInCart = (id) => cart.value.some(item => item.id === id);

const openDetailModal = (barang) => { selectedBarang.value = barang; isDetailOpen.value = true; };
const closeDetailModal = () => isDetailOpen.value = false;

const openCheckoutModal = () => {
    isCartOpen.value = false;
    setTimeout(() => { isCheckoutOpen.value = true; }, 300);
};

// FUNGSI INI YANG DIUBAH
const onCheckoutSuccess = () => {
    cart.value = [];
    isCheckoutOpen.value = false;
    // router.push('/user/riwayat'); <-- Dihapus
    
    showAlert('Peminjaman berhasil! Silakan cek di Riwayat Peminjaman.', 'success');
    // Refresh katalog agar stok barang yang baru dipinjam langsung berkurang di tampilan
    fetchBarang();
};

// FUNGSI INI JUGA DIUBAH (Hanya sebagai fallback jika tombol submit ada di page ini)
const submitPeminjaman = async () => {
    isSubmitting.value = true;
    try {
        const payload = {
            ...formCheckout.value,
            keranjang_barang: cart.value.map(item => ({
                barang_id: item.id,
                jumlah: item.jumlah
            }))
        };

        const response = await api.post('/user/peminjaman/checkout', payload);
        
        showAlert(response.data.message, 'success');
        cart.value = [];
        isCheckoutOpen.value = false;
        
        // router.push('/user/riwayat'); <-- Dihapus
        
        // Refresh katalog
        fetchBarang();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Gagal mengirim permohonan', 'error');
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchBarang();
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-bounce-short { animation: bounceShort 0.5s ease-in-out 1; }
@keyframes bounceShort {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-3px) scale(1.1); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-scale-enter-active, .modal-scale-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-scale-enter-from, .modal-scale-leave-to { opacity: 0; transform: scale(0.95); }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>