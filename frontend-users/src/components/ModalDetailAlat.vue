<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-1000 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4 md:p-6">
                <!-- Overlay -->
                <div class="absolute inset-0 cursor-pointer" @click="$emit('close')"></div>

                <!-- Modal Box -->
                <div
                    class="modal-box relative z-10 w-full sm:max-w-4xl bg-white shadow-2xl ring-1 ring-slate-100 overflow-hidden flex flex-col rounded-t-3xl sm:rounded-3xl max-h-[94vh] sm:max-h-[90vh] lg:max-h-[82vh]">
                    <!-- Close Button -->
                    <button @click="$emit('close')"
                        class="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition-colors backdrop-blur-md cursor-pointer active:scale-95 shadow-sm border border-slate-100">
                        <XMarkIcon class="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <!-- Content -->
                    <div class="flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden custom-scrollbar">
                        <!-- Image Section -->
                        <div
                            class="lg:w-5/12 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-8 flex items-center justify-center shrink-0">
                            <div
                                class="w-full max-w-56 sm:max-w-xs md:max-w-sm aspect-square rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden group">
                                <img :src="getImageUrl(barang?.gambar)" :alt="barang?.nama_barang || 'Gambar barang'"
                                    loading="lazy" decoding="async"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </div>

                        <!-- Detail Section -->
                        <div class="lg:w-7/12 flex flex-col bg-white relative min-h-0">
                            <div class="p-5 md:p-8 flex-1 overflow-y-auto custom-scrollbar pr-12 md:pr-14 lg:pr-8">
                                <h1
                                    class="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-5 md:mb-6 pt-2 md:pt-0">
                                    {{ barang?.nama_barang || 'Detail Alat' }}
                                </h1>

                                <!-- Stock Card -->
                                <div
                                    class="bg-blue-50/50 p-4 md:p-5 rounded-xl border border-blue-100/50 w-fit pr-8 md:pr-10 mb-6 md:mb-8">
                                    <p
                                        class="text-[10px] font-black text-blue-500/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Stok
                                    </p>

                                    <p class="text-2xl md:text-3xl font-black"
                                        :class="(barang?.stok || 0) > 0 ? 'text-slate-800' : 'text-red-600'">
                                        {{ barang?.stok || 0 }}
                                        <span class="text-xs md:text-sm font-semibold text-slate-500">
                                            Unit
                                        </span>
                                    </p>
                                </div>

                                <!-- Description -->
                                <div class="mb-4">
                                    <h3
                                        class="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 md:pb-3 mb-3 md:mb-4">
                                        Spesifikasi Alat
                                    </h3>

                                    <p
                                        class="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
                                        {{ barang?.deskripsi || 'Belum ada detail spesifikasi yang ditambahkan.' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Desktop Action -->
                            <div
                                class="hidden lg:block p-6 md:p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md shrink-0">
                                <template v-if="(barang?.stok || 0) > 0">
                                    <button v-if="!isInCart" @click="$emit('add', barang)"
                                        class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer">
                                        Tambah ke Keranjang
                                    </button>

                                    <button v-else @click="$emit('remove', barang?.id)"
                                        class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-black rounded-xl border border-red-200 hover:bg-red-100 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer">
                                        Hapus dari Keranjang
                                    </button>
                                </template>

                                <button v-else disabled
                                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-400 font-black rounded-xl cursor-not-allowed text-base">
                                    Stok Barang Sedang Kosong
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Action -->
                    <div class="lg:hidden p-4 sm:p-5 border-t border-slate-100 bg-white/95 backdrop-blur-md shrink-0">
                        <template v-if="(barang?.stok || 0) > 0">
                            <button v-if="!isInCart" @click="$emit('add', barang)"
                                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 text-sm cursor-pointer">
                                Tambah ke Keranjang
                            </button>

                            <button v-else @click="$emit('remove', barang?.id)"
                                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 font-black rounded-xl border border-red-200 hover:bg-red-100 hover:-translate-y-0.5 transition-all active:scale-95 text-sm cursor-pointer">
                                Hapus dari Keranjang
                            </button>
                        </template>

                        <button v-else disabled
                            class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-400 font-black rounded-xl cursor-not-allowed text-sm">
                            Stok Alat Sedang Kosong
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';

defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    barang: {
        type: Object,
        default: () => ({})
    },
    isInCart: {
        type: Boolean,
        default: false
    }
});

defineEmits(['close', 'add', 'remove']);

const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    }

    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    return `http://localhost:3000${imagePath}`;
};
</script>

<style scoped>
.custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Animasi Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .modal-box {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-box {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
}
</style>