<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 md:p-6"
                @click.self="$emit('close')">
                <div
                    class="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                    <button type="button" @click="$emit('close')"
                        class="absolute top-3 right-3 md:top-5 md:right-5 z-30 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        aria-label="Tutup modal">
                        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="max-h-[92vh] overflow-y-auto hidden-scrollbar p-4 sm:p-6 md:p-8">

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
                                Lengkapi informasi peminjaman alat laboratorium dengan benar sebelum mengirim
                                permohonan.
                            </p>
                        </div>

                        <!-- Custom Date Picker -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                                <div class="relative" ref="tanggalPinjamPickerRef">
                                    <label class="label-form">
                                        Tgl Ambil Alat <span class="text-red-500">*</span>
                                    </label>

                                    <button type="button" @click.stop="toggleTanggalPinjamPicker"
                                        class="date-filter-button"
                                        :class="showTanggalPinjamPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''">
                                        <div class="flex items-center gap-2 overflow-hidden">
                                            <svg class="w-4 h-4 shrink-0 transition-colors"
                                                :class="showTanggalPinjamPicker || formCheckout.tanggal_pinjam ? 'text-blue-500' : 'text-slate-400'"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                                            </svg>

                                            <span class="truncate"
                                                :class="formCheckout.tanggal_pinjam ? 'text-slate-800' : 'text-slate-500'">
                                                {{ formatForDisplay(formCheckout.tanggal_pinjam) }}
                                            </span>
                                        </div>

                                        <svg class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                                            :class="showTanggalPinjamPicker ? 'rotate-180 text-blue-500' : ''"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <transition name="dropdown">
                                        <div v-if="showTanggalPinjamPicker" class="date-picker-panel-down left-0" @click.stop>
                                            <div class="flex items-center justify-between mb-4">
                                                <button type="button"
                                                    @click="currentTanggalPinjamCal = subMonth(currentTanggalPinjamCal)"
                                                    class="calendar-nav-button">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>

                                                <span class="font-black text-slate-800 text-sm">
                                                    {{ getCalHeader(currentTanggalPinjamCal) }}
                                                </span>

                                                <button type="button"
                                                    @click="currentTanggalPinjamCal = addMonth(currentTanggalPinjamCal)"
                                                    class="calendar-nav-button">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div
                                                class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                                <div v-for="day in daysOfWeek" :key="day">
                                                    {{ day }}
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-7 gap-1">
                                                <button type="button" v-for="(date, index) in tanggalPinjamCalGrid"
                                                    :key="index" @click="pilihTanggalPinjam(date)" :disabled="!date"
                                                    class="calendar-day" :class="getTanggalPinjamClass(date)">
                                                    {{ date ? date.getDate() : '' }}
                                                </button>
                                            </div>

                                            <div
                                                class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                                <button type="button" @click="clearTanggalPinjam"
                                                    class="calendar-action-button text-slate-500 hover:bg-slate-100">
                                                    Hapus
                                                </button>

                                                <button type="button" @click="setTanggalPinjamToday"
                                                    class="calendar-action-button text-blue-600 hover:bg-blue-50">
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

                                    <button type="button" @click.stop="toggleTanggalKembaliPicker"
                                        class="date-filter-button"
                                        :class="showTanggalKembaliPicker ? 'border-blue-500 bg-white ring-4 ring-blue-50' : ''">
                                        <div class="flex items-center gap-2 overflow-hidden">
                                            <svg class="w-4 h-4 shrink-0 transition-colors"
                                                :class="showTanggalKembaliPicker || formCheckout.tanggal_kembali ? 'text-blue-500' : 'text-slate-400'"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                                            </svg>

                                            <span class="truncate"
                                                :class="formCheckout.tanggal_kembali ? 'text-slate-800' : 'text-slate-500'">
                                                {{ formatForDisplay(formCheckout.tanggal_kembali) }}
                                            </span>
                                        </div>

                                        <svg class="w-4 h-4 shrink-0 text-slate-400 transition-transform"
                                            :class="showTanggalKembaliPicker ? 'rotate-180 text-blue-500' : ''"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <transition name="dropdown">
                                        <div v-if="showTanggalKembaliPicker"class="date-picker-panel-down left-0 md:left-0 md:left-auto" @click.stop>
                                            <div class="flex items-center justify-between mb-4">
                                                <button type="button"
                                                    @click="currentTanggalKembaliCal = subMonth(currentTanggalKembaliCal)"
                                                    class="calendar-nav-button">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>

                                                <span class="font-black text-slate-800 text-sm">
                                                    {{ getCalHeader(currentTanggalKembaliCal) }}
                                                </span>

                                                <button type="button"
                                                    @click="currentTanggalKembaliCal = addMonth(currentTanggalKembaliCal)"
                                                    class="calendar-nav-button">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div
                                                class="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-black text-slate-400">
                                                <div v-for="day in daysOfWeek" :key="day">
                                                    {{ day }}
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-7 gap-1">
                                                <button type="button" v-for="(date, index) in tanggalKembaliCalGrid"
                                                    :key="index" @click="pilihTanggalKembali(date)"
                                                    :disabled="!date || isBeforeTanggalPinjam(date)"
                                                    class="calendar-day" :class="getTanggalKembaliClass(date)">
                                                    {{ date ? date.getDate() : '' }}
                                                </button>
                                            </div>

                                            <div
                                                class="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                                                <button type="button" @click="clearTanggalKembali"
                                                    class="calendar-action-button text-slate-500 hover:bg-slate-100">
                                                    Hapus
                                                </button>

                                                <button type="button" @click="setTanggalKembaliToday"
                                                    class="calendar-action-button text-blue-600 hover:bg-blue-50">
                                                    Hari ini
                                                </button>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>

                        <form @submit.prevent="submitPeminjaman" class="space-y-4 sm:space-y-5 md:space-y-6 mt-8">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                                <div>
                                    <label class="label-form">
                                        Kategori <span class="text-red-500">*</span>
                                    </label>

                                    <div class="relative" ref="kategoriDropdownRef">
                                        <button type="button" @click.stop="toggleKategoriDropdown"
                                            class="dropdown-button">
                                            <div>
                                                <p class="text-sm font-bold text-slate-800">
                                                    {{ getKategoriLabel?.label }}
                                                </p>
                                                <p class="text-[11px] text-slate-500 font-medium">
                                                    {{ getKategoriLabel?.desc }}
                                                </p>
                                            </div>

                                            <svg class="w-5 h-5 text-slate-400 transition-transform shrink-0"
                                                :class="isKategoriOpen ? 'rotate-180' : ''" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <div v-if="isKategoriOpen" class="dropdown-menu" @click.stop>
                                            <button v-for="item in kategoriOptions" :key="item.value" type="button"
                                                @click="pilihKategori(item.value)" class="dropdown-item"
                                                :class="formCheckout.kategori_kebutuhan === item.value ? 'bg-blue-50' : ''">
                                                <div>
                                                    <p class="text-sm font-black text-slate-800">
                                                        {{ item.label }}
                                                    </p>
                                                    <p class="text-[11px] font-medium text-slate-500">
                                                        {{ item.desc }}
                                                    </p>
                                                </div>

                                                <span v-if="formCheckout.kategori_kebutuhan === item.value"
                                                    class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <p v-if="!isMahasiswa"
                                        class="text-[10px] md:text-[11px] text-amber-600 font-bold mt-1.5 ml-1">
                                        Peminjaman Khusus hanya tersedia untuk mahasiswa.
                                    </p>
                                </div>

                                <div>
                                    <label class="label-form">
                                        Tujuan / Judul Kegiatan <span class="text-red-500">*</span>
                                    </label>

                                    <input v-model="formCheckout.tujuan_peminjaman" type="text" required
                                        placeholder="Cth: Praktikum IoT / Lomba Robotik" class="input-form" />
                                </div>
                            </div>

                            <div v-if="formCheckout.kategori_kebutuhan === 'Khusus'"
                                class="section-card bg-blue-50/50 border-blue-100">
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
                                            <button type="button" @click.stop="toggleJenisDropdown"
                                                class="dropdown-button bg-white border-blue-200">
                                                <div>
                                                    <p class="text-sm font-bold text-slate-800">
                                                        {{ getJenisKhususLabel?.label || 'Pilih Jenis Kegiatan' }}
                                                    </p>
                                                    <p class="text-[11px] text-slate-500 font-medium">
                                                        {{ getJenisKhususLabel?.desc || 'Pilih sesuai kebutuhan peminjaman' }}
                                                    </p>
                                                </div>

                                                <svg class="w-5 h-5 text-slate-400 transition-transform shrink-0"
                                                    :class="isJenisOpen ? 'rotate-180' : ''" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <div v-if="isJenisOpen" class="dropdown-menu" @click.stop>
                                                <button v-for="item in jenisKhususOptions" :key="item.value"
                                                    type="button" @click="pilihJenisKhusus(item.value)"
                                                    class="dropdown-item"
                                                    :class="formCheckout.jenis_khusus === item.value ? 'bg-blue-50' : ''">
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

                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                                        <div>
                                            <label class="label-form">
                                                Dosen Penanggung Jawab <span class="text-red-500">*</span>
                                            </label>
                                            <input v-model="formCheckout.dosen_penanggung_jawab" type="text" required
                                                placeholder="Nama Dosen Pembimbing" class="input-form bg-white" />
                                        </div>

                                        <div>
                                            <label class="label-form">
                                                NIP Dosen PJ <span class="text-red-500">*</span>
                                            </label>
                                            <input v-model="formCheckout.nip_dosen_pj" type="text" required
                                                placeholder="Cth: 199123456789056789" class="input-form bg-white" />
                                        </div>
                                    </div>

                                    <div v-if="formCheckout.jenis_khusus === 'Organisasi'"
                                        class="section-card bg-white">
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                                            <div>
                                                <label class="label-form">
                                                    Nama Acara <span class="text-red-500">*</span>
                                                </label>
                                                <input v-model="formCheckout.nama_acara" type="text" required
                                                    placeholder="Cth: Kontes Robot Indonesia" class="input-form" />
                                            </div>

                                            <div>
                                                <label class="label-form">
                                                    Penyelenggara <span class="text-red-500">*</span>
                                                </label>
                                                <input v-model="formCheckout.organisasi_penyelenggara" type="text"
                                                    required placeholder="Cth: BEM Teknik / Puspresnas"
                                                    class="input-form" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="section-card bg-white">
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                            Data Peminjam Otomatis
                                        </p>

                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                                            <div>
                                                <label class="label-form">Nama Lengkap</label>
                                                <input v-model="formCheckout.nama_mahasiswa" type="text" readonly
                                                    class="input-readonly" />
                                            </div>

                                            <div>
                                                <label class="label-form">NIM / Identitas</label>
                                                <input v-model="formCheckout.nim_mahasiswa" type="text" readonly
                                                    class="input-readonly" />
                                            </div>

                                            <div>
                                                <label class="label-form">Program Studi</label>
                                                <input v-model="formCheckout.prodi_mahasiswa" type="text" readonly
                                                    class="input-readonly" />
                                            </div>

                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label class="label-form">Angkatan</label>
                                                    <input v-model="formCheckout.angkatan_mahasiswa" type="text"
                                                        readonly class="input-readonly" />
                                                </div>

                                                <div>
                                                    <label class="label-form">Kelas</label>
                                                    <input v-model="formCheckout.kelas_mahasiswa" type="text" readonly
                                                        class="input-readonly" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="formCheckout.kategori_kebutuhan === 'Harian'">
                                <label class="label-form mt-10">
                                    Dosen Penanggung Jawab / Pengampu
                                    <span class="text-slate-400 normal-case">(Opsional)</span>
                                </label>

                                <input v-model="formCheckout.dosen_penanggung_jawab" type="text"
                                    placeholder="Nama Dosen Praktikum" class="input-form" />
                            </div>

                            <div
                                class="pt-5 sm:pt-6 mt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3">
                                <button type="button" @click="$emit('back')"
                                    class="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]">
                                    Kembali
                                </button>

                                <button type="submit" :disabled="isSubmitting"
                                    class="w-full sm:flex-1 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    <span v-if="isSubmitting"
                                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                                    {{ isSubmitting ? 'Mengirim Permohonan...' : 'Kirim Permohonan Peminjaman' }}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
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
    margin-bottom: 0.4rem;
    font-size: 9.5px;
    font-weight: 900;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.input-form {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #dbe3ee;
    background: #f8fafc;
    padding: 0.75rem 0.9rem;
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
    padding: 0.75rem 0.9rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #64748b;
    outline: none;
    cursor: not-allowed;
}

.dropdown-button,
.date-filter-button {
    width: 100%;
    min-height: 46px;
    border-radius: 0.75rem;
    border: 1px solid #dbe3ee;
    background: #f8fafc;
    padding: 0.75rem 0.9rem;
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
    max-height: 240px;
    overflow-y: auto;
    border-radius: 0.875rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0.4rem;
    box-shadow: 0 20px 45px rgb(15 23 42 / 0.16);
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.dropdown-menu::-webkit-scrollbar {
    display: none;
}

.dropdown-item {
    width: 100%;
    border-radius: 0.7rem;
    padding: 0.75rem 0.85rem;
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
    border-radius: 1rem;
    border-width: 1px;
    padding: 1rem;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.hidden-scrollbar,
.custom-scrollbar,
.dropdown-menu,
.date-picker-panel {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hidden-scrollbar::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar,
.dropdown-menu::-webkit-scrollbar,
.date-picker-panel::-webkit-scrollbar {
    display: none;
}

.date-picker-panel {
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    width: min(17rem, calc(100vw - 2rem));
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0.75rem;
    z-index: 90;
    box-shadow: 0 22px 50px rgb(15 23 42 / 0.18);
}

.calendar-nav-button {
    width: 2rem;
    height: 2rem;
    border-radius: 0.7rem;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background: #f8fafc;
}

.calendar-nav-button:hover {
    background: #eff6ff;
    color: #2563eb;
}

.calendar-day {
    height: 1.95rem;
    width: 100%;
    border-radius: 0.55rem;
    font-size: 0.72rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.calendar-action-button {
    padding: 0.4rem 0.7rem;
    border-radius: 0.6rem;
    font-size: 0.68rem;
    font-weight: 900;
    transition: all 0.2s ease;
}

.dropdown-enter-active,
.dropdown-leave-active,
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active>div>div,
.modal-fade-leave-active>div>div {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from>div>div,
.modal-fade-leave-to>div>div {
    transform: scale(0.96) translateY(12px);
    opacity: 0;
}

@media (min-width: 768px) {
    .section-card {
        padding: 1.15rem;
    }

    .date-picker-panel {
        width: 17rem;
    }
}

@media (max-width: 640px) {
    .label-form {
        font-size: 9px;
        margin-bottom: 0.35rem;
    }

    .input-form,
    .input-readonly,
    .dropdown-button,
    .date-filter-button {
        padding: 0.7rem 0.85rem;
        border-radius: 0.7rem;
        font-size: 0.82rem;
        min-height: 44px;
    }

    .section-card {
        padding: 0.9rem;
        border-radius: 0.85rem;
    }

    .date-picker-panel {
        left: 0 !important;
        right: auto !important;
        width: min(17rem, calc(100vw - 2.5rem));
        padding: 0.7rem;
    }

    .calendar-day {
        height: 1.85rem;
        font-size: 0.68rem;
        border-radius: 0.5rem;
    }

    .calendar-nav-button {
        width: 1.9rem;
        height: 1.9rem;
    }
}

.date-picker-panel-down {
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    width: min(17rem, calc(100vw - 2rem));
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0.75rem;
    z-index: 9999;
    box-shadow: 0 22px 50px rgb(15 23 42 / 0.18);
}

.date-picker-panel-up {
    position: absolute;
    bottom: 100%;
    width: min(17rem, calc(100vw - 2rem));
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0.75rem;
    z-index: 90;
    box-shadow: 0 22px 50px rgb(15 23 42 / 0.18);
}

@media (max-width: 640px) {
    .date-picker-panel-down,
    .date-picker-panel-up {
        width: min(17rem, calc(100vw - 2.5rem));
        padding: 0.7rem;
    }
}
</style>
