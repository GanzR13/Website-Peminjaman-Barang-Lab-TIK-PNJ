<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-3xl" paddingClass="p-6 md:p-8" @close="$emit('close')">
        <div class="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
            <div>
                <h2 class="text-xl font-black text-slate-900">Formulir Peminjaman</h2>
                <p class="text-slate-500 text-xs font-medium mt-1">Lengkapi data untuk permohonan alat lab.</p>
            </div>
        </div>

        <form @submit.prevent="submitPeminjaman" id="checkout-form"
            class="space-y-6 lg:max-h-[65vh] lg:overflow-y-auto custom-scrollbar pr-2">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kategori
                        <span class="text-red-500">*</span></label>
                    <select v-model="formCheckout.kategori_kebutuhan" required @change="resetKhusus"
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer">
                        <option value="Harian">Harian (Praktikum Reguler)</option>
                        <option v-if="isMahasiswa" value="Khusus">Khusus (PBL/Skripsi/Organisasi)</option>
                    </select>
                    <p v-if="!isMahasiswa" class="text-[11px] text-amber-600 font-semibold mt-1 ml-1">
                        Peminjaman Khusus hanya tersedia untuk mahasiswa.
                    </p>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tujuan
                        / Judul Kegiatan <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tujuan_peminjaman" type="text" required
                        placeholder="Cth: Praktikum IoT / Lomba Robotik"
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 hover:bg-white focus:bg-white transition-all" />
                </div>
            </div>

            <!-- BAGIAN KHUSUS -->
            <div v-if="formCheckout.kategori_kebutuhan === 'Khusus'"
                class="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-5">
                <div class="flex items-center gap-2 mb-2 border-b border-blue-100 pb-3">
                    <DocumentTextIcon class="w-5 h-5 text-blue-600" />
                    <p class="text-sm font-black text-blue-800">Detail Peminjaman Khusus</p>
                </div>

                <!-- Jenis Kegiatan -->
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                        Jenis Kegiatan <span class="text-red-500">*</span>
                    </label>
                    <select v-model="formCheckout.jenis_khusus" required @change="handleJenisKhususChange"
                        class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium text-slate-800 bg-white cursor-pointer">
                        <option value="" disabled>-- Pilih Jenis --</option>
                        <option value="PBL">Project Based Learning (PBL)</option>
                        <option value="Skripsi">Tugas Akhir / Skripsi</option>
                        <option value="Organisasi">Kegiatan Organisasi / Lomba</option>
                    </select>
                </div>

                <!-- Dosen PJ + NIP -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                            Dosen Penanggung Jawab <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formCheckout.dosen_penanggung_jawab" type="text" required
                            placeholder="Nama Dosen Pembimbing"
                            class="w-full px-4 py-3 border border-blue-200 rounded-xl outline-none text-sm font-medium bg-white" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                            NIP Dosen Penanggung Jawab <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formCheckout.nip_dosen_pj" type="text" required
                            placeholder="Cth: 199123456789056789"
                            class="w-full px-4 py-3 border border-blue-200 rounded-xl outline-none text-sm font-medium bg-white" />
                    </div>
                </div>

                <!-- Input spesifik untuk Organisasi -->
                <div v-if="formCheckout.jenis_khusus === 'Organisasi'"
                    class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                            Nama Acara <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formCheckout.nama_acara" type="text" required
                            placeholder="Cth: Kontes Robot Indonesia"
                            class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                            Penyelenggara <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formCheckout.organisasi_penyelenggara" type="text" required
                            placeholder="Cth: BEM Teknik / Puspresnas"
                            class="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-sm bg-slate-50" />
                    </div>
                </div>

                <!-- Data Peminjam (Otomatis) -->
                <div class="pt-4 border-t border-blue-100 space-y-4">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Peminjam (Otomatis)
                    </p>

                    <!-- Nama + NIM -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                Nama Lengkap
                            </label>
                            <input v-model="formCheckout.nama_mahasiswa" type="text" readonly
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                NIM / Identitas
                            </label>
                            <input v-model="formCheckout.nim_mahasiswa" type="text" readonly
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed" />
                        </div>
                    </div>

                    <!-- Prodi + Angkatan + Kelas -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                Program Studi
                            </label>
                            <input v-model="formCheckout.prodi_mahasiswa" type="text" readonly
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                Angkatan
                            </label>
                            <input v-model="formCheckout.angkatan_mahasiswa" type="text" readonly
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                Kelas
                            </label>
                            <input v-model="formCheckout.kelas_mahasiswa" type="text" readonly
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- BAGIAN TANGGAL PINJAM -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tgl
                        Ambil Alat <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tanggal_pinjam" type="date" required
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer" />
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tgl
                        Kembali Alat <span class="text-red-500">*</span></label>
                    <input v-model="formCheckout.tanggal_kembali" type="date" required
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition-all cursor-pointer" />
                </div>
            </div>

            <div v-if="formCheckout.kategori_kebutuhan === 'Harian'">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Dosen
                    Penanggung Jawab / Pengampu (Opsional)</label>
                <input v-model="formCheckout.dosen_penanggung_jawab" type="text" placeholder="Nama Dosen Praktikum"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-medium bg-slate-50 hover:bg-white focus:bg-white transition-all" />
            </div>

            <div class="pt-6 border-t border-slate-100 flex gap-3 mt-4">
                <button type="button" @click="$emit('back')"
                    class="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors cursor-pointer">
                    Kembali
                </button>
                <button type="submit" :disabled="isSubmitting"
                    class="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-base">
                    {{ isSubmitting ? 'Mengirim...' : 'Kirim Permohonan Peminjaman' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import BaseModal from './BaseModal.vue';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    isOpen: Boolean,
    cart: Array
});

const emit = defineEmits(['close', 'back', 'success']);
const { showAlert } = useAlert();

const isSubmitting = ref(false);

const isMahasiswa = computed(() => !!formCheckout.value._isMahasiswa);

const defaultForm = {
    kategori_kebutuhan: 'Harian',
    jenis_khusus: '',
    tujuan_peminjaman: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    nama_acara: '',
    organisasi_penyelenggara: '',
    dosen_penanggung_jawab: '',
    nama_mahasiswa: '',
    nim_mahasiswa: '',
    email_mahasiswa: '',
    telepon_mahasiswa: '',
    prodi_mahasiswa: '',
    angkatan_mahasiswa: '',
    kelas_mahasiswa: '',
    nip_dosen_pj: '',
    _isMahasiswa: false
};
const formCheckout = ref({ ...defaultForm });

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        const userStr = localStorage.getItem('user');
        const currentUser = userStr ? JSON.parse(userStr) : {};

        const isMahasiswaUser = !!currentUser.nim;
        formCheckout.value._isMahasiswa = isMahasiswaUser;

        formCheckout.value.nama_mahasiswa = currentUser.nama || '-';
        formCheckout.value.nim_mahasiswa = currentUser.identitas || currentUser.nim || currentUser.nip || '-';
        formCheckout.value.email_mahasiswa = currentUser.email || '';
        formCheckout.value.telepon_mahasiswa = currentUser.no_telepon || '';

        formCheckout.value.prodi_mahasiswa = currentUser.prodi || '-';
        formCheckout.value.angkatan_mahasiswa = currentUser.angkatan || '-';
        formCheckout.value.kelas_mahasiswa = currentUser.kelas || '-';

        if (!isMahasiswaUser) {
            formCheckout.value.kategori_kebutuhan = 'Harian';
        }
    }
});


const resetKhusus = () => {
    if (formCheckout.value.kategori_kebutuhan === 'Harian') {
        formCheckout.value.jenis_khusus = '';
        formCheckout.value.nama_acara = '';
        formCheckout.value.organisasi_penyelenggara = '';
    }
};

// Perbaikan: Mereset nama_acara ketika jenis_khusus pindah ke Skripsi/PBL
const handleJenisKhususChange = () => {
    if (formCheckout.value.jenis_khusus !== 'Organisasi') {
        formCheckout.value.nama_acara = '';
        formCheckout.value.organisasi_penyelenggara = '';
    }
};

const submitPeminjaman = async () => {
    isSubmitting.value = true;
    try {
        // PERBAIKAN UTAMA: Membersihkan Data (Sanitizing)
        // Kita ubah string kosong "" menjadi null agar database tidak error
        const payload = {
            kategori_kebutuhan: formCheckout.value.kategori_kebutuhan,
            tujuan_peminjaman: formCheckout.value.tujuan_peminjaman,
            tanggal_pinjam: formCheckout.value.tanggal_pinjam,
            tanggal_kembali: formCheckout.value.tanggal_kembali,

            // Aturan ketat, jika Harian maka sisanya null
            jenis_khusus: formCheckout.value.kategori_kebutuhan === 'Khusus' ? formCheckout.value.jenis_khusus : null,
            dosen_penanggung_jawab: formCheckout.value.dosen_penanggung_jawab || null,
            nip_dosen_pj: formCheckout.value.nip_dosen_pj || null,

            // Aturan ketat, nama_acara hanya dikirim jika jenisnya Organisasi
            nama_acara: formCheckout.value.jenis_khusus === 'Organisasi' ? formCheckout.value.nama_acara : null,
            organisasi_penyelenggara: formCheckout.value.jenis_khusus === 'Organisasi' ? formCheckout.value.organisasi_penyelenggara : null,

            keranjang_barang: props.cart.map(item => ({
                barang_id: item.id,
                jumlah: item.jumlah
            }))
        };

        const response = await api.post('/user/peminjaman/checkout', payload);
        showAlert(response.data.message, 'success');

        formCheckout.value = { ...defaultForm };
        emit('success');

    } catch (error) {
        console.error("Error Checkout Payload:", error.response?.data);
        showAlert(error.response?.data?.message || 'Gagal mengirim permohonan', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>