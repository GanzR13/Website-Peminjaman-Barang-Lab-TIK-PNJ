<template>
    <transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4"
            @click.self="$emit('close')">

            <div
                class="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden">

                <button @click="$emit('close')"
                    class="absolute top-3 right-3 md:top-5 md:right-5 p-2 bg-white/80 backdrop-blur-sm md:bg-transparent text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full md:rounded-lg transition-colors cursor-pointer active:scale-95 z-20 shadow-sm md:shadow-none"
                    title="Tutup Modal">
                    <XMarkIcon class="w-6 h-6" />
                </button>

                <div v-if="item"
                    class="flex flex-col md:grid md:grid-cols-2 flex-1 overflow-y-auto hide-scrollbar md:overflow-hidden tracking-tight relative">

                    <div
                        class="bg-slate-50 p-5 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 md:overflow-y-auto hide-scrollbar shrink-0">
                        <h3
                            class="text-lg font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-2 pr-10 md:pr-0">
                            <WrenchScrewdriverIcon class="w-5 h-5 text-slate-500" />
                            Detail Bukti Laporan
                        </h3>

                        <a :href="getImageUrl(item.foto_bukti)" target="_blank"
                            class="block w-full h-48 md:h-auto md:aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-5 md:mb-6 hover:opacity-90 transition cursor-zoom-in relative group bg-white text-center">
                            <img :src="getImageUrl(item.foto_bukti)"
                                class="w-full h-full object-cover md:object-contain" />
                            <div
                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-white text-xs uppercase tracking-widest gap-2">
                                <MagnifyingGlassIcon class="w-5 h-5" /> Perbesar
                            </div>
                        </a>

                        <div class="space-y-4 text-sm font-medium">
                            <div class="bg-white p-3 rounded-xl border border-slate-100">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Barang
                                    Bermasalah</p>
                                <p class="font-bold text-slate-800">{{ item.barang?.nama_barang }} ({{ item.jumlah }}
                                    Unit)</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                                    Kronologi Kejadian</p>
                                <div
                                    class="p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-slate-600 italic leading-relaxed text-xs md:text-sm">
                                    "{{ item.deskripsi }}"
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-5 md:p-8 flex flex-col md:overflow-y-auto hide-scrollbar">

                        <div class="mb-5 md:mb-6 pb-4 border-b border-slate-100">
                            <span
                                :class="item.jenis_laporan === 'Kerusakan' ? 'bg-red-100 text-red-700 ring-red-200' : 'bg-orange-100 text-orange-700 ring-orange-200'"
                                class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 mb-2 inline-block">
                                {{ item.jenis_laporan }}
                            </span>

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h2 class="text-xl font-black text-slate-900">Proses Penyelesaian</h2>
                                <span :class="getStatusBadgeClass(item.status)"
                                    class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 shadow-sm text-center w-fit">
                                    {{ item.status === 'Perlu Perbaikan' ? 'Barang Rusak' : item.status }}
                                </span>
                            </div>
                        </div>

                        <div v-if="item.status === 'Selesai Diperbaiki'"
                            class="mb-5 p-3 md:p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 items-start animate-fade-in">
                            <CheckBadgeIcon class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <p class="text-xs font-bold text-emerald-900 mb-0.5">Laporan Selesai Diperbaiki</p>
                                <p class="text-[11px] font-medium text-emerald-700 leading-relaxed tracking-normal">Data
                                    ini telah dikunci secara permanen karena proses servis telah selesai dan stok lab
                                    kembali normal.</p>
                            </div>
                        </div>

                        <div v-if="item.status === 'Rusak Total'"
                            class="mb-5 p-3 md:p-4 bg-slate-900 text-white border border-slate-800 rounded-xl flex gap-3 items-start animate-fade-in">
                            <ArchiveBoxXMarkIcon class="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p class="text-xs font-bold text-slate-200 mb-0.5">Barang Rusak Total</p>
                                <p class="text-[11px] font-medium text-slate-400 leading-relaxed tracking-normal">Data
                                    ini telah dikunci permanen. Barang dinyatakan tidak dapat diperbaiki dan telah
                                    dihapus dari inventaris aktif laboratorium.</p>
                            </div>
                        </div>

                        <form @submit.prevent="handleSave" class="flex-1 flex flex-col gap-5">

                            <div class="relative">
                                <label
                                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Update
                                    Status & Tindakan <span class="text-red-500">*</span></label>

                                <button type="button" @click.stop="toggleDropdown" :disabled="isStatusLockedPermanently"
                                    class="w-full flex items-center justify-between px-4 py-3 border rounded-xl outline-none text-sm font-bold transition-all disabled:opacity-75 disabled:cursor-not-allowed bg-slate-50 cursor-pointer"
                                    :class="isDropdownOpen ? 'border-orange-500 ring-4 ring-orange-50 text-slate-800' : 'border-slate-200 text-slate-700'">

                                    <span class="truncate">{{ getSelectedStatusLabel || '-- Pilih Status --' }}</span>

                                    <svg class="w-4 h-4 text-slate-400 transition-transform shrink-0"
                                        :class="{ 'rotate-180 text-orange-500': isDropdownOpen }" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <transition name="fade-down">
                                    <ul v-if="isDropdownOpen && !isStatusLockedPermanently"
                                        class="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto hide-scrollbar">

                                        <li v-for="option in statusOptions" :key="option.value"
                                            v-show="option.value !== 'Menunggu Tindakan' || item.status === 'Menunggu Tindakan'"
                                            @click="selectStatus(option.value)"
                                            class="px-4 py-3 text-xs sm:text-sm cursor-pointer transition-colors border-b border-slate-50 last:border-0 hover:bg-orange-50"
                                            :class="localForm.status === option.value ? 'bg-orange-50 text-orange-700 font-black' : 'text-slate-700 font-medium'">
                                            {{ option.label }}
                                        </li>
                                    </ul>
                                </transition>

                                <div v-if="localForm.status === 'Perlu Perbaikan'"
                                    class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2.5 items-start animate-fade-in">
                                    <InformationCircleIcon class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p class="text-[11px] font-medium text-red-800 leading-relaxed tracking-normal">
                                        Sistem akan otomatis <b>mengurangi stok fisik</b> lab alat ini karena Anda
                                        diasumsikan memberikan unit baru sebagai pengganti.
                                    </p>
                                </div>
                            </div>

                            <div class="flex-1 flex flex-col">
                                <label
                                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Catatan
                                    Perbaikan / Servis <span class="text-red-500">*</span></label>
                                <textarea v-model="localForm.tindakan_penyelesaian"
                                    :disabled="isStatusLockedPermanently" rows="4" required
                                    placeholder="Contoh: Diganti dengan unit dari lemari A, unit lama dikirim ke teknisi IT..."
                                    class="w-full flex-1 min-h-25 md:min-h-30 px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-medium bg-slate-50 resize-none disabled:opacity-75 disabled:cursor-not-allowed transition-all"></textarea>
                            </div>

                            <div class="mt-2 pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3">
                                <button type="button" @click="$emit('close')"
                                    class="w-full sm:w-auto px-5 py-3 md:py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm cursor-pointer active:scale-95 border border-slate-200">
                                    {{ isStatusLockedPermanently ? 'Tutup Modal' : 'Batal' }}
                                </button>

                                <button v-if="!isStatusLockedPermanently" type="submit"
                                    :disabled="isProcessing || !localForm.status"
                                    class="w-full sm:flex-1 py-3 md:py-3.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all active:scale-95 text-sm flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer">
                                    <span v-if="isProcessing"
                                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {{ isProcessing ? 'Memproses...' : 'Simpan Perubahan' }}
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
    tindakan_penyelesaian: '',
    jumlah_proses: 1
});

const isDropdownOpen = ref(false);

const statusOptions = [
    { value: 'Menunggu Tindakan', label: 'Baru: Menunggu Tindakan' },
    { value: 'Perlu Perbaikan', label: 'Perlu Perbaikan / Barang Rusak' },
    { value: 'Sedang Diservis', label: 'Sedang Diservis (Dikirim ke Teknisi)' },
    { value: 'Sudah Diganti', label: 'Sudah Diganti (Unit Pengganti Keluar, Stok Berkurang)' },
    { value: 'Selesai Diperbaiki', label: 'Selesai Diperbaiki (Barang Lama Kembali, Stok Bertambah)' },
    { value: 'Rusak Total', label: 'Rusak Total / Tidak Bisa Diperbaiki' }
];

watch(() => props.item, (newVal) => {
    if (newVal) {
        localForm.value = {
            status: newVal.status || '',
            tindakan_penyelesaian: newVal.tindakan_penyelesaian || '',
            jumlah_proses: Number(newVal.jumlah || 1)
        };

        isDropdownOpen.value = false;
    }
}, { immediate: true });

const isStatusLockedPermanently = computed(() => {
    return [
        'Selesai Diperbaiki',
        'Rusak Total',
        'Dikonfirmasi Hilang'
    ].includes(props.item?.status);
});

const getSelectedStatusLabel = computed(() => {
    const selected = statusOptions.find(opt => opt.value === localForm.value.status);
    return selected ? selected.label : '';
});

const toggleDropdown = () => {
    if (!isStatusLockedPermanently.value) {
        isDropdownOpen.value = !isDropdownOpen.value;
    }
};

const selectStatus = (value) => {
    localForm.value.status = value;
    isDropdownOpen.value = false;
};

const closeDropdown = (e) => {
    if (isDropdownOpen.value) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
});

const handleSave = () => {
    emit('save', {
        ...localForm.value,
        jumlah: Number(props.item?.jumlah || 1)
    });
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

const totalUnitLaporan = computed(() => {
    return Number(props.item?.jumlah || 1);
});

const showJumlahProsesInput = computed(() => {
    return totalUnitLaporan.value > 1 && !isStatusLockedPermanently.value;
});

const jumlahSisa = computed(() => {
    return Math.max(totalUnitLaporan.value - Number(localForm.value.jumlah_proses || 1), 0);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.fade-down-enter-active,
.fade-down-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

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

/* Utilitas CSS untuk Menyembunyikan Scrollbar Namun Tetap Bisa di-Scroll */
.hide-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}
</style>