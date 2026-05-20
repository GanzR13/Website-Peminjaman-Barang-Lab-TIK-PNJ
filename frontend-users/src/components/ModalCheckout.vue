<template>
    <BaseModal :isOpen="isOpen" maxWidth="max-w-3xl" @close="$emit('close')">
        <div class="mb-6 border-b border-slate-100 pb-5">
            <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider mb-3">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                Form Peminjaman
            </div>

            <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Formulir Peminjaman Alat
            </h2>

            <p class="text-slate-500 text-sm font-medium mt-2 max-w-xl leading-relaxed">
                Lengkapi informasi peminjaman alat laboratorium dengan benar sebelum mengirim permohonan.
            </p>
        </div>

        <form
            @submit.prevent="submitPeminjaman"
            class="space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar pr-1 sm:pr-2"
        >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label class="label-form">
                        Kategori <span class="text-red-500">*</span>
                    </label>

                    <div class="relative" ref="kategoriDropdownRef">
                        <button
                            type="button"
                            @click.stop="toggleKategoriDropdown"
                            class="dropdown-button"
                        >
                            <div>
                                <p class="text-sm font-bold text-slate-800">
                                    {{ getKategoriLabel?.label }}
                                </p>
                                <p class="text-[11px] text-slate-500 font-medium">
                                    {{ getKategoriLabel?.desc }}
                                </p>
                            </div>

                            <svg
                                class="w-5 h-5 text-slate-400 transition-transform shrink-0"
                                :class="isKategoriOpen ? 'rotate-180' : ''"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <div v-if="isKategoriOpen" class="dropdown-menu" @click.stop>
                            <button
                                v-for="item in kategoriOptions"
                                :key="item.value"
                                type="button"
                                @click="pilihKategori(item.value)"
                                class="dropdown-item"
                                :class="formCheckout.kategori_kebutuhan === item.value ? 'bg-blue-50' : ''"
                            >
                                <div>
                                    <p class="text-sm font-black text-slate-800">
                                        {{ item.label }}
                                    </p>
                                    <p class="text-[11px] font-medium text-slate-500">
                                        {{ item.desc }}
                                    </p>
                                </div>

                                <span
                                    v-if="formCheckout.kategori_kebutuhan === item.value"
                                    class="w-2.5 h-2.5 rounded-full bg-blue-600"
                                ></span>
                            </button>
                        </div>
                    </div>

                    <p v-if="!isMahasiswa" class="text-[10px] md:text-[11px] text-amber-600 font-bold mt-1.5 ml-1">
                        Peminjaman Khusus hanya tersedia untuk mahasiswa.
                    </p>
                </div>

                <div>
                    <label class="label-form">
                        Tujuan / Judul Kegiatan <span class="text-red-500">*</span>
                    </label>

                    <input
                        v-model="formCheckout.tujuan_peminjaman"
                        type="text"
                        required
                        placeholder="Cth: Praktikum IoT / Lomba Robotik"
                        class="input-form"
                    />
                </div>
            </div>

            <div
                v-if="formCheckout.kategori_kebutuhan === 'Khusus'"
                class="section-card bg-blue-50/50 border-blue-100"
            >
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <DocumentTextIcon class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p class="text-sm font-black text-blue-800">
                            Detail Peminjaman Khusus
                        </p>
                        <p class="text-xs text-blue-500 font-medium">
                            Isi data tambahan untuk peminjaman khusus.
                        </p>
                    </div>
                </div>

                <div class="space-y-5">
                    <div>
                        <label class="label-form">
                            Jenis Kegiatan <span class="text-red-500">*</span>
                        </label>

                        <div class="relative" ref="jenisDropdownRef">
                            <button
                                type="button"
                                @click.stop="toggleJenisDropdown"
                                class="dropdown-button bg-white border-blue-200"
                            >
                                <div>
                                    <p class="text-sm font-bold text-slate-800">
                                        {{ getJenisKhususLabel?.label || 'Pilih Jenis Kegiatan' }}
                                    </p>
                                    <p class="text-[11px] text-slate-500 font-medium">
                                        {{ getJenisKhususLabel?.desc || 'Pilih sesuai kebutuhan peminjaman' }}
                                    </p>
                                </div>

                                <svg
                                    class="w-5 h-5 text-slate-400 transition-transform shrink-0"
                                    :class="isJenisOpen ? 'rotate-180' : ''"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <div v-if="isJenisOpen" class="dropdown-menu" @click.stop>
                                <button
                                    v-for="item in jenisKhususOptions"
                                    :key="item.value"
                                    type="button"
                                    @click="pilihJenisKhusus(item.value)"
                                    class="dropdown-item"
                                    :class="formCheckout.jenis_khusus === item.value ? 'bg-blue-50' : ''"
                                >
                                    <div>
                                        <p class="text-sm font-black text-slate-800">
                                            {{ item.label }}
                                        </p>
                                        <p class="text-[11px] font-medium text-slate-500">
                                            {{ item.desc }}
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="label-form">
                                Dosen Penanggung Jawab <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="formCheckout.dosen_penanggung_jawab"
                                type="text"
                                required
                                placeholder="Nama Dosen Pembimbing"
                                class="input-form bg-white"
                            />
                        </div>

                        <div>
                            <label class="label-form">
                                NIP Dosen PJ <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="formCheckout.nip_dosen_pj"
                                type="text"
                                required
                                placeholder="Cth: 199123456789056789"
                                class="input-form bg-white"
                            />
                        </div>
                    </div>

                    <div v-if="formCheckout.jenis_khusus === 'Organisasi'" class="section-card bg-white">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label class="label-form">
                                    Nama Acara <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="formCheckout.nama_acara"
                                    type="text"
                                    required
                                    placeholder="Cth: Kontes Robot Indonesia"
                                    class="input-form"
                                />
                            </div>

                            <div>
                                <label class="label-form">
                                    Penyelenggara <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="formCheckout.organisasi_penyelenggara"
                                    type="text"
                                    required
                                    placeholder="Cth: BEM Teknik / Puspresnas"
                                    class="input-form"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="section-card bg-white">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            Data Peminjam Otomatis
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label class="label-form">Nama Lengkap</label>
                                <input v-model="formCheckout.nama_mahasiswa" type="text" readonly class="input-readonly" />
                            </div>

                            <div>
                                <label class="label-form">NIM / Identitas</label>
                                <input v-model="formCheckout.nim_mahasiswa" type="text" readonly class="input-readonly" />
                            </div>

                            <div>
                                <label class="label-form">Program Studi</label>
                                <input v-model="formCheckout.prodi_mahasiswa" type="text" readonly class="input-readonly" />
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label-form">Angkatan</label>
                                    <input v-model="formCheckout.angkatan_mahasiswa" type="text" readonly class="input-readonly" />
                                </div>

                                <div>
                                    <label class="label-form">Kelas</label>
                                    <input v-model="formCheckout.kelas_mahasiswa" type="text" readonly class="input-readonly" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Custom Date Picker -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative" ref="tanggalPinjamPickerRef">
                    <label class="label-form">
                        Tgl Ambil Alat <span class="text-red-500">*</span>
                    </label>

                    <button
                        type="button"
                        @click.stop="toggleTanggalPinjamPicker"
                        class="date-filter-button"
                        :class="showTanggalPinjamPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''"
                    >
                        <div class="flex items-center gap-2 overflow-hidden">
                            <svg
                                class="w-4 h-4 shrink-0 transition-colors"
                                :class="showTanggalPinjamPicker || formCheckout.tanggal_pinjam ? 'text-blue-500' : 'text-slate-400'"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
                                />
                            </svg>

                            <span class="truncate" :class="formCheckout.tanggal_pinjam ? 'text-slate-800' : 'text-slate-500'">
                                {{ formatForDisplay(formCheckout.tanggal_pinjam) }}
                            </span>
                        </div>

                        <svg
                            class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                            :class="showTanggalPinjamPicker ? 'rotate-180 text-blue-500' : ''"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <transition name="dropdown">
                        <div
                            v-if="showTanggalPinjamPicker"
                            class="date-picker-panel left-0"
                            @click.stop
                        >
                            <div class="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    @click="currentTanggalPinjamCal = subMonth(currentTanggalPinjamCal)"
                                    class="calendar-nav-button"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <span class="font-black text-slate-800 text-sm">
                                    {{ getCalHeader(currentTanggalPinjamCal) }}
                                </span>

                                <button
                                    type="button"
                                    @click="currentTanggalPinjamCal = addMonth(currentTanggalPinjamCal)"
                                    class="calendar-nav-button"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                <div v-for="day in daysOfWeek" :key="day">
                                    {{ day }}
                                </div>
                            </div>

                            <div class="grid grid-cols-7 gap-1">
                                <button
                                    type="button"
                                    v-for="(date, index) in tanggalPinjamCalGrid"
                                    :key="index"
                                    @click="pilihTanggalPinjam(date)"
                                    :disabled="!date"
                                    class="calendar-day"
                                    :class="getTanggalPinjamClass(date)"
                                >
                                    {{ date ? date.getDate() : '' }}
                                </button>
                            </div>

                            <div class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    @click="clearTanggalPinjam"
                                    class="calendar-action-button text-slate-500 hover:bg-slate-100"
                                >
                                    Hapus
                                </button>

                                <button
                                    type="button"
                                    @click="setTanggalPinjamToday"
                                    class="calendar-action-button text-blue-600 hover:bg-blue-50"
                                >
                                    Hari ini
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="relative" ref="tanggalKembaliPickerRef">
                    <label class="label-form">
                        Tgl Kembali Alat <span class="text-red-500">*</span>
                    </label>

                    <button
                        type="button"
                        @click.stop="toggleTanggalKembaliPicker"
                        class="date-filter-button"
                        :class="showTanggalKembaliPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''"
                    >
                        <div class="flex items-center gap-2 overflow-hidden">
                            <svg
                                class="w-4 h-4 shrink-0 transition-colors"
                                :class="showTanggalKembaliPicker || formCheckout.tanggal_kembali ? 'text-blue-500' : 'text-slate-400'"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
                                />
                            </svg>

                            <span class="truncate" :class="formCheckout.tanggal_kembali ? 'text-slate-800' : 'text-slate-500'">
                                {{ formatForDisplay(formCheckout.tanggal_kembali) }}
                            </span>
                        </div>

                        <svg
                            class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                            :class="showTanggalKembaliPicker ? 'rotate-180 text-blue-500' : ''"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <transition name="dropdown">
                        <div
                            v-if="showTanggalKembaliPicker"
                            class="date-picker-panel left-0 md:right-0 md:left-auto"
                            @click.stop
                        >
                            <div class="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    @click="currentTanggalKembaliCal = subMonth(currentTanggalKembaliCal)"
                                    class="calendar-nav-button"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <span class="font-black text-slate-800 text-sm">
                                    {{ getCalHeader(currentTanggalKembaliCal) }}
                                </span>

                                <button
                                    type="button"
                                    @click="currentTanggalKembaliCal = addMonth(currentTanggalKembaliCal)"
                                    class="calendar-nav-button"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                <div v-for="day in daysOfWeek" :key="day">
                                    {{ day }}
                                </div>
                            </div>

                            <div class="grid grid-cols-7 gap-1">
                                <button
                                    type="button"
                                    v-for="(date, index) in tanggalKembaliCalGrid"
                                    :key="index"
                                    @click="pilihTanggalKembali(date)"
                                    :disabled="!date || isBeforeTanggalPinjam(date)"
                                    class="calendar-day"
                                    :class="getTanggalKembaliClass(date)"
                                >
                                    {{ date ? date.getDate() : '' }}
                                </button>
                            </div>

                            <p v-if="formCheckout.tanggal_pinjam" class="mt-3 text-[10px] font-bold text-slate-400">
                                Tanggal kembali tidak boleh sebelum tanggal ambil.
                            </p>

                            <div class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    @click="clearTanggalKembali"
                                    class="calendar-action-button text-slate-500 hover:bg-slate-100"
                                >
                                    Hapus
                                </button>

                                <button
                                    type="button"
                                    @click="setTanggalKembaliToday"
                                    class="calendar-action-button text-blue-600 hover:bg-blue-50"
                                >
                                    Hari ini
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <div v-if="formCheckout.kategori_kebutuhan === 'Harian'">
                <label class="label-form">
                    Dosen Penanggung Jawab / Pengampu
                    <span class="text-slate-400 normal-case">(Opsional)</span>
                </label>

                <input
                    v-model="formCheckout.dosen_penanggung_jawab"
                    type="text"
                    placeholder="Nama Dosen Praktikum"
                    class="input-form"
                />
            </div>

            <div
                class="sticky bottom-0 bg-white/95 backdrop-blur-md pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3"
            >
                <button
                    type="button"
                    @click="$emit('back')"
                    class="w-full sm:w-auto px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                    Kembali
                </button>

                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full sm:flex-1 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-black rounded-lg shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <span
                        v-if="isSubmitting"
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></span>

                    {{ isSubmitting ? 'Mengirim Permohonan...' : 'Kirim Permohonan Peminjaman' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import BaseModal from './BaseModal.vue';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    isOpen: Boolean,
    cart: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'back', 'success']);
const { showAlert } = useAlert();

const isSubmitting = ref(false);

const isKategoriOpen = ref(false);
const isJenisOpen = ref(false);
const kategoriDropdownRef = ref(null);
const jenisDropdownRef = ref(null);

const showTanggalPinjamPicker = ref(false);
const showTanggalKembaliPicker = ref(false);
const tanggalPinjamPickerRef = ref(null);
const tanggalKembaliPickerRef = ref(null);

const currentTanggalPinjamCal = ref(new Date());
const currentTanggalKembaliCal = ref(new Date());

const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];

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

const isMahasiswa = computed(() => !!formCheckout.value._isMahasiswa);

const kategoriOptions = computed(() => {
    const options = [
        {
            value: 'Harian',
            label: 'Harian',
            desc: 'Praktikum Reguler'
        }
    ];

    if (isMahasiswa.value) {
        options.push({
            value: 'Khusus',
            label: 'Khusus',
            desc: 'PBL / Skripsi / Organisasi'
        });
    }

    return options;
});

const jenisKhususOptions = [
    {
        value: 'PBL',
        label: 'Project Based Learning',
        desc: 'Peminjaman untuk kegiatan PBL'
    },
    {
        value: 'Skripsi',
        label: 'Tugas Akhir / Skripsi',
        desc: 'Peminjaman untuk penelitian skripsi'
    },
    {
        value: 'Organisasi',
        label: 'Organisasi / Lomba',
        desc: 'Kegiatan organisasi atau perlombaan'
    }
];

const getKategoriLabel = computed(() => {
    return kategoriOptions.value.find(
        item => item.value === formCheckout.value.kategori_kebutuhan
    );
});

const getJenisKhususLabel = computed(() => {
    return jenisKhususOptions.find(
        item => item.value === formCheckout.value.jenis_khusus
    );
});

const toggleKategoriDropdown = () => {
    isKategoriOpen.value = !isKategoriOpen.value;
    isJenisOpen.value = false;
    closeDatePickers();
};

const toggleJenisDropdown = () => {
    isJenisOpen.value = !isJenisOpen.value;
    isKategoriOpen.value = false;
    closeDatePickers();
};

const pilihKategori = (value) => {
    formCheckout.value.kategori_kebutuhan = value;
    isKategoriOpen.value = false;
    resetKhusus();
};

const pilihJenisKhusus = (value) => {
    formCheckout.value.jenis_khusus = value;
    isJenisOpen.value = false;
    handleJenisKhususChange();
};

const resetKhusus = () => {
    if (formCheckout.value.kategori_kebutuhan === 'Harian') {
        formCheckout.value.jenis_khusus = '';
        formCheckout.value.nama_acara = '';
        formCheckout.value.organisasi_penyelenggara = '';
        formCheckout.value.nip_dosen_pj = '';
    }
};

const handleJenisKhususChange = () => {
    if (formCheckout.value.jenis_khusus !== 'Organisasi') {
        formCheckout.value.nama_acara = '';
        formCheckout.value.organisasi_penyelenggara = '';
    }
};

const makeLocalDate = (dateString) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split('-').map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
};

const formatForDisplay = (dateString) => {
    const date = makeLocalDate(dateString);

    if (!date) return 'Pilih Tanggal';

    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatForStore = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getCalHeader = (date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const addMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const subMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const getCalGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const grid = [];

    for (let i = 0; i < firstDay; i++) {
        grid.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
        grid.push(new Date(year, month, day));
    }

    return grid;
};

const tanggalPinjamCalGrid = computed(() => getCalGrid(currentTanggalPinjamCal.value));
const tanggalKembaliCalGrid = computed(() => getCalGrid(currentTanggalKembaliCal.value));

const closeDatePickers = () => {
    showTanggalPinjamPicker.value = false;
    showTanggalKembaliPicker.value = false;
};

const toggleTanggalPinjamPicker = () => {
    showTanggalPinjamPicker.value = !showTanggalPinjamPicker.value;
    showTanggalKembaliPicker.value = false;
    isKategoriOpen.value = false;
    isJenisOpen.value = false;

    if (formCheckout.value.tanggal_pinjam) {
        currentTanggalPinjamCal.value = makeLocalDate(formCheckout.value.tanggal_pinjam);
    }
};

const toggleTanggalKembaliPicker = () => {
    showTanggalKembaliPicker.value = !showTanggalKembaliPicker.value;
    showTanggalPinjamPicker.value = false;
    isKategoriOpen.value = false;
    isJenisOpen.value = false;

    if (formCheckout.value.tanggal_kembali) {
        currentTanggalKembaliCal.value = makeLocalDate(formCheckout.value.tanggal_kembali);
    } else if (formCheckout.value.tanggal_pinjam) {
        currentTanggalKembaliCal.value = makeLocalDate(formCheckout.value.tanggal_pinjam);
    }
};

const pilihTanggalPinjam = (date) => {
    if (!date) return;

    const selected = formatForStore(date);
    formCheckout.value.tanggal_pinjam = selected;

    if (
        formCheckout.value.tanggal_kembali &&
        makeLocalDate(formCheckout.value.tanggal_kembali) < makeLocalDate(selected)
    ) {
        formCheckout.value.tanggal_kembali = selected;
        currentTanggalKembaliCal.value = new Date(date);
    }

    showTanggalPinjamPicker.value = false;
};

const pilihTanggalKembali = (date) => {
    if (!date || isBeforeTanggalPinjam(date)) return;

    formCheckout.value.tanggal_kembali = formatForStore(date);
    showTanggalKembaliPicker.value = false;
};

const isSameDate = (date, dateString) => {
    const target = makeLocalDate(dateString);

    if (!date || !target) return false;

    return date.getFullYear() === target.getFullYear()
        && date.getMonth() === target.getMonth()
        && date.getDate() === target.getDate();
};

const isToday = (date) => {
    if (!date) return false;

    const today = new Date();

    return date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate();
};

const isBeforeTanggalPinjam = (date) => {
    if (!date || !formCheckout.value.tanggal_pinjam) return false;

    return date < makeLocalDate(formCheckout.value.tanggal_pinjam);
};

const getTanggalPinjamClass = (date) => {
    if (!date) return 'opacity-0 cursor-default';

    if (isSameDate(date, formCheckout.value.tanggal_pinjam)) {
        return 'bg-blue-600 text-white shadow-md shadow-blue-500/30';
    }

    if (isToday(date)) {
        return 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 hover:bg-blue-100';
    }

    return 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer';
};

const getTanggalKembaliClass = (date) => {
    if (!date) return 'opacity-0 cursor-default';

    if (isBeforeTanggalPinjam(date)) {
        return 'text-slate-300 cursor-not-allowed bg-slate-50';
    }

    if (isSameDate(date, formCheckout.value.tanggal_kembali)) {
        return 'bg-blue-600 text-white shadow-md shadow-blue-500/30';
    }

    if (isToday(date)) {
        return 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 hover:bg-blue-100';
    }

    return 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer';
};

const clearTanggalPinjam = () => {
    formCheckout.value.tanggal_pinjam = '';
    showTanggalPinjamPicker.value = false;
};

const clearTanggalKembali = () => {
    formCheckout.value.tanggal_kembali = '';
    showTanggalKembaliPicker.value = false;
};

const setTanggalPinjamToday = () => {
    pilihTanggalPinjam(new Date());
};

const setTanggalKembaliToday = () => {
    const today = new Date();

    if (!formCheckout.value.tanggal_pinjam || today >= makeLocalDate(formCheckout.value.tanggal_pinjam)) {
        pilihTanggalKembali(today);
    }
};

const handleClickOutside = (event) => {
    if (kategoriDropdownRef.value && !kategoriDropdownRef.value.contains(event.target)) {
        isKategoriOpen.value = false;
    }

    if (jenisDropdownRef.value && !jenisDropdownRef.value.contains(event.target)) {
        isJenisOpen.value = false;
    }

    if (tanggalPinjamPickerRef.value && !tanggalPinjamPickerRef.value.contains(event.target)) {
        showTanggalPinjamPicker.value = false;
    }

    if (tanggalKembaliPickerRef.value && !tanggalKembaliPickerRef.value.contains(event.target)) {
        showTanggalKembaliPicker.value = false;
    }
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        isKategoriOpen.value = false;
        isJenisOpen.value = false;
        closeDatePickers();

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

onMounted(() => {
    window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
});

const submitPeminjaman = async () => {
    isSubmitting.value = true;

    try {
        const payload = {
            kategori_kebutuhan: formCheckout.value.kategori_kebutuhan,
            tujuan_peminjaman: formCheckout.value.tujuan_peminjaman,
            tanggal_pinjam: formCheckout.value.tanggal_pinjam,
            tanggal_kembali: formCheckout.value.tanggal_kembali,

            jenis_khusus: formCheckout.value.kategori_kebutuhan === 'Khusus'
                ? formCheckout.value.jenis_khusus
                : null,

            dosen_penanggung_jawab: formCheckout.value.dosen_penanggung_jawab || null,
            nip_dosen_pj: formCheckout.value.nip_dosen_pj || null,

            nama_acara: formCheckout.value.jenis_khusus === 'Organisasi'
                ? formCheckout.value.nama_acara
                : null,

            organisasi_penyelenggara: formCheckout.value.jenis_khusus === 'Organisasi'
                ? formCheckout.value.organisasi_penyelenggara
                : null,

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
        console.error('Error Checkout Payload:', error.response?.data);
        showAlert(error.response?.data?.message || 'Gagal mengirim permohonan', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.label-form {
    display: block;
    margin-left: 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 10px;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.input-form {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #dbe3ee;
    background: #f8fafc;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    outline: none;
    transition: all 0.2s ease;
}

.input-form:hover,
.input-form:focus {
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px #dbeafe;
}

.input-readonly {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #dbe3ee;
    background: #f1f5f9;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #64748b;
    outline: none;
    cursor: not-allowed;
}

.dropdown-button,
.date-filter-button {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #dbe3ee;
    background: #f8fafc;
    padding: 0.875rem 1rem;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    outline: none;
    transition: all 0.2s ease;
    cursor: pointer;
}

.dropdown-button:hover,
.dropdown-button:focus,
.date-filter-button:hover,
.date-filter-button:focus {
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px #dbeafe;
}

.dropdown-menu {
    position: absolute;
    z-index: 80;
    margin-top: 0.5rem;
    width: 100%;
    overflow: hidden;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0.5rem;
    box-shadow: 0 20px 40px rgb(15 23 42 / 0.14);
}

.dropdown-item {
    width: 100%;
    border-radius: 0.625rem;
    padding: 0.875rem 1rem;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    transition: background 0.2s ease;
}

.dropdown-item:hover {
    background: #eff6ff;
}

.section-card {
    border-radius: 0.875rem;
    border-width: 1px;
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 999px;
}

.date-picker-panel {
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    width: min(18rem, calc(100vw - 2rem));
    border-radius: 0.875rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 1rem;
    z-index: 90;
    box-shadow: 0 20px 40px rgb(15 23 42 / 0.16);
}

.calendar-nav-button {
    padding: 0.35rem;
    border-radius: 0.5rem;
    color: #64748b;
    transition: all 0.2s ease;
}

.calendar-nav-button:hover {
    background: #f1f5f9;
    color: #2563eb;
}

.calendar-day {
    height: 2rem;
    width: 100%;
    border-radius: 0.55rem;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.calendar-action-button {
    padding: 0.5rem 0.75rem;
    border-radius: 0.55rem;
    font-size: 0.7rem;
    font-weight: 900;
    transition: all 0.2s ease;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

@media (max-width: 640px) {
    .section-card {
        padding: 1rem;
        border-radius: 0.75rem;
    }

    .date-picker-panel {
        left: 0 !important;
        right: auto !important;
        width: min(18rem, calc(100vw - 3rem));
    }
}
</style>