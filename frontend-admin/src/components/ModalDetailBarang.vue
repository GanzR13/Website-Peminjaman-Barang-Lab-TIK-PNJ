<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="closeModal">
                
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden relative flex flex-col max-h-[95vh] lg:max-h-[70vh]">
                    
                    <button @click="closeModal" class="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors z-50 shadow-xs cursor-pointer active:scale-95" title="Tutup Modal">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 w-full h-full overflow-y-auto lg:overflow-hidden custom-scrollbar">
                        
                        <div class="lg:col-span-5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-8 flex flex-col items-center justify-start relative h-full">
                            
                            <div class="w-full max-w-sm aspect-square rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden relative group lg:sticky lg:top-4 lg:mt-4">
                                <img 
                                    :src="getImageUrl(data?.gambar)" 
                                    :alt="data?.nama_barang" 
                                    loading="lazy" 
                                    decoding="async"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                        </div>

                        <div class="lg:col-span-7 flex flex-col relative bg-white lg:max-h-[70vh] lg:overflow-y-auto custom-scrollbar">
                            
                            <div class="p-6 md:p-8 flex-1 mt-6 lg:mt-0">
                                <div class="mb-6">
                                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight pr-10">
                                        {{ data?.nama_barang }}
                                    </h1>
                                </div>

                                <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 w-fit pr-12 mb-8">
                                    <p class="text-[11px] font-bold text-blue-500/80 uppercase tracking-widest mb-1.5">Stok Gudang</p>
                                    <p class="text-3xl font-black flex items-baseline gap-2" :class="(data?.stok || 0) > 0 ? 'text-slate-800' : 'text-red-600'">
                                        {{ data?.stok || 0 }} <span class="text-sm font-semibold text-slate-500">Unit Tersedia</span>
                                    </p>
                                </div>

                                <div class="mb-4">
                                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Deskripsi & Spesifikasi</h3>
                                    <p class="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                                        {{ data?.deskripsi || 'Belum ada deskripsi yang ditulis untuk barang ini.' }}
                                    </p>
                                </div>
                            </div>

                            <div class="p-6 md:p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md sticky bottom-0 z-10 shrink-0">
                                <button @click="editBarang" class="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95 text-sm cursor-pointer">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
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
    closeModal(); // Otomatis menutup modal detail ini saat modal Edit terbuka
};

const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    }
    return imagePath;
};
</script>

<style scoped>
/* Transisi Fade untuk Modal Background & Box */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

/* Menyembunyikan scrollbar tapi tetap bisa di-scroll di browser */
.custom-scrollbar {
    -ms-overflow-style: none;  /* Untuk Internet Explorer dan Edge */
    scrollbar-width: none;  /* Untuk Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
    display: none; /* Untuk Chrome, Safari, dan Opera */
}
</style>