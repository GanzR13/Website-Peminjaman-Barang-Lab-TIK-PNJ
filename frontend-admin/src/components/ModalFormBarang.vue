<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-xl" paddingClass="p-8 md:p-10" @close="closeModal">
        <div class="mb-8">
            <h2 class="text-2xl font-black text-slate-900">{{ isEditMode ? 'Edit Barang' : 'Tambah Barang Baru' }}</h2>
            <p class="text-slate-500 text-sm font-medium mt-1">Edit data di bawah dengan data yang valid.</p>
        </div>

        <form @submit.prevent="submitData" class="space-y-6">
            <div class="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 border-dashed hover:border-blue-300 transition-colors">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Foto / Gambar Barang</label>
                <div class="flex items-center gap-5">
                    <div class="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                        <img :src="form.gambarPreview || 'https://placehold.co/150x150/f8fafc/94a3b8?text=Upload'" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <input type="file" @change="onFileChange" accept="image/jpeg, image/png, image/webp" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors outline-none" />
                        <p class="text-[10px] text-slate-400 font-medium mt-2">* Format jpg/png/webp, Maks. 5 MB. (Otomatis dioptimasi)</p>
                    </div>
                </div>
            </div>

            <div v-if="isEditMode" class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-100/50 border border-slate-200 rounded-xl">
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ID Barang (UUID)</label>
                    <input v-model="form.id" type="text" readonly class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-500 bg-slate-100/50 cursor-not-allowed select-all focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">URL Cloudinary</label>
                    <input v-model="form.gambar" type="text" readonly class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-500 bg-slate-100/50 cursor-not-allowed select-all focus:ring-2 focus:ring-blue-100" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Nama Barang <span class="text-red-500">*</span></label>
                    <input v-model="form.nama_barang" type="text" required placeholder="Contoh: Oscilloscope Rigol" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-colors" />
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jumlah Stok Fisik <span class="text-red-500">*</span></label>
                    <input v-model.number="form.stok" type="number" min="0" required placeholder="0" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-colors" />
                </div>
            </div>

            <div>
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Deskripsi & Spesifikasi</label>
                <textarea v-model="form.deskripsi" rows="3" placeholder="Tulis spesifikasi singkat barang di sini..." class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white leading-relaxed transition-colors"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                <button type="button" @click="closeModal" class="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" class="px-8 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer">
                    {{ isEditMode ? 'Simpan Perubahan' : 'Upload Barang Baru' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import { ref, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';

const props = defineProps({ isOpen: Boolean, isEditMode: Boolean, dataEdit: Object });
const emit = defineEmits(['close', 'refresh-data']);
const { showAlert } = useAlert();

// Tambahkan kembali properti 'gambar' di default form
const defaultForm = { id: null, nama_barang: '', stok: 0, deskripsi: '', gambar: '', gambarPreview: null, fileUpload: null };
const form = ref({ ...defaultForm });

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Not+Found';
    return imagePath;
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        if (props.isEditMode && props.dataEdit) {
            form.value = {
                id: props.dataEdit.id,
                nama_barang: props.dataEdit.nama_barang,
                stok: props.dataEdit.stok,
                deskripsi: props.dataEdit.deskripsi,
                gambar: props.dataEdit.gambar, // Ambil URL utuh dari database
                gambarPreview: getImageUrl(props.dataEdit.gambar),
                fileUpload: null
            };
        } else {
            form.value = { ...defaultForm };
        }
    }
});

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.value.fileUpload = file;
        form.value.gambarPreview = URL.createObjectURL(file);
    }
};

const closeModal = () => emit('close');

const submitData = async () => {
    const formData = new FormData();
    formData.append('nama_barang', form.value.nama_barang);
    formData.append('stok', form.value.stok);
    formData.append('deskripsi', form.value.deskripsi || '');
    if (form.value.fileUpload) formData.append('gambar', form.value.fileUpload);

    try {
        if (props.isEditMode) {
            await api.put(`/barang/${form.value.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            showAlert('Data barang berhasil diperbarui!', 'success');
        } else {
            await api.post('/barang', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            showAlert('Barang baru berhasil ditambahkan!', 'success');
        }
        emit('refresh-data');
        closeModal();
    } catch (error) {
        showAlert(`Gagal menyimpan: ${error.response?.data?.message || 'Terjadi kesalahan'}`, 'error');
    }
};
</script>