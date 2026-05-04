<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-2xl" paddingClass="p-6 md:p-8" @close="$emit('close')">
        <div class="mb-6 border-b border-slate-100 pb-4">
            <h2 class="text-xl font-black text-slate-900">Formulir Peminjaman</h2>
            <p class="text-slate-500 text-xs font-medium mt-1">Lengkapi data untuk permohonan alat lab.</p>
        </div>

        <form @submit.prevent="submitPeminjaman" id="checkout-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kategori <span class="text-red-500">*</span></label>
                    <select v-model="formCheckout.kategori_kebutuhan" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer">
                        <option value="Akademik">Akademik (Tugas/Skripsi)</option>
                        <option value="Non-Akademik">Non-Akademik (Lomba/UKM)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tujuan / Judul Skripsi <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tujuan_peminjaman" type="text" required placeholder="Cth: Skripsi IoT / Tugas WDC" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-all" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tgl Ambil <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tanggal_pinjam" type="date" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer" />
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tgl Kembali <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tanggal_kembali" type="date" required class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer" />
                </div>
            </div>

            <div v-if="formCheckout.kategori_kebutuhan === 'Non-Akademik'" class="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <p class="text-xs font-bold text-blue-700">Data Tambahan Non-Akademik</p>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Nama Acara/Lomba</label>
                    <input v-model="formCheckout.nama_acara" type="text" class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-medium bg-white" />
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Organisasi Penyelenggara</label>
                    <input v-model="formCheckout.organisasi_penyelenggara" type="text" class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-medium bg-white" />
                </div>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Dosen Penanggung Jawab (Opsional)</label>
                <input v-model="formCheckout.dosen_penanggung_jawab" type="text" placeholder="Nama Dosen Pembimbing" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-medium bg-slate-50 hover:bg-white focus:bg-white transition-all" />
            </div>

            <div class="pt-6 border-t border-slate-100 flex gap-3">
                <button type="button" @click="$emit('back')" class="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                    Kembali
                </button>
                <button type="submit" :disabled="isSubmitting"
                    class="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-base">
                    {{ isSubmitting ? 'Mengirim...' : 'Kirim Permohonan' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import BaseModal from './BaseModal.vue';

const props = defineProps({
    isOpen: Boolean,
    cart: Array
});

const emit = defineEmits(['close', 'back', 'success']);
const { showAlert } = useAlert();

const isSubmitting = ref(false);
const defaultForm = {
    kategori_kebutuhan: 'Akademik', tujuan_peminjaman: '', tanggal_pinjam: '', 
    tanggal_kembali: '', nama_acara: '', organisasi_penyelenggara: '', dosen_penanggung_jawab: ''
};
const formCheckout = ref({ ...defaultForm });

const submitPeminjaman = async () => {
    isSubmitting.value = true;
    try {
        const payload = {
            ...formCheckout.value,
            keranjang_barang: props.cart.map(item => ({
                barang_id: item.id,
                jumlah: item.jumlah
            }))
        };

        const response = await api.post('/user/peminjaman/checkout', payload);
        showAlert(response.data.message, 'success');
        
        formCheckout.value = { ...defaultForm }; // Reset form
        emit('success'); // Kirim sinyal sukses ke CatalogBarang.vue

    } catch (error) {
        showAlert(error.response?.data?.message || 'Gagal mengirim permohonan', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>