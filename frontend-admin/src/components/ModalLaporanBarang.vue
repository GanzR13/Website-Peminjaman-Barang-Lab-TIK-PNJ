<template>
    <transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="$emit('close')">
            
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden">
                
                <div v-if="item" class="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-hidden tracking-tight">

                    <div class="bg-slate-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
                        <h3 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <WrenchScrewdriverIcon class="w-5 h-5 text-slate-500" />
                            Detail Bukti Laporan
                        </h3>

                        <a :href="getImageUrl(item.foto_bukti)" target="_blank"
                            class="block w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6 hover:opacity-90 transition cursor-zoom-in relative group bg-white text-center">
                            <img :src="getImageUrl(item.foto_bukti)" class="w-full h-full object-contain" />
                            <div
                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-white text-xs uppercase tracking-widest gap-2">
                                <MagnifyingGlassIcon class="w-5 h-5" /> Perbesar
                            </div>
                        </a>

                        <div class="space-y-4 text-sm font-medium">
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Barang Bermasalah</p>
                                <p class="font-bold text-slate-800">{{ item.barang?.nama_barang }} ({{ item.jumlah }} Unit)</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kronologi Kejadian</p>
                                <div class="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 italic leading-relaxed">
                                    "{{ item.deskripsi }}"
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 md:p-8 flex flex-col overflow-y-auto">
                        
                        <div class="mb-6 pb-4 border-b border-slate-100 flex justify-between items-start gap-4">
                            <div>
                                <span
                                    :class="item.jenis_laporan === 'Kerusakan' ? 'bg-red-100 text-red-700 ring-red-200' : 'bg-orange-100 text-orange-700 ring-orange-200'"
                                    class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 mb-2 inline-block">
                                    {{ item.jenis_laporan }}
                                </span>
                                <h2 class="text-xl font-black text-slate-900">Proses Penyelesaian</h2>
                            </div>
                            
                            <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                                <span :class="getStatusBadgeClass(item.status)"
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 shadow-sm text-center">
                                    {{ item.status === 'Perlu Perbaikan' ? 'Barang Rusak' : item.status }}
                                </span>
                                
                                <button @click="$emit('close')" 
                                    class="p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer active:scale-95" 
                                    title="Tutup Modal">
                                    <XMarkIcon class="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div v-if="item.status === 'Selesai Diperbaiki'"
                            class="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 items-start animate-fade-in">
                            <CheckBadgeIcon class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <p class="text-xs font-bold text-emerald-900 mb-0.5">Laporan Selesai Diperbaiki</p>
                                <p class="text-[11px] font-medium text-emerald-700 leading-relaxed tracking-normal">Data ini telah dikunci secara permanen karena proses servis telah selesai dan stok lab kembali normal.</p>
                            </div>
                        </div>

                        <div v-if="item.status === 'Rusak Total'"
                            class="mb-5 p-4 bg-slate-900 text-white border border-slate-800 rounded-xl flex gap-3 items-start animate-fade-in">
                            <ArchiveBoxXMarkIcon class="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p class="text-xs font-bold text-slate-200 mb-0.5">Barang Rusak Total</p>
                                <p class="text-[11px] font-medium text-slate-400 leading-relaxed tracking-normal">Data ini telah dikunci permanen. Barang dinyatakan tidak dapat diperbaiki dan telah dihapus dari inventaris aktif laboratorium.</p>
                            </div>
                        </div>

                        <form @submit.prevent="handleSave" class="flex-1 flex flex-col gap-5">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Update Status & Tindakan <span class="text-red-500">*</span></label>

                                <select v-model="localForm.status" :disabled="isStatusLockedPermanently" required
                                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-bold text-slate-700 bg-slate-50 disabled:opacity-75 disabled:cursor-not-allowed">
                                    <option disabled value="">-- Pilih Status --</option>
                                    <option v-if="item.status === 'Menunggu Tindakan'" value="Menunggu Tindakan">1. Baru: Menunggu Tindakan</option>
                                    
                                    <option value="Perlu Perbaikan">Barang Rusak (Ganti Unit Baru Stock Barang Berkurang)</option>
                                    <option value="Sedang Diservis">Sedang Diservis (Dikirim ke Teknisi)</option>
                                    
                                    <option value="Selesai Diperbaiki">Selesai Diperbaiki (Stok Lab Bertambah)</option>
                                    <option value="Rusak Total">Rusak Total / Dibuang (Stok Tetap/Hangus)</option>
                                </select>

                                <div v-if="localForm.status === 'Perlu Perbaikan'"
                                    class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start animate-fade-in">
                                    <InformationCircleIcon class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p class="text-[11px] font-medium text-red-800 leading-relaxed tracking-normal">
                                        Sistem akan otomatis <b>mengurangi stok fisik</b> lab alat ini karena Anda diasumsikan memberikan unit baru sebagai pengganti.
                                    </p>
                                </div>
                            </div>

                            <div class="flex-1">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Catatan Perbaikan / Servis <span class="text-red-500">*</span></label>
                                <textarea v-model="localForm.tindakan_penyelesaian" :disabled="isStatusLockedPermanently"
                                    rows="5" required
                                    placeholder="Contoh: Diganti dengan unit dari lemari A, unit lama dikirim ke teknisi IT..."
                                    class="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-medium bg-slate-50 resize-none disabled:opacity-75 disabled:cursor-not-allowed"></textarea>
                            </div>

                            <div class="mt-auto pt-6 flex gap-3">
                                <button type="button" @click="$emit('close')"
                                    class="px-5 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm cursor-pointer active:scale-95">
                                    {{ isStatusLockedPermanently ? 'Tutup' : 'Batal' }}
                                </button>

                                <button v-if="!isStatusLockedPermanently" type="submit" :disabled="isProcessing"
                                    class="flex-1 py-3.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all active:scale-95 text-sm flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer">
                                    <span v-if="isProcessing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
    MagnifyingGlassIcon, WrenchScrewdriverIcon, InformationCircleIcon,
    CheckBadgeIcon, ArchiveBoxXMarkIcon, XMarkIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
    isOpen: Boolean,
    item: Object,
    isProcessing: Boolean
});

const emit = defineEmits(['close', 'save']);

const localForm = ref({
    status: '',
    tindakan_penyelesaian: ''
});

watch(() => props.item, (newVal) => {
    if (newVal) {
        localForm.value = {
            status: newVal.status || '',
            tindakan_penyelesaian: newVal.tindakan_penyelesaian || ''
        };
    }
}, { immediate: true });

const isStatusLockedPermanently = computed(() => {
    return props.item?.status === 'Selesai Diperbaiki' || props.item?.status === 'Rusak Total';
});

const handleSave = () => {
    emit('save', { ...localForm.value });
};

const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/400x400/f8fafc/94a3b8?text=No+Photo';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
};

const getStatusBadgeClass = (status) => {
    switch (status) {
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
/* Transisi Modal Sama Persis Seperti Modal Peminjam */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

/* Animasi Fade In Form */
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
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
</style>