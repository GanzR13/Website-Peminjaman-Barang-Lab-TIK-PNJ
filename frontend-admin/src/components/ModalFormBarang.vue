<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
                @click.self="closeModal">

                <div
                    class="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-xl p-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[85vh]">

                    <form @submit.prevent="submitData" class="flex flex-col w-full h-full overflow-hidden">

                        <div
                            class="p-5 md:p-8 pb-4 border-b border-slate-100 bg-white shrink-0 flex items-center justify-between">
                            <div>
                                <h2 class="text-xl md:text-2xl font-black text-slate-900">
                                    {{ isEditMode ? 'Edit Barang' : 'Tambah Barang Baru' }}
                                </h2>
                                <p class="text-slate-500 text-xs md:text-sm font-medium mt-0.5 md:mt-1">
                                    Lengkapi data barang dengan benar.
                                </p>
                            </div>
                            <div class="w-1 h-1 sm:hidden">
                                <div
                                    class="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full">
                                </div>
                            </div>
                        </div>

                        <div class="p-5 md:p-8 overflow-y-auto custom-scrollbar space-y-5 bg-white flex-1">

                            <div
                                class="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 border-dashed hover:border-blue-300 transition-colors">
                                <label
                                    class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                    Foto / Gambar Barang
                                </label>
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                        <img :src="form.gambarPreview || 'https://placehold.co/150x150/f8fafc/94a3b8?text=Upload'"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <input type="file" @change="onFileChange"
                                            accept="image/jpeg, image/png, image/webp"
                                            class="block w-full text-xs md:text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors outline-none" />
                                        <p class="text-[10px] text-slate-400 font-medium mt-1.5">
                                            Format jpg/png/webp, Maks. 5 MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div v-if="isEditMode"
                                class="grid grid-cols-1 gap-3 p-4 bg-slate-100/50 border border-slate-200 rounded-xl">
                                <div>
                                    <label
                                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                        ID Barang (UUID)
                                    </label>
                                    <input v-model="form.id" type="text" readonly
                                        class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-500 bg-slate-100/50 cursor-not-allowed select-all" />
                                </div>
                                <div>
                                    <label
                                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                        URL Gambar
                                    </label>
                                    <input v-model="form.gambar" type="text" readonly
                                        class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-500 bg-slate-100/50 cursor-not-allowed select-all truncate" />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Nama Barang <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.nama_barang" type="text" required
                                    placeholder="Contoh: Oscilloscope Rigol"
                                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-colors" />
                            </div>

                            <div>
                                <label
                                    class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Jumlah Stok Fisik <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.stok" type="number" min="0" required placeholder="0"
                                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-colors" />
                            </div>

                            <div>
                                <label
                                    class="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Deskripsi & Spesifikasi
                                </label>
                                <textarea v-model="form.deskripsi" rows="4"
                                    placeholder="Tulis spesifikasi lengkap barang di sini..."
                                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white leading-relaxed transition-colors resize-none"></textarea>
                            </div>

                        </div>

                        <div class="p-4 md:p-6 bg-slate-50/80 border-t border-slate-100 shrink-0 flex gap-3">
                            <button type="button" @click="closeModal" :disabled="isLoading"
                                class="flex-1 sm:flex-none px-5 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                Batal
                            </button>

                            <button type="submit" :disabled="isLoading"
                                class="flex-1 px-6 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                <span v-if="isLoading" class="flex items-center justify-center gap-2">
                                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Memproses...
                                </span>
                                <span v-else>
                                    {{ isEditMode ? 'Simpan Perubahan' : 'Upload Barang Baru' }}
                                </span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';

const props = defineProps({ isOpen: Boolean, isEditMode: Boolean, dataEdit: Object });
const emit = defineEmits(['close', 'refresh-data']);
const { showAlert } = useAlert();

// STATE BARU: Untuk melacak status loading
const isLoading = ref(false);

const defaultForm = { id: null, nama_barang: '', stok: 0, deskripsi: '', gambar: '', gambarPreview: null, fileUpload: null };
const form = ref({ ...defaultForm });

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300/f8fafc/94a3b8?text=No+Image';
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
                gambar: props.dataEdit.gambar,
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
    // Cegah submit berulang jika sedang loading
    if (isLoading.value) return;

    isLoading.value = true; // Nyalakan loading

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
    } finally {
        // Matikan loading baik saat sukses maupun gagal
        isLoading.value = false;
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

@media (min-width: 640px) {

    .fade-enter-from,
    .fade-leave-to {
        transform: translateY(-10px) scale(0.95);
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