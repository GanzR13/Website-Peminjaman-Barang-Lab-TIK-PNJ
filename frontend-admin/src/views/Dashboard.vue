<template>
    <div class="p-8 relative h-full flex flex-col bg-gray-50 overflow-y-auto">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
            <p class="text-gray-600 mt-1 text-sm">Ringkasan sistem manajemen barang dan aktivitas terbaru.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                    124
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total User</p>
                    <p class="text-sm font-medium text-gray-600">Terdaftar</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                    42
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Jenis Alat</p>
                    <p class="text-sm font-medium text-gray-600">Dalam Katalog</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
                    3
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Alat Rusak</p>
                    <p class="text-sm font-medium text-gray-600">Perlu Perbaikan</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                    12
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Peminjaman</p>
                    <p class="text-sm font-medium text-gray-600">Sedang Aktif</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-125">
            
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Aktivitas & Permintaan</h2>
                    <p class="text-sm text-gray-500">Kelola persetujuan dan riwayat peminjaman.</p>
                </div>
                
                <div class="relative w-full md:w-72">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        v-model="searchQuery"
                        @input="currentPage = 1"
                        type="text" 
                        placeholder="Cari nama peminjam..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                    />
                </div>
            </div>

            <div class="overflow-x-auto flex-1">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th class="py-4 px-6">Peminjam</th>
                            <th class="py-4 px-6">Total Barang</th>
                            <th class="py-4 px-6">Status</th>
                            <th class="py-4 px-6">Waktu</th>
                            <th class="py-4 px-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-gray-50">
                        <tr v-if="paginatedAktivitas.length === 0">
                            <td colspan="5" class="py-12 text-center text-gray-500">
                                Tidak ada data aktivitas yang ditemukan.
                            </td>
                        </tr>

                        <tr v-for="aktivitas in paginatedAktivitas" :key="aktivitas.id" class="hover:bg-blue-50/30 transition-colors">
                            <td class="py-4 px-6 font-bold text-gray-900">{{ aktivitas.peminjam }}</td>
                            <td class="py-4 px-6 text-gray-600 font-bold">
                                {{ aktivitas.barang.length }} <span class="font-normal text-xs text-gray-400">Item</span>
                            </td>
                            <td class="py-4 px-6">
                                <span 
                                    class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
                                    :class="{
                                        'bg-amber-100 text-amber-700 ring-1 ring-amber-200': aktivitas.status === 'Menunggu',
                                        'bg-blue-100 text-blue-700 ring-1 ring-blue-200': aktivitas.status === 'Dipinjam',
                                        'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200': aktivitas.status === 'Kembali',
                                        'bg-red-100 text-red-700 ring-1 ring-red-200': aktivitas.status === 'Ditolak'
                                    }">
                                    {{ aktivitas.status }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-gray-500 text-xs font-medium">{{ aktivitas.waktu }}</td>
                            <td class="py-4 px-6 text-center">
                                <div class="flex justify-center items-center gap-2">
                                    <button 
                                        @click="openModalReview(aktivitas)"
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors text-xs font-bold shadow-sm cursor-pointer"
                                    >
                                        <EyeIcon class="w-4 h-4" /> 
                                        {{ aktivitas.status === 'Menunggu' ? 'Review' : 'Detail' }}
                                    </button>
                                    
                                    <button 
                                        @click="deleteAktivitas(aktivitas.id)"
                                        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Hapus Riwayat"
                                    >
                                        <TrashIcon class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Menampilkan <span class="text-blue-600">{{ startIndex + 1 }}</span> - 
                    <span class="text-blue-600">{{ Math.min(endIndex, filteredAktivitas.length) }}</span> 
                    dari {{ filteredAktivitas.length }} data
                </span>
                
                <div class="flex gap-2">
                    <button 
                        @click="prevPage" 
                        :disabled="currentPage === 1" 
                        class="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                        Sebelumnya
                    </button>
                    <button 
                        @click="nextPage" 
                        :disabled="currentPage === totalPages || totalPages === 0" 
                        class="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-0 overflow-hidden">
                    
                    <div class="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-black text-gray-900">
                                {{ selectedRequest.status === 'Menunggu' ? 'Review Permintaan Peminjaman' : 'Detail Peminjaman' }}
                            </h3>
                            <p class="text-xs text-gray-500 mt-1 font-medium">Oleh: <span class="font-bold text-blue-600">{{ selectedRequest.peminjam }}</span></p>
                        </div>
                        <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="p-6 max-h-[50vh] overflow-y-auto">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Daftar Alat/Barang:</p>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in selectedRequest.barang" :key="index" class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <CubeIcon class="w-6 h-6" />
                                </div>
                                <div>
                                    <p class="font-bold text-sm text-gray-900">{{ item.nama }}</p>
                                    <p class="text-xs font-mono text-gray-500 mt-0.5">Kode: {{ item.kode }}</p>
                                </div>
                            </li>
                        </ul>

                        <div class="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100" v-if="selectedRequest.catatan">
                            <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Catatan Peminjam:</p>
                            <p class="text-sm text-amber-800 font-medium">"{{ selectedRequest.catatan }}"</p>
                        </div>
                    </div>

                    <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button @click="closeModal" class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">
                            Tutup
                        </button>
                        
                        <template v-if="selectedRequest.status === 'Menunggu'">
                            <button @click="rejectRequest" class="flex items-center gap-2 px-5 py-2 text-sm font-bold text-red-600 bg-red-100 hover:bg-red-200 border border-red-200 rounded-xl transition-colors active:scale-95 cursor-pointer">
                                <XCircleIcon class="w-5 h-5" /> Tolak
                            </button>
                            <button @click="approveRequest" class="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-colors active:scale-95 cursor-pointer">
                                <CheckCircleIcon class="w-5 h-5" /> Setujui Peminjaman
                            </button>
                        </template>
                    </div>

                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { EyeIcon, XMarkIcon, CubeIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert'; // 1. Import Global Alert

const { showAlert } = useAlert(); // 2. Ekstrak fungsi showAlert

const aktivitasList = ref([
    { id: 1, peminjam: 'Andi Saputra', waktu: '10 Menit lalu', status: 'Menunggu', catatan: 'Praktikum mikrokontroler kelas TIK-4A', barang: [{ kode: 'EL-001', nama: 'Oscilloscope Rigol DS1054Z' }, { kode: 'EL-012', nama: 'Kabel Probe BNC' }] },
    { id: 2, peminjam: 'Budi Santoso', waktu: '1 Jam lalu', status: 'Dipinjam', catatan: '', barang: [{ kode: 'EL-005', nama: 'Multimeter Digital Fluke 17B+' }] },
    { id: 3, peminjam: 'Siti Aminah', waktu: 'Kemarin', status: 'Kembali', catatan: 'Solder sedikit tumpul', barang: [{ kode: 'EL-008', nama: 'Solder Station Hakko FX-888D' }] },
    { id: 4, peminjam: 'Rizky Maulana', waktu: 'Kemarin', status: 'Menunggu', catatan: 'Pinjam proyektor untuk presentasi skripsi', barang: [{ kode: 'PRJ-01', nama: 'Proyektor Epson EB-X05' }] },
    { id: 5, peminjam: 'Dina Lestari', waktu: '2 Hari lalu', status: 'Ditolak', catatan: '', barang: [{ kode: 'EL-015', nama: 'Power Supply Zhaoxin' }] },
    { id: 6, peminjam: 'Fajar Nugraha', waktu: '2 Hari lalu', status: 'Dipinjam', catatan: 'Untuk lomba robotik', barang: [{ kode: 'RBT-02', nama: 'Kit Arduino Mega 2560' }, { kode: 'RBT-03', nama: 'Sensor Ultrasonik HC-SR04' }] },
    { id: 7, peminjam: 'Ayu Wandira', waktu: '3 Hari lalu', status: 'Kembali', catatan: '', barang: [{ kode: 'NTW-01', nama: 'Crimping Tool Oucheng' }, { kode: 'NTW-02', nama: 'LAN Tester' }] },
]);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5; 

const filteredAktivitas = computed(() => {
    if (!searchQuery.value) return aktivitasList.value;
    const query = searchQuery.value.toLowerCase();
    return aktivitasList.value.filter(a => 
        a.peminjam.toLowerCase().includes(query) || 
        a.status.toLowerCase().includes(query)
    );
});

const totalPages = computed(() => Math.ceil(filteredAktivitas.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedAktivitas = computed(() => {
    return filteredAktivitas.value.slice(startIndex.value, endIndex.value);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

// --- LOGIKA HAPUS DATA DENGAN ALERT CONFIRM ---
const deleteAktivitas = (id) => {
    // Gunakan mode confirm dari useAlert
    showAlert(
        "Apakah Anda yakin ingin menghapus riwayat aktivitas ini? Data tidak dapat dikembalikan.",
        "confirm",
        () => {
            // Callback jika di-klik "Ya"
            aktivitasList.value = aktivitasList.value.filter(a => a.id !== id);
            
            if (paginatedAktivitas.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }

            // Tampilkan alert success setelah berhasil dihapus
            showAlert("Riwayat aktivitas berhasil dihapus.", "success");
        }
    );
};

const isModalOpen = ref(false);
const selectedRequest = ref(null);

const openModalReview = (aktivitas) => {
    selectedRequest.value = aktivitas;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    setTimeout(() => { selectedRequest.value = null; }, 300);
};

// --- LOGIKA APPROVAL DENGAN ALERT SUCCESS ---
const approveRequest = () => {
    const index = aktivitasList.value.findIndex(a => a.id === selectedRequest.value.id);
    if (index !== -1) {
        aktivitasList.value[index].status = 'Dipinjam';
    }
    closeModal();
    
    // Tampilkan pesan sukses
    showAlert("Permintaan peminjaman berhasil disetujui.", "success");
};

// --- LOGIKA REJECT DENGAN ALERT SUCCESS ---
const rejectRequest = () => {
    // Prompt bawaan browser tetap digunakan untuk mengambil input alasan (teks)
    const alasan = prompt('Masukkan alasan penolakan (opsional):');
    if (alasan !== null) {
        const index = aktivitasList.value.findIndex(a => a.id === selectedRequest.value.id);
        if (index !== -1) {
            aktivitasList.value[index].status = 'Ditolak';
        }
        closeModal();
        
        // Tampilkan pesan bahwa penolakan berhasil diproses
        showAlert("Permintaan peminjaman telah ditolak.", "success");
    }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.95); }

.overflow-y-auto::-webkit-scrollbar, .overflow-x-auto::-webkit-scrollbar { width: 6px; height: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb, .overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>