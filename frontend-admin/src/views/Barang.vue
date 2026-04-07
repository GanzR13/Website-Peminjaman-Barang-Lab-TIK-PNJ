<template>
    <div class="p-8 h-full flex flex-col relative">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Katalog Alat & Barang</h2>
                <p class="text-gray-600 mt-1 text-sm">Kelola detail, gambar, dan stok barang laboratorium.</p>
            </div>
            <button @click="openAddModal" class="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 shrink-0">
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
                    <p class="text-sm font-medium text-gray-500">Total Jenis Barang</p>
                    <p class="text-2xl font-bold text-gray-900">{{ barangList.length }}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Barang Tersedia</p>
                    <p class="text-2xl font-bold text-gray-900">{{ totalTersedia }}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="p-3 rounded-xl bg-red-50 text-red-600">
                    <ExclamationCircleIcon class="w-8 h-8" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">Stok Habis</p>
                    <p class="text-2xl font-bold text-gray-900">{{ totalHabis }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between">
            <div class="relative flex-1 max-w-md">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Cari nama barang atau kode..." 
                    class="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition text-sm"
                />
            </div>
        </div>

        <div class="flex-1">
            <div v-if="filteredBarang.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <CubeTransparentIcon class="w-20 h-20 text-gray-300 mx-auto" />
                <h3 class="text-xl font-bold text-gray-800 mt-6">Barang Tidak Ditemukan</h3>
                <p class="text-gray-500 mt-2 text-sm">Coba ubah kata kunci pencarian Anda atau tambah barang baru.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                <div 
                    v-for="barang in filteredBarang" 
                    :key="barang.id" 
                    @click="openDetailModal(barang)"
                    class="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col group hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <div class="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                        <img 
                            :src="barang.gambar || 'https://via.placeholder.com/300x200?text=No+Image'" 
                            :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div class="absolute top-2 right-2">
                            <span v-if="barang.stok > 0" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 shadow-sm">
                                <CheckIcon class="w-3 h-3" /> Tersedia ({{ barang.stok }})
                            </span>
                            <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 ring-1 ring-red-200 shadow-sm">
                                <XMarkIcon class="w-3 h-3" /> Habis
                            </span>
                        </div>
                    </div>

                    <div class="flex-1 mb-5">
                        <p class="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mb-1.5 border border-blue-100">{{ barang.kode_barang }}</p>
                        <h3 class="text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700">{{ barang.nama_barang }}</h3>
                        <p class="text-xs text-gray-500 mt-1.5 line-clamp-2">{{ barang.deskripsi || 'Tidak ada deskripsi.' }}</p>
                    </div>

                    <div class="flex items-center gap-2 border-t border-gray-100 pt-4 mt-auto">
                        <button @click.stop="openEditModal(barang)" class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition active:scale-95 text-xs border border-gray-200">
                            <PencilSquareIcon class="w-3.5 h-3.5" /> Edit
                        </button>
                        <button @click.stop="confirmDelete(barang)" class="px-3 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 border border-gray-200 hover:border-red-200 transition active:scale-95">
                            <TrashIcon class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="isDetailOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 overflow-y-auto max-h-[90vh]">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                        
                        <button @click="closeDetailModal" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6" />
                        </button>

                        <div class="lg:col-span-5 bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center justify-center min-h-75">
                            <div class="w-full aspect-square rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative group">
                                <img 
                                    :src="selectedBarang.gambar || 'https://via.placeholder.com/600x600?text=No+Image'" 
                                    :alt="selectedBarang.nama_barang"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        <div class="lg:col-span-7 p-8 md:p-10">
                            <div class="flex flex-wrap items-center gap-3 mb-4">
                                <span v-if="selectedBarang.stok > 0" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                                    <CheckCircleIcon class="w-4 h-4" /> Tersedia
                                </span>
                                <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 ring-1 ring-red-200">
                                    <XMarkIcon class="w-4 h-4" /> Habis
                                </span>
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                    {{ selectedBarang.kategori }}
                                </span>
                            </div>

                            <h1 class="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
                                {{ selectedBarang.nama_barang }}
                            </h1>
                            <div class="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg mb-6">
                                <p class="text-xs font-mono font-bold text-blue-700 tracking-wide">
                                    Kode: {{ selectedBarang.kode_barang }}
                                </p>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Stok</p>
                                    <p class="text-2xl font-black text-gray-900">{{ selectedBarang.stok }} <span class="text-xs font-medium text-gray-500">Unit</span></p>
                                </div>
                                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                    <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Sedang Dipinjam</p>
                                    <p class="text-2xl font-black text-blue-700">{{ selectedBarang.dipinjam || 0 }} <span class="text-xs font-medium text-blue-500/70">Unit</span></p>
                                </div>
                            </div>

                            <div class="mb-8">
                                <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">Deskripsi & Spesifikasi</h3>
                                <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {{ selectedBarang.deskripsi || 'Belum ada deskripsi.' }}
                                </p>
                            </div>

                            <div>
                                <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
                                    <ClipboardDocumentListIcon class="w-4 h-4 text-gray-400" /> Peminjaman Terakhir
                                </h3>
                                <div v-if="selectedBarang.riwayat && selectedBarang.riwayat.length > 0" class="space-y-2">
                                    <div v-for="log in selectedBarang.riwayat" :key="log.id" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                        <div>
                                            <p class="text-xs font-bold text-gray-900">{{ log.peminjam }}</p>
                                            <p class="text-[10px] text-gray-500 mt-0.5">{{ log.tanggal }}</p>
                                        </div>
                                        <span class="text-[10px] font-bold px-2 py-1 rounded-md uppercase" 
                                            :class="log.status === 'Dikembalikan' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                                            {{ log.status }}
                                        </span>
                                    </div>
                                </div>
                                <div v-else class="text-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                                    <p class="text-xs text-gray-500 font-medium">Belum ada riwayat peminjaman.</p>
                                </div>
                            </div>

                            <div class="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                                <button @click="openEditModal(selectedBarang); closeDetailModal()" class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition active:scale-95 text-sm">
                                    <PencilSquareIcon class="w-4 h-4" /> Edit Data Ini
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 overflow-y-auto max-h-[90vh]">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-black text-gray-900">{{ isEditMode ? 'Edit Barang' : 'Tambah Barang Baru' }}</h2>
                        <button @click="closeModal" class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>
                    
                    <form @submit.prevent="saveBarang" class="space-y-5">
                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Gambar Barang</label>
                            <div class="flex items-center gap-4">
                                <img :src="form.gambarPreview || 'https://via.placeholder.com/150?text=Preview'" class="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
                                <div class="flex-1">
                                    <input type="file" @change="onFileChange" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"/>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Kode Barang</label>
                                <input v-model="form.kode_barang" type="text" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="LAB-KOM-001" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Nama Barang</label>
                                <input v-model="form.nama_barang" type="text" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="Monitor Dell 24 Inch" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Kategori</label>
                                <select v-model="form.kategori" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm transition-all cursor-pointer">
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option value="Elektronik">Elektronik</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Alat Tulis">Alat Tulis</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Stok</label>
                                <input v-model.number="form.stok" type="number" min="0" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="0" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Deskripsi</label>
                            <textarea v-model="form.deskripsi" rows="3" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="Jelaskan detail barang..."></textarea>
                        </div>

                        <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                            <button type="button" @click="closeModal" class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" class="px-6 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95">
                                {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Barang' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  PlusIcon, CubeIcon, CheckCircleIcon, ExclamationCircleIcon, MagnifyingGlassIcon,
  PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon, CubeTransparentIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline';

// --- DATA DUMMY (Sudah ditambahkan history riwayat) ---
const barangList = ref([
  { 
      id: 1, kode_barang: 'EL-MNT-01', nama_barang: 'Monitor Samsung Odyssey G5 27"', kategori: 'Elektronik', 
      stok: 5, dipinjam: 2, deskripsi: 'Monitor gaming curved 144Hz. Kondisi prima tanpa dead pixel.', 
      gambar: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=600&auto=format&fit=crop',
      riwayat: [
          { id: 101, peminjam: 'Budi Santoso', tanggal: '12 Apr 2026', status: 'Sedang Dipinjam' },
          { id: 102, peminjam: 'Andi Saputra', tanggal: '05 Apr 2026', status: 'Dikembalikan' }
      ]
  },
  { 
      id: 2, kode_barang: 'FR-CH-05', nama_barang: 'Kursi Kantor Ergonomis Seca', kategori: 'Furniture', 
      stok: 0, dipinjam: 0, deskripsi: 'Kursi jaring hitam. Sedang dalam perbaikan karena hidrolik macet.', 
      gambar: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop',
      riwayat: []
  },
  { 
      id: 3, kode_barang: 'EL-LPT-02', nama_barang: 'MacBook Pro M1 2020 16/512GB', kategori: 'Elektronik', 
      stok: 2, dipinjam: 1, deskripsi: 'Warna Space Gray, fullset. Cocok untuk rendering iOS.', 
      gambar: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
      riwayat: [
          { id: 103, peminjam: 'Siti Aminah', tanggal: '13 Apr 2026', status: 'Sedang Dipinjam' }
      ]
  },
]);

// --- SEARCH & STATS LOGIC ---
const searchQuery = ref('');
const filteredBarang = computed(() => {
  if (!searchQuery.value) return barangList.value;
  const query = searchQuery.value.toLowerCase();
  return barangList.value.filter(b => 
    b.nama_barang.toLowerCase().includes(query) || b.kode_barang.toLowerCase().includes(query)
  );
});

const totalTersedia = computed(() => barangList.value.filter(b => b.stok > 0).length);
const totalHabis = computed(() => barangList.value.filter(b => b.stok === 0).length);

// --- MODAL DETAIL LOGIC ---
const isDetailOpen = ref(false);
const selectedBarang = ref({});

const openDetailModal = (barang) => {
    selectedBarang.value = barang;
    isDetailOpen.value = true;
};

const closeDetailModal = () => {
    isDetailOpen.value = false;
};

// --- MODAL FORM LOGIC ---
const isModalOpen = ref(false);
const isEditMode = ref(false);
const defaultForm = { id: null, kode_barang: '', nama_barang: '', kategori: '', stok: 0, deskripsi: '', gambar: null, gambarPreview: null };
const form = ref({ ...defaultForm });

const openAddModal = () => {
  isEditMode.value = false;
  form.value = { ...defaultForm };
  isModalOpen.value = true;
};

const openEditModal = (barang) => {
  isEditMode.value = true;
  form.value = { ...barang, gambarPreview: barang.gambar };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) form.value.gambarPreview = URL.createObjectURL(file);
};

const saveBarang = () => {
  console.log('Menyimpan data:', form.value);
  alert('Simulasi Simpan Berhasil! (Menunggu Backend)');
  closeModal();
};

const confirmDelete = (barang) => {
  if (confirm(`Apakah Anda yakin ingin menghapus "${barang.nama_barang}"?`)) {
    barangList.value = barangList.value.filter(b => b.id !== barang.id);
  }
};
</script>

<style scoped>
/* Transisi Modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

/* Custom Scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
</style>