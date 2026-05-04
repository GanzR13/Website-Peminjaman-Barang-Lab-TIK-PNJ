<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-4xl" paddingClass="p-0" @close="$emit('close')">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-100">
            <div class="bg-slate-50/50 p-8 md:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                <div class="w-full aspect-square rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden relative">
                    <img :src="getImageUrl(barang.gambar)" :alt="barang.nama_barang" class="w-full h-full object-cover" />
                </div>
            </div>
            
            <div class="p-8 md:p-12 flex flex-col">
                <h1 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6">{{ barang.nama_barang }}</h1>
                
                <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 w-fit pr-10 mb-8">
                    <p class="text-[10px] font-black text-blue-500/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        Stok Gudang
                    </p>
                    <p class="text-3xl font-black" :class="barang.stok > 0 ? 'text-slate-800' : 'text-red-600'">
                        {{ barang.stok }} <span class="text-sm font-semibold text-slate-500">Unit</span>
                    </p>
                </div>

                <div class="mb-8">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Spesifikasi Alat</h3>
                    <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">{{ barang.deskripsi || 'Belum ada detail spesifikasi yang ditambahkan.' }}</p>
                </div>
            </div>
        </div>

        <div class="p-6 border-t border-slate-100 bg-white shrink-0">
            <template v-if="barang.stok > 0">
                <button v-if="!isInCart" @click="$emit('add', barang)"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 text-base">
                    Tambah ke Keranjang
                </button>
                <button v-else @click="$emit('remove', barang.id)"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl border border-red-200 hover:bg-red-100 hover:-translate-y-0.5 transition-all active:scale-95 text-base">
                    Hapus dari Keranjang
                </button>
            </template>
            <button v-else disabled class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl cursor-not-allowed text-base">
                Stok Alat Sedang Kosong
            </button>
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
    return `http://localhost:5000${imagePath}`;
};
</script>