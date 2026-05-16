<template>
    <div class="p-8 relative h-full flex flex-col bg-slate-50 lg:overflow-y-auto custom-scrollbar">
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span
                    class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 border border-blue-200">
                    Sistem Penunjang Keputusan (SPK)
                </span>
                <h2 class="text-2xl font-black text-slate-900 tracking-tight">Data Analitik Pengadaan Tahunan</h2>
                <p class="text-slate-500 mt-1 text-sm font-medium">Rekomendasi pengadaan alat laboratorium berbasis
                    Rule-Based Analytics.</p>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative w-40">
                    <select v-model="selectedYear"
                        class="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none shadow-sm">
                        <option v-for="year in availableYears" :key="year" :value="year">Tahun {{ year }}</option>
                    </select>
                    <ChevronDownIcon
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                <button @click="exportReport"
                    class="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95 cursor-pointer">
                    <DocumentArrowDownIcon class="w-5 h-5" />
                    Cetak Laporan
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <div
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-indigo-300 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <UsersIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Peminjam</p>
                    <p v-if="isLoadingUser" class="text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-xl font-black text-slate-800">{{ totalUser }} <span
                            class="text-xs font-semibold text-slate-500">Akun</span></p>
                </div>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-blue-300 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ChartBarIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaksi</p>
                    <p v-if="isLoading" class="text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-xl font-black text-slate-800">{{ totalPeminjamanTahunIni }} <span
                            class="text-xs font-semibold text-slate-500">Peminjaman</span></p>
                </div>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-emerald-300 transition-colors">
                <div
                    class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArchiveBoxArrowDownIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioritas Pengadaan</p>
                    <p v-if="isLoading" class="text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-xl font-black text-slate-800">{{ prioritasTinggiCount }} <span
                            class="text-xs font-semibold text-slate-500">Jenis Alat</span></p>
                </div>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-red-300 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <WrenchScrewdriverIcon class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Kendala & Rusak Total</p>
                    <p v-if="isLoading" class="text-xl font-black text-slate-300 animate-pulse">...</p>
                    <p v-else class="text-xl font-black text-slate-800">{{ totalMasalahTahunIni }} <span
                            class="text-xs font-semibold text-slate-500">Kasus</span></p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 class="text-lg font-bold text-slate-800 mb-4">Top 5 Alat Sering Dipinjam & Bermasalah ({{
                    selectedYear }})</h3>

                <div v-if="isLoading" class="h-64 flex flex-col items-center justify-center text-slate-400">
                    <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3">
                    </div>
                    <p class="font-medium text-sm">Menyiapkan grafik analitik...</p>
                </div>
                <div v-else-if="top5Data.length === 0"
                    class="h-64 flex items-center justify-center text-slate-400 font-medium">
                    Tidak ada data peminjaman di tahun ini.
                </div>
                <div v-else class="h-64 relative w-full">
                    <Bar :data="chartData" :options="chartOptions" />
                </div>
            </div>

            <div class="bg-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-4 border-b border-slate-600 pb-4">
                    <div class="p-3 bg-white/10 rounded-xl">
                        <BeakerIcon class="w-6 h-6 text-blue-300" />
                    </div>
                    <h3 class="text-lg font-bold text-white">Rule-Based Matrix</h3>
                </div>
                <ul class="space-y-3 text-sm font-medium text-slate-300">
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Kritis:</strong> Dipinjam > 50x DAN Kendala (Rusak/Hilang/Rusak Total) > 2x. (Ganti & Tambah)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Prioritas:</strong> Dipinjam > 50x DAN Sisa Stok < 5. (Tambah Stok)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Menengah:</strong> Dipinjam > 50x TAPI Sisa Stok Aman. (Tambah Cadangan)</p>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <p><strong class="text-white">Aman:</strong> Permintaan rendah, stok dan kondisi terkendali. (Tidak Perlu Pengadaan)</p>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden min-h-125">
            <div
                class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div>
                    <h2 class="text-lg font-black text-slate-800">Tabel Rekomendasi Pengadaan {{ selectedYear + 1 }}
                    </h2>
                </div>
                <div class="relative w-full md:w-72">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama alat..."
                        class="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium" />
                </div>
            </div>

            <div class="overflow-x-auto flex-1">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <th class="py-4 px-6 min-w-50">Nama Alat / Barang</th>
                            <th class="py-4 px-6 text-center bg-blue-50/30">Total Dipinjam</th>
                            <th class="py-4 px-6 text-center bg-red-50/30">Kerusakan</th>
                            <th class="py-4 px-6 text-center bg-orange-50/30">Kehilangan</th>
                            <th class="py-4 px-6 text-center bg-slate-100/50">Rusak Total</th>
                            <th class="py-4 px-6 text-center bg-emerald-50/30">Sisa Stok</th>
                            <th class="py-4 px-6 min-w-62.5 border-l border-slate-100">Rekomendasi (Rule-Based)</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100">

                        <tr v-if="isLoading">
                            <td colspan="7" class="py-12 text-center">
                                <div class="animate-pulse flex flex-col items-center">
                                    <div class="h-6 w-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                                    <p class="text-slate-500 font-medium">Sinkronisasi data analitik...</p>
                                </div>
                            </td>
                        </tr>

                        <tr v-else-if="filteredAnalitik.length === 0">
                            <td colspan="7" class="py-12 text-center text-slate-500 font-medium">
                                Data alat tidak ditemukan atau belum ada aktivitas pada tahun {{ selectedYear }}.
                            </td>
                        </tr>

                        <tr v-else v-for="item in filteredAnalitik" :key="item.kode"
                            class="hover:bg-slate-50 transition-colors">
                            <td class="py-4 px-6">
                                <p class="font-bold text-slate-900">{{ item.nama }}</p>
                                <p class="text-xs font-mono text-slate-400 mt-0.5">{{ item.kode }}</p>
                            </td>
                            <td class="py-4 px-6 text-center font-black text-slate-700 bg-blue-50/10">{{ item.total_dipinjam }}x</td>

                            <td class="py-4 px-6 text-center font-black bg-red-50/10"
                                :class="item.rusak > 0 ? 'text-red-600' : 'text-slate-400'">{{ item.rusak }}x</td>

                            <td class="py-4 px-6 text-center font-black bg-orange-50/10"
                                :class="item.hilang > 0 ? 'text-orange-600' : 'text-slate-400'">{{ item.hilang }}x</td>

                            <td class="py-4 px-6 text-center font-black bg-slate-50"
                                :class="item.rusak_total > 0 ? 'text-slate-800' : 'text-slate-400'">{{ item.rusak_total }}x</td>

                            <td class="py-4 px-6 text-center font-black bg-emerald-50/10"
                                :class="item.stok_saat_ini < 5 ? 'text-amber-600' : 'text-slate-700'">{{ item.stok_saat_ini }} Unit</td>

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

            <div class="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <p class="text-xs font-medium text-slate-500 text-center">Data descriptive di atas difilter berdasarkan
                    aktivitas laboratorium pada tahun {{ selectedYear }}.</p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {
    MagnifyingGlassIcon, ChartBarIcon, ArchiveBoxArrowDownIcon,
    WrenchScrewdriverIcon, DocumentArrowDownIcon, BeakerIcon, ChevronDownIcon, UsersIcon
} from '@heroicons/vue/24/outline';
import { useAlert } from '../composables/useAlert';
import api from '../plugins/axios';

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { showAlert } = useAlert();
const searchQuery = ref('');
const isLoading = ref(true);
const isLoadingUser = ref(true);

const currentYear = new Date().getFullYear();
const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
const selectedYear = ref(currentYear);

const rawDataAnalitik = ref([]);
const totalUser = ref(0);

// --- FETCH 1: Analitik Pengadaan ---
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

// --- FETCH 2: Total User Peminjam ---
const fetchTotalUser = async () => {
    isLoadingUser.value = true;
    try {
        // Cukup tarik limit=1 agar backend merespon sangat cepat, kita hanya butuh properti "totalItems"
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
    fetchTotalUser();
});

watch(selectedYear, () => fetchAnalitikData());

const generateRecommendation = (item) => {
    const thresholdDemandTinggi = 50;
    const thresholdStokRendah = 5;
    const thresholdMasalahTinggi = 2;

    const isHighDemand = item.total_dipinjam >= thresholdDemandTinggi;
    const isLowStock = item.stok_saat_ini <= thresholdStokRendah;
    const totalKendala = item.rusak + item.hilang + item.rusak_total;
    const isHighProblem = totalKendala >= thresholdMasalahTinggi;

    if (isHighDemand && isHighProblem) return { type: 'kritis', label: 'Status Kritis', action: 'Ganti Unit Lama & Tambah Pengadaan Baru' };
    if (isHighDemand && isLowStock) return { type: 'prioritas_tinggi', label: 'Prioritas Tinggi', action: 'Wajib Pengadaan / Tambah Stok' };
    if (isHighDemand && !isLowStock) return { type: 'prioritas_menengah', label: 'Prioritas Menengah', action: 'Stok Aman, Tambah Cadangan Jika Dana Tersedia' };
    
    return { type: 'aman', label: 'Status Aman', action: 'Tidak Perlu Pengadaan Baru' };
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

const prioritasTinggiCount = computed(() => analitikWithRekomendasi.value.filter(a => a.rekomendasi.type === 'prioritas_tinggi' || a.rekomendasi.type === 'kritis').length);

const top5Data = computed(() => [...analitikWithRekomendasi.value].slice(0, 5));

const chartData = computed(() => ({
    labels: top5Data.value.map(item => item.nama.length > 15 ? item.nama.substring(0, 15) + '...' : item.nama),
    datasets: [
        {
            label: 'Total Dipinjam',
            backgroundColor: '#3b82f6', 
            borderRadius: 6,
            data: top5Data.value.map(item => item.total_dipinjam)
        },
        {
            label: 'Kerusakan',
            backgroundColor: '#ef4444', 
            borderRadius: 6,
            data: top5Data.value.map(item => item.rusak)
        },
        {
            label: 'Kehilangan',
            backgroundColor: '#f59e0b', 
            borderRadius: 6,
            data: top5Data.value.map(item => item.hilang)
        },
        {
            label: 'Rusak Total',
            backgroundColor: '#1e293b', 
            borderRadius: 6,
            data: top5Data.value.map(item => item.rusak_total)
        }
    ]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top', align: 'end' },
        tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            cornerRadius: 8,
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            border: { dash: [4, 4] },
            ticks: { precision: 0 }
        },
        x: {
            grid: { display: false }
        }
    }
};

const getBadgeClass = (type) => {
    switch (type) {
        case 'kritis': return 'bg-red-100 text-red-700 ring-red-300';
        case 'prioritas_tinggi': return 'bg-blue-100 text-blue-700 ring-blue-300';
        case 'prioritas_menengah': return 'bg-amber-100 text-amber-700 ring-amber-300';
        case 'aman': return 'bg-emerald-100 text-emerald-700 ring-emerald-300';
        default: return 'bg-slate-100 text-slate-700 ring-slate-300';
    }
};

const exportReport = () => {
    showAlert(`Mengekspor Laporan Pengadaan untuk tahun ${selectedYear.value}...`, "success");
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
</style>