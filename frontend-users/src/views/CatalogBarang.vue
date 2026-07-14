<template>
    <div class="h-full flex flex-col relative animate-fade-in">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-8">
            <div>
                <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Katalog Barang Lab</h2>
                <p class="text-slate-500 mt-1 md:mt-2 text-xs md:text-sm max-w-2xl font-medium leading-relaxed">
                    Cari dan temukan komponen elektronik, alat ukur, atau modul untuk keperluan praktikum dan proyekmu.
                </p>
            </div>
        </div>

        <div
            class="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 md:gap-4 items-center relative z-10">
            <!-- Search -->
            <div class="relative w-full flex-1">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input v-model="searchQuery" type="text" placeholder="Cari alat di halaman ini..."
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
            </div>

            <!-- Cart Button -->
            <button @click="isCartOpen = true"
                class="relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all shrink-0 cursor-pointer active:scale-95">
                <ShoppingCartIcon class="w-5 h-5" />
                <span>Keranjang</span>
                <span v-if="cart.length > 0"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce-short">
                    {{ cart.length }}
                </span>
            </button>
        </div>

        <div class="flex-1 flex flex-col">
          
            <div v-if="isLoading" class="text-center py-20 md:py-24">
                <div
                    class="animate-spin inline-block w-10 h-10 md:w-12 md:h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-slate-500 font-bold animate-pulse text-sm md:text-base">Memuat katalog barang dari
                    server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-20 md:py-24 bg-white/50 rounded-3xl border border-slate-200 border-dashed mt-2 md:mt-4 mx-4 md:mx-0">
                <CubeTransparentIcon class="w-20 h-20 md:w-24 md:h-24 text-slate-300 mx-auto mb-4 md:mb-6" />
                <h3 class="text-lg md:text-xl font-bold text-slate-800">Alat Tidak Ditemukan</h3>
                <p class="text-slate-500 mt-2 text-xs md:text-sm font-medium">Coba gunakan kata kunci pencarian yang
                    lain.</p>
            </div>

            <div v-else
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-3 md:p-5 flex flex-col group hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden">

                    <div v-if="isInCart(barang.id)"
                        class="absolute -right-8 md:-right-10 top-3 md:top-5 bg-emerald-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest py-1 md:py-1.5 px-8 md:px-10 rotate-45 z-10 shadow-sm shadow-emerald-500/30">
                        Dipilih
                    </div>

                    <div
                        class="relative w-full h-28 sm:h-36 md:h-60 rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 mb-3 md:mb-5 border border-slate-100 shrink-0">
                        <img :src="getImageUrl(barang.gambar)" :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div class="flex-1 flex flex-col">
                        <h3
                            class="text-sm md:text-lg font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-1 md:mb-2">
                            {{ barang.nama_barang }}
                        </h3>

                        <div class="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2 mt-1 flex-wrap">
                            <span v-if="barang.stok > 0"
                                class="inline-flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2.5 py-0.5 md:py-1.5 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span
                                    class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                <span class="hidden sm:inline">Tersedia: </span>
                                <span class="sm:hidden">Sisa: </span>
                                {{ barang.stok }}
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2.5 py-0.5 md:py-1.5 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                                <XMarkIcon class="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" /> Habis
                            </span>
                        </div>

                        <p
                            class="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5 font-medium leading-relaxed line-clamp-2 whitespace-pre-line">
                            {{ barang.deskripsi || "Tidak ada deskripsi." }}
                        </p>
                    </div>

                    <div class="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-slate-100 space-y-2">
                        
                        <button type="button" @click.stop="openDetailModal(barang)"
                            class="w-full py-2 md:py-2.5 bg-slate-50 text-blue-700 font-bold text-[11px] md:text-sm rounded-lg md:rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer">
                            Detail
                            <ArrowRightIcon
                                class="w-3 h-3 md:w-4 md:h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </button>

                        <button v-if="barang.stok > 0 && !isInCart(barang.id)" type="button"
                            @click.stop="addToCart(barang)"
                            class="w-full py-2 md:py-2.5 bg-blue-600 text-white font-black text-[11px] md:text-sm rounded-lg md:rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2 shadow-md shadow-blue-600/20 cursor-pointer">
                            Tambah Ke Keranjang
                        </button>
                    </div>
                </div>
            </div>

            <!-- Paginasi -->
            <div v-if="!isLoading && totalPages > 1"
                class="flex items-center justify-center border-t border-slate-200 pt-6 md:pt-8 mt-auto mb-6 md:mb-8">
                <div class="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto px-4 sm:px-0">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="flex-1 sm:flex-none px-4 py-2.5 md:px-5 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all border flex items-center justify-center shadow-sm"
                        :class="currentPage === 1 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer active:scale-95'">
                        <span class="sm:hidden">←</span>
                        <span class="hidden sm:inline">Sebelumnya</span>
                    </button>
                    <div
                        class="px-4 py-2.5 md:px-5 md:py-2.5 bg-blue-50 text-blue-700 text-xs md:text-sm font-black rounded-xl border border-blue-100/50 shrink-0">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="flex-1 sm:flex-none px-4 py-2.5 md:px-5 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all border flex items-center justify-center shadow-sm"
                        :class="currentPage === totalPages ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer active:scale-95'">
                        <span class="sm:hidden">→</span>
                        <span class="hidden sm:inline">Selanjutnya</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal & Sidebar Keranjang -->
        <Teleport to="body">
            <div>
                <!-- Backdrop Keranjang -->
                <transition name="fade">
                    <div v-if="isCartOpen" class="fixed inset-0 z-1000 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
                        @click="isCartOpen = false"></div>
                </transition>

                <!-- Sidebar Keranjang -->
                <transition name="slide-right">
                    <div v-if="isCartOpen"
                        class="fixed inset-y-0 right-0 z-1001 w-full sm:w-100 md:max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100">

                        <div
                            class="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                            <div class="flex items-center gap-3">
                                <div class="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                    <ShoppingCartIcon class="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h2 class="text-lg md:text-xl font-black text-slate-900">Keranjang</h2>
                            </div>
                            <button @click="isCartOpen = false"
                                class="p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors cursor-pointer active:scale-95">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>

                        <!-- Isi Keranjang -->
                        <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            <div v-if="cart.length === 0"
                                class="h-full flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                                <ShoppingCartIcon class="w-16 h-16 md:w-20 md:h-20 text-slate-200" />
                                <div>
                                    <p class="text-base md:text-lg font-bold text-slate-800">Keranjang masih kosong</p>
                                    <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">Silakan pilih barang
                                        dari katalog.</p>
                                </div>
                                <button @click="isCartOpen = false"
                                    class="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold text-xs md:text-sm rounded-xl mt-2 hover:bg-blue-100 transition-colors cursor-pointer active:scale-95">Mulai
                                    Memilih</button>
                            </div>

                            <div v-else class="space-y-3 md:space-y-4 pb-4">
                                <div v-for="item in cart" :key="item.id"
                                    class="flex flex-col gap-3 p-3 md:p-4 border rounded-2xl shadow-sm transition-colors"
                                    :class="item.stok === 0 ? 'bg-slate-50 border-red-200 opacity-80' : 'bg-white border-slate-200'">

                                    <div class="flex gap-3 md:gap-4">
                                        <img :src="getImageUrl(item.gambar)"
                                            class="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                                            :class="{ 'grayscale opacity-60': item.stok === 0 }" />
                                        <div class="flex-1 min-w-0">
                                            <h4 class="font-bold text-xs md:text-sm leading-snug line-clamp-2"
                                                :class="item.stok === 0 ? 'text-slate-500 line-through' : 'text-slate-800'">
                                                {{ item.nama_barang }}
                                            </h4>

                                            <span v-if="item.stok === 0"
                                                class="inline-block mt-1 px-1.5 md:px-2 py-0.5 bg-red-100 text-red-600 text-[9px] md:text-[10px] font-black rounded-md border border-red-200">
                                                Habis Dipinjam
                                            </span>
                                            <span v-else-if="item.jumlah === item.stok"
                                                class="inline-block mt-1 px-1.5 md:px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] md:text-[10px] font-black rounded-md border border-amber-200">
                                                Stok Maksimal
                                            </span>
                                        </div>
                                        <button @click="removeFromCart(item.id)"
                                            class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 md:p-2 rounded-lg h-fit transition-colors cursor-pointer shrink-0">
                                            <TrashIcon class="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>

                                    <div
                                        class="flex items-center justify-between bg-white p-1.5 md:p-2 rounded-xl border border-slate-100 shadow-xs">
                                        <span
                                            class="text-[10px] md:text-xs font-bold text-slate-500 ml-1.5 md:ml-2">Jumlah
                                            Pinjam:</span>
                                        <div class="flex items-center gap-2 md:gap-3">
                                            <button @click="item.jumlah > 1 && item.jumlah--"
                                                :disabled="item.stok === 0"
                                                class="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md text-slate-600 font-bold hover:bg-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">-</button>
                                            <input type="number" v-model.number="item.jumlah"
                                                @change="validateItemQuantity(item)" @blur="validateItemQuantity(item)"
                                                :disabled="item.stok === 0"
                                                class="w-10 md:w-12 text-center text-xs md:text-sm font-black bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none transition-colors px-1 py-0 custom-number-input"
                                                :class="item.stok === 0 ? 'text-slate-400' : 'text-slate-800'" />
                                            <button @click="item.jumlah < item.stok && item.jumlah++"
                                                :disabled="item.stok === 0 || item.jumlah >= item.stok"
                                                class="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md text-slate-600 font-bold hover:bg-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="cart.length > 0"
                            class="p-4 md:p-6 border-t border-slate-100 bg-white/95 backdrop-blur-md shrink-0">
                            <button @click="openCheckoutModal" :disabled="validCartItems.length === 0"
                                class="w-full py-3.5 md:py-4 text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                :class="validCartItems.length > 0 ? 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5' : 'bg-slate-500 shadow-none hover:translate-y-0'">
                                {{ validCartItems.length > 0 ? 'Lanjut Formulir Peminjaman' : 'Semua Barang Habis' }}
                            </button>
                            <p v-if="validCartItems.length !== cart.length && validCartItems.length > 0"
                                class="text-[9px] md:text-[10px] text-amber-600 font-bold text-center mt-2.5 md:mt-3 leading-tight">
                                *Barang yang habis (0) tidak akan diikutkan saat checkout.
                            </p>
                        </div>
                    </div>
                </transition>
            </div>
        </Teleport>

        <ModalDetailAlat :isOpen="isDetailOpen" :barang="selectedBarang" :isInCart="isInCart(selectedBarang.id)"
            @close="isDetailOpen = false" @add="addToCart" @remove="removeFromCart" />

        <ModalCheckout :isOpen="isCheckoutOpen" :cart="validCartItems" @close="isCheckoutOpen = false"
            @back="isCheckoutOpen = false; isCartOpen = true" @success="onCheckoutSuccess" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import {
    MagnifyingGlassIcon, CubeTransparentIcon, XMarkIcon,
    ArrowRightIcon, ShoppingCartIcon, TrashIcon
} from '@heroicons/vue/24/outline';

import ModalDetailAlat from '../components/ModalDetailAlat.vue';
import ModalCheckout from '../components/ModalCheckout.vue';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
let searchTimeout = null;

const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(12);

const savedCart = localStorage.getItem('cart_peminjaman');
const cart = ref(savedCart ? JSON.parse(savedCart) : []);

const validCartItems = computed(() => {
    return cart.value.filter(item => item.stok > 0 && item.jumlah > 0);
});

watch(cart, (newCart) => {
    localStorage.setItem('cart_peminjaman', JSON.stringify(newCart));
}, { deep: true });

const isCartOpen = ref(false);
const isDetailOpen = ref(false);
const selectedBarang = ref({});
const isCheckoutOpen = ref(false);

watch(searchQuery, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchBarang();
    }, 500);
});

const filteredBarang = computed(() => barangList.value);

// --- Sinkronisasi Stok Local Dengan Server ---
const syncCartWithServerData = (serverDataList) => {
    let hasChanges = false;
    serverDataList.forEach(serverItem => {
        const cartItem = cart.value.find(c => c.id === serverItem.id);
        if (cartItem) {
            if (cartItem.stok !== serverItem.stok) {
                cartItem.stok = serverItem.stok;
                hasChanges = true;
            }
            if (cartItem.stok === 0 && cartItem.jumlah !== 0) {
                cartItem.jumlah = 0;
                hasChanges = true;
            } else if (cartItem.stok > 0 && cartItem.jumlah > cartItem.stok) {
                cartItem.jumlah = cartItem.stok;
                hasChanges = true;
            } else if (cartItem.stok > 0 && cartItem.jumlah === 0) {
                cartItem.jumlah = 1;
                hasChanges = true;
            }
        }
    });
    return hasChanges;
};

const validateItemQuantity = (item) => {
    // Jika dikosongkan atau bukan angka, kembalikan ke 1
    if (typeof item.jumlah !== 'number' || isNaN(item.jumlah) || item.jumlah === '') {
        item.jumlah = 1;
    } 
    // Jika diketik minus atau 0
    else if (item.jumlah < 1) {
        item.jumlah = 1;
    } 
    // Jika diketik melebihi stok yang ada
    else if (item.jumlah > item.stok) {
        item.jumlah = item.stok;
        showAlert(`Maksimal peminjaman untuk ${item.nama_barang} adalah ${item.stok} unit.`, 'warning');
    }
};

const validateCartStock = async () => {
    if (cart.value.length === 0) return;
    let hasChanges = false;

    for (let i = 0; i < cart.value.length; i++) {
        try {
            const res = await api.get(`/barang/${cart.value[i].id}`);
            const freshStok = res.data.data.stok;

            if (cart.value[i].stok !== freshStok) {
                cart.value[i].stok = freshStok;
                hasChanges = true;
            }

            if (freshStok === 0 && cart.value[i].jumlah !== 0) {
                cart.value[i].jumlah = 0;
                hasChanges = true;
            } else if (freshStok > 0 && cart.value[i].jumlah > freshStok) {
                cart.value[i].jumlah = freshStok;
                hasChanges = true;
            } else if (freshStok > 0 && cart.value[i].jumlah === 0) {
                cart.value[i].jumlah = 1;
                hasChanges = true;
            }
        } catch (err) {
            if (err.response?.status === 404 && cart.value[i].stok !== 0) {
                cart.value[i].stok = 0;
                cart.value[i].jumlah = 0;
                hasChanges = true;
            }
        }
    }

    if (hasChanges) {
        showAlert('Stok di keranjang Anda telah disesuaikan dengan kondisi gudang terbaru.', 'warning');
    }
};

watch(isCartOpen, (newVal) => {
    if (newVal) validateCartStock();
});

const fetchBarang = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/barang', {
            params: { page: currentPage.value, limit: limit.value, search: searchQuery.value }
        });
        if (response.data.status === 'success') {
            barangList.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
            syncCartWithServerData(response.data.data);
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
const removeFromCart = (id) => {
    cart.value = cart.value.filter(item => item.id !== id);
};

const confirmRemoveFromCart = (item) => {
    showConfirm(
        `Hapus "${item.nama_barang}" dari keranjang?`,
        () => {
            removeFromCart(item.id);
            showAlert('Barang dihapus dari keranjang.', 'success');
        },
        null,
        'Ya, Hapus',
        'red',
        'Konfirmasi Hapus'
    );
};

const isInCart = (barangId) => {
    return cart.value.some(item => item.id === barangId);
};

const openDetailModal = (barang) => { selectedBarang.value = barang; isDetailOpen.value = true; };

const openCheckoutModal = () => {
    isCartOpen.value = false;
    setTimeout(() => { isCheckoutOpen.value = true; }, 300);
};

const onCheckoutSuccess = () => {
    cart.value = [];
    isCheckoutOpen.value = false;
    showAlert('Peminjaman berhasil! Silakan cek di Riwayat Peminjaman.', 'success');
    fetchBarang();
};

onMounted(() => {
    fetchBarang();
    validateCartStock();
});
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

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(100%);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

.custom-number-input::-webkit-outer-spin-button,
.custom-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

.custom-number-input[type=number] {
    -moz-appearance: textfield; 
    appearance: textfield; 
}
</style>