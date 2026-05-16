<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-4xl" paddingClass="p-0" @close="$emit('close')">
        
        <!-- Wrapper Utama: Mengunci tinggi maksimal (di semua layar) & menyembunyikan scrollbar terluar -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 w-full max-h-[95vh] lg:max-h-[70vh] overflow-y-auto lg:overflow-hidden custom-scrollbar">
            
            <!-- KOLOM KIRI: GAMBAR (Statis / Tidak Ikut Scroll di Desktop) -->
            <div class="lg:col-span-5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-8 flex flex-col items-center justify-start relative h-full">
                
                <!-- Wrapper gambar dengan sticky agar selalu mengambang di atas saat ada aktivitas -->
                <div class="w-full max-w-sm aspect-square rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden relative group lg:sticky lg:top-4 lg:mt-4">
                    <img 
                        :src="getImageUrl(barang?.gambar)" 
                        :alt="barang?.nama_barang" 
                        loading="lazy"
                        decoding="async"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                </div>
            </div>
            
            <!-- KOLOM KANAN: KONTEN (Scrollable Independen) -->
            <div class="lg:col-span-7 flex flex-col relative bg-white lg:max-h-[70vh] lg:overflow-y-auto custom-scrollbar">
                
                <!-- Area Konten -->
                <div class="p-6 md:p-8 flex-1">
                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6">{{ barang?.nama_barang }}</h1>
                    
                    <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 w-fit pr-10 mb-8">
                        <p class="text-[10px] font-black text-blue-500/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            Stok
                        </p>
                        <p class="text-3xl font-black" :class="(barang?.stok || 0) > 0 ? 'text-slate-800' : 'text-red-600'">
                            {{ barang?.stok || 0 }} <span class="text-sm font-semibold text-slate-500">Unit</span>
                        </p>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Spesifikasi Alat</h3>
                        <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                            {{ barang?.deskripsi || 'Belum ada detail spesifikasi yang ditambahkan.' }}
                        </p>
                    </div>
                </div>

                <!-- Area Tombol Aksi (Sticky di bawah) -->
                <div class="p-6 md:p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md sticky bottom-0 z-10 shrink-0">
                    <template v-if="(barang?.stok || 0) > 0">
                        <button v-if="!isInCart" @click="$emit('add', barang)"
                            class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer">
                            Tambah ke Keranjang
                        </button>
                        <button v-else @click="$emit('remove', barang?.id)"
                            class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl border border-red-200 hover:bg-red-100 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer">
                            Hapus dari Keranjang
                        </button>
                    </template>
                    <button v-else disabled class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl cursor-not-allowed text-base">
                        Stok Alat Sedang Kosong
                    </button>
                </div>

            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
    isOpen: Boolean,
    barang: Object,
    isInCart: Boolean
});

defineEmits(['close', 'add', 'remove']);

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
};
</script>

<style scoped>
/* Menyembunyikan scrollbar tapi tetap bisa di-scroll di browser */
.custom-scrollbar {
    -ms-overflow-style: none;  /* Untuk Internet Explorer dan Edge */
    scrollbar-width: none;  /* Untuk Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
    display: none; /* Untuk Chrome, Safari, dan Opera */
}
</style>