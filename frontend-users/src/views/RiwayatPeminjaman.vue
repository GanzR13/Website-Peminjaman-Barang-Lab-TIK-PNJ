<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in max-w-5xl mx-auto">

        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Riwayat Peminjaman</h2>
            <p class="text-slate-500 mt-1 text-sm font-medium">Pantau status permohonan dan riwayat peminjaman alat lab Anda di sini.</p>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p class="text-slate-500 font-bold animate-pulse">Memuat riwayat Anda...</p>
        </div>

        <!-- PERBAIKAN: Link Katalog diubah ke /catalog -->
        <div v-else-if="riwayatList.length === 0" class="text-center py-24 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
            <ClipboardDocumentListIcon class="w-20 h-20 text-slate-300 mx-auto" />
            <h3 class="text-xl font-bold text-slate-700 mt-6">Belum Ada Riwayat</h3>
            <p class="text-slate-500 mt-2 text-sm font-medium">Anda belum pernah melakukan permohonan peminjaman barang.</p>
            <router-link to="/catalog" class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Lihat Katalog Barang
            </router-link>
        </div>

        <div v-else class="space-y-6 pb-8">
            <div v-for="transaksi in riwayatList" :key="transaksi.antrian" 
                class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                
                <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Transaksi #{{ transaksi.antrian }}</span>
                            <span :class="getStatusBadgeClass(transaksi.status)" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 shadow-sm">
                                {{ transaksi.status }}
                            </span>
                        </div>
                        <h3 class="text-sm font-bold text-slate-800">
                            {{ formatDate(transaksi.tanggal_pinjam) }} <span class="text-slate-400 font-normal mx-1">s/d</span> {{ formatDate(transaksi.tanggal_kembali) }}
                        </h3>
                    </div>

                    <button v-if="transaksi.status === 'Menunggu'" 
                        @click="handleCancelConfirmation(transaksi.antrian)"
                        :disabled="cancelingId === transaksi.antrian"
                        class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                        
                        <div v-if="cancelingId === transaksi.antrian" class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <XMarkIcon v-else class="w-4 h-4" />
                        
                        {{ cancelingId === transaksi.antrian ? 'Membatalkan...' : 'Batalkan Permohonan' }}
                    </button>
                </div>

                <div class="p-6">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Daftar Barang yang Dipinjam</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="detail in transaksi.detail_barang" :key="detail.id" 
                            class="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            
                            <img :src="getImageUrl(detail.barang?.gambar)" :alt="detail.barang?.nama_barang"
                                class="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white" />
                            
                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-slate-800 line-clamp-1" :title="detail.barang?.nama_barang">
                                    {{ detail.barang?.nama_barang || 'Barang Dihapus' }}
                                </h4>
                                <p class="text-xs font-medium text-slate-500 mt-0.5">Jumlah: <span class="font-bold text-slate-700">{{ detail.jumlah_pinjam }} Unit</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori & Tujuan</p>
                        <p class="text-xs font-medium text-slate-700 mt-1">
                            <span class="font-bold text-blue-600">{{ transaksi.kategori_kebutuhan }}</span> - {{ transaksi.tujuan_peminjaman }}
                        </p>
                    </div>
                    <div v-if="transaksi.catatan_admin" class="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100 w-full md:w-auto">
                        <p class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Catatan Admin</p>
                        <p class="text-xs font-medium text-yellow-800 mt-0.5">{{ transaksi.catatan_admin }}</p>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Fix locale import
import { ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const { showAlert } = useAlert();

const riwayatList = ref([]);
const isLoading = ref(true);
const cancelingId = ref(null);

const fetchRiwayat = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/user/peminjaman/riwayat'); 
        if (response.data.status === 'success') {
            riwayatList.value = response.data.data;
        }
    } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
        if (error.response?.status !== 404) {
            showAlert('Gagal memuat riwayat peminjaman', 'error');
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchRiwayat();
});

const handleCancelConfirmation = (id) => {
    showAlert(
        'Apakah Anda yakin ingin membatalkan permohonan ini? Stok akan dikembalikan otomatis.',
        'confirm',
        () => {
            batalkanPesanan(id);
        }
    );
};

const batalkanPesanan = async (id) => {
    if (cancelingId.value !== null) return;

    cancelingId.value = id;
    try {
        // PERBAIKAN: Pastikan endpoint sesuai dengan rute backend /api/user/peminjaman/:id/batal
        const response = await api.delete(`/user/peminjaman/${id}/batal`);
        
        if (response.data.status === 'success') {
            showAlert('Permohonan berhasil dibatalkan.', 'success');
            await fetchRiwayat(); 
        }
    } catch (error) {
        console.error("Error Detail:", error.response?.data);
        const msg = error.response?.data?.message || 'Gagal membatalkan permohonan';
        showAlert(msg, 'error');
    } finally {
        cancelingId.value = null;
    }
};

// --- UTILITIES ---
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'dd MMM yyyy', { locale: idLocale });
    } catch (e) {
        return '-';
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/150x150/f8fafc/94a3b8?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    // PERBAIKAN: Gunakan port backend yang sedang berjalan (:3000)
    return `http://localhost:3000${imagePath}`; 
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Menunggu': return 'bg-amber-100 text-amber-700 ring-amber-200';
        case 'Disetujui': return 'bg-blue-100 text-blue-700 ring-blue-200';
        case 'Dipinjam': return 'bg-indigo-100 text-indigo-700 ring-indigo-200';
        case 'Selesai': return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
        case 'Ditolak': return 'bg-red-100 text-red-700 ring-red-200';
        default: return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
};
</script>