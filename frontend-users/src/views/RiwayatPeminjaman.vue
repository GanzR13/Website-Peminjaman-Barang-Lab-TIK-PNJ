<template>
    <div class="animate-fade-in pb-10">
        <!-- Header -->
        <div class="mb-6">
            <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Riwayat Peminjaman
            </h2>
            <p class="text-slate-500 mt-1 text-xs md:text-sm font-medium">
                Pantau status dan riwayat peminjaman alat lab Anda.
            </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div
                class="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
            </div>
            <p class="text-slate-500 font-bold text-sm animate-pulse">
                Memuat riwayat Anda...
            </p>
        </div>

        <!-- Empty -->
        <div v-else-if="riwayatList.length === 0"
            class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <ClipboardDocumentListIcon class="w-16 h-16 text-slate-300 mx-auto" />

            <h3 class="text-lg font-bold text-slate-700 mt-6">
                Belum Ada Riwayat
            </h3>

            <p class="text-slate-500 mt-2 text-sm px-6">
                Anda belum pernah melakukan permohonan peminjaman barang.
            </p>

            <router-link to="/catalog"
                class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 text-sm shadow-lg shadow-blue-600/20">
                Lihat Katalog
            </router-link>
        </div>

        <!-- List -->
        <div v-else class="space-y-4">
            <div v-for="transaksi in riwayatList" :key="transaksi.id"
                class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <!-- Header Kartu -->
                <div class="px-4 py-3.5 border-b border-slate-100 bg-slate-50">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    #{{ transaksi.antrian || shortId(transaksi.id) }}
                                </span>

                                <span :class="getStatusBadgeClass(transaksi.status)"
                                    class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ring-1 shadow-sm">
                                    {{ transaksi.status }}
                                </span>
                            </div>

                            <p class="text-xs font-bold text-slate-700">
                                <CalendarIcon class="w-3 h-3 inline mr-1 text-slate-400" />
                                {{ formatDate(transaksi.tanggal_pinjam) }}
                                <span class="text-slate-400 mx-1 font-normal">s/d</span>
                                {{ formatDate(transaksi.tanggal_kembali) }}
                            </p>
                        </div>

                        <span class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0"
                            :class="transaksi.kategori_kebutuhan === 'Khusus'
                                ? 'bg-purple-50 text-purple-600 ring-1 ring-purple-200'
                                : 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'">
                            {{ transaksi.kategori_kebutuhan || 'Harian' }}
                        </span>
                    </div>

                    <p class="text-[11px] text-slate-500 font-medium mt-2 line-clamp-1">
                        {{ transaksi.tujuan_peminjaman || 'Tidak ada tujuan peminjaman' }}
                    </p>
                </div>

                <!-- Daftar Barang -->
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Barang Dipinjam
                        </p>

                        <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {{ transaksi.detail_barang?.length || 0 }} barang
                        </span>
                    </div>

                    <div v-if="transaksi.detail_barang?.length"
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        <div v-for="detail in transaksi.detail_barang" :key="detail.id"
                            class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
                            <img :src="getImageUrl(detail.barang?.gambar)" :alt="detail.barang?.nama_barang || 'Barang'"
                                class="w-11 h-11 rounded-lg object-cover bg-white border border-slate-200 shrink-0" />

                            <div class="flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-slate-800 truncate">
                                    {{ detail.barang?.nama_barang || 'Barang Dihapus' }}
                                </h4>

                                <p class="text-[10px] text-slate-500 font-medium mt-0.5">
                                    Jumlah:
                                    <span class="font-black text-slate-700">
                                        {{ detail.jumlah_pinjam || 0 }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                        <p class="text-xs font-bold text-slate-400">
                            Tidak ada data barang.
                        </p>
                    </div>
                </div>

                <!-- Catatan Admin -->
                <div v-if="transaksi.catatan_admin" class="px-4 pb-3">
                    <div class="bg-yellow-50 px-3 py-2.5 rounded-xl border border-yellow-100">
                        <p class="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-0.5">
                            Catatan Admin
                        </p>

                        <p class="text-xs font-medium text-yellow-800">
                            {{ transaksi.catatan_admin }}
                        </p>
                    </div>
                </div>

                <!-- Tombol Aksi -->
                <div class="px-4 pb-4 flex flex-wrap gap-2">
                    <button v-if="canPrintSurat(transaksi)" @click="cetakSurat(transaksi)"
                        class="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95 text-xs cursor-pointer shadow-md">
                        <PrinterIcon class="w-3.5 h-3.5" />
                        Cetak Surat
                    </button>

                    <button v-if="canAddGoogleCalendarReminder(transaksi)" @click="addGoogleCalendarReminder(transaksi)"
                        class="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold rounded-xl hover:bg-emerald-100 transition-all active:scale-95 text-xs cursor-pointer">
                        <CalendarIcon class="w-3.5 h-3.5" />
                        Pengingat Pengembalian
                    </button>

                    <button v-if="transaksi.status === 'Dipinjam'" @click="openLaporModal(transaksi)"
                        class="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 border border-orange-200 font-bold rounded-xl hover:bg-orange-100 transition-all active:scale-95 text-xs cursor-pointer">
                        <ExclamationTriangleIcon class="w-3.5 h-3.5" />
                        Lapor Masalah
                    </button>

                    <button v-if="transaksi.status === 'Menunggu'" @click="handleCancelConfirmation(transaksi.id)"
                        :disabled="cancelingId === transaksi.id"
                        class="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-all active:scale-95 text-xs cursor-pointer disabled:opacity-50">
                        <div v-if="cancelingId === transaksi.id"
                            class="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin">
                        </div>

                        <XCircleIcon v-else class="w-3.5 h-3.5" />

                        {{ cancelingId === transaksi.id ? 'Membatalkan...' : 'Batalkan' }}
                    </button>
                </div>
            </div>
        </div>

        <ModalLaporMasalah :is-open="isLaporModalOpen" :transaksi="selectedPeminjaman" @close="closeLaporModal" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    ClipboardDocumentListIcon,
    PrinterIcon,
    ExclamationTriangleIcon,
    CalendarIcon,
    XCircleIcon
} from '@heroicons/vue/24/outline';
import ModalLaporMasalah from '../components/ModalLaporMasalah.vue';
import { generateSuratPDF } from '../utils/printSurat';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const riwayatList = ref([]);
const isLoading = ref(true);
const cancelingId = ref(null);

const isLaporModalOpen = ref(false);
const selectedPeminjaman = ref(null);

const fetchRiwayat = async () => {
    isLoading.value = true;

    try {
        const response = await api.get('/user/peminjaman/riwayat');

        if (response.data.status === 'success') {
            riwayatList.value = response.data.data || [];
        }
    } catch (error) {
        if (error.response?.status !== 404) {
            showAlert('Gagal memuat riwayat.', 'error');
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchRiwayat();
});

const handleCancelConfirmation = (id) => {
    showConfirm('Batalkan permohonan ini?', () => batalkanPesanan(id));
};

const batalkanPesanan = async (id) => {
    cancelingId.value = id;

    try {
        await api.delete(`/user/peminjaman/${id}/batal`);
        showAlert('Berhasil dibatalkan.', 'success');
        await fetchRiwayat();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Gagal membatalkan.', 'error');
    } finally {
        cancelingId.value = null;
    }
};

const canPrintSurat = (transaksi) => {
    return transaksi.kategori_kebutuhan === 'Khusus' && transaksi.status === 'Disetujui';
};

const cetakSurat = (transaksi) => {
    generateSuratPDF(transaksi, showAlert);
};

const canAddGoogleCalendarReminder = (transaksi) => {
    return (
        transaksi.kategori_kebutuhan === 'Khusus' &&
        ['Disetujui', 'Dipinjam'].includes(transaksi.status) &&
        transaksi.tanggal_kembali
    );
};

const formatGoogleCalendarDate = (dateValue, hour = 8, minute = 0) => {
    const date = parseLocalDate(dateValue);

    if (!date) return null;

    date.setHours(hour, minute, 0, 0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}00`;
};

const getBarangListText = (transaksi) => {
    if (!transaksi.detail_barang?.length) {
        return '-';
    }

    return transaksi.detail_barang
        .map((detail, index) => {
            const namaBarang = detail.barang?.nama_barang || 'Barang Dihapus';
            const jumlah = detail.jumlah_pinjam || 0;

            return `${index + 1}. ${namaBarang} (${jumlah} unit)`;
        })
        .join('\n');
};

const addGoogleCalendarReminder = (transaksi) => {
    const startDate = formatGoogleCalendarDate(transaksi.tanggal_kembali, 8, 0);
    const endDate = formatGoogleCalendarDate(transaksi.tanggal_kembali, 9, 0);

    if (!startDate || !endDate) {
        showAlert('Tanggal pengembalian tidak valid.', 'error');
        return;
    }

    const title = `Pengembalian Barang Lab - ${transaksi.antrian || shortId(transaksi.id)}`;

    const details = [
        `Pengingat pengembalian barang peminjaman khusus.`,
        ``,
        `Nomor Antrian: ${transaksi.antrian || shortId(transaksi.id)}`,
        `Tanggal Pinjam: ${formatDate(transaksi.tanggal_pinjam)}`,
        `Tanggal Kembali: ${formatDate(transaksi.tanggal_kembali)}`,
        `Tujuan: ${transaksi.tujuan_peminjaman || '-'}`,
        ``,
        `Daftar Barang:`,
        getBarangListText(transaksi),
        ``,
        `Catatan: Pastikan barang dikembalikan sesuai jadwal.`
    ].join('\n');

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');

    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', title);
    calendarUrl.searchParams.set('dates', `${startDate}/${endDate}`);
    calendarUrl.searchParams.set('ctz', 'Asia/Jakarta');
    calendarUrl.searchParams.set('details', details);
    calendarUrl.searchParams.set('location', 'Lab PLP TIK PNJ');

    window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer');
};

const openLaporModal = (transaksi) => {
    selectedPeminjaman.value = transaksi;
    isLaporModalOpen.value = true;
};

const closeLaporModal = () => {
    isLaporModalOpen.value = false;
    selectedPeminjaman.value = null;
};

const shortId = (id) => {
    if (!id) return '-';
    return String(id).slice(0, 8);
};

const parseLocalDate = (dateValue) => {
    if (!dateValue) return null;

    if (dateValue instanceof Date) {
        return Number.isNaN(dateValue.getTime()) ? null : dateValue;
    }

    const dateString = String(dateValue);
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
        const [, year, month, day] = match;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (dateValue) => {
    const date = parseLocalDate(dateValue);

    return date ? format(date, 'dd MMM yyyy', { locale: idLocale }) : '-';
};

const getImageUrl = (path) => {
    if (!path) {
        return 'https://placehold.co/150x150/f8fafc/94a3b8?text=No+Image';
    }

    return path.startsWith('http') ? path : `http://localhost:3000${path}`;
};

const getStatusBadgeClass = (status) => {
    const map = {
        Menunggu: 'bg-amber-100 text-amber-700 ring-amber-200',
        Disetujui: 'bg-blue-100 text-blue-700 ring-blue-200',
        Dipinjam: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        Selesai: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        Ditolak: 'bg-red-100 text-red-700 ring-red-200',
        Dibatalkan: 'bg-slate-100 text-slate-500 ring-slate-200'
    };

    return map[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
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