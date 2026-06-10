<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                @click.self="closeModal">

                <div
                    class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden flex flex-col max-h-[95vh] lg:max-h-[90vh]">

                    <div
                        class="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start gap-4 shrink-0 bg-white z-10">
                        <div>
                            <h2 class="text-2xl font-black text-slate-900">Proses Peminjaman</h2>
                            <p class="text-slate-500 text-sm mt-1">Nomor Antrian: #{{ selectedData?.antrian ||
                                selectedData?.id }}</p>
                        </div>

                        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                            <span :class="getStatusBadgeClass(selectedData?.status)"
                                class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 shadow-sm text-center">
                                {{ selectedData?.status }}
                            </span>

                            <button @click="closeModal"
                                class="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer active:scale-95"
                                title="Tutup Modal">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div v-if="selectedData"
                        class="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-5 bg-white flex-1">

                        <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                            <p
                                class="text-xs text-blue-500 font-black uppercase tracking-widest mb-4 border-b border-blue-200/50 pb-2">
                                Informasi Peminjam & Kegiatan</p>
                            <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div class="col-span-2 sm:col-span-1">
                                    <p class="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-widest">Nama
                                        Lengkap</p>
                                    <p class="font-bold text-slate-800">{{ selectedData.nama_peminjam }}</p>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <p class="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-widest">
                                        Kategori Kebutuhan</p>
                                    <span class="font-bold text-slate-800 px-2 py-0.5 bg-blue-100 rounded text-xs">{{
                                        selectedData.kategori_kebutuhan }}</span>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <p class="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-widest">Tujuan
                                        / Acara</p>
                                    <p class="font-bold text-slate-800">{{ selectedData.tujuan_peminjaman || '-' }}</p>
                                </div>
                                <div v-if="selectedData.kategori_kebutuhan === 'Khusus'"
                                    class="col-span-2 sm:col-span-1">
                                    <p class="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-widest">Kode Peminjaman</p>
                                    <p v-if="selectedData.kode_peminjaman" class="font-bold text-slate-800">{{
                                        selectedData.kode_peminjaman }}</p>
                                    <p v-else class="font-bold text-amber-600 text-xs italic">Akan digenerate saat
                                        disetujui</p>
                                </div>
                            </div>
                        </div>

                        <div class="border border-slate-200 rounded-2xl overflow-hidden">
                            <div class="bg-slate-50 px-5 py-3.5 border-b border-slate-200">
                                <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Daftar Barang
                                    yang Dipinjam</p>
                            </div>
                            <div class="p-3 bg-white">
                                <ul v-if="selectedData.detail_barang && selectedData.detail_barang.length > 0"
                                    class="space-y-2">
                                    <li v-for="detail in selectedData.detail_barang" :key="detail.id"
                                        class="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <div class="flex items-center gap-3">
                                            <img :src="getImageUrl(detail.barang?.gambar)"
                                                :alt="detail.barang?.nama_barang"
                                                class="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white shadow-sm" />
                                            <div>
                                                <p class="font-bold text-slate-800 text-sm line-clamp-1">
                                                    {{ detail.barang?.nama_barang || 'Barang Dihapus' }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="text-right shrink-0 ml-4">
                                            <span
                                                class="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-black shadow-sm">
                                                {{ detail.jumlah_pinjam }} Unit
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="selectedData.laporan_masalah && selectedData.laporan_masalah.length > 0"
                            class="border border-orange-200 rounded-2xl overflow-hidden mt-4 shadow-sm">
                            <div
                                class="bg-orange-50 px-5 py-3.5 border-b border-orange-200 flex items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <ExclamationTriangleIcon class="w-5 h-5 text-orange-600" />
                                    <p class="text-[10px] text-orange-800 font-black uppercase tracking-widest">Laporan
                                        Kendala (Kerusakan / Kehilangan)</p>
                                </div>
                                <span
                                    class="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{{
                                    selectedData.laporan_masalah.length }}</span>
                            </div>
                            <div class="p-4 bg-white space-y-3">
                                <div v-for="laporan in selectedData.laporan_masalah" :key="laporan.id"
                                    class="p-4 rounded-xl border border-orange-100 bg-orange-50/30 flex flex-col sm:flex-row gap-4">
                                    <a :href="getImageUrl(laporan.foto_bukti)" target="_blank"
                                        class="shrink-0 w-24 h-24 sm:w-20 sm:h-20 block rounded-lg overflow-hidden border border-orange-200 bg-white shadow-sm hover:scale-105 transition-transform">
                                        <img :src="getImageUrl(laporan.foto_bukti)" class="w-full h-full object-cover"
                                            alt="Foto Laporan" />
                                    </a>

                                    <div class="flex-1 text-sm">
                                        <div class="flex justify-between items-start mb-1">
                                            <p class="font-bold text-slate-800">{{ laporan.jenis_laporan }} <span
                                                    class="text-slate-500 font-medium text-xs">({{ laporan.jumlah }}
                                                    Unit)</span></p>
                                            <span
                                                class="px-2 py-1 bg-orange-100 text-orange-700 font-black text-[9px] uppercase tracking-widest rounded ring-1 ring-orange-200 shadow-sm">{{
                                                laporan.status }}</span>
                                        </div>
                                        <p class="text-xs font-bold text-slate-400 mb-2">Tgl Kejadian: <span
                                                class="text-slate-600 font-medium">{{
                                                formatDate(laporan.tanggal_kejadian) }}</span></p>
                                        <div
                                            class="bg-white p-3 rounded-lg border border-orange-100/50 text-xs text-slate-600 leading-relaxed font-medium italic">
                                            "{{ laporan.deskripsi }}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedData.status === 'Menunggu'"
                            class="flex flex-col gap-3 pt-4 border-t border-slate-100">
                            <div v-if="selectedData.kategori_kebutuhan === 'Harian'"
                                class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex items-start gap-3">
                                <InformationCircleIcon class="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                                <p class="text-xs text-amber-800 font-bold leading-relaxed">Pastikan Anda telah menerima
                                    KTM sebagai jaminan sebelum menyerahkan barang dan menyetujui peminjaman ini.</p>
                            </div>

                            <div class="flex gap-3 flex-col sm:flex-row mt-2">
                                <button v-if="selectedData.kategori_kebutuhan === 'Khusus'"
                                    @click="triggerUpdateStatus('Disetujui')" :disabled="processingStatus !== null"
                                    class="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer active:scale-95 text-sm text-center shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <span v-if="processingStatus === 'Disetujui'"
                                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {{ processingStatus === 'Disetujui' ? 'Memproses...' : 'Setujui Permohonan (Generate Surat)' }}
                                </button>

                                <button v-else @click="triggerUpdateStatus('Dipinjam')"
                                    :disabled="processingStatus !== null"
                                    class="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer active:scale-95 text-sm text-center shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <span v-if="processingStatus === 'Dipinjam'"
                                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {{ processingStatus === 'Dipinjam' ? 'Memproses...' : 'Setujui & Serahkan Barang' }}
                                </button>

                                <button @click="triggerUpdateStatus('Ditolak')" :disabled="processingStatus !== null"
                                    class="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition cursor-pointer active:scale-95 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                                    <span v-if="processingStatus === 'Ditolak'"
                                        class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                                    Tolak
                                </button>
                            </div>
                        </div>

                        <div v-else-if="selectedData.status === 'Disetujui'"
                            class="flex flex-col gap-3 pt-4 border-t border-slate-100">
                            <div
                                class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 mb-2 flex items-start gap-3">
                                <InformationCircleIcon class="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                                <p class="text-xs text-amber-800 font-bold leading-relaxed">Surat telah disetujui.
                                    Pastikan Anda menerima KTM sebelum menyerahkan fisik barang ke peminjam.</p>
                            </div>
                            <button @click="triggerUpdateStatus('Dipinjam')" :disabled="processingStatus !== null"
                                class="w-full py-3.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 cursor-pointer active:scale-95 text-sm text-center flex justify-center items-center gap-2 disabled:opacity-50">
                                <span v-if="processingStatus === 'Dipinjam'"
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Barang Telah Diambil (Mulai Peminjaman)
                            </button>
                        </div>

                        <div v-else-if="['Dipinjam', 'Barang Rusak'].includes(selectedData.status)"
                            class="flex flex-col gap-3 pt-4 border-t border-slate-100">
                            <div v-if="selectedData.status === 'Barang Rusak' || selectedData.laporan_masalah?.length > 0"
                                class="bg-red-50 p-3.5 rounded-xl border border-red-200 flex items-start gap-3 mb-2">
                                <ExclamationTriangleIcon class="w-6 h-6 text-red-600 shrink-0 mt-0.5" />

                                <p class="text-xs text-red-800 font-bold leading-relaxed">
                                    Perhatian: Transaksi ini memiliki laporan kendala atau status barang rusak.
                                    Pastikan pertanggungjawaban, penggantian, atau servis sudah dicatat manual oleh
                                    admin sebelum menyelesaikan peminjaman.
                                </p>
                            </div>

                            <button @click="triggerUpdateStatus('Selesai')" :disabled="processingStatus !== null"
                                class="w-full py-3.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20 cursor-pointer active:scale-95 text-sm text-center flex items-center justify-center gap-2 disabled:opacity-50">
                                <span v-if="processingStatus === 'Selesai'"
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                                {{
                                    selectedData.status === 'Barang Rusak'
                                        ? 'Selesaikan Peminjaman Bermasalah'
                                        : 'Peminjaman Selesai (Kembalikan KTM/Jaminan)'
                                }}
                            </button>
                        </div>

                        <div v-else class="pt-4 border-t border-slate-100 text-center">
                            <p
                                class="text-slate-500 font-bold text-sm bg-slate-50 py-3 rounded-xl border border-slate-100">
                                Transaksi ini sudah tertutup / selesai.</p>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import {
    InformationCircleIcon, ExclamationTriangleIcon, XMarkIcon // Icon XMarkIcon diimport
} from '@heroicons/vue/24/outline';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    selectedData: { type: Object, default: null },
    processingStatus: { type: String, default: null }
});

const emit = defineEmits(['close', 'update-status']);

const closeModal = () => {
    emit('close');
};

const triggerUpdateStatus = (newStatus) => {
    emit('update-status', newStatus);
};

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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 10px;
}
</style>