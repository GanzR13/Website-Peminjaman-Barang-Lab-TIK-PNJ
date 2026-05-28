<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                @click.self="closeModal">

                <div
                    class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden relative flex flex-col max-h-[95vh] lg:max-h-[70vh]">

                    <form @submit.prevent="submitLapor"
                        class="grid grid-cols-1 lg:grid-cols-12 gap-0 w-full h-full overflow-y-auto lg:overflow-hidden custom-scrollbar">

                        <div
                            class="lg:col-span-5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-8 flex flex-col items-center justify-start relative h-full">

                            <div
                                class="w-full max-w-sm aspect-square rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden relative group lg:sticky lg:top-4 lg:mt-4 flex items-center justify-center">
                                <img v-if="selectedBarangImage" :src="getImageUrl(selectedBarangImage)"
                                    alt="Preview Barang" loading="lazy"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div v-else class="flex flex-col items-center gap-3 text-slate-300">
                                    <PhotoIcon class="w-16 h-16" />
                                    <p class="text-sm font-bold">Pilih Barang Dulu</p>
                                </div>
                            </div>

                            <div class="mt-6 text-center w-full max-w-sm">
                                <h4
                                    class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">
                                    Informasi Laporan</h4>
                                <p class="text-xs font-medium text-slate-500 leading-relaxed">
                                    Pastikan data laporan kerusakan atau kehilangan sesuai dengan kejadian sebenarnya.
                                    Pemalsuan laporan dapat dikenakan sanksi tata tertib laboratorium.
                                </p>
                            </div>
                        </div>

                        <div
                            class="lg:col-span-7 flex flex-col relative bg-white lg:max-h-[70vh] lg:overflow-y-auto custom-scrollbar">

                            <div
                                class="p-6 md:p-8 pb-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 class="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <ExclamationTriangleIcon class="w-7 h-7 text-orange-500 shrink-0" />
                                        Lapor Masalah Barang
                                    </h3>
                                    <p class="text-xs font-medium text-slate-500 mt-1">Transaksi #{{ transaksi?.antrian
                                        || transaksi?.id }}</p>
                                </div>
                                <button type="button" @click="closeModal"
                                    class="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95"
                                    title="Tutup">
                                    <XMarkIcon class="w-5 h-5" />
                                </button>
                            </div>

                            <div class="p-6 md:p-8 flex-1 space-y-6">

                                <div>
                                    <label
                                        class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Pilih
                                        Barang <span class="text-red-500">*</span></label>
                                    <div class="relative custom-dropdown">
                                        <button type="button" @click.stop="toggleDropdown('barang')"
                                            class="w-full flex items-center justify-between gap-3 px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-orange-300 focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-bold text-slate-700 cursor-pointer transition-all">
                                            <span class="truncate">
                                                {{ selectedBarangLabel }}
                                            </span>

                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                class="w-4 h-4 text-slate-400 shrink-0 transition-transform"
                                                :class="{ 'rotate-180': activeDropdown === 'barang' }" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <transition name="fade">
                                            <div v-if="activeDropdown === 'barang'"
                                                class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-80 max-h-56 overflow-y-auto custom-scrollbar">
                                                <button v-if="!transaksi?.detail_barang?.length" type="button" disabled
                                                    class="w-full px-4 py-3 text-sm text-left text-slate-400 font-bold cursor-not-allowed">
                                                    Tidak ada barang
                                                </button>

                                                <button v-for="detail in transaksi?.detail_barang"
                                                    :key="detail.barang.id" type="button" @click="selectBarang(detail)"
                                                    class="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-b-0"
                                                    :class="Number(formLapor.barang_id) === Number(detail.barang.id) ? 'bg-orange-50' : ''">
                                                    <p class="text-sm font-black text-slate-800 leading-tight">
                                                        {{ detail.barang.nama_barang }}
                                                    </p>
                                                    <p
                                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        Dipinjam: {{ detail.jumlah_pinjam }} Unit
                                                    </p>
                                                </button>
                                            </div>
                                        </transition>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jenis
                                            Laporan <span class="text-red-500">*</span></label>
                                        <div class="relative custom-dropdown">
                                            <button type="button" @click.stop="toggleDropdown('jenis')"
                                                class="w-full flex items-center justify-between gap-3 px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-orange-300 focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-bold text-slate-700 cursor-pointer transition-all">
                                                <span>
                                                    {{ selectedJenisLabel }}
                                                </span>

                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="w-4 h-4 text-slate-400 shrink-0 transition-transform"
                                                    :class="{ 'rotate-180': activeDropdown === 'jenis' }" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <transition name="fade">
                                                <div v-if="activeDropdown === 'jenis'"
                                                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-80 overflow-hidden">
                                                    <button v-for="option in jenisLaporanOptions" :key="option.value"
                                                        type="button" @click="selectJenisLaporan(option.value)"
                                                        class="w-full px-4 py-3 text-sm text-left font-bold hover:bg-orange-50 transition-colors"
                                                        :class="formLapor.jenis_laporan === option.value ? 'bg-orange-50 text-orange-700' : 'text-slate-700'">
                                                        {{ option.label }}
                                                    </button>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Jumlah
                                            Unit <span class="text-red-500">*</span></label>
                                        <input v-model="formLapor.jumlah" type="number" min="1"
                                            :max="selectedBarangMaxQty" required
                                            class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 outline-none text-sm font-medium bg-slate-50 transition-all" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tanggal
                                            Kejadian <span class="text-red-500">*</span></label>
                                        <div class="relative custom-date-picker">
                                            <button type="button" @click.stop="isDatePickerOpen = !isDatePickerOpen"
                                                class="w-full flex items-center justify-between gap-3 px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-orange-300 focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-bold text-slate-700 cursor-pointer transition-all">
                                                <span
                                                    :class="formLapor.tanggal_kejadian ? 'text-slate-700' : 'text-slate-400'">
                                                    {{ selectedDateLabel }}
                                                </span>

                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="w-5 h-5 text-orange-500 shrink-0" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                                </svg>
                                            </button>

                                            <transition name="fade">
                                                <div v-if="isDatePickerOpen"
                                                    class="absolute top-full left-0 right-0 md:right-auto md:w-70 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-90 p-3 md:p-3">
                                                    <!-- Header Kalender -->
                                                    <div class="flex items-center justify-between mb-3">
                                                        <button type="button" @click="previousMonth"
                                                            class="w-9 h-9 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 flex items-center justify-center transition-colors">
                                                            ‹
                                                        </button>

                                                        <div class="text-center">
                                                            <p class="text-sm font-black text-slate-800">
                                                                {{ currentMonthName }}
                                                            </p>
                                                            <p class="text-xs font-bold text-slate-400">
                                                                {{ currentCalendarYear }}
                                                            </p>
                                                        </div>

                                                        <button type="button" @click="nextMonth"
                                                            class="w-8 h-8 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 flex items-center justify-center transition-colors">
                                                            ›
                                                        </button>
                                                    </div>

                                                    <!-- Nama Hari -->
                                                    <div class="grid grid-cols-7 gap-1 mb-2">
                                                        <div v-for="day in dayNames" :key="day"
                                                            class="text-center text-[10px] font-black text-slate-400 uppercase">
                                                            {{ day }}
                                                        </div>
                                                    </div>

                                                    <!-- Tanggal -->
                                                    <div class="grid grid-cols-7 gap-1">
                                                        <button v-for="date in calendarDates" :key="date.key"
                                                            type="button" :disabled="date.disabled"
                                                            @click="selectDate(date)"
                                                            class="h-9 rounded-xl text-xs font-black transition-all"
                                                            :class="[
                                                                !date.isCurrentMonth ? 'text-slate-300' : 'text-slate-700',
                                                                date.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-orange-50 hover:text-orange-600 cursor-pointer',
                                                                date.isSelected ? 'bg-orange-500 text-white hover:bg-orange-600 hover:text-white shadow-lg shadow-orange-200' : '',
                                                                date.isToday && !date.isSelected ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' : ''
                                                            ]">
                                                            {{ date.day }}
                                                        </button>
                                                    </div>

                                                    <!-- Footer -->
                                                    <div
                                                        class="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
                                                        <button type="button" @click="clearDate"
                                                            class="px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                                                            Reset
                                                        </button>

                                                        <button type="button" @click="selectToday"
                                                            class="px-3 py-2 text-xs font-black text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                                                            Hari Ini
                                                        </button>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Bukti
                                            Foto <span class="text-red-500">*</span></label>
                                        <input type="file" @change="handleFileChange" accept="image/*" required
                                            class="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Kronologi
                                        Kejadian <span class="text-red-500">*</span></label>
                                    <textarea v-model="formLapor.deskripsi" rows="4" required
                                        placeholder="Contoh: Saat digunakan untuk praktikum IoT, pin ESP32 patah karena jatuh dari meja..."
                                        class="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none text-sm font-medium bg-slate-50 resize-none transition-all"></textarea>
                                </div>

                            </div>

                            <div
                                class="p-6 md:p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md sticky bottom-0 z-10 shrink-0 flex gap-4">
                                <button type="button" @click="closeModal"
                                    class="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors cursor-pointer text-base shrink-0 active:scale-95">
                                    Batal
                                </button>
                                <button type="submit" :disabled="isSubmitting"
                                    class="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all active:scale-95 text-base cursor-pointer disabled:opacity-50">
                                    <span v-if="isSubmitting"
                                        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {{ isSubmitting ? 'Mengunggah Laporan...' : 'Kirim Laporan' }}
                                </button>
                            </div>

                        </div>
                    </form>

                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { format } from 'date-fns';
import { ExclamationTriangleIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline';

const isDatePickerOpen = ref(false);

const today = new Date();
const currentCalendarMonth = ref(today.getMonth());
const currentCalendarYear = ref(today.getFullYear());

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

const currentMonthName = computed(() => {
    return monthNames[currentCalendarMonth.value];
});

const formatDateToInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatDateLabel = (dateString) => {
    if (!dateString) return 'Pilih Tanggal Kejadian';

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const selectedDateLabel = computed(() => {
    return formatDateLabel(formLapor.value.tanggal_kejadian);
});

const calendarDates = computed(() => {
    const year = currentCalendarYear.value;
    const month = currentCalendarMonth.value;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const previousMonthLastDay = new Date(year, month, 0).getDate();

    const dates = [];

    // Tanggal bulan sebelumnya
    for (let i = startDay - 1; i >= 0; i--) {
        const day = previousMonthLastDay - i;
        const date = new Date(year, month - 1, day);

        dates.push({
            key: `prev-${day}`,
            day,
            value: formatDateToInput(date),
            isCurrentMonth: false,
            isToday: formatDateToInput(date) === formatDateToInput(today),
            isSelected: formLapor.value.tanggal_kejadian === formatDateToInput(date),
            disabled: false
        });
    }

    // Tanggal bulan aktif
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const value = formatDateToInput(date);

        dates.push({
            key: `current-${day}`,
            day,
            value,
            isCurrentMonth: true,
            isToday: value === formatDateToInput(today),
            isSelected: formLapor.value.tanggal_kejadian === value,
            disabled: false
        });
    }

    // Tanggal bulan berikutnya agar grid penuh
    const remainingDates = 42 - dates.length;

    for (let day = 1; day <= remainingDates; day++) {
        const date = new Date(year, month + 1, day);
        const value = formatDateToInput(date);

        dates.push({
            key: `next-${day}`,
            day,
            value,
            isCurrentMonth: false,
            isToday: value === formatDateToInput(today),
            isSelected: formLapor.value.tanggal_kejadian === value,
            disabled: false
        });
    }

    return dates;
});

const previousMonth = () => {
    if (currentCalendarMonth.value === 0) {
        currentCalendarMonth.value = 11;
        currentCalendarYear.value--;
    } else {
        currentCalendarMonth.value--;
    }
};

const nextMonth = () => {
    if (currentCalendarMonth.value === 11) {
        currentCalendarMonth.value = 0;
        currentCalendarYear.value++;
    } else {
        currentCalendarMonth.value++;
    }
};

const selectDate = (date) => {
    if (date.disabled) return;

    formLapor.value.tanggal_kejadian = date.value;
    isDatePickerOpen.value = false;
};

const selectToday = () => {
    const value = formatDateToInput(today);

    formLapor.value.tanggal_kejadian = value;
    currentCalendarMonth.value = today.getMonth();
    currentCalendarYear.value = today.getFullYear();
    isDatePickerOpen.value = false;
};

const clearDate = () => {
    formLapor.value.tanggal_kejadian = '';
    isDatePickerOpen.value = false;
};

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

const activeDropdown = ref(null);

const jenisLaporanOptions = [
    {
        value: 'Kerusakan',
        label: 'Kerusakan Fisik'
    },
    {
        value: 'Kehilangan',
        label: 'Kehilangan Total'
    }
];

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

const selectBarang = (detail) => {
    formLapor.value.barang_id = detail.barang.id;

    if (Number(formLapor.value.jumlah) > Number(detail.jumlah_pinjam)) {
        formLapor.value.jumlah = detail.jumlah_pinjam;
    }

    activeDropdown.value = null;
};

const selectJenisLaporan = (value) => {
    formLapor.value.jenis_laporan = value;
    activeDropdown.value = null;
};

const selectedBarangLabel = computed(() => {
    if (!props.transaksi || !formLapor.value.barang_id) {
        return 'Pilih Barang Bermasalah';
    }

    const detail = props.transaksi.detail_barang?.find(
        (item) => Number(item.barang.id) === Number(formLapor.value.barang_id)
    );

    if (!detail) return 'Pilih Barang Bermasalah';

    return `${detail.barang.nama_barang} (${detail.jumlah_pinjam} Unit)`;
});

const selectedJenisLabel = computed(() => {
    return jenisLaporanOptions.find(
        (item) => item.value === formLapor.value.jenis_laporan
    )?.label || 'Pilih Jenis Laporan';
});

const closeDropdownOutside = (event) => {
    if (!event.target.closest('.custom-dropdown')) {
        activeDropdown.value = null;
    }

    if (!event.target.closest('.custom-date-picker')) {
        isDatePickerOpen.value = false;
    }
};
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

    const detail = props.transaksi.detail_barang.find(
        d => Number(d.barang.id) === Number(formLapor.value.barang_id)
    );

    return detail ? detail.barang.gambar : null;
});

// Computed Property untuk mencegah input jumlah melewati total pinjam
const selectedBarangMaxQty = computed(() => {
    if (!props.transaksi || !formLapor.value.barang_id) return 1;

    const detail = props.transaksi.detail_barang.find(
        d => Number(d.barang.id) === Number(formLapor.value.barang_id)
    );

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
onMounted(() => {
    window.addEventListener('click', closeDropdownOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', closeDropdownOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 999px;
}
</style>