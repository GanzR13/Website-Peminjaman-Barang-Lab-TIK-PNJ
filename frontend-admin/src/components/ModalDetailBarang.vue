<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-4xl" paddingClass="p-0" @close="closeModal">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-100">
            <div class="lg:col-span-5 bg-slate-50/50 border-r border-slate-100 p-8 md:p-12 flex flex-col items-center justify-center min-h-75">
                <div class="w-full aspect-square rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden relative group">
                    <img :src="getImageUrl(data?.gambar)" :alt="data?.nama_barang" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
            </div>

            <div class="lg:col-span-7 p-8 md:p-12 flex flex-col">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{{ data?.nama_barang }}</h1>
                </div>

                <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 w-fit pr-12 mb-8">
                    <p class="text-[11px] font-bold text-blue-500/80 uppercase tracking-widest mb-1.5">Stok Gudang</p>
                    <p class="text-3xl font-black flex items-baseline gap-2" :class="(data?.stok || 0) > 0 ? 'text-slate-800' : 'text-red-600'">
                        {{ data?.stok || 0 }} <span class="text-sm font-semibold text-slate-500">Unit Tersedia</span>
                    </p>
                </div>

                <div class="mb-8">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Deskripsi & Spesifikasi</h3>
                    <p class="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">{{ data?.deskripsi || 'Belum ada deskripsi yang ditulis untuk barang ini.' }}</p>
                </div>

                <div class="mt-auto pt-6 border-t border-slate-100">
                    <button @click="editBarang" class="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95 text-sm cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Edit Data Barang Ini
                    </button>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

const props = defineProps({ isOpen: Boolean, data: Object });
const emit = defineEmits(['close', 'edit']);

const closeModal = () => emit('close');

const editBarang = () => {
    emit('edit', props.data);
    closeModal(); // Otomatis menutup modal detail ini saat modal Edit terbuka
};

// --- FUNGSI GET IMAGE YANG SUDAH DIBERSIHKAN UNTUK CLOUDINARY ---
const getImageUrl = (imagePath) => {
    // Jika data gambar kosong, kembalikan gambar placeholder abu-abu
    if (!imagePath) {
        return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    }
    
    // Kembalikan URL utuh dari Cloudinary yang ada di database
    return imagePath;
};
</script>