<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in bg-slate-50 tracking-tight">
        
        <div class="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 border border-orange-200">
                    Pemeliharaan Inventaris
                </span>
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">Manajemen Kendala & Perbaikan</h2>
                <p class="text-slate-500 mt-1 text-sm font-medium leading-relaxed">Pantau laporan kerusakan, kehilangan, dan proses servis alat lab secara real-time.</p>
            </div>
            
            <button @click="fetchLaporan" class="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-sm cursor-pointer shadow-sm">
                <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
                Segarkan Data
            </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div v-for="(stat, idx) in statsOverview" :key="idx" class="bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <div :class="stat.bg" class="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0">
                    <component :is="stat.icon" class="w-5 h-5 md:w-6 md:h-6" :class="stat.color" />
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
                    <p class="text-lg md:text-xl font-black text-slate-800">{{ stat.value }} <span class="text-[10px] md:text-xs font-semibold text-slate-500">Unit</span></p>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-3 md:gap-4">
            
            <div class="relative flex-1 group">
                <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input v-model="searchQuery" type="text" placeholder="Cari barang atau pelapor..."
                    class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all text-sm font-medium bg-slate-50 focus:bg-white text-slate-700" />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                
                <div class="relative w-full sm:w-56" ref="datePickerRef">
                    <button type="button" @click="showDatePicker = !showDatePicker"
                        class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all text-sm font-bold text-slate-700 bg-slate-50 hover:bg-white cursor-pointer outline-none">
                        <div class="flex items-center gap-2 overflow-hidden">
                            <CalendarIcon class="w-4 h-4 shrink-0 transition-colors" :class="showDatePicker || filterTanggal ? 'text-orange-500' : 'text-slate-400'" />
                            <span class="truncate" :class="filterTanggal ? 'text-slate-800' : 'text-slate-500'">{{ formatForDisplay(filterTanggal) }}</span>
                        </div>
                    </button>

                    <transition name="dropdown">
                        <div v-if="showDatePicker" class="absolute top-full left-0 sm:right-auto sm:left-auto mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 z-50 w-72">
                            <div class="flex items-center justify-between mb-4">
                                <button type="button" @click="prevMonth" class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer">
                                    <ChevronLeftIcon class="w-4 h-4" />
                                </button>
                                <span class="font-black text-slate-800 text-sm tracking-wide">{{ calHeader }}</span>
                                <button type="button" @click="nextMonth" class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer">
                                    <ChevronRightIcon class="w-4 h-4" />
                                </button>
                            </div>
                            <div class="grid grid-cols-7 gap-1 mb-2 text-center">
                                <div v-for="d in daysOfWeek" :key="d" class="text-[10px] font-black text-slate-400">{{ d }}</div>
                            </div>
                            <div class="grid grid-cols-7 gap-1">
                                <button type="button" v-for="(date, i) in calGrid" :key="i"
                                    @click="pilihTanggal(date)"
                                    :disabled="!date"
                                    :class="[
                                        'h-8 w-full rounded-lg text-xs font-bold transition-all flex items-center justify-center',
                                        !date ? 'opacity-0 cursor-default' : 'cursor-pointer',
                                        isSameDate(date, filterTanggal) 
                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 hover:bg-orange-600' 
                                            : (date ? 'text-slate-700 hover:bg-orange-50 hover:text-orange-600' : '')
                                    ]">
                                    {{ date ? date.getDate() : '' }}
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="relative w-full sm:w-48" ref="jenisDropdownRef">
                    <button type="button" @click="showJenisDropdown = !showJenisDropdown"
                        class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all text-sm font-bold text-slate-700 bg-slate-50 hover:bg-white cursor-pointer outline-none">
                        <span class="truncate pr-2">{{ jenisFilterLabel }}</span>
                        <ChevronDownIcon class="w-4 h-4 text-slate-500 transition-transform shrink-0"
                            :class="showJenisDropdown ? 'rotate-180 text-orange-500' : ''" />
                    </button>
                    
                    <transition name="dropdown">
                        <div v-if="showJenisDropdown"
                            class="absolute top-full right-0 sm:left-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                            <button v-for="opt in jenisOptions" :key="opt.value" type="button"
                                @click="pilihJenis(opt.value)"
                                class="w-full px-4 py-2.5 text-sm text-left font-bold transition-colors cursor-pointer"
                                :class="filterJenis === opt.value ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'">
                                {{ opt.label }}
                            </button>
                        </div>
                    </transition>
                </div>

                <button v-if="filterTanggal" @click="resetTanggal" type="button" class="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm cursor-pointer border border-transparent">
                    Reset
                </button>
            </div>
        </div>

        <div class="bg-transparent md:bg-white md:rounded-2xl md:border border-slate-200 md:shadow-sm flex-1 flex flex-col">
            
            <div v-if="isLoading" class="p-12 text-center bg-white rounded-2xl md:bg-transparent">
                <div class="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-slate-500 font-bold animate-pulse">Menarik data laporan...</p>
            </div>
            
            <div v-else-if="paginatedData.length === 0" class="p-16 text-center bg-white rounded-2xl md:bg-transparent">
                <ArchiveBoxXMarkIcon class="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 class="font-bold text-lg text-slate-700 tracking-tight">Tidak ada laporan ditemukan</h3>
                <p class="text-sm text-slate-500 mt-1">Coba sesuaikan kata kunci, tanggal, atau filter jenis.</p>
            </div>

            <div v-else class="md:hidden space-y-3 pb-6">
                <div v-for="item in paginatedData" :key="item.id" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div class="flex justify-between items-start mb-3">
                        <span :class="getStatusBadgeClass(item.status)" class="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ring-1">
                            {{ item.status === 'Perlu Perbaikan' ? 'Barang Rusak' : item.status }}
                        </span>
                        <span :class="item.jenis_laporan === 'Kerusakan' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'" class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                            {{ item.jenis_laporan }}
                        </span>
                    </div>
                    
                    <div class="flex gap-3 mb-3">
                        <img :src="getImageUrl(item.barang?.gambar)" class="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
                        <div>
                            <p class="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{{ item.barang?.nama_barang }}</p>
                            <p class="text-xs text-slate-500 mt-1 font-semibold">Stok Kendala: {{ item.jumlah }} Unit</p>
                        </div>
                    </div>

                    <div class="bg-slate-50 p-3 rounded-xl mb-4">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ formatDate(item.tanggal_kejadian) }} • {{ item.pelapor?.nama_lengkap || 'User Lab' }}</p>
                        <p class="text-xs text-slate-600 line-clamp-2 italic">"{{ item.deskripsi }}"</p>
                    </div>

                    <button @click="openModal(item)" :class="item.status === 'Selesai Diperbaiki' ? 'text-slate-500 bg-slate-100' : 'text-white bg-orange-600 shadow-md shadow-orange-600/20'" class="w-full py-2.5 font-bold rounded-xl transition-colors active:scale-95 text-xs cursor-pointer">
                        {{ item.status === 'Selesai Diperbaiki' ? 'Lihat Detail' : 'Tinjau / Proses Laporan' }}
                    </button>
                </div>
            </div>

            <div v-if="!isLoading && paginatedData.length > 0" class="hidden md:block overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                            <th class="p-4 pl-6">Tgl & Pelapor</th>
                            <th class="p-4">Barang Bermasalah</th>
                            <th class="p-4">Jenis & Kendala</th>
                            <th class="p-4 text-center">Status</th>
                            <th class="p-4 pr-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                        <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4 pl-6">
                                <p class="text-[10px] font-black text-slate-400 mb-1">{{ formatDate(item.tanggal_kejadian) }}</p>
                                <p class="font-bold text-slate-800">{{ item.pelapor?.nama_lengkap || 'User Lab' }}</p>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <img :src="getImageUrl(item.barang?.gambar)" class="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                    <div>
                                        <p class="font-bold text-slate-800 line-clamp-1 max-w-50">{{ item.barang?.nama_barang }}</p>
                                        <p class="text-xs text-slate-500 font-semibold">{{ item.jumlah }} Unit</p>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4 max-w-xs">
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
                            <td class="p-4 pr-6 text-center">
                                <button @click="openModal(item)" :class="item.status === 'Selesai Diperbaiki' ? 'text-slate-500 hover:bg-slate-100' : 'text-orange-600 hover:bg-orange-50 border-slate-200'" class="px-4 py-2 bg-white border font-bold rounded-lg transition-colors active:scale-95 text-xs cursor-pointer shadow-sm">
                                    {{ item.status === 'Selesai Diperbaiki' ? 'Lihat Detail' : 'Tinjau / Proses' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!isLoading && filteredData.length > 0" class="flex flex-col sm:flex-row items-center justify-between p-4 md:border-t border-slate-100 md:bg-slate-50/50 mt-auto gap-4 bg-white rounded-2xl md:rounded-none shadow-sm md:shadow-none">
                <span class="text-xs md:text-sm font-bold text-slate-500 w-full sm:w-auto text-center sm:text-left">Total: {{ filteredData.length }} Laporan</span>
                <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 font-bold text-sm">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer text-xs md:text-sm">
                        <span class="sm:hidden">←</span>
                        <span class="hidden sm:inline">Sebelumnya</span>
                    </button>
                    <span class="text-slate-700 px-2 md:px-4 text-xs md:text-sm">Hal {{ currentPage }} / {{ totalPages }}</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer text-xs md:text-sm">
                        <span class="sm:hidden">→</span>
                        <span class="hidden sm:inline">Selanjutnya</span>
                    </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import ModalLaporanBarang from '../components/ModalLaporanBarang.vue';
import { 
    MagnifyingGlassIcon, ClipboardDocumentListIcon, WrenchIcon, 
    ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon, 
    ArchiveBoxXMarkIcon, WrenchScrewdriverIcon, CalendarIcon 
} from '@heroicons/vue/24/outline';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

// States Umum
const rawData = ref([]);
const isLoading = ref(false);
const isProcessing = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isModalOpen = ref(false);
const selectedLaporan = ref(null);

// === STATE: DROPDOWN JENIS ===
const filterJenis = ref('');
const showJenisDropdown = ref(false);
const jenisDropdownRef = ref(null);

const jenisOptions = [
    { value: '', label: 'Semua Jenis Laporan' },
    { value: 'Kerusakan', label: 'Kerusakan Barang' },
    { value: 'Kehilangan', label: 'Kehilangan Barang' }
];

const jenisFilterLabel = computed(() => {
    return jenisOptions.find(o => o.value === filterJenis.value)?.label || 'Semua Jenis Laporan';
});

const pilihJenis = (val) => {
    filterJenis.value = val;
    showJenisDropdown.value = false;
    currentPage.value = 1;
};

// === STATE: CUSTOM DATE PICKER ===
const filterTanggal = ref(''); 
const showDatePicker = ref(false);
const datePickerRef = ref(null);
const currentCalDate = ref(new Date());

const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const calHeader = computed(() => {
    return `${monthNames[currentCalDate.value.getMonth()]} ${currentCalDate.value.getFullYear()}`;
});

const calGrid = computed(() => {
    const y = currentCalDate.value.getFullYear();
    const m = currentCalDate.value.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();
    let grid = [];
    
    // Slot kosong sebelum hari pertama
    for (let i = 0; i < firstDay; i++) grid.push(null);
    // Tanggal sesungguhnya
    for (let i = 1; i <= totalDays; i++) grid.push(new Date(y, m, i));
    
    return grid;
});

const prevMonth = () => currentCalDate.value = new Date(currentCalDate.value.getFullYear(), currentCalDate.value.getMonth() - 1, 1);
const nextMonth = () => currentCalDate.value = new Date(currentCalDate.value.getFullYear(), currentCalDate.value.getMonth() + 1, 1);

const formatForDisplay = (isoString) => {
    if (!isoString) return 'Pilih Tanggal';
    const d = new Date(isoString);
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

const pilihTanggal = (date) => {
    if (!date) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    filterTanggal.value = `${y}-${m}-${d}`;
    showDatePicker.value = false;
    currentPage.value = 1; // Reset pagination
};

const resetTanggal = () => {
    filterTanggal.value = '';
    currentCalDate.value = new Date();
    currentPage.value = 1;
};

const isSameDate = (d1, isoString) => {
    if (!d1 || !isoString) return false;
    const d2 = new Date(isoString);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

// Menutup dropdown jika klik di luar
const handleClickOutside = (e) => {
    if (jenisDropdownRef.value && !jenisDropdownRef.value.contains(e.target)) {
        showJenisDropdown.value = false;
    }
    if (datePickerRef.value && !datePickerRef.value.contains(e.target)) {
        showDatePicker.value = false;
    }
};

// Fetching
const fetchLaporan = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/admin/laporan');
        if (response.data.status === 'success') rawData.value = response.data.data;
    } catch (e) { showAlert("Gagal memuat data", "error"); }
    finally { isLoading.value = false; }
};

onMounted(() => {
    fetchLaporan();
    window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
});

// Filtering & Pagination
const filteredData = computed(() => {
    let res = rawData.value;
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        res = res.filter(i => (i.barang?.nama_barang || '').toLowerCase().includes(q) || (i.pelapor?.nama_lengkap || '').toLowerCase().includes(q));
    }
    if (filterJenis.value) res = res.filter(i => i.jenis_laporan === filterJenis.value);
    
    if (filterTanggal.value) {
        res = res.filter(i => {
            if(!i.tanggal_kejadian) return false;
            const tglLaporan = new Date(i.tanggal_kejadian).toISOString().split('T')[0];
            return tglLaporan === filterTanggal.value;
        });
    }
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
    if (!selectedLaporan.value?.id) {
        showAlert('Data laporan tidak valid.', 'error');
        return;
    }

    const statusBaru = formData.status;

    let pesanKonfirmasi = 'Simpan perubahan status laporan ini?';
    let tombolText = 'Ya, Simpan';
    let warnaTombol = 'blue';
    let judulDialog = 'Konfirmasi Perubahan Status';

    if (statusBaru === 'Perlu Perbaikan') {
        pesanKonfirmasi = 'Tandai barang ini sebagai perlu perbaikan?';
        tombolText = 'Ya, Tandai';
        warnaTombol = 'red';
    }

    if (statusBaru === 'Sedang Diservis') {
        pesanKonfirmasi = 'Ubah status laporan menjadi sedang diservis?';
        tombolText = 'Ya, Proses';
        warnaTombol = 'orange';
    }

    if (statusBaru === 'Selesai Diperbaiki') {
        pesanKonfirmasi = 'Tandai laporan ini sebagai selesai diperbaiki?';
        tombolText = 'Ya, Selesai';
        warnaTombol = 'emerald';
    }

    if (statusBaru === 'Rusak Total') {
        pesanKonfirmasi = 'Tandai barang ini sebagai rusak total? Pastikan keputusan ini sudah benar.';
        tombolText = 'Ya, Rusak Total';
        warnaTombol = 'red';
        judulDialog = 'Konfirmasi Rusak Total';
    }

    showConfirm(
        pesanKonfirmasi,
        async () => {
            isProcessing.value = true;

            try {
                await api.put(`/admin/laporan/${selectedLaporan.value.id}/status`, formData);

                showAlert('Status laporan berhasil diperbarui.', 'success');

                isModalOpen.value = false;
                selectedLaporan.value = null;

                await fetchLaporan();
            } catch (error) {
                console.error('Gagal update laporan:', error.response?.data || error);

                showAlert(
                    error.response?.data?.message || 'Gagal memperbarui status laporan.',
                    'error'
                );
            } finally {
                isProcessing.value = false;
            }
        },
        null,
        tombolText,
        warnaTombol,
        judulDialog
    );
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

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>