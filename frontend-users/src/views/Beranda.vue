<template>
  <div class="space-y-7 md:space-y-12 animate-fade-in pb-10 md:pb-12 -mt-6 md:mt-0">
    <!-- HERO SECTION -->
    <section class="flex flex-col gap-5 md:gap-8">
      <div
        class="relative -mx-4 sm:mx-0 min-h-80 sm:min-h-90 md:min-h-105 bg-slate-900 sm:rounded-4xl shadow-md sm:shadow-2xl overflow-hidden group"
        @mouseenter="pauseCarousel"
        @mouseleave="startCarousel"
      >
        <transition name="slide-fade" mode="out-in">
          <div
            :key="slides[currentSlide].id"
            class="absolute inset-0 flex flex-col justify-center bg-linear-to-br px-5 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-10 md:py-14"
            :class="slides[currentSlide].bg"
          >
            <!-- Ornamen Dekoratif -->
            <div class="absolute -top-20 -right-20 w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-24 left-8 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            

            <div class="relative z-10 max-w-2xl text-white">
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 md:mb-5 w-fit shadow-sm"
              >
                <component :is="slides[currentSlide].icon" class="w-3.5 h-3.5 md:w-4 md:h-4" />
                {{ slides[currentSlide].tag }}
              </div>

              <h1
                class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3 md:mb-5 drop-shadow-sm"
                v-html="slides[currentSlide].title"
              ></h1>

              <p
                class="text-xs sm:text-sm md:text-lg text-white/90 font-medium leading-relaxed max-w-xl line-clamp-4 md:line-clamp-none drop-shadow-sm"
                v-html="slides[currentSlide].desc"
              ></p>
            </div>
          </div>
        </transition>

        <!-- Progress Bar Otomatis -->
        <div class="absolute left-0 right-0 bottom-0 z-20 h-1 bg-white/10">
          <div
            :key="currentSlide"
            class="h-full bg-white/80 animate-carousel-progress"
          ></div>
        </div>
      </div>
    </section>

    <!-- INFO CARDS -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      <div
        v-for="info in infoCards"
        :key="info.title"
        class="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-start gap-3 md:gap-4"
      >
        <div
          class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"
          :class="info.iconBox"
        >
          <component :is="info.icon" class="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <div class="min-w-0">
          <h3 class="font-black text-slate-900 text-sm md:text-base mb-1">
            {{ info.title }}
          </h3>
          <p class="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            {{ info.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- TATA CARA PEMINJAMAN -->
    <section>
      <div class="mb-5 md:mb-8 text-center md:text-left">

        <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Langkah Peminjaman
        </h2>

        <p class="text-slate-500 mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base font-medium">
          Ikuti 6 langkah mudah berikut untuk meminjam alat di Laboratorium PLP TIK.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div
          v-for="step in steps"
          :key="step.no"
          class="bg-white p-4 sm:p-5 md:p-7 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          :class="step.hover"
        >
          <div
            class="absolute -right-2 -top-5 md:-top-8 text-[76px] sm:text-[90px] md:text-[120px] font-black text-slate-50 transition-colors duration-500 z-0 select-none"
            :class="step.numberHover"
          >
            {{ step.no }}
          </div>

          <div class="relative z-10">
            <div
              class="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 group-hover:scale-110 transition-transform duration-300"
              :class="step.iconBox"
            >
              <component :is="step.icon" class="w-5 h-5 md:w-7 md:h-7" />
            </div>

            <h3
              class="text-base md:text-xl font-black text-slate-800 mb-1.5 md:mb-2 transition-colors"
              :class="step.titleHover"
            >
              {{ step.title }}
            </h3>

            <p class="text-xs md:text-sm text-slate-500 font-medium leading-relaxed" v-html="step.desc"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- WARNING -->
    <section class="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
      <div class="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-amber-400">
        <ExclamationTriangleIcon class="w-6 h-6 md:w-8 md:h-8" />
      </div>

      <div>
        <h3 class="text-base md:text-xl font-black text-white mb-1.5 md:mb-2">
          Perhatian & Tanggung Jawab!
        </h3>

        <p class="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
          Peminjaman yang terlambat dikembalikan, <b>hilang, atau rusak</b> menjadi tanggung jawab penuh peminjam.
          Pastikan untuk selalu memeriksa kelengkapan dan kondisi fisik barang saat pengambilan serta sebelum dikembalikan ke Admin Lab.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, markRaw } from 'vue';
import { useAuthStore } from '../stores/auth';
import {
  SparklesIcon,
  ClockIcon,
  CameraIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

const namaPengguna = computed(() => {
  const user = authStore.user;

  if (!user) return 'Pengguna';
  if (user.nama) return user.nama;
  if (user.email) return user.email.split('@')[0];

  return 'Mahasiswa/Dosen';
});

const currentSlide = ref(0);
let slideInterval = null;

const slides = computed(() => [
  {
    id: 1,
    tag: 'Selamat Datang',
    icon: markRaw(SparklesIcon),
    title: `Halo, ${namaPengguna.value}!`,
    desc: 'Temukan alat ukur, mikrokontroler, dan komponen elektronik untuk praktikum, proyek, lomba, PBL, atau skripsi.',
    bg: 'from-blue-600 via-indigo-700 to-slate-900'
  },
  {
    id: 2,
    tag: 'Informasi Penting',
    icon: markRaw(ClockIcon),
    title: 'Jam Operasional Lab',
    desc: 'Lab PLP TIK buka <b>Senin - Jumat</b> pukul <b>08:00 - 16:00 WIB</b>. Pengambilan dan pengembalian alat hanya dilayani pada jam tersebut.',
    bg: 'from-indigo-600 via-violet-700 to-slate-900'
  },
  {
    id: 3,
    tag: 'Aturan Peminjaman',
    icon: markRaw(DocumentCheckIcon),
    title: 'Peminjaman Khusus',
    desc: 'Untuk keperluan lomba, skripsi, atau PBL, sistem akan otomatis membuat surat peminjaman setelah permohonan disetujui admin.',
    bg: 'from-emerald-600 via-teal-700 to-slate-900'
  },
  {
    id: 4,
    tag: 'Aturan Lab',
    icon: markRaw(CameraIcon),
    title: 'Pelaporan Kendala Alat',
    desc: 'Jika alat mengalami kendala, segera buat laporan dengan keterangan jelas dan bukti foto dengan timestamp agar dapat diproses admin.',
    bg: 'from-orange-600 via-red-700 to-slate-900'
  }
]);

const infoCards = [
  {
    title: 'Jam Operasional',
    desc: 'Senin - Jumat pukul 08:00 - 16:00 WIB.',
    icon: markRaw(ClockIcon),
    iconBox: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: 'Surat Otomatis',
    desc: 'Peminjaman khusus akan menghasilkan surat setelah disetujui.',
    icon: markRaw(DocumentCheckIcon),
    iconBox: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Laporan Kendala',
    desc: 'Laporkan kerusakan atau kehilangan alat dari menu riwayat beserta bukti foto dengan timestamp.',
    icon: markRaw(CameraIcon),
    iconBox: 'bg-red-100 text-red-700'
  }
];

const steps = [
  {
    no: 1,
    title: 'Pilih Barang',
    desc: 'Buka menu <b>Katalog</b>, cari alat yang dibutuhkan, dan pastikan stok tersedia.',
    icon: markRaw(MagnifyingGlassIcon),
    iconBox: 'bg-blue-50 text-blue-600',
    hover: 'hover:shadow-blue-500/10 hover:border-blue-100',
    numberHover: 'group-hover:text-blue-50',
    titleHover: 'group-hover:text-blue-600'
  },
  {
    no: 2,
    title: 'Masukkan Keranjang',
    desc: 'Tambahkan barang ke keranjang dan tentukan jumlah unit yang ingin dipinjam.',
    icon: markRaw(ShoppingCartIcon),
    iconBox: 'bg-indigo-50 text-indigo-600',
    hover: 'hover:shadow-indigo-500/10 hover:border-indigo-100',
    numberHover: 'group-hover:text-indigo-50',
    titleHover: 'group-hover:text-indigo-600'
  },
  {
    no: 3,
    title: 'Isi Formulir',
    desc: 'Lakukan <i>checkout</i> dan isi tujuan peminjaman, tanggal, serta data pendukung.',
    icon: markRaw(DocumentTextIcon),
    iconBox: 'bg-violet-50 text-violet-600',
    hover: 'hover:shadow-violet-500/10 hover:border-violet-100',
    numberHover: 'group-hover:text-violet-50',
    titleHover: 'group-hover:text-violet-600'
  },
  {
    no: 4,
    title: 'Tunggu Konfirmasi',
    desc: 'Permohonanmu akan diperiksa oleh admin sebelum disetujui.',
    icon: markRaw(ClockIcon),
    iconBox: 'bg-amber-50 text-amber-600',
    hover: 'hover:shadow-amber-500/10 hover:border-amber-100',
    numberHover: 'group-hover:text-amber-50',
    titleHover: 'group-hover:text-amber-600'
  },
  {
    no: 5,
    title: 'Ambil Barang',
    desc: 'Jika status <b>Disetujui</b>, datang ke lab untuk mengambil barang.',
    icon: markRaw(HandRaisedIcon),
    iconBox: 'bg-emerald-50 text-emerald-600',
    hover: 'hover:shadow-emerald-500/10 hover:border-emerald-100',
    numberHover: 'group-hover:text-emerald-50',
    titleHover: 'group-hover:text-emerald-600'
  },
  {
    no: 6,
    title: 'Pengembalian',
    desc: 'Kembalikan alat tepat waktu agar status peminjaman menjadi <b>Selesai</b>.',
    icon: markRaw(ArrowPathIcon),
    iconBox: 'bg-rose-50 text-rose-600',
    hover: 'hover:shadow-rose-500/10 hover:border-rose-100',
    numberHover: 'group-hover:text-rose-50',
    titleHover: 'group-hover:text-rose-600'
  }
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const startCarousel = () => {
  pauseCarousel();
  slideInterval = setInterval(nextSlide, 8000);
};

const pauseCarousel = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
};

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  pauseCarousel();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.8s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.animate-carousel-progress {
  animation: carouselProgress 8s linear forwards;
}

@keyframes carouselProgress {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>