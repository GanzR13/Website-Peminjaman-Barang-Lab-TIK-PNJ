<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in bg-slate-50 tracking-tight">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Manajemen Peminjaman
                </h2>
                <p class="text-slate-500 mt-1 text-sm font-medium leading-relaxed">
                    Kelola persetujuan, antrian harian, dan riwayat alat lab.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full sm:w-auto">
                <button @click="exportExcel"
                    class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 ring-1 ring-emerald-200 transition-all active:scale-95 text-sm cursor-pointer shadow-sm">
                    <DocumentArrowDownIcon class="w-4 h-4" />
                    Export Excel
                </button>

                <button @click="exportPDF"
                    class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 ring-1 ring-red-200 transition-all active:scale-95 text-sm cursor-pointer shadow-sm">
                    <DocumentTextIcon class="w-4 h-4" />
                    Export PDF
                </button>
            </div>
        </div>

        <!-- Filter -->
        <div class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">

            <!-- Date Filter -->
            <div class="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:flex-1">

                    <!-- Start Date -->
                    <div class="relative w-full" ref="startPickerRef">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                            Mulai
                        </label>

                        <button type="button" @click.stop="toggleStartPicker" class="date-filter-button"
                            :class="showStartPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <CalendarIcon class="w-4 h-4 shrink-0 transition-colors"
                                    :class="showStartPicker || startDate ? 'text-blue-500' : 'text-slate-400'" />
                                <span class="truncate" :class="startDate ? 'text-slate-800' : 'text-slate-500'">
                                    {{ formatForDisplay(startDate) }}
                                </span>
                            </div>

                            <ChevronDownIcon class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                                :class="showStartPicker ? 'rotate-180 text-blue-500' : ''" />
                        </button>

                        <transition name="dropdown">
                            <div v-if="showStartPicker" class="date-picker-panel left-0" @click.stop>
                                <div class="flex items-center justify-between mb-4">
                                    <button type="button" @click="currentStartCal = subMonth(currentStartCal)"
                                        class="calendar-nav-button">
                                        <ChevronLeftIcon class="w-4 h-4" />
                                    </button>

                                    <span class="font-black text-slate-800 text-sm">
                                        {{ getCalHeader(currentStartCal) }}
                                    </span>

                                    <button type="button" @click="currentStartCal = addMonth(currentStartCal)"
                                        class="calendar-nav-button">
                                        <ChevronRightIcon class="w-4 h-4" />
                                    </button>
                                </div>

                                <div
                                    class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                    <div v-for="d in daysOfWeek" :key="d">
                                        {{ d }}
                                    </div>
                                </div>

                                <div class="grid grid-cols-7 gap-1">
                                    <button type="button" v-for="(date, i) in startCalGrid" :key="i"
                                        @click="pilihStartDate(date)" :disabled="!date" class="calendar-day"
                                        :class="getStartDateClass(date)">
                                        {{ date ? date.getDate() : '' }}
                                    </button>
                                </div>

                                <div
                                    class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                    <button type="button" @click="clearStartDate"
                                        class="calendar-action-button text-slate-500 hover:bg-slate-100">
                                        Hapus
                                    </button>

                                    <button type="button" @click="setStartToday"
                                        class="calendar-action-button text-blue-600 hover:bg-blue-50">
                                        Hari ini
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>

                    <!-- End Date -->
                    <div class="relative w-full" ref="endPickerRef">
                        <label
                            class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                            Selesai
                        </label>

                        <button type="button" @click.stop="toggleEndPicker" class="date-filter-button"
                            :class="showEndPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <CalendarIcon class="w-4 h-4 shrink-0 transition-colors"
                                    :class="showEndPicker || endDate ? 'text-blue-500' : 'text-slate-400'" />
                                <span class="truncate" :class="endDate ? 'text-slate-800' : 'text-slate-500'">
                                    {{ formatForDisplay(endDate) }}
                                </span>
                            </div>

                            <ChevronDownIcon class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                                :class="showEndPicker ? 'rotate-180 text-blue-500' : ''" />
                        </button>

                        <transition name="dropdown">
                            <div v-if="showEndPicker" class="date-picker-panel left-0 sm:right-0 sm:left-auto"
                                @click.stop>
                                <div class="flex items-center justify-between mb-4">
                                    <button type="button" @click="currentEndCal = subMonth(currentEndCal)"
                                        class="calendar-nav-button">
                                        <ChevronLeftIcon class="w-4 h-4" />
                                    </button>

                                    <span class="font-black text-slate-800 text-sm">
                                        {{ getCalHeader(currentEndCal) }}
                                    </span>

                                    <button type="button" @click="currentEndCal = addMonth(currentEndCal)"
                                        class="calendar-nav-button">
                                        <ChevronRightIcon class="w-4 h-4" />
                                    </button>
                                </div>

                                <div
                                    class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                    <div v-for="d in daysOfWeek" :key="d">
                                        {{ d }}
                                    </div>
                                </div>

                                <div class="grid grid-cols-7 gap-1">
                                    <button type="button" v-for="(date, i) in endCalGrid" :key="i"
                                        @click="pilihEndDate(date)" :disabled="!date || isBeforeStartDate(date)"
                                        class="calendar-day" :class="getEndDateClass(date)">
                                        {{ date ? date.getDate() : '' }}
                                    </button>
                                </div>

                                <p v-if="startDate" class="mt-3 text-[10px] font-bold text-slate-400">
                                    Tanggal selesai tidak boleh sebelum tanggal mulai.
                                </p>

                                <div
                                    class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                    <button type="button" @click="clearEndDate"
                                        class="calendar-action-button text-slate-500 hover:bg-slate-100">
                                        Hapus
                                    </button>

                                    <button type="button" @click="setEndToday"
                                        class="calendar-action-button text-blue-600 hover:bg-blue-50">
                                        Hari ini
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Quick Date Actions -->
                <div class="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                    <button @click="setToday"
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-xl hover:bg-emerald-100 ring-1 ring-emerald-200/50 transition-all cursor-pointer">
                        Hari Ini
                    </button>

                    <button @click="setThisWeek"
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-indigo-50 text-indigo-700 text-[11px] font-black rounded-xl hover:bg-indigo-100 ring-1 ring-indigo-200/50 transition-all cursor-pointer">
                        Mg. Ini
                    </button>

                    <button @click="resetDateFilter"
                        class="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        title="Reset Tanggal">
                        <ArrowPathIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div class="w-full h-px bg-slate-100 my-1"></div>

            <!-- Search & Status -->
            <div class="flex flex-col md:flex-row gap-3 items-center">
                <div class="relative w-full group">
                    <MagnifyingGlassIcon
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama peminjam..."
                        class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium bg-slate-50 focus:bg-white" />
                </div>

                <div class="relative w-full md:w-56 shrink-0" ref="statusDropdownRef">
                    <button type="button" @click.stop="showStatusDropdown = !showStatusDropdown"
                        class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 bg-slate-50 hover:bg-white cursor-pointer outline-none">
                        <span class="truncate pr-2">{{ statusFilterLabel }}</span>
                        <ChevronDownIcon class="w-4 h-4 text-slate-500 transition-transform shrink-0"
                            :class="showStatusDropdown ? 'rotate-180 text-blue-500' : ''" />
                    </button>

                    <transition name="dropdown">
                        <div v-if="showStatusDropdown"
                            class="absolute top-full right-0 sm:left-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                            @click.stop>
                            <button v-for="opt in statusOptions" :key="opt.value" type="button"
                                @click="pilihStatus(opt.value)"
                                class="w-full px-4 py-2.5 text-sm text-left font-bold transition-colors cursor-pointer"
                                :class="filterStatus === opt.value ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'">
                                {{ opt.label }}
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div
            class="bg-transparent md:bg-white md:rounded-2xl md:border border-slate-200 md:shadow-sm flex-1 flex flex-col overflow-hidden">

            <!-- Loading -->
            <div v-if="isLoading" class="p-12 text-center bg-white rounded-2xl md:bg-transparent">
                <div
                    class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <p class="text-slate-500 font-bold animate-pulse">
                    Menarik antrian peminjaman...
                </p>
            </div>

            <!-- Empty -->
            <div v-else-if="paginatedData.length === 0" class="p-16 text-center bg-white rounded-2xl md:bg-transparent">
                <ClipboardDocumentListIcon class="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 class="font-bold text-lg text-slate-700 tracking-tight">
                    Tidak ada antrian
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                    Belum ada peminjaman sesuai kriteria.
                </p>
            </div>

            <!-- Mobile Cards -->
            <div v-else class="md:hidden space-y-3 pb-6">
                <div v-for="item in paginatedData" :key="item.id"
                    class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-2">
                            <span class="bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                                #{{ item.antrian || item.id }}
                            </span>

                            <span v-if="item.kategori_kebutuhan === 'Khusus'"
                                class="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                Khusus
                            </span>
                        </div>

                        <span :class="getStatusBadgeClass(item.status)"
                            class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 text-center max-w-30 truncate">
                            {{ item.status }}
                        </span>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center gap-2">
                            <p class="font-bold text-slate-900 text-lg">
                                {{ item.nama_peminjam }}
                            </p>

                            <ExclamationTriangleIcon v-if="item.laporan_masalah?.length > 0"
                                class="w-5 h-5 text-orange-500" />
                        </div>

                        <div class="flex items-center gap-3 mt-3">
                            <div class="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    Pinjam
                                </p>
                                <p class="text-xs font-bold text-slate-700 mt-0.5">
                                    {{ formatDate(item.tanggal_pinjam) }}
                                </p>
                            </div>

                            <div class="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    Kembali
                                </p>
                                <p class="text-xs font-bold text-slate-700 mt-0.5">
                                    {{ formatDate(item.tanggal_kembali) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button @click="openProcessModal(item)"
                        class="w-full py-2.5 border border-slate-200 text-blue-600 bg-white font-black rounded-xl transition-colors hover:bg-blue-50 active:scale-95 text-xs cursor-pointer shadow-sm">
                        Detail / Proses Transaksi
                    </button>
                </div>
            </div>

            <!-- Desktop Table -->
            <div v-if="!isLoading && paginatedData.length > 0" class="hidden md:block overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                            <th class="p-4 pl-6">Antrian</th>
                            <th class="p-4">Info Peminjam</th>
                            <th class="p-4">Tgl Pinjam</th>
                            <th class="p-4">Tgl Kembali</th>
                            <th class="p-4 pr-6 text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody class="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                        <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="p-4 pl-6 font-black text-slate-900">
                                #{{ item.antrian || item.id }}
                            </td>

                            <td class="p-4">
                                <div class="flex items-center gap-2 mb-1.5">
                                    <p class="font-bold text-slate-900">
                                        {{ item.nama_peminjam }}
                                    </p>

                                    <ExclamationTriangleIcon v-if="item.laporan_masalah?.length > 0"
                                        class="w-4 h-4 text-orange-500" title="Ada Laporan Masalah!" />
                                </div>

                                <div class="flex items-center gap-2">
                                    <span :class="getStatusBadgeClass(item.status)"
                                        class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ring-1">
                                        {{ item.status }}
                                    </span>

                                    <span v-if="item.kategori_kebutuhan === 'Khusus'"
                                        class="text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                        Khusus
                                    </span>
                                </div>
                            </td>

                            <td class="p-4">
                                <span
                                    class="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-bold text-xs">
                                    {{ formatDate(item.tanggal_pinjam) }}
                                </span>
                            </td>

                            <td class="p-4">
                                <span
                                    class="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-bold text-xs">
                                    {{ formatDate(item.tanggal_kembali) }}
                                </span>
                            </td>

                            <td class="p-4 pr-6 text-center">
                                <button @click="openProcessModal(item)"
                                    class="px-4 py-2 bg-white border border-slate-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors active:scale-95 text-xs cursor-pointer shadow-sm">
                                    Detail / Proses
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="!isLoading && filteredData.length > 0"
                class="flex flex-col sm:flex-row items-center justify-between p-4 md:border-t border-slate-100 md:bg-slate-50/50 mt-auto gap-4 bg-white rounded-2xl md:rounded-none shadow-sm md:shadow-none z-10">
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <span class="text-xs font-bold text-slate-500 hidden sm:inline">
                        Tampilkan:
                    </span>

                    <div class="relative w-full sm:w-32" ref="limitDropdownRef">
                        <button type="button" @click.stop="showLimitDropdown = !showLimitDropdown"
                            class="w-full flex items-center justify-between px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer outline-none shadow-sm">
                            <span>{{ itemsPerPage }} Baris</span>
                            <ChevronDownIcon class="w-3 h-3 text-slate-500 transition-transform shrink-0"
                                :class="showLimitDropdown ? 'rotate-180 text-blue-500' : ''" />
                        </button>

                        <transition name="dropdown">
                            <div v-if="showLimitDropdown"
                                class="absolute bottom-full left-0 mb-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                @click.stop>
                                <button v-for="opt in limitOptions" :key="opt" type="button" @click="pilihLimit(opt)"
                                    class="w-full px-4 py-2.5 text-xs text-left font-bold transition-colors cursor-pointer"
                                    :class="itemsPerPage === opt ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'">
                                    {{ opt }} Baris
                                </button>
                            </div>
                        </transition>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 font-bold text-xs md:text-sm">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer shadow-sm">
                        <span class="sm:hidden">←</span>
                        <span class="hidden sm:inline">Sebelumnya</span>
                    </button>

                    <span class="text-slate-700 px-2 md:px-4">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </span>

                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer shadow-sm">
                        <span class="sm:hidden">→</span>
                        <span class="hidden sm:inline">Selanjutnya</span>
                    </button>
                </div>
            </div>
        </div>

        <ModalManagementPeminjam :isOpen="isModalOpen" :selectedData="selectedData" :processingStatus="processingStatus"
            @close="isModalOpen = false" @update-status="updateStatus" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm'; // IMPORT Confirm Baruu
import ModalManagementPeminjam from '../components/ModalManagementPeminjam.vue';
import {
    format,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    parseISO,
    endOfDay
} from 'date-fns';
import { id } from 'date-fns/locale/id';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    MagnifyingGlassIcon,
    ClipboardDocumentListIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm(); // Panggil fungsi Confirm

// State Umum
const rawPeminjamanList = ref([]);
const isLoading = ref(false);
const processingStatus = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const isModalOpen = ref(false);
const selectedData = ref(null);

// Status Dropdown
const filterStatus = ref('');
const showStatusDropdown = ref(false);
const statusDropdownRef = ref(null);

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Menunggu', label: 'Menunggu (Pending)' },
    { value: 'Disetujui', label: 'Disetujui (Belum Diambil)' },
    { value: 'Barang Rusak', label: 'Barang Rusak / Hilang' },
    { value: 'Dipinjam', label: 'Dipinjam (Sedang Digunakan)' },
    { value: 'Selesai', label: 'Selesai (Dikembalikan)' },
    { value: 'Ditolak', label: 'Ditolak / Dibatalkan' }
];

const statusFilterLabel = computed(() => {
    return statusOptions.find(o => o.value === filterStatus.value)?.label || 'Semua Status';
});

const pilihStatus = (val) => {
    filterStatus.value = val;
    showStatusDropdown.value = false;
    currentPage.value = 1;
};

// Limit Dropdown
const itemsPerPage = ref(10);
const showLimitDropdown = ref(false);
const limitDropdownRef = ref(null);
const limitOptions = [10, 20, 50, 100];

const pilihLimit = (val) => {
    itemsPerPage.value = val;
    showLimitDropdown.value = false;
    currentPage.value = 1;
};

// Date Picker
const startDate = ref('');
const endDate = ref('');
const showStartPicker = ref(false);
const showEndPicker = ref(false);
const startPickerRef = ref(null);
const endPickerRef = ref(null);

const currentStartCal = ref(new Date());
const currentEndCal = ref(new Date());

const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];

const makeLocalDate = (dateString) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split('-').map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
};

const getCalHeader = (date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const addMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const subMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const getCalGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const grid = [];

    for (let i = 0; i < firstDay; i++) {
        grid.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
        grid.push(new Date(year, month, day));
    }

    return grid;
};

const startCalGrid = computed(() => getCalGrid(currentStartCal.value));
const endCalGrid = computed(() => getCalGrid(currentEndCal.value));

const formatForDisplay = (dateString) => {
    const date = makeLocalDate(dateString);

    if (!date) return 'Pilih Tanggal';

    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatForStore = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const toggleStartPicker = () => {
    showStartPicker.value = !showStartPicker.value;
    showEndPicker.value = false;
    showStatusDropdown.value = false;
    showLimitDropdown.value = false;

    if (startDate.value) {
        currentStartCal.value = makeLocalDate(startDate.value);
    }
};

const toggleEndPicker = () => {
    showEndPicker.value = !showEndPicker.value;
    showStartPicker.value = false;
    showStatusDropdown.value = false;
    showLimitDropdown.value = false;

    if (endDate.value) {
        currentEndCal.value = makeLocalDate(endDate.value);
    } else if (startDate.value) {
        currentEndCal.value = makeLocalDate(startDate.value);
    }
};

const pilihStartDate = (date) => {
    if (!date) return;

    const selected = formatForStore(date);
    startDate.value = selected;

    if (endDate.value && makeLocalDate(endDate.value) < makeLocalDate(selected)) {
        endDate.value = selected;
        currentEndCal.value = new Date(date);
    }

    showStartPicker.value = false;
};

const pilihEndDate = (date) => {
    if (!date || isBeforeStartDate(date)) return;

    endDate.value = formatForStore(date);
    showEndPicker.value = false;
};

const isSameDate = (date, dateString) => {
    const target = makeLocalDate(dateString);

    if (!date || !target) return false;

    return date.getFullYear() === target.getFullYear()
        && date.getMonth() === target.getMonth()
        && date.getDate() === target.getDate();
};

const isToday = (date) => {
    if (!date) return false;

    const today = new Date();

    return date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate();
};

const isBeforeStartDate = (date) => {
    if (!date || !startDate.value) return false;

    return date < makeLocalDate(startDate.value);
};

const getStartDateClass = (date) => {
    if (!date) return 'opacity-0 cursor-default';

    if (isSameDate(date, startDate.value)) {
        return 'bg-blue-600 text-white shadow-md shadow-blue-500/30';
    }

    if (isToday(date)) {
        return 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 hover:bg-blue-100';
    }

    return 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer';
};

const getEndDateClass = (date) => {
    if (!date) return 'opacity-0 cursor-default';

    if (isBeforeStartDate(date)) {
        return 'text-slate-300 cursor-not-allowed bg-slate-50';
    }

    if (isSameDate(date, endDate.value)) {
        return 'bg-blue-600 text-white shadow-md shadow-blue-500/30';
    }

    if (isToday(date)) {
        return 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 hover:bg-blue-100';
    }

    return 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer';
};

const clearStartDate = () => {
    startDate.value = '';
    showStartPicker.value = false;
};

const clearEndDate = () => {
    endDate.value = '';
    showEndPicker.value = false;
};

const setStartToday = () => {
    pilihStartDate(new Date());
};

const setEndToday = () => {
    const today = new Date();

    if (!startDate.value || today >= makeLocalDate(startDate.value)) {
        pilihEndDate(today);
    }
};

const setToday = () => {
    const today = new Date();
    const todayString = formatForStore(today);

    startDate.value = todayString;
    endDate.value = todayString;
    currentPage.value = 1;
    showAlert('Menampilkan antrian hari ini', 'success');

    currentStartCal.value = new Date(today);
    currentEndCal.value = new Date(today);

    showStartPicker.value = false;
    showEndPicker.value = false;
};

const setThisWeek = () => {
    const today = new Date();

    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const sunday = endOfDay(endOfWeek(today, { weekStartsOn: 1 }));

    startDate.value = formatForStore(monday);
    endDate.value = formatForStore(sunday);
    currentPage.value = 1;
    showAlert('Menampilkan rentang minggu ini', 'success');

    currentStartCal.value = new Date(monday);
    currentEndCal.value = new Date(sunday);

    showStartPicker.value = false;
    showEndPicker.value = false;
};

const resetDateFilter = () => {
    startDate.value = '';
    endDate.value = '';
    currentStartCal.value = new Date();
    currentEndCal.value = new Date();
    showStartPicker.value = false;
    showEndPicker.value = false;
};

// Click Outside
const handleClickOutside = (event) => {
    if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) {
        showStatusDropdown.value = false;
    }

    if (startPickerRef.value && !startPickerRef.value.contains(event.target)) {
        showStartPicker.value = false;
    }

    if (endPickerRef.value && !endPickerRef.value.contains(event.target)) {
        showEndPicker.value = false;
    }

    if (limitDropdownRef.value && !limitDropdownRef.value.contains(event.target)) {
        showLimitDropdown.value = false;
    }
};

// Fetch
const fetchPeminjaman = async () => {
    isLoading.value = true;

    try {
        const response = await api.get('/admin/peminjaman/all?page=1&limit=1000');
        rawPeminjamanList.value = response.data.data || [];
    } catch (error) {
        showAlert('Gagal sinkronisasi data server', 'error');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchPeminjaman();
    window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
});

// Filter
const filteredData = computed(() => {
    let result = rawPeminjamanList.value;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();

        result = result.filter(item =>
            (item.nama_peminjam || '').toLowerCase().includes(query)
        );
    }

    if (filterStatus.value) {
        result = result.filter(item => item.status === filterStatus.value);
    }

    if (startDate.value && endDate.value) {
        try {
            const start = parseISO(startDate.value);
            const end = endOfDay(parseISO(endDate.value));

            result = result.filter(item => {
                if (!item.tanggal_pinjam) return false;

                return isWithinInterval(new Date(item.tanggal_pinjam), {
                    start,
                    end
                });
            });
        } catch (error) {
            console.error('Filter tanggal gagal:', error);
        }
    }

    return result;
});

// Pagination
const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value) || 1;
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;

    return filteredData.value.slice(startIndex, startIndex + itemsPerPage.value);
});

watch([searchQuery, filterStatus, startDate, endDate, itemsPerPage], () => {
    currentPage.value = 1;
});

// Utils
const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), 'dd MMM yyyy', { locale: id }) : '-';
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Menunggu':
            return 'bg-amber-50 text-amber-600 ring-amber-200';
        case 'Disetujui':
            return 'bg-blue-50 text-blue-600 ring-blue-200';
        case 'Dipinjam':
            return 'bg-indigo-50 text-indigo-600 ring-indigo-200';
        case 'Barang Rusak':
            return 'bg-orange-50 text-orange-600 ring-orange-200';
        case 'Selesai':
            return 'bg-emerald-50 text-emerald-600 ring-emerald-200';
        case 'Dibatalkan':
        case 'Ditolak':
            return 'bg-red-50 text-red-600 ring-red-200';
        default:
            return 'bg-slate-50 text-slate-500 ring-slate-200';
    }
};

const openProcessModal = (item) => {
    selectedData.value = item;
    isModalOpen.value = true;
};

// LOGIKA UPDATE STATUS (MENGGUNAKAN useConfirm)
const updateStatus = (newStatus) => {
    const currentStatus = selectedData.value?.status;
    const hasLaporanMasalah = selectedData.value?.laporan_masalah?.length > 0;

    let pesanKonfirmasi = `Ubah status menjadi "${newStatus}"?`;
    let btnText = 'Ya, Lanjutkan';
    let btnColor = 'blue';

    if (newStatus === 'Disetujui') {
        pesanKonfirmasi = 'Setujui permohonan ini? Nomor surat akan di-generate otomatis.';
        btnText = 'Ya, Setujui';
        btnColor = 'blue';
    } else if (newStatus === 'Dipinjam') {
        pesanKonfirmasi = 'Pastikan jaminan telah diterima. Ubah ke status Sedang Dipinjam?';
        btnText = 'Ya, Mulai Peminjaman';
        btnColor = 'blue';
    } else if (newStatus === 'Selesai') {
        if (currentStatus === 'Barang Rusak' || hasLaporanMasalah) {
            pesanKonfirmasi =
                'Transaksi ini memiliki laporan kendala/barang rusak. Pastikan pertanggungjawaban sudah dicatat atau diselesaikan secara manual oleh admin. Tetap selesaikan peminjaman ini?';
            btnText = 'Ya, Selesaikan';
            btnColor = 'emerald';
        } else {
            pesanKonfirmasi = 'Pastikan alat telah dikembalikan dengan lengkap. Selesaikan peminjaman ini?';
            btnText = 'Ya, Selesai';
            btnColor = 'emerald';
        }
    } else if (newStatus === 'Ditolak') {
        pesanKonfirmasi = 'Yakin ingin MENOLAK permohonan peminjaman ini?';
        btnText = 'Ya, Tolak';
        btnColor = 'red';
    }

    showConfirm(
        pesanKonfirmasi,
        async () => {
            if (processingStatus.value !== null) return;

            processingStatus.value = newStatus;

            try {
                await api.put(`/admin/peminjaman/${selectedData.value.id}/status`, {
                    status: newStatus,
                    force_selesai: newStatus === 'Selesai' && (currentStatus === 'Barang Rusak' || hasLaporanMasalah),
                });

                showAlert(`Status berhasil diubah menjadi ${newStatus}`, 'success');
                isModalOpen.value = false;
                await fetchPeminjaman();
            } catch (error) {
                showAlert(error.response?.data?.message || 'Gagal mengubah status', 'error');
            } finally {
                processingStatus.value = null;
            }
        },
        null,
        btnText,
        btnColor
    );
};

// Export Excel
const exportExcel = () => {
    if (filteredData.value.length === 0) {
        return showAlert('Data kosong', 'error');
    }

    const data = filteredData.value.map((item, index) => {
        const listBarang = item.detail_barang
            ?.map(d => `${d.barang?.nama_barang} (${d.jumlah_pinjam})`)
            .join(', ') || '-';

        return {
            No: index + 1,
            Antrian: item.antrian || item.id,
            'Nama Peminjam': item.nama_peminjam,
            Kategori: item.kategori_kebutuhan || '-',
            'Nomor Surat': item.nomor_surat || '-',
            'Barang Dipinjam': listBarang,
            'Mulai Pinjam': formatDate(item.tanggal_pinjam),
            'Tgl Kembali': formatDate(item.tanggal_kembali),
            Status: item.status
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, `Laporan_Peminjaman_${startDate.value || 'All'}.xlsx`);

    showAlert('Excel berhasil diunduh', 'success');
};

// Export PDF
const exportPDF = () => {
    if (filteredData.value.length === 0) {
        return showAlert('Data kosong', 'error');
    }

    const doc = new jsPDF('l', 'mm', 'a4');

    doc.text('LAPORAN PEMINJAMAN BARANG LAB PLP TIK PNJ', 14, 15);

    const subtitle = startDate.value && endDate.value
        ? `Periode: ${formatDate(startDate.value)} s.d. ${formatDate(endDate.value)}`
        : 'Periode: Semua Waktu';

    doc.setFontSize(10);
    doc.text(subtitle, 14, 22);

    const rows = filteredData.value.map((item, index) => {
        const listBarang = item.detail_barang
            ?.map(d => `${d.barang?.nama_barang} (${d.jumlah_pinjam})`)
            .join(',\n') || '-';

        return [
            index + 1,
            item.antrian || item.id,
            item.nama_peminjam,
            listBarang,
            formatDate(item.tanggal_pinjam),
            formatDate(item.tanggal_kembali),
            item.status
        ];
    });

    doc.autoTable({
        head: [['No', 'Antrian', 'Peminjam', 'Barang (Jml)', 'Tgl Pinjam', 'Tgl Kembali', 'Status']],
        body: rows,
        startY: 30,
        headStyles: {
            fillColor: [30, 64, 175]
        },
        styles: {
            cellPadding: 2,
            fontSize: 8,
            overflow: 'linebreak'
        },
        columnStyles: {
            3: {
                cellWidth: 50
            }
        }
    });

    doc.save(`Laporan_Lab_${format(new Date(), 'ddMMyy')}.pdf`);
    showAlert('PDF berhasil diunduh', 'success');
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.date-filter-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    background: #f8fafc;
    font-size: 0.875rem;
    font-weight: 800;
    color: #334155;
    outline: none;
    transition: all 0.2s ease;
    cursor: pointer;
}

.date-filter-button:hover {
    background: #ffffff;
    border-color: #bfdbfe;
}

.date-picker-panel {
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    width: min(18rem, calc(100vw - 2rem));
    border-radius: 0.875rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 1rem;
    z-index: 80;
    box-shadow: 0 20px 40px rgb(15 23 42 / 0.16);
}

.calendar-nav-button {
    padding: 0.35rem;
    border-radius: 0.5rem;
    color: #64748b;
    transition: all 0.2s ease;
}

.calendar-nav-button:hover {
    background: #f1f5f9;
    color: #2563eb;
}

.calendar-day {
    height: 2rem;
    width: 100%;
    border-radius: 0.55rem;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.calendar-action-button {
    padding: 0.5rem 0.75rem;
    border-radius: 0.55rem;
    font-size: 0.7rem;
    font-weight: 900;
    transition: all 0.2s ease;
}

.animate-fade-in {
    animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .date-picker-panel {
        left: 0 !important;
        right: auto !important;
        width: min(18rem, calc(100vw - 3rem));
    }
}
</style>