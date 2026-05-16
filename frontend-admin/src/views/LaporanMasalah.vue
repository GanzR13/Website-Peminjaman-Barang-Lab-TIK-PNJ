<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in bg-slate-50 tracking-tight">
        
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 border border-orange-200">
                    Pemeliharaan Inventaris
                </span>
                <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-none">Manajemen Kendala & Perbaikan</h2>
                <p class="text-slate-500 mt-2 text-sm font-medium leading-relaxed">Pantau laporan kerusakan, kehilangan, dan proses servis alat lab secara real-time.</p>
            </div>
            
            <button @click="fetchLaporan" class="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-sm cursor-pointer shadow-sm">
                <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
                Segarkan Data
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div v-for="(stat, idx) in statsOverview" :key="idx" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div :class="stat.bg" class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
                    <p class="text-xl font-black text-slate-800">{{ stat.value }} <span class="text-xs font-semibold text-slate-500">Unit</span></p>
                </div>
            </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
            <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input v-model="searchQuery" type="text" placeholder="Cari nama barang atau pelapor..."
                    class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-medium" />
            </div>
            <select v-model="filterJenis" class="w-full md:w-48 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 outline-none cursor-pointer">
                <option value="">Semua Jenis</option>
                <option value="Kerusakan">Kerusakan</option>
                <option value="Kehilangan">Kehilangan</option>
            </select>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                            <th class="p-4">Tgl & Pelapor</th>
                            <th class="p-4">Barang Bermasalah</th>
                            <th class="p-4">Jenis & Kendala</th>
                            <th class="p-4 text-center">Status</th>
                            <th class="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                        <tr v-if="isLoading"><td colspan="5" class="p-12 text-center text-slate-500 animate-pulse">Menarik data...</td></tr>
                        <tr v-else-if="paginatedData.length === 0">
                            <td colspan="5" class="p-16 text-center text-slate-500">
                                <ArchiveBoxXMarkIcon class="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                <p class="font-bold text-slate-800 tracking-tight">Tidak ada laporan ditemukan</p>
                            </td>
                        </tr>
                        <tr v-else v-for="item in paginatedData" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4">
                                <p class="text-[10px] font-black text-slate-400 mb-1">{{ formatDate(item.tanggal_kejadian) }}</p>
                                <p class="font-bold text-slate-800">{{ item.pelapor?.nama_lengkap || 'User Lab' }}</p>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <img :src="getImageUrl(item.barang?.gambar)" class="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                    <div>
                                        <p class="font-bold text-slate-800 line-clamp-1">{{ item.barang?.nama_barang }}</p>
                                        <p class="text-xs text-slate-500 font-semibold">{{ item.jumlah }} Unit</p>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <span :class="item.jenis_laporan === 'Kerusakan' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest mb-1 inline-block">
                                    {{ item.jenis_laporan }}
                                </span>
                                <p class="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">"{{ item.deskripsi }}"</p>
                            </td>
                            <td class="p-4 text-center">
                                <span :class="getStatusBadgeClass(item.status)" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1">
                                    {{ item.status === 'Perlu Perbaikan' ? 'Barang Rusak' : item.status }}
                                </span>
                            </td>
                            <td class="p-4 text-center">
                                <button @click="openModal(item)" :class="item.status === 'Selesai Diperbaiki' ? 'text-slate-500 hover:bg-slate-100' : 'text-orange-600 hover:bg-orange-50 border-slate-200'" class="px-4 py-2 bg-white border font-bold rounded-lg transition-colors active:scale-95 text-xs cursor-pointer shadow-sm">
                                    {{ item.status === 'Selesai Diperbaiki' ? 'Lihat Detail' : 'Tinjau / Proses' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!isLoading && filteredData.length > 0" class="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                <span class="text-sm font-bold text-slate-500">Total: {{ filteredData.length }} Laporan</span>
                <div class="flex items-center gap-2 font-bold text-sm">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer">Sebelumnya</button>
                    <span class="text-slate-700 px-3">Hal {{ currentPage }} / {{ totalPages }}</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer">Selanjutnya</button>
                </div>
            </div>
        </div>

        <ModalLaporanBarang 
            :isOpen="isModalOpen" 
            :item="selectedLaporan" 
            :isProcessing="isProcessing"
            @close="isModalOpen = false"
            @save="updateStatusLaporan"
        />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import ModalLaporanBarang from '../components/ModalLaporanBarang.vue';
import { 
    MagnifyingGlassIcon, ClipboardDocumentListIcon, WrenchIcon, 
    ExclamationTriangleIcon, CheckBadgeIcon, ArrowPathIcon, 
    ArchiveBoxXMarkIcon, WrenchScrewdriverIcon 
} from '@heroicons/vue/24/outline';

const { showAlert } = useAlert();

// States
const rawData = ref([]);
const isLoading = ref(false);
const isProcessing = ref(false);
const searchQuery = ref('');
const filterJenis = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isModalOpen = ref(false);
const selectedLaporan = ref(null);

// Fetching
const fetchLaporan = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/admin/laporan');
        if (response.data.status === 'success') rawData.value = response.data.data;
    } catch (e) { showAlert("Gagal memuat data", "error"); }
    finally { isLoading.value = false; }
};

onMounted(fetchLaporan);

// Filtering & Pagination
const filteredData = computed(() => {
    let res = rawData.value;
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        res = res.filter(i => (i.barang?.nama_barang || '').toLowerCase().includes(q) || (i.pelapor?.nama_lengkap || '').toLowerCase().includes(q));
    }
    if (filterJenis.value) res = res.filter(i => i.jenis_laporan === filterJenis.value);
    return res;
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredData.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage) || 1);

// Stats
const statsOverview = computed(() => [
    { label: 'Menunggu', value: rawData.value.filter(d => d.status === 'Menunggu Tindakan').length, icon: ClipboardDocumentListIcon, bg: 'bg-slate-100', color: 'text-slate-600' },
    { label: 'Barang Rusak', value: rawData.value.filter(d => d.status === 'Perlu Perbaikan').length, icon: WrenchScrewdriverIcon, bg: 'bg-red-50', color: 'text-red-600' },
    { label: 'Diservis', value: rawData.value.filter(d => d.status === 'Sedang Diservis').length, icon: WrenchIcon, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'Rusak Total', value: rawData.value.filter(d => d.status === 'Rusak Total').length, icon: ArchiveBoxXMarkIcon, bg: 'bg-slate-800', color: 'text-white' }
]);

// Actions
const openModal = (item) => {
    selectedLaporan.value = item;
    isModalOpen.value = true;
};

const updateStatusLaporan = async (formData) => {
    isProcessing.value = true;
    try {
        await api.put(`/admin/laporan/${selectedLaporan.value.id}/status`, formData);
        showAlert("Berhasil memperbarui status", "success");
        isModalOpen.value = false;
        fetchLaporan();
    } catch (e) { showAlert(e.response?.data?.message || "Gagal update", "error"); }
    finally { isProcessing.value = false; }
};

// Utils
const formatDate = (d) => d ? format(new Date(d), 'dd MMM yyyy', { locale: id }) : '-';
const getImageUrl = (p) => p ? (p.startsWith('http') ? p : `http://localhost:3000${p}`) : 'https://placehold.co/100';

const getStatusBadgeClass = (s) => {
    switch (s) {
        case 'Menunggu Tindakan': return 'bg-slate-100 text-slate-600 ring-slate-300';
        case 'Perlu Perbaikan': return 'bg-red-100 text-red-700 ring-red-300';
        case 'Sedang Diservis': return 'bg-orange-100 text-orange-700 ring-orange-300';
        case 'Selesai Diperbaiki': return 'bg-emerald-100 text-emerald-700 ring-emerald-300';
        case 'Rusak Total': return 'bg-slate-800 text-white ring-slate-900';
        default: return 'bg-slate-100 text-slate-500 ring-slate-200';
    }
};
</script>