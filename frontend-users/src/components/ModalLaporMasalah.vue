<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-4xl" paddingClass="p-0" @close="closeModal">
        
        <form @submit.prevent="submitLapor" class="grid grid-cols-1 lg:grid-cols-12 gap-0 w-full max-h-[95vh] lg:max-h-[70vh] overflow-y-auto lg:overflow-hidden custom-scrollbar bg-white">
            
            <div class="lg:col-span-5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-8 flex flex-col items-center justify-start relative h-full">
                
                <div class="w-full max-w-sm aspect-square rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden relative group lg:sticky lg:top-4 lg:mt-4 flex items-center justify-center">
                    <img v-if="selectedBarangImage"
                        :src="getImageUrl(selectedBarangImage)" 
                        alt="Preview Barang" 
                        loading="lazy"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div v-else class="flex flex-col items-center gap-3 text-slate-300">
                        <PhotoIcon class="w-16 h-16" />
                        <p class="text-sm font-bold">Pilih Barang Dulu</p>
                    </div>
                </div>
                
                <div class="mt-6 text-center w-full max-w-sm">
                    <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Informasi Laporan</h4>
                    <p class="text-xs font-medium text-slate-500 leading-relaxed">
                        Pastikan data laporan kerusakan atau kehilangan sesuai dengan kejadian sebenarnya. Pemalsuan laporan dapat dikenakan sanksi tata tertib laboratorium.
                    </p>
                </div>
            </div>
            
            <div class="lg:col-span-7 flex flex-col relative bg-white lg:max-h-[70vh] lg:overflow-y-auto custom-scrollbar">
                
                <div class="p-6 md:p-8 pb-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 flex justify-between items-start shrink-0">
                    <div>
                        <h3 class="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                            <ExclamationTriangleIcon class="w-7 h-7 text-orange-500 shrink-0" />
                            Lapor Masalah Barang
                        </h3>
                        <p class="text-xs font-medium text-slate-500 mt-1">Transaksi #{{ transaksi?.antrian || transaksi?.id }}</p>
                    </div>
                    <button type="button" @click="closeModal" class="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer shrink-0">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>
                
                <div class="p-6 md:p-8 flex-1 space-y-6">
                    
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Pilih Barang <span class="text-red-500">*</span></label>
                        <select v-model="formLapor.barang_id" required class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-medium bg-slate-50 focus:bg-white cursor-pointer transition-all">
                            <option value="" disabled>-- Pilih Barang Bermasalah --</option>
                            <option v-for="detail in transaksi?.detail_barang" :key="detail.barang.id" :value="detail.barang.id">
                                {{ detail.barang.nama_barang }} (Pinjam: {{ detail.jumlah_pinjam }} Unit)
                            </option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jenis Laporan <span class="text-red-500">*</span></label>
                            <select v-model="formLapor.jenis_laporan" required class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-medium bg-slate-50 cursor-pointer transition-all">
                                <option value="Kerusakan">Kerusakan Fisik</option>
                                <option value="Kehilangan">Kehilangan Total</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jumlah Unit <span class="text-red-500">*</span></label>
                            <input v-model="formLapor.jumlah" type="number" min="1" :max="selectedBarangMaxQty" required class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-medium bg-slate-50 transition-all" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tanggal Kejadian <span class="text-red-500">*</span></label>
                            <input v-model="formLapor.tanggal_kejadian" type="date" required class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-medium bg-slate-50 cursor-pointer transition-all" />
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Bukti Foto <span class="text-red-500">*</span></label>
                            <input type="file" @change="handleFileChange" accept="image/*" required class="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer transition-all" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kronologi Kejadian <span class="text-red-500">*</span></label>
                        <textarea v-model="formLapor.deskripsi" rows="4" required placeholder="Contoh: Saat digunakan untuk praktikum IoT, pin ESP32 patah karena jatuh dari meja..." class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-medium bg-slate-50 resize-none transition-all"></textarea>
                    </div>

                </div>

                <div class="p-6 md:p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md sticky bottom-0 z-10 shrink-0 flex gap-4">
                    <button type="button" @click="closeModal" class="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors cursor-pointer text-base shrink-0">
                        Batal
                    </button>
                    <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer disabled:opacity-50">
                        <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {{ isSubmitting ? 'Mengunggah Laporan...' : 'Kirim Laporan' }}
                    </button>
                </div>

            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { format } from 'date-fns';
import { ExclamationTriangleIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline';
import BaseModal from './BaseModal.vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    transaksi: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'success']);
const { showAlert } = useAlert();

const isSubmitting = ref(false);
const formLapor = ref({
    barang_id: '',
    jenis_laporan: 'Kerusakan',
    jumlah: 1,
    tanggal_kejadian: format(new Date(), 'yyyy-MM-dd'),
    deskripsi: '',
    foto_bukti: null
});

// Reset form setiap kali modal dibuka
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.transaksi) {
        formLapor.value = {
            barang_id: props.transaksi.detail_barang.length > 0 ? props.transaksi.detail_barang[0].barang.id : '',
            jenis_laporan: 'Kerusakan',
            jumlah: 1,
            tanggal_kejadian: format(new Date(), 'yyyy-MM-dd'),
            deskripsi: '',
            foto_bukti: null
        };
    }
});

// Computed Property untuk mengambil gambar barang yang di-select
const selectedBarangImage = computed(() => {
    if (!props.transaksi || !formLapor.value.barang_id) return null;
    const detail = props.transaksi.detail_barang.find(d => d.barang.id === formLapor.value.barang_id);
    return detail ? detail.barang.gambar : null;
});

// Computed Property untuk mencegah input jumlah melewati total pinjam
const selectedBarangMaxQty = computed(() => {
    if (!props.transaksi || !formLapor.value.barang_id) return 1;
    const detail = props.transaksi.detail_barang.find(d => d.barang.id === formLapor.value.barang_id);
    return detail ? detail.jumlah_pinjam : 1;
});

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showAlert('Ukuran foto maksimal 5MB.', 'warning');
            event.target.value = '';
            formLapor.value.foto_bukti = null;
            return;
        }
        formLapor.value.foto_bukti = file;
    }
};

const submitLapor = async () => {
    isSubmitting.value = true;
    try {
        const formData = new FormData();
        formData.append('peminjaman_id', props.transaksi.id);
        formData.append('barang_id', formLapor.value.barang_id);
        formData.append('jenis_laporan', formLapor.value.jenis_laporan);
        formData.append('jumlah', formLapor.value.jumlah);
        formData.append('tanggal_kejadian', formLapor.value.tanggal_kejadian);
        formData.append('deskripsi', formLapor.value.deskripsi);
        
        if (formLapor.value.foto_bukti) {
            formData.append('foto_bukti', formLapor.value.foto_bukti);
        }

        const response = await api.post('/user/peminjaman/laporan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        showAlert(response.data.message || 'Laporan berhasil dikirim!', 'success');
        emit('success');
        emit('close');
        
    } catch (error) {
        console.error("Lapor error:", error);
        const msg = error.response?.data?.message || 'Gagal mengirim laporan';
        showAlert(msg, 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
/* Menyembunyikan scrollbar tapi tetap bisa di-scroll di browser */
.custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>