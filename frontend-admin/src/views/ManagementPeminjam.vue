<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in max-w-5xl mx-auto">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-black text-slate-900 tracking-tight">Laporan & Manajemen Peminjaman</h2>
                <p class="text-slate-500 mt-1 text-sm font-medium">Kelola antrian harian dan riwayat peminjaman alat lab.</p>
            </div>

            <div class="flex items-center gap-3">
                <button @click="exportExcel"
                    class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 ring-1 ring-emerald-200 transition-all active:scale-95 text-sm cursor-pointer">
                    <DocumentArrowDownIcon class="w-5 h-5" /> Export Excel
                </button>
                <button @click="exportPDF"
                    class="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 ring-1 ring-red-200 transition-all active:scale-95 text-sm cursor-pointer">
                    <DocumentTextIcon class="w-5 h-5" /> Export PDF
                </button>
            </div>
        </div>

        <!-- Filter Controls -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 space-y-4">
            <div class="flex flex-col lg:flex-row gap-4 items-end">
                <div class="w-full lg:w-auto flex-1">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tanggal Mulai</label>
                    <input v-model="startDate" type="date"
                        class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
                <div class="w-full lg:w-auto flex-1">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tanggal Selesai</label>
                    <input v-model="endDate" type="date"
                        class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
                <div class="flex gap-2 w-full lg:w-auto">
                    <button @click="setThisWeek"
                        class="flex-1 lg:flex-none px-4 py-2.5 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer">Minggu Ini</button>
                    <button @click="resetDateFilter"
                        class="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:text-red-500 transition-all cursor-pointer"
                        title="Reset Tanggal">
                        <ArrowPathIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-50">
                <div class="relative flex-1">
                    <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama peminjam..."
                        class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium" />
                </div>
                <select v-model="filterStatus"
                    class="w-full md:w-48 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 outline-none cursor-pointer">
                    <option value="">Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak / Batal</option>
                </select>
            </div>
        </div>

        <!-- Table Data -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-100">
                            <th class="p-4 font-black">Antrian</th>
                            <th class="p-4 font-black">Peminjam</th>
                            <th class="p-4 font-black">Tanggal Pinjam</th>
                            <th class="p-4 font-black">Tanggal Kembali</th>
                            <th class="p-4 font-black text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-medium text-slate-700">
                        <tr v-if="isLoading">
                            <td colspan="5" class="p-8 text-center text-slate-500 animate-pulse">Sinkronisasi data...</td>
                        </tr>
                        <tr v-else-if="paginatedData.length === 0">
                            <td colspan="5" class="p-16 text-center text-slate-500">
                                <ClipboardDocumentListIcon class="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                <p class="font-bold text-slate-800">Tidak ada data</p>
                            </td>
                        </tr>
                        <tr v-else v-for="item in paginatedData" :key="item.id" class="border-b border-slate-50 hover:bg-slate-50/50">
                            <td class="p-4 font-black text-slate-900">#{{ item.antrian || item.id }}</td>
                            <td class="p-4">
                                <!-- LANGSUNG PAKAI NAMA_PEMINJAM DARI BACKEND -->
                                <p class="font-bold text-slate-900">{{ item.nama_peminjam }}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span :class="getStatusBadgeClass(item.status)"
                                        class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ring-1">
                                        {{ item.status }}
                                    </span>
                                </div>
                            </td>
                            <td class="p-4">
                                <span class="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-bold">
                                    {{ formatDate(item.tanggal_pinjam) }}
                                </span>
                            </td>
                            <td class="p-4">
                                <span class="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-bold">
                                    {{ formatDate(item.tanggal_kembali) }}
                                </span>
                            </td>
                            <td class="p-4 text-center">
                                <button @click="openProcessModal(item)"
                                    class="px-4 py-2 bg-white border border-slate-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors active:scale-95 text-xs cursor-pointer">
                                    Detail / Proses
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="!isLoading && filteredData.length > 0"
                class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 gap-4 mt-auto">
                <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-slate-500">Tampilkan:</span>
                    <select v-model="itemsPerPage"
                        class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 bg-white outline-none cursor-pointer">
                        <option :value="10">10 Baris</option>
                        <option :value="20">20 Baris</option>
                        <option :value="50">50 Baris</option>
                        <option :value="100">100 Baris</option>
                        <option :value="200">200 Baris</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Sebelumnya
                    </button>
                    <span class="text-sm font-black text-slate-700 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL DETAIL -->
        <BaseModal :isOpen="isModalOpen" maxWidth="max-w-2xl" @close="isModalOpen = false">
            <template #header>
                <div class="mb-6">
                    <h2 class="text-2xl font-black text-slate-900">Detail Peminjaman</h2>
                    <p class="text-slate-500 text-sm mt-1">Nomor Antrian: #{{ selectedData?.antrian || selectedData?.id }}</p>
                </div>
            </template>
            
            <div v-if="selectedData" class="space-y-4">
                
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p class="text-xs text-blue-500 font-black uppercase tracking-widest mb-3 border-b border-blue-200/50 pb-2">Informasi Peminjam</p>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="col-span-2 sm:col-span-1">
                            <p class="text-xs text-blue-400 font-bold mb-1">Nama Tampilan</p>
                            <!-- LANGSUNG PAKAI NAMA_PEMINJAM DARI BACKEND -->
                            <p class="font-bold text-slate-800">{{ selectedData.nama_peminjam }}</p>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <p class="text-xs text-blue-400 font-bold mb-1">Status / Peran</p>
                            <p class="font-bold text-slate-800">
                                {{ selectedData.peminjam?.mahasiswa ? 'Mahasiswa' : (selectedData.peminjam?.pegawai ? 'Dosen / Pegawai' : 'User') }}
                            </p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-xs text-blue-400 font-bold mb-1">Email Akun</p>
                            <p class="font-bold text-slate-800">{{ selectedData.peminjam?.email || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p class="text-xs text-slate-400 font-black uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Detail Transaksi</p>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-xs text-slate-400 font-bold mb-1">Status Saat Ini</p>
                            <span :class="getStatusBadgeClass(selectedData.status)"
                                class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ring-1">{{
                                selectedData.status }}</span>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-bold mb-1">Kategori Kebutuhan</p>
                            <p class="font-bold text-slate-800">{{ selectedData.kategori_kebutuhan || '-' }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-xs text-slate-400 font-bold mb-1">Tujuan / Nama Acara</p>
                            <p class="font-medium text-slate-700">{{ selectedData.tujuan_peminjaman || '-' }} {{
                                selectedData.nama_acara ? `(${selectedData.nama_acara})` : '' }}</p>
                        </div>
                    </div>
                </div>

                <div class="border border-slate-200 rounded-xl overflow-hidden">
                    <div class="bg-slate-100 px-4 py-3 border-b border-slate-200">
                        <p class="text-xs text-slate-500 font-black uppercase tracking-widest">Daftar Barang yang Dipinjam</p>
                    </div>
                    <div class="p-4 bg-white">
                        <ul v-if="selectedData.detail_barang && selectedData.detail_barang.length > 0" class="space-y-3">
                            <li v-for="detail in selectedData.detail_barang" :key="detail.id" 
                                class="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div class="flex items-center gap-3">
                                    <img :src="getImageUrl(detail.barang?.gambar)" 
                                         :alt="detail.barang?.nama_barang"
                                         class="w-12 h-12 rounded-md object-cover border border-slate-200 bg-white" />
                                    <div>
                                        <p class="font-bold text-slate-800 text-sm line-clamp-1">
                                            {{ detail.barang?.nama_barang || 'Barang Dihapus' }}
                                        </p>
                                        <p class="text-xs text-slate-400 font-medium mt-0.5">ID Barang: {{ detail.barang_id }}</p>
                                    </div>
                                </div>
                                <div class="text-right shrink-0 ml-4">
                                    <span class="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-black">
                                        {{ detail.jumlah_pinjam }} Unit
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="text-center py-6">
                            <p class="text-slate-400 text-sm font-medium">Tidak ada detail barang untuk transaksi ini.</p>
                        </div>
                    </div>
                </div>

                <div v-if="selectedData.status === 'Menunggu'" class="flex gap-3 pt-4 border-t border-slate-100">
                    <button @click="updateStatus('Disetujui')"
                        class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer active:scale-95">Setujui Permohonan</button>
                    <button @click="updateStatus('Ditolak')"
                        class="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition cursor-pointer active:scale-95">Tolak</button>
                </div>
                <div v-else-if="selectedData.status === 'Disetujui'" class="flex gap-3 pt-4 border-t border-slate-100">
                    <button @click="updateStatus('Dipinjam')"
                        class="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 cursor-pointer active:scale-95">Barang Telah Diambil (Mulai Pinjam)</button>
                </div>
                <div v-else-if="selectedData.status === 'Dipinjam'" class="flex gap-3 pt-4 border-t border-slate-100">
                    <button @click="updateStatus('Selesai')"
                        class="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition shadow-lg shadow-slate-200 cursor-pointer active:scale-95">Selesaikan & Kembalikan Barang</button>
                </div>
                <div v-else class="pt-4 border-t border-slate-100 text-center">
                    <p class="text-slate-500 font-bold text-sm">Transaksi ini sudah tutup buku.</p>
                </div>
            </div>
        </BaseModal>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import BaseModal from '../components/BaseModal.vue';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, endOfDay } from 'date-fns';
import { id } from 'date-fns/locale/id';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    MagnifyingGlassIcon, ClipboardDocumentListIcon,
    DocumentArrowDownIcon, DocumentTextIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline';

const { showAlert } = useAlert();

const rawPeminjamanList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isModalOpen = ref(false);
const selectedData = ref(null);

const setThisWeek = () => {
    const today = new Date();
    const senin = startOfWeek(today, { weekStartsOn: 1 });
    const minggu = endOfDay(endOfWeek(today, { weekStartsOn: 1 }));
    startDate.value = format(senin, 'yyyy-MM-dd');
    endDate.value = format(minggu, 'yyyy-MM-dd');
    currentPage.value = 1;
    showAlert('Menampilkan rentang minggu ini', 'success');
};

const resetDateFilter = () => {
    startDate.value = '';
    endDate.value = '';
};

const fetchPeminjaman = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/admin/peminjaman/all?page=1&limit=1000');
        rawPeminjamanList.value = response.data.data || [];
    } catch (error) {
        console.error("Error Fetch:", error);
        showAlert('Gagal sinkronisasi data server', 'error');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchPeminjaman());

const filteredData = computed(() => {
    let result = rawPeminjamanList.value;

    // Filter Pencarian (Langsung pakai nama_peminjam dari API)
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(item => {
            const nama = (item.nama_peminjam || '').toLowerCase();
            return nama.includes(q);
        });
    }

    if (filterStatus.value) {
        result = result.filter(item => item.status === filterStatus.value);
    }

    if (startDate.value && endDate.value) {
        try {
            const start = parseISO(startDate.value);
            const end = endOfDay(parseISO(endDate.value));
            result = result.filter(item => {
                const pinjamDate = new Date(item.tanggal_pinjam);
                return isWithinInterval(pinjamDate, { start, end });
            });
        } catch (e) {
            console.error("Filter tanggal error:", e);
        }
    }
    return result;
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value) || 1);
const paginatedData = computed(() => {
    const startIdx = (currentPage.value - 1) * itemsPerPage.value;
    const endIdx = startIdx + itemsPerPage.value;
    return filteredData.value.slice(startIdx, endIdx);
});

watch([searchQuery, filterStatus, startDate, endDate, itemsPerPage], () => {
    currentPage.value = 1;
});

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    } catch (error) {
        return '-';
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/150x150/f8fafc/94a3b8?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`; 
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Menunggu': return 'bg-amber-50 text-amber-600 ring-amber-200';
        case 'Disetujui': return 'bg-blue-50 text-blue-600 ring-blue-200';
        case 'Dipinjam': return 'bg-indigo-50 text-indigo-600 ring-indigo-200';
        case 'Selesai': return 'bg-emerald-50 text-emerald-600 ring-emerald-200';
        case 'Dibatalkan':
        case 'Ditolak': return 'bg-red-50 text-red-600 ring-red-200';
        default: return 'bg-slate-50 text-slate-500 ring-slate-200';
    }
};

const openProcessModal = (item) => {
    selectedData.value = item;
    isModalOpen.value = true;
};

const updateStatus = (newStatus) => {
    showAlert(
        `Apakah Anda yakin ingin mengubah status peminjaman ini menjadi "${newStatus}"?`,
        "confirm",
        async () => {
            try {
                await api.put(`/admin/peminjaman/${selectedData.value.id}/status`, { status: newStatus });
                showAlert(`Status berhasil diubah menjadi ${newStatus}`, 'success');
                isModalOpen.value = false;
                fetchPeminjaman();
            } catch (error) {
                console.error("Error Update Status:", error);
                showAlert('Gagal mengubah status di server', 'error');
            }
        }
    );
};

// --- EXPORT LOGIC ---
const exportExcel = () => {
    if (filteredData.value.length === 0) return showAlert('Data kosong, tidak ada yang bisa di-export', 'error');

    const data = filteredData.value.map((item, index) => {
        const listBarang = item.detail_barang?.map(d => `${d.barang?.nama_barang} (${d.jumlah_pinjam})`).join(', ') || '-';
        
        return {
            'No': index + 1,
            'Antrian': item.antrian || item.id,
            'Nama Peminjam': item.nama_peminjam, // Langsung panggil variabel ini
            'Kategori': item.kategori_kebutuhan || '-',
            'Barang Dipinjam': listBarang,
            'Mulai Pinjam': formatDate(item.tanggal_pinjam),
            'Tgl Kembali': formatDate(item.tanggal_kembali),
            'Status': item.status
        };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_Peminjaman_${startDate.value || 'All'}.xlsx`);
    showAlert('File Excel berhasil diunduh', 'success');
};

const exportPDF = () => {
    if (filteredData.value.length === 0) return showAlert('Data kosong, tidak ada yang bisa di-export', 'error');

    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('LAPORAN PEMINJAMAN BARANG LAB PLP TIK PNJ', 14, 15);

    const subtitle = startDate.value && endDate.value
        ? `Periode: ${formatDate(startDate.value)} s.d. ${formatDate(endDate.value)}`
        : 'Periode: Semua Waktu';
    doc.setFontSize(10);
    doc.text(subtitle, 14, 22);

    const rows = filteredData.value.map((item, i) => {
        const listBarang = item.detail_barang?.map(d => `${d.barang?.nama_barang} (${d.jumlah_pinjam})`).join(',\n') || '-';
        
        return [
            i + 1, 
            item.antrian || item.id, 
            item.nama_peminjam, // Langsung panggil variabel ini
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
        headStyles: { fillColor: [30, 64, 175] },
        styles: { cellPadding: 2, fontSize: 8, overflow: 'linebreak' },
        columnStyles: { 3: { cellWidth: 50 } }
    });

    doc.save(`Laporan_Lab_${format(new Date(), 'ddMMyy')}.pdf`);
    showAlert('File PDF berhasil diunduh', 'success');
};
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
</style>