<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
                @click.self="closeModal">

                <div
                    class="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-4xl p-0 overflow-hidden relative flex flex-col max-h-[92vh] sm:max-h-[85vh] lg:max-h-[75vh]">

                    <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div class="w-10 h-1 bg-slate-200 rounded-full"></div>
                    </div>

                    <button @click="closeModal"
                        class="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors z-50 shadow-sm cursor-pointer active:scale-95">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="flex flex-col lg:grid lg:grid-cols-12 w-full flex-1 overflow-hidden">

                        <div
                            class="lg:col-span-5 bg-slate-50 lg:border-r border-slate-100 flex flex-col items-center justify-start lg:overflow-y-auto custom-scrollbar">

                            <div class="w-full lg:hidden px-5 pt-3 pb-4">
                                <div
                                    class="w-full h-52 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                                    <img :src="getImageUrl(data?.gambar)" :alt="data?.nama_barang" loading="lazy"
                                        class="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div class="hidden lg:block w-full p-6 md:p-8">
                                <div
                                    class="w-full aspect-square rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden group lg:sticky lg:top-4">
                                    <img :src="getImageUrl(data?.gambar)" :alt="data?.nama_barang" loading="lazy"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-7 flex flex-col bg-white overflow-y-auto custom-scrollbar flex-1">

                            <div class="p-5 md:p-8 flex-1">

                                <h1 class="text-xl md:text-3xl font-black text-slate-900 leading-tight pr-8 mb-1">
                                    {{ data?.nama_barang }}

                                </h1>
                                <span
                                    class="inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">
                                    ID: {{ data?.id }}
                                </span>

                                <div
                                    class="bg-blue-50/50 p-4 md:p-5 rounded-2xl border border-blue-100/50 w-fit pr-10 mb-6">
                                    <p class="text-[11px] font-bold text-blue-500/80 uppercase tracking-widest mb-1">
                                        Stok</p>
                                    <p class="text-2xl md:text-3xl font-black flex items-baseline gap-2"
                                        :class="(data?.stok || 0) > 0 ? 'text-slate-800' : 'text-red-600'">
                                        {{ data?.stok || 0 }}
                                        <span class="text-sm font-semibold text-slate-500">Unit Tersedia</span>
                                    </p>
                                </div>

                                <div>
                                    <h3
                                        class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                                        Deskripsi & Spesifikasi
                                    </h3>
                                    <p
                                        class="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                                        {{ data?.deskripsi || 'Belum ada deskripsi yang ditulis untuk barang ini.' }}
                                    </p>
                                </div>
                            </div>

                            <div class="p-4 md:p-6 border-t border-slate-100 bg-white shrink-0">
                                <button @click="editBarang"
                                    class="w-full flex items-center justify-center gap-2 px-5 py-3 md:py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95 text-sm cursor-pointer">
                                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Data Barang Ini
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({ isOpen: Boolean, data: Object });
const emit = defineEmits(['close', 'edit']);

const closeModal = () => emit('close');

const editBarang = () => {
    emit('edit', props.data);
    closeModal();
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=No+Image';
    return imagePath;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

@media (min-width: 640px) {

    .fade-enter-from,
    .fade-leave-to {
        transform: translateY(-10px) scale(0.98);
    }
}

.custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>