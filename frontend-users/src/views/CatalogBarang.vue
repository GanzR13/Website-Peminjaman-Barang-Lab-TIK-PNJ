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

        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex gap-4 items-center relative z-10">
            <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Ketik nama alat, kode, atau merk yang ingin dicari..." 
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm font-medium text-gray-800"
                />
            </div>
            
            <button 
                @click="isCartOpen = true" 
                class="relative flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all shrink-0 cursor-pointer active:scale-95"
            >
                <ShoppingCartIcon class="w-5 h-5" />
                <span class="hidden sm:inline">Keranjang</span>
                <span v-if="cart.length > 0" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce-short">
                    {{ cart.length }}
                </span>
            </button>
        </div>

        <div class="flex-1">
            <div v-if="filteredBarang.length === 0" class="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                <CubeTransparentIcon class="w-24 h-24 text-gray-200 mx-auto mb-6" />
                <h3 class="text-xl font-bold text-gray-900">Alat Tidak Ditemukan</h3>
                <p class="text-gray-500 mt-2 text-sm">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                <div 
                    v-for="barang in filteredBarang" 
                    :key="barang.id" 
                    @click="openDetailModal(barang)"
                    class="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                >
                    <div v-if="isInCart(barang.id)" class="absolute -right-10 top-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 shadow-sm z-10">
                        Dipilih
                    </div>

                    <div class="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-50 mb-5">
                        <img :src="barang.gambar || 'https://via.placeholder.com/400x300?text=No+Image'" :alt="barang.nama_barang" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
                            <span v-if="barang.stok > 0" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur text-emerald-700 shadow-sm">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Tersedia
                            </span>
                            <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur text-red-700 shadow-sm">
                                <XMarkIcon class="w-3 h-3" /> Stok Habis
                            </span>
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{{ barang.kategori }}</span>
                            <span class="text-xs font-mono text-gray-400 font-bold">{{ barang.kode_barang }}</span>
                        </div>
                        <h3 class="text-lg font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">{{ barang.nama_barang }}</h3>
                        <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-auto">{{ barang.deskripsi || 'Tidak ada spesifikasi tercatat.' }}</p>
                    </div>

                    <div class="mt-6 pt-5 border-t border-gray-100">
                        <button class="w-full py-2.5 bg-gray-50 text-blue-700 font-bold text-sm rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                            Lihat Detail <ArrowRightIcon class="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <transition name="modal-scale">
                <div v-if="isDetailOpen" class="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-6">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" @click="closeDetailModal"></div>
                    
                    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
                        <button @click="closeDetailModal" class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                            <XMarkIcon class="w-5 h-5" />
                        </button>

                        <div class="flex-1 overflow-y-auto">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-full">
                                <div class="bg-gray-50 p-8 md:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                                    <div class="w-full aspect-square max-w-md rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative">
                                        <img :src="selectedBarang.gambar || 'https://via.placeholder.com/800x800?text=No+Image'" :alt="selectedBarang.nama_barang" class="w-full h-full object-cover"/>
                                    </div>
                                </div>
                                <div class="p-8 md:p-12 flex flex-col">
                                    <div class="mb-6">
                                        <div class="flex gap-2 mb-4">
                                            <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600">{{ selectedBarang.kategori }}</span>
                                            <span class="px-3 py-1 rounded-lg text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100">{{ selectedBarang.kode_barang }}</span>
                                        </div>
                                        <h1 class="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{{ selectedBarang.nama_barang }}</h1>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 mb-8">
                                        <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><CubeIcon class="w-3.5 h-3.5" /> Stok Tersedia</p>
                                            <p class="text-3xl font-black" :class="selectedBarang.stok > 0 ? 'text-gray-900' : 'text-red-600'">{{ selectedBarang.stok }} <span class="text-sm font-medium text-gray-500">Unit</span></p>
                                        </div>
                                        <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                            <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ArrowPathIcon class="w-3.5 h-3.5" /> Kondisi</p>
                                            <p class="text-xl font-bold text-blue-800 mt-2">Baik / Normal</p>
                                        </div>
                                    </div>
                                    <div class="mb-8">
                                        <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Spesifikasi Alat</h3>
                                        <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{{ selectedBarang.deskripsi || 'Belum ada detail spesifikasi yang ditambahkan.' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-6 border-t border-gray-100 bg-white shrink-0">
                            <template v-if="selectedBarang.stok > 0">
                                <button v-if="!isInCart(selectedBarang.id)" @click="addToCart(selectedBarang)" class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer text-base"><PlusCircleIcon class="w-6 h-6" /> Tambah ke Keranjang</button>
                                <button v-else @click="removeFromCart(selectedBarang.id)" class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl border border-red-200 hover:bg-red-100 transition-all active:scale-95 cursor-pointer text-base"><TrashIcon class="w-5 h-5" /> Hapus dari Keranjang</button>
                            </template>
                            <button v-else disabled class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed text-base"><XCircleIcon class="w-6 h-6" /> Stok Alat Sedang Kosong</button>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

        <Teleport to="body">
            <div>
                <transition name="fade">
                    <div v-if="isCartOpen" class="fixed inset-0 z-998 bg-black/60 backdrop-blur-md cursor-pointer" @click="isCartOpen = false"></div>
                </transition>
                
                <transition name="slide-right">
                    <div v-if="isCartOpen" class="fixed inset-y-0 right-0 z-999 w-full max-w-md bg-white shadow-2xl flex flex-col">
                        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-blue-100 text-blue-600 rounded-xl"><ShoppingCartIcon class="w-6 h-6" /></div>
                                <h2 class="text-xl font-black text-gray-900">Keranjang Pinjam</h2>
                            </div>
                            <button @click="isCartOpen = false" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"><XMarkIcon class="w-6 h-6" /></button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <ShoppingCartIcon class="w-20 h-20 text-gray-200" />
                                <div>
                                    <p class="font-bold text-gray-900">Keranjang masih kosong</p>
                                    <p class="text-sm text-gray-500">Silakan pilih alat dari katalog terlebih dahulu.</p>
                                </div>
                                <button @click="isCartOpen = false" class="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl mt-2 hover:bg-blue-100 transition-colors">Mulai Memilih</button>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="item in cart" :key="item.id" class="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:border-blue-100 transition-colors">
                                    <img :src="item.gambar || 'https://via.placeholder.com/100'" class="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                                    <div class="flex-1">
                                        <p class="text-[10px] font-mono text-gray-500 mb-1">{{ item.kode_barang }}</p>
                                        <h4 class="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{{ item.nama_barang }}</h4>
                                    </div>
                                    <button @click="removeFromCart(item.id)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit transition-colors"><TrashIcon class="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>

                        <div v-if="cart.length > 0" class="p-6 border-t border-gray-100 bg-white shrink-0">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-sm font-bold text-gray-500">Total Alat Dipilih:</span>
                                <span class="text-xl font-black text-gray-900">{{ cart.length }} Item</span>
                            </div>
                            <button @click="openCheckoutModal" class="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer text-base">
                                Lanjut Isi Form Peminjaman
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </Teleport>

        <Teleport to="body">
            <transition name="modal-scale">
                <div v-if="isCheckoutOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" @click="isCheckoutOpen = false"></div>
                    
                    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col relative z-10 max-h-[90vh]">
                        <div class="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-t-3xl">
                            <div>
                                <h2 class="text-xl font-black text-gray-900">Formulir Peminjaman</h2>
                                <p class="text-xs text-gray-500 mt-1">Lengkapi data untuk meminjam <span class="font-bold text-blue-600">{{ cart.length }} alat</span>.</p>
                            </div>
                            <button @click="isCheckoutOpen = false" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>

                        <div class="p-6 md:p-8 flex-1 overflow-y-auto">
                            <form id="checkoutForm" @submit.prevent="submitPeminjaman" class="space-y-8">
                                <div>
                                    <label class="block text-xs font-black text-gray-900 uppercase tracking-widest mb-3">Kategori Kebutuhan <span class="text-red-500">*</span></label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label class="cursor-pointer relative">
                                            <input type="radio" v-model="formCheckout.kategori_kebutuhan" value="Akademik" class="peer sr-only">
                                            <div class="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                                                <div class="flex items-center gap-3 mb-1">
                                                    <div class="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 flex items-center justify-center shrink-0">
                                                        <div v-if="formCheckout.kategori_kebutuhan === 'Akademik'" class="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    </div>
                                                    <span class="font-bold text-gray-900">Akademik</span>
                                                </div>
                                                <p class="text-xs text-gray-500 pl-7 leading-relaxed">Praktikum, Tugas Akhir, Riset Dosen.</p>
                                            </div>
                                        </label>
                                        <label class="cursor-pointer relative">
                                            <input type="radio" v-model="formCheckout.kategori_kebutuhan" value="Non-Akademik" class="peer sr-only">
                                            <div class="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                                                <div class="flex items-center gap-3 mb-1">
                                                    <div class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
                                                        <div v-if="formCheckout.kategori_kebutuhan === 'Non-Akademik'" class="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    </div>
                                                    <span class="font-bold text-gray-900">Non-Akademik</span>
                                                </div>
                                                <p class="text-xs text-gray-500 pl-7 leading-relaxed">Acara HIMA, BEM, Lomba, UKM.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div v-if="formCheckout.kategori_kebutuhan === 'Non-Akademik'" class="space-y-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                                    <h3 class="text-xs font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2"><ClipboardDocumentListIcon class="w-4 h-4"/> Detail Acara</h3>
                                    <div>
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nama Acara <span class="text-red-500">*</span></label>
                                        <input v-model="formCheckout.nama_acara" type="text" required class="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Lomba Robotik Nasional">
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Organisasi <span class="text-red-500">*</span></label>
                                            <input v-model="formCheckout.organisasi_penyelenggara" type="text" required class="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: HIMA TIK">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Dosen Penanggung Jawab <span class="text-red-500">*</span></label>
                                            <input v-model="formCheckout.dosen_penanggung_jawab" type="text" required class="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Nama Dosen Pembina">
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Tujuan Peminjaman <span class="text-red-500">*</span></label>
                                        <textarea v-model="formCheckout.tujuan_peminjaman" rows="2" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Jelaskan secara singkat alat ini akan digunakan untuk apa..."></textarea>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Tanggal Pinjam <span class="text-red-500">*</span></label>
                                            <input v-model="formCheckout.tanggal_pinjam" type="date" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 cursor-pointer">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Tanggal Kembali <span class="text-red-500">*</span></label>
                                            <input v-model="formCheckout.tanggal_kembali" type="date" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 cursor-pointer">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-3xl">
                            <button type="button" @click="isCheckoutOpen = false" class="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition cursor-pointer">Batal</button>
                            <button type="submit" form="checkoutForm" class="px-6 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95">Ajukan Peminjaman</button>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  MagnifyingGlassIcon, CubeTransparentIcon, XMarkIcon, 
  ArrowRightIcon, CubeIcon, PlusCircleIcon, XCircleIcon, ArrowPathIcon,
  ShoppingCartIcon, TrashIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline';

const barangList = ref([
  { id: 1, kode_barang: 'MC-ARD-01', nama_barang: 'Kit Arduino Mega 2560 R3 Asli', kategori: 'Mikrokontroler', stok: 12, deskripsi: 'Board mikrokontroler berbasis ATmega2560. Kondisi lengkap dengan kabel USB.' },
  { id: 2, kode_barang: 'MC-ESP-32', nama_barang: 'Modul ESP32 Doit DevKit V1', kategori: 'Mikrokontroler', stok: 0, deskripsi: 'Mikrokontroler dengan WiFi.', gambar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' },
  { id: 3, kode_barang: 'TL-OSC-01', nama_barang: 'Oscilloscope Rigol DS1054Z 50MHz', kategori: 'Alat Ukur', stok: 2, deskripsi: 'Digital oscilloscope 4 channel.', gambar: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop' },
  { id: 4, kode_barang: 'TL-MUL-05', nama_barang: 'Multimeter Digital Fluke 17B+', kategori: 'Alat Ukur', stok: 5, deskripsi: 'Multimeter standar industri yang akurat.' }
]);

const searchQuery = ref('');
const filteredBarang = computed(() => {
  if (!searchQuery.value) return barangList.value;
  return barangList.value.filter(b => 
    b.nama_barang.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    b.kode_barang.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- CART STATE ---
const cart = ref([]);
const isCartOpen = ref(false);

const addToCart = (barang) => { if (!isInCart(barang.id)) cart.value.push(barang); };
const removeFromCart = (id) => { cart.value = cart.value.filter(item => item.id !== id); };
const isInCart = (id) => cart.value.some(item => item.id === id);

// --- DETAIL MODAL STATE ---
const isDetailOpen = ref(false);
const selectedBarang = ref({});
const openDetailModal = (barang) => { selectedBarang.value = barang; isDetailOpen.value = true; };
const closeDetailModal = () => isDetailOpen.value = false;

// --- CHECKOUT FORM STATE ---
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

const openCheckoutModal = () => {
    isCartOpen.value = false; 
    setTimeout(() => { isCheckoutOpen.value = true; }, 300); // Beri jeda animasi
};

const submitPeminjaman = () => {
    console.log("Data:", formCheckout.value, "Barang:", cart.value);
    alert(`Sukses! Peminjaman ${cart.value.length} alat berhasil dikirim.`);
    cart.value = [];
    isCheckoutOpen.value = false;
    formCheckout.value = { kategori_kebutuhan: 'Akademik', tujuan_peminjaman: '', tanggal_pinjam: '', tanggal_kembali: '', nama_acara: '', organisasi_penyelenggara: '', dosen_penanggung_jawab: '' };
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-bounce-short { animation: bounceShort 0.5s ease-in-out 1; }
@keyframes bounceShort { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-3px) scale(1.1); } }

/* Animasi Fade standar */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Animasi Modal Scale (Zoom in sedikit) */
.modal-scale-enter-active, .modal-scale-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-scale-enter-from, .modal-scale-leave-to { opacity: 0; transform: scale(0.95); }

/* Animasi Slide Keranjang dari Kanan */
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>