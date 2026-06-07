<template>
    <div class="p-4 md:p-8 relative h-full flex flex-col bg-slate-50 lg:overflow-y-auto custom-scrollbar">

        <!-- Header -->
        <div class="mb-6 md:mb-8 flex flex-col gap-4">
            <div>
                <span
                    class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 border border-blue-200">
                    Sistem Penunjang Keputusan (SPK)
                </span>
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Data Analitik Pengadaan Tahunan
                </h2>
                <p class="text-slate-500 mt-1 text-sm font-medium">Rekomendasi pengadaan alat laboratorium berbasis
                    Rule-Based Analytics</p>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative flex-1 md:w-40 md:flex-none" ref="dropdownRef">
                    <button type="button" @click="showYearDropdown = !showYearDropdown"
                        class="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 cursor-pointer hover:border-blue-400 transition-all shadow-sm">
                        <span>Tahun {{ selectedYear }}</span>
                        <ChevronDownIcon class="w-4 h-4 text-slate-500 transition-transform"
                            :class="showYearDropdown ? 'rotate-180' : ''" />
                    </button>

                    <transition name="fade">
                        <div v-if="showYearDropdown"
                            class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                            <button v-for="year in availableYears" :key="year" type="button" @click="pilihTahun(year)"
                                class="w-full px-4 py-2.5 text-sm text-left font-medium transition-colors" :class="selectedYear === year
                                    ? 'bg-blue-50 text-blue-700 font-black'
                                    : 'text-slate-700 hover:bg-slate-50'">
                                Tahun {{ year }}
                            </button>
                        </div>
                    </transition>
                </div>
                <button @click="exportReport"
                    class="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95 cursor-pointer shrink-0">
                    <DocumentArrowDownIcon class="w-5 h-5" />
                    <span class="hidden sm:inline">Cetak Laporan</span>
                </button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div
                class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 md:gap-4 hover:border-indigo-300 transition-colors">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <UsersIcon class="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Total
                        Peminjam</p>
                    <p v-if="isLoadingUser" class="text-lg md:text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-lg md:text-xl font-black text-slate-800">{{ totalUser }} <span
                            class="text-xs font-semibold text-slate-500">Akun</span></p>
                </div>
            </div>

            <div
                class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 md:gap-4 hover:border-blue-300 transition-colors">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ChartBarIcon class="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Total
                        Transaksi</p>
                    <p v-if="isLoading" class="text-lg md:text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-lg md:text-xl font-black text-slate-800">{{ totalPeminjamanTahunIni }} <span
                            class="text-xs font-semibold text-slate-500">Peminjaman</span></p>
                </div>
            </div>

            <div
                class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 md:gap-4 hover:border-emerald-300 transition-colors">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArchiveBoxArrowDownIcon class="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioritas
                        Pengadaan</p>
                    <p v-if="isLoading" class="text-lg md:text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-lg md:text-xl font-black text-slate-800">{{ prioritasTinggiCount }} <span
                            class="text-xs font-semibold text-slate-500">Jenis Alat</span></p>
                </div>
            </div>

            <div
                class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 md:gap-4 hover:border-red-300 transition-colors">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <WrenchScrewdriverIcon class="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Total
                        Kendala</p>
                    <p v-if="isLoading" class="text-lg md:text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-lg md:text-xl font-black text-slate-800">{{ totalMasalahTahunIni }} <span
                            class="text-xs font-semibold text-slate-500">Kasus</span></p>
                </div>
            </div>
        </div>

        <!-- Tren Peminjaman Bulanan -->
        <div class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-6 md:mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                    <h3 class="text-base md:text-lg font-black text-slate-800">
                        Tren Peminjaman per Bulan
                    </h3>
                    <p class="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                        Total transaksi peminjaman sepanjang tahun {{ selectedYear }}
                    </p>
                </div>

                <span
                    class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 w-fit">
                    Line Chart
                </span>
            </div>

            <div v-if="isLoading" class="h-56 md:h-72 flex flex-col items-center justify-center text-slate-400">
                <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                <p class="font-medium text-sm">Menyiapkan tren peminjaman...</p>
            </div>

            <div v-else-if="monthlyTrend.length === 0"
                class="h-56 md:h-72 flex items-center justify-center text-slate-400 font-medium text-sm">
                Tidak ada data tren peminjaman pada tahun {{ selectedYear }}
            </div>

            <div v-else class="h-56 md:h-72 relative w-full">
                <Line :data="monthlyTrendChartData" :options="monthlyTrendChartOptions" />
            </div>
        </div>

        <!-- Chart + Rule Matrix -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div class="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                        <h3 class="text-base md:text-lg font-black text-slate-800">
                            Top 5 Prioritas Pengadaan
                        </h3>
                        <p class="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                            Berdasarkan skor SPK 0,00 - 1,00 tahun {{ selectedYear }}
                        </p>
                    </div>

                    <span
                        class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 w-fit">
                        Rule-Based Score 0,00 - 1,00
                    </span>
                </div>
                <div v-if="isLoading" class="h-52 md:h-64 flex flex-col items-center justify-center text-slate-400">
                    <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3">
                    </div>
                    <p class="font-medium text-sm">Menyiapkan grafik analitik...</p>
                </div>
                <div v-else-if="top5Data.length === 0"
                    class="h-52 md:h-64 flex items-center justify-center text-slate-400 font-medium text-sm">
                    Tidak ada data peminjaman di tahun ini.
                </div>
                <div v-else class="h-52 md:h-64 relative w-full">
                    <Bar :data="chartData" :options="chartOptions" />
                </div>
                <div v-if="!isLoading && top5Data.length > 0" class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            Bobot Peminjaman
                        </p>
                        <p class="text-xs text-blue-700 font-bold mt-1">
                            Dinormalisasi 0,00 - 1,00 dari data tahun terpilih.
                        </p>
                    </div>

                    <div class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            Bobot Stok
                        </p>
                        <p class="text-xs text-amber-700 font-bold mt-1">
                            Stok ≤ 5 mendapat tambahan prioritas.
                        </p>
                    </div>

                    <div class="bg-red-50 border border-red-100 rounded-xl p-3">
                        <p class="text-[10px] font-black text-red-500 uppercase tracking-widest">
                            Bobot Kendala
                        </p>
                        <p class="text-xs text-red-700 font-bold mt-1">
                            Rusak, hilang, dan rusak total menaikkan skor.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Rule Matrix — collapsible di mobile -->
            <div class="bg-slate-800 rounded-2xl p-5 md:p-6 text-white shadow-lg">
                <button @click="showMatrix = !showMatrix"
                    class="flex items-center justify-between w-full lg:cursor-default"
                    :class="{ 'mb-4 border-b border-slate-600 pb-4': showMatrix || isDesktop }">
                    <div class="flex items-center gap-3">
                        <div class="p-2 md:p-3 bg-white/10 rounded-xl">
                            <BeakerIcon class="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
                        </div>
                        <h3 class="text-base md:text-lg font-bold text-white">Rule-Based Matrix</h3>
                    </div>
                    <ChevronDownIcon class="w-5 h-5 text-slate-400 lg:hidden transition-transform"
                        :class="showMatrix ? 'rotate-180' : ''" />
                </button>

                <ul v-if="showMatrix || isDesktop" class="space-y-3 text-sm font-medium text-slate-300 mt-4 lg:mt-0">
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Kritis:</strong> Dipinjam ≥ 50x & Kendala ≥ 2x. (Ganti & Tambah
                            Stok)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Prioritas Tinggi:</strong> Dipinjam ≥ 50x & Stok ≤ 5. (Wajib Tambah
                                Stok)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Perlu Penggantian:</strong> Ada barang rusak/hilang. (Wajib Restock)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Prioritas Menengah:</strong> Dipinjam ≥ 50x (Stok Aman), ATAU Stok Tipis.
                        </p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Aman:</strong> Kondisi 100% normal.</p>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Tabel Rekomendasi -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div
                class="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/50">
                <h2 class="text-base md:text-lg font-black text-slate-800">Tabel Rekomendasi Pengadaan {{ selectedYear +
                    1 }}</h2>
                <div class="relative w-full md:w-72">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama alat..."
                        class="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium" />
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden divide-y divide-slate-100">
                <div v-if="isLoading" class="py-12 text-center">
                    <div class="animate-pulse flex flex-col items-center">
                        <div class="h-6 w-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-3">
                        </div>
                        <p class="text-slate-500 font-medium text-sm">Sinkronisasi data analitik...</p>
                    </div>
                </div>
                <div v-else-if="filteredAnalitik.length === 0"
                    class="py-12 text-center text-slate-500 font-medium text-sm px-4">
                    Data alat tidak ditemukan atau belum ada aktivitas pada tahun {{ selectedYear }}.
                </div>
                <div v-else v-for="item in filteredAnalitik" :key="item.kode" class="p-4 space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <p class="font-bold text-slate-900 text-sm">{{ item.nama }}</p>
                            <p class="text-xs font-mono text-slate-400 mt-0.5">{{ item.kode }}</p>
                        </div>
                        <span
                            class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 shrink-0"
                            :class="getBadgeClass(item.rekomendasi.type)">
                            {{ item.rekomendasi.label }}
                        </span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div class="bg-blue-50/50 rounded-xl p-2">
                            <p class="text-[9px] font-black text-blue-400 uppercase mb-1">Dipinjam</p>
                            <p class="font-black text-slate-700 text-sm">{{ item.total_dipinjam }}x</p>
                        </div>
                        <div class="bg-red-50/50 rounded-xl p-2">
                            <p class="text-[9px] font-black text-red-400 uppercase mb-1">Rusak</p>
                            <p class="font-black text-sm" :class="item.rusak > 0 ? 'text-red-600' : 'text-slate-400'">{{
                                item.rusak }}x</p>
                        </div>
                        <div class="bg-orange-50/50 rounded-xl p-2">
                            <p class="text-[9px] font-black text-orange-400 uppercase mb-1">Hilang</p>
                            <p class="font-black text-sm"
                                :class="item.hilang > 0 ? 'text-orange-600' : 'text-slate-400'">{{ item.hilang }}x</p>
                        </div>
                        <div class="bg-emerald-50/50 rounded-xl p-2">
                            <p class="text-[9px] font-black text-emerald-400 uppercase mb-1">Stok</p>
                            <p class="font-black text-sm"
                                :class="item.stok_saat_ini < 5 ? 'text-amber-600' : 'text-slate-700'">{{
                                    item.stok_saat_ini }}</p>
                        </div>
                    </div>
                    <p
                        class="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        {{ item.rekomendasi.action }}
                    </p>
                </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden md:block overflow-x-auto flex-1">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <th class="py-4 px-6 min-w-50">Nama Alat / Barang</th>
                            <th class="py-4 px-6 text-center bg-blue-50/30">Total Dipinjam</th>
                            <th class="py-4 px-6 text-center bg-red-50/30">Kerusakan</th>
                            <th class="py-4 px-6 text-center bg-orange-50/30">Kehilangan</th>
                            <th class="py-4 px-6 text-center bg-slate-100/50">Rusak Total</th>
                            <th class="py-4 px-6 text-center bg-emerald-50/30">Sisa Stok</th>
                            <th class="py-4 px-6 min-w-62.5 border-l border-slate-100">Rekomendasi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100">
                        <tr v-if="isLoading">
                            <td colspan="7" class="py-12 text-center">
                                <div class="animate-pulse flex flex-col items-center">
                                    <div
                                        class="h-6 w-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-3">
                                    </div>
                                    <p class="text-slate-500 font-medium">Sinkronisasi data analitik...</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="filteredAnalitik.length === 0">
                            <td colspan="7" class="py-12 text-center text-slate-500 font-medium">
                                Data tidak ditemukan atau belum ada aktivitas pada tahun {{ selectedYear }}.
                            </td>
                        </tr>
                        <tr v-else v-for="item in filteredAnalitik" :key="item.kode"
                            class="hover:bg-slate-50 transition-colors">
                            <td class="py-4 px-6">
                                <p class="font-bold text-slate-900">{{ item.nama }}</p>
                                <p class="text-xs font-mono text-slate-400 mt-0.5">{{ item.kode }}</p>
                            </td>
                            <td class="py-4 px-6 text-center font-black text-slate-700 bg-blue-50/10">{{
                                item.total_dipinjam }}x</td>
                            <td class="py-4 px-6 text-center font-black bg-red-50/10"
                                :class="item.rusak > 0 ? 'text-red-600' : 'text-slate-400'">{{ item.rusak }}x</td>
                            <td class="py-4 px-6 text-center font-black bg-orange-50/10"
                                :class="item.hilang > 0 ? 'text-orange-600' : 'text-slate-400'">{{ item.hilang }}x</td>
                            <td class="py-4 px-6 text-center font-black bg-slate-50"
                                :class="item.rusak_total > 0 ? 'text-slate-800' : 'text-slate-400'">{{ item.rusak_total
                                }}x</td>
                            <td class="py-4 px-6 text-center font-black bg-emerald-50/10"
                                :class="item.stok_saat_ini < 5 ? 'text-amber-600' : 'text-slate-700'">{{
                                    item.stok_saat_ini }} Unit</td>
                            <td class="py-4 px-6 border-l border-slate-100">
                                <div class="flex flex-col items-start gap-1">
                                    <span
                                        class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1"
                                        :class="getBadgeClass(item.rekomendasi.type)">
                                        {{ item.rekomendasi.label }}
                                    </span>
                                    <p class="text-xs font-bold text-slate-600 mt-1">{{ item.rekomendasi.action }}</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-slate-50 px-4 md:px-6 py-4 border-t border-slate-200">
                <p class="text-xs font-medium text-slate-500 text-center">
                    Data difilter berdasarkan aktivitas laboratorium pada tahun {{ selectedYear }}.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
    MagnifyingGlassIcon, ChartBarIcon, ArchiveBoxArrowDownIcon,
    WrenchScrewdriverIcon, DocumentArrowDownIcon, BeakerIcon, ChevronDownIcon, UsersIcon
} from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import api from '../plugins/axios';

import { Bar, Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler
);

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const searchQuery = ref('');
const isLoading = ref(true);
const isLoadingUser = ref(true);

const currentYear = new Date().getFullYear();
const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
const selectedYear = ref(currentYear);

const rawDataAnalitik = ref([]);
const totalUser = ref(0);
const monthlyTrend = ref([]);

const showMatrix = ref(false);
const isDesktop = ref(window.innerWidth >= 1024);

const showYearDropdown = ref(false);
const dropdownRef = ref(null);

const pilihTahun = (year) => {
    selectedYear.value = year;
    showYearDropdown.value = false;
};

const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        showYearDropdown.value = false;
    }
};

const handleResize = () => {
    isDesktop.value = window.innerWidth >= 1024;
};

const fetchAnalitikData = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/dataanalitik/pengadaan', {
            params: { tahun: selectedYear.value }
        });

        if (response.data.status === 'success') {
            rawDataAnalitik.value = response.data.data.map(item => ({
                kode: item.kode || '-',
                nama: item.nama || 'Tanpa Nama',
                stok_saat_ini: Number(item.stok_saat_ini || 0),
                total_dipinjam: Number(item.total_dipinjam || 0),
                rusak: Number(item.rusak || 0),
                hilang: Number(item.hilang || 0),
                rusak_total: Number(item.rusak_total || 0)
            }));
        }
    } catch (error) {
        console.error("Gagal memuat data analitik:", error);
        showAlert("Gagal menarik data dari server.", "error");
        rawDataAnalitik.value = [];
    } finally {
        isLoading.value = false;
    }
};

const fetchMonthlyTrendData = async () => {
    try {
        const response = await api.get('/dataanalitik/peminjaman-bulanan', {
            params: {
                tahun: selectedYear.value
            }
        });

        if (response.data.status === 'success') {
            monthlyTrend.value = response.data.data || [];
        }
    } catch (error) {
        console.error("Gagal memuat tren peminjaman bulanan:", error);
        monthlyTrend.value = [];
    }
};

const fetchTotalUser = async () => {
    isLoadingUser.value = true;
    try {
        const res = await api.get('/users/peminjam?page=1&limit=1');
        totalUser.value = res.data.pagination.totalItems;
    } catch (err) {
        console.error("Gagal memuat total user:", err);
        totalUser.value = 0;
    } finally {
        isLoadingUser.value = false;
    }
};

onMounted(() => {
    fetchAnalitikData();
    fetchMonthlyTrendData();
    fetchTotalUser();

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResize);
});

watch(selectedYear, () => {
    fetchAnalitikData();
    fetchMonthlyTrendData();
});

// --- Logika Rule Base Data Analitik ---
const generateRecommendation = (item) => {
    const isHighDemand = item.total_dipinjam >= 50;
    const isLowStock = item.stok_saat_ini <= 5;

    // Total kendala (unit yang secara fisik rusak/hilang sehingga stok efektif berkurang)
    const totalKendala = item.rusak + item.hilang + item.rusak_total;
    const hasProblem = totalKendala > 0;

    // 1. Kondisi Sangat Kritis: Permintaan tinggi & barang banyak yang rusak
    if (isHighDemand && totalKendala >= 2) {
        return {
            type: 'kritis',
            label: 'Status Kritis',
            action: `Ganti ${totalKendala} unit rusak/hilang & tambah stok baru.`
        };
    }

    // 2. Prioritas Tinggi: Permintaan tinggi & stok menipis
    if (isHighDemand && isLowStock) {
        let act = 'Wajib tambah pengadaan stok.';
        // Jika ada masalah juga, kita sebutkan
        if (hasProblem) act += ` (Sekaligus ganti ${totalKendala} unit rusak/hilang).`;
        return { type: 'prioritas_tinggi', label: 'Prioritas Tinggi', action: act };
    }

    // 3. PENGGANTIAN WAJIB: Meskipun jarang dipinjam, kalau ada barang rusak/hilang, wajib diganti
    if (hasProblem) {
        return {
            type: 'ganti_unit',
            label: 'Perlu Penggantian',
            action: `Restock wajib untuk mengganti ${totalKendala} unit yang rusak/hilang.`
        };
    }

    // 4. Prioritas Menengah: Permintaan tinggi tapi stok masih aman
    if (isHighDemand && !isLowStock) {
        return { type: 'prioritas_menengah', label: 'Prioritas Menengah', action: 'Stok aman, tambah cadangan jika ada dana.' };
    }

    // 5. Tinjau Ulang: Stok menipis tapi alatnya jarang dipakai
    if (!isHighDemand && isLowStock) {
        return { type: 'prioritas_menengah', label: 'Tinjau Ulang', action: 'Stok menipis tapi jarang dipakai. Tinjau urgensi.' };
    }

    // 6. Aman
    return { type: 'aman', label: 'Status Aman', action: 'Kondisi 100% normal. Tidak perlu pengadaan.' };
};

const analitikWithRekomendasi = computed(() => {
    return rawDataAnalitik.value
        .filter(item => item.total_dipinjam > 0 || item.rusak > 0 || item.hilang > 0 || item.rusak_total > 0)
        .map(item => ({
            ...item,
            rekomendasi: generateRecommendation(item)
        })).sort((a, b) => b.total_dipinjam - a.total_dipinjam);
});

const filteredAnalitik = computed(() => {
    if (!searchQuery.value) return analitikWithRekomendasi.value;
    const query = searchQuery.value.toLowerCase();
    return analitikWithRekomendasi.value.filter(a => a.nama.toLowerCase().includes(query));
});

const totalPeminjamanTahunIni = computed(() => rawDataAnalitik.value.reduce((sum, item) => sum + item.total_dipinjam, 0));

const totalMasalahTahunIni = computed(() => {
    return rawDataAnalitik.value.reduce((sum, item) => sum + item.rusak + item.hilang + item.rusak_total, 0);
});

// Hitung juga yang perlu penggantian ke dalam prioritas tinggi
const prioritasTinggiCount = computed(() => analitikWithRekomendasi.value.filter(a =>
    a.rekomendasi.type === 'prioritas_tinggi' ||
    a.rekomendasi.type === 'kritis' ||
    a.rekomendasi.type === 'ganti_unit'
).length);

const normalizeScore = (value, maxValue) => {
    if (!maxValue || maxValue <= 0) return 0;
    return Math.min(Number(value || 0) / maxValue, 1);
};

const getStockScore = (stok) => {
    const currentStock = Number(stok || 0);

    if (currentStock <= 0) return 1;
    if (currentStock <= 5) return (6 - currentStock) / 5;

    return 0;
};

const getRuleScore = (type) => {
    const ruleScoreMap = {
        kritis: 1,
        prioritas_tinggi: 0.85,
        ganti_unit: 0.7,
        prioritas_menengah: 0.5,
        aman: 0
    };

    return ruleScoreMap[type] || 0;
};

const calculatePriorityScore = (item, maxValues) => {
    const totalKendala = item.rusak + item.hilang + item.rusak_total;

    const demandScore = normalizeScore(item.total_dipinjam, maxValues.maxDipinjam);
    const problemScore = normalizeScore(totalKendala, maxValues.maxKendala);
    const stockScore = getStockScore(item.stok_saat_ini);
    const ruleScore = getRuleScore(item.rekomendasi.type);

    const finalScore =
        (demandScore * 0.40) +
        (problemScore * 0.25) +
        (stockScore * 0.20) +
        (ruleScore * 0.15);

    return Number(Math.min(finalScore, 1).toFixed(2));
};

const top5Data = computed(() => {
    const data = [...analitikWithRekomendasi.value];

    const maxValues = {
        maxDipinjam: Math.max(...data.map(item => item.total_dipinjam), 0),
        maxKendala: Math.max(...data.map(item => item.rusak + item.hilang + item.rusak_total), 0)
    };

    return data
        .map(item => ({
            ...item,
            priority_score: calculatePriorityScore(item, maxValues)
        }))
        .filter(item => item.priority_score > 0)
        .sort((a, b) => b.priority_score - a.priority_score)
        .slice(0, 5);
});

const chartData = computed(() => ({
    labels: top5Data.value.map(item =>
        item.nama.length > 22 ? item.nama.substring(0, 22) + '...' : item.nama
    ),
    datasets: [
        {
            label: 'Skor Prioritas',
            data: top5Data.value.map(item => item.priority_score),
            backgroundColor: '#2563eb',
            borderColor: '#1d4ed8',
            borderWidth: 1,
            borderRadius: 10,
            barThickness: 22,
            maxBarThickness: 30
        }
    ]
}));

const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
                label: (context) => {
                    const item = top5Data.value[context.dataIndex];

                    return [
                        `Skor Prioritas: ${item.priority_score.toFixed(2)}`,
                        `Dipinjam: ${item.total_dipinjam}x`,
                        `Stok: ${item.stok_saat_ini} unit`,
                        `Kendala: ${item.rusak + item.hilang + item.rusak_total} kasus`
                    ];
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            suggestedMax: 1,
            grid: {
                color: '#f1f5f9'
            },
            ticks: {
                color: '#64748b',
                callback: (value) => Number(value).toFixed(2),
                font: {
                    size: 11,
                    weight: 'bold'
                }
            }
        },
        y: {
            grid: {
                display: false
            },
            ticks: {
                color: '#475569',
                font: {
                    size: 11,
                    weight: 'bold'
                }
            }
        }
    }
};

const getBadgeClass = (type) => {
    switch (type) {
        case 'kritis': return 'bg-red-100 text-red-700 ring-red-300';
        case 'prioritas_tinggi': return 'bg-blue-100 text-blue-700 ring-blue-300';
        case 'ganti_unit': return 'bg-orange-100 text-orange-700 ring-orange-300'; // Styling baru untuk penggantian
        case 'prioritas_menengah': return 'bg-amber-100 text-amber-700 ring-amber-300';
        case 'aman': return 'bg-emerald-100 text-emerald-700 ring-emerald-300';
        default: return 'bg-slate-100 text-slate-700 ring-slate-300';
    }
};

const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const monthlyTrendChartData = computed(() => {
    const monthlyTotals = Array(12).fill(0);

    monthlyTrend.value.forEach(item => {
        const monthIndex = Number(item.bulan) - 1;

        if (monthIndex >= 0 && monthIndex <= 11) {
            monthlyTotals[monthIndex] = Number(item.total || 0);
        }
    });

    return {
        labels: monthLabels,
        datasets: [
            {
                label: 'Total Peminjaman',
                data: monthlyTotals,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }
        ]
    };
});

const monthlyTrendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
                label: (context) => {
                    return `Total Peminjaman: ${context.raw} transaksi`;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#f1f5f9'
            },
            ticks: {
                precision: 0,
                color: '#64748b',
                font: {
                    size: 11,
                    weight: 'bold'
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#64748b',
                font: {
                    size: 11,
                    weight: 'bold'
                }
            }
        }
    }
};

const exportReport = () => {
    showConfirm(
        `Cetak laporan rekomendasi pengadaan untuk tahun ${selectedYear.value}?`,
        async () => {
            try {
                if (filteredAnalitik.value.length === 0) {
                    showAlert("Tidak ada data untuk dicetak.", "error");
                    return;
                }

                printReportToPdf();
            } catch (error) {
                console.error("Gagal mencetak laporan:", error);
                showAlert("Gagal mencetak laporan pengadaan.", "error");
            }
        },
        null,
        "Ya, Cetak",
        "blue",
        "Konfirmasi Cetak Laporan"
    );
};

const getPriorityLabel = (type) => {
    const map = {
        kritis: "Status Kritis",
        prioritas_tinggi: "Prioritas Tinggi",
        ganti_unit: "Perlu Penggantian",
        prioritas_menengah: "Prioritas Menengah",
        aman: "Status Aman"
    };

    return map[type] || "Tidak Diketahui";
};

const escapeHtml = (value) => {
    if (value === null || value === undefined) return "-";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
};

const printReportToPdf = () => {
    const reportWindow = window.open("", "_blank", "width=1200,height=900");

    if (!reportWindow) {
        showAlert("Pop-up diblokir browser. Izinkan pop-up untuk mencetak laporan.", "error");
        return;
    }

    const tanggalCetak = new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const rows = filteredAnalitik.value
        .map((item, index) => {
            return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>
                        <strong>${escapeHtml(item.nama)}</strong><br>
                        <span class="kode">${escapeHtml(item.kode)}</span>
                    </td>
                    <td class="text-center">${item.total_dipinjam}x</td>
                    <td class="text-center">${item.rusak}x</td>
                    <td class="text-center">${item.hilang}x</td>
                    <td class="text-center">${item.rusak_total}x</td>
                    <td class="text-center">${item.stok_saat_ini} Unit</td>
                    <td>
                        <strong>${escapeHtml(getPriorityLabel(item.rekomendasi.type))}</strong><br>
                        <span>${escapeHtml(item.rekomendasi.action)}</span>
                    </td>
                </tr>
            `;
        })
        .join("");

    const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Laporan Pengadaan ${selectedYear.value}</title>

            <style>
                @page {
                    size: A4 landscape;
                    margin: 12mm;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;
                    background: #e5e7eb;
                    color: #0f172a;
                    font-family: Arial, sans-serif;
                }

                .toolbar {
                    position: sticky;
                    top: 0;
                    z-index: 999;
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 12px 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08);
                }

                .toolbar-title {
                    font-weight: 800;
                    color: #0f172a;
                    font-size: 14px;
                }

                .toolbar-subtitle {
                    display: block;
                    margin-top: 2px;
                    font-weight: 500;
                    color: #64748b;
                    font-size: 12px;
                }

                .toolbar-actions {
                    display: flex;
                    gap: 8px;
                }

                .toolbar button {
                    border: none;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .btn-print {
                    background: #2563eb;
                    color: white;
                }

                .btn-close {
                    background: #f1f5f9;
                    color: #475569;
                }

                .page-wrapper {
                    padding: 24px;
                }

                .page {
                    width: 297mm;
                    min-height: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 14mm;
                    box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 24px;
                    border-bottom: 3px solid #0f172a;
                    padding-bottom: 14px;
                    margin-bottom: 18px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 22px;
                    color: #0f172a;
                    line-height: 1.2;
                }

                .header p {
                    margin: 6px 0 0;
                    font-size: 12px;
                    color: #475569;
                    line-height: 1.5;
                }

                .badge {
                    display: inline-block;
                    background: #eff6ff;
                    color: #1d4ed8;
                    border: 1px solid #bfdbfe;
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 18px;
                }

                .summary-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 12px;
                    background: #f8fafc;
                }

                .summary-card span {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                .summary-card strong {
                    display: block;
                    margin-top: 4px;
                    font-size: 20px;
                    color: #0f172a;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }

                th {
                    background: #0f172a;
                    color: white;
                    padding: 9px;
                    border: 1px solid #0f172a;
                    text-transform: uppercase;
                    font-size: 9px;
                    letter-spacing: 0.04em;
                }

                td {
                    padding: 8px;
                    border: 1px solid #cbd5e1;
                    vertical-align: top;
                    line-height: 1.4;
                }

                tr:nth-child(even) td {
                    background: #f8fafc;
                }

                .text-center {
                    text-align: center;
                }

                .kode {
                    color: #64748b;
                    font-size: 10px;
                    font-family: monospace;
                }

                .footer {
                    margin-top: 16px;
                    font-size: 10px;
                    color: #64748b;
                    text-align: center;
                }

                @media print {
                    body {
                        background: white;
                    }

                    .toolbar {
                        display: none;
                    }

                    .page-wrapper {
                        padding: 0;
                    }

                    .page {
                        width: auto;
                        min-height: auto;
                        padding: 0;
                        box-shadow: none;
                    }

                    .summary-card {
                        background: #f8fafc !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    th {
                        background: #0f172a !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    tr:nth-child(even) td {
                        background: #f8fafc !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>

        <body>
            <div class="toolbar">
                <div>
                    <span class="toolbar-title">Preview Laporan Pengadaan</span>
                    <span class="toolbar-subtitle">Klik Cetak / Simpan PDF untuk membuka Chrome Print Preview.</span>
                </div>

                <div class="toolbar-actions">
                    <button class="btn-close" onclick="window.close()">Tutup</button>
                    <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
                </div>
            </div>

            <div class="page-wrapper">
                <div class="page">
                    <div class="header">
                        <div>
                            <h1>Laporan Rekomendasi Pengadaan Alat Laboratorium</h1>
                            <p>
                                Sistem Penunjang Keputusan Pengadaan Tahunan<br>
                                Laboratorium PLP TIK Politeknik Negeri Jakarta
                            </p>
                        </div>

                        <div class="badge">
                            Data Analitik ${selectedYear.value}
                        </div>
                    </div>

                    <div class="summary">
                        <div class="summary-card">
                            <span>Total Peminjam</span>
                            <strong>${totalUser.value}</strong>
                        </div>
                        <div class="summary-card">
                            <span>Total Transaksi</span>
                            <strong>${totalPeminjamanTahunIni.value}</strong>
                        </div>
                        <div class="summary-card">
                            <span>Prioritas Pengadaan</span>
                            <strong>${prioritasTinggiCount.value}</strong>
                        </div>
                        <div class="summary-card">
                            <span>Total Kendala</span>
                            <strong>${totalMasalahTahunIni.value}</strong>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 4%;">No</th>
                                <th style="width: 22%;">Nama Alat</th>
                                <th style="width: 10%;">Dipinjam</th>
                                <th style="width: 9%;">Rusak</th>
                                <th style="width: 9%;">Hilang</th>
                                <th style="width: 10%;">Rusak Total</th>
                                <th style="width: 10%;">Stok</th>
                                <th>Rekomendasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>

                    <div class="footer">
                        Dicetak pada ${tanggalCetak}. Data berdasarkan aktivitas laboratorium tahun ${selectedYear.value}.
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();

    reportWindow.onload = () => {
        reportWindow.focus();
    };
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>