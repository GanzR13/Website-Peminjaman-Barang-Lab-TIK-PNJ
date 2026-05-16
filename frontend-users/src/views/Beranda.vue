<template>
  <div class="space-y-8 animate-fade-in pb-10">

    <!-- WELCOME BANNER -->
    <div class="relative bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden">
      <!-- Ornamen Background -->
      <div class="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-20 -mb-16 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <h1 class="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
          Halo, {{ namaPengguna }}! 👋
        </h1>
        <p class="text-blue-100 max-w-2xl text-sm md:text-lg font-medium leading-relaxed mb-8">
          Selamat datang di Sistem Informasi Manajemen  Laboratorium (SI-Lab) PLP TIK PNJ. 
          Temukan alat dan komponen elektronik yang kamu butuhkan untuk kelancaran praktikum atau proyek akhirmu di sini.
        </p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/catalog"
            class="px-8 py-3.5 bg-white text-blue-700 font-black rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
            <MagnifyingGlassIcon class="w-5 h-5 font-bold" />
            Cari Barang Sekarang
          </router-link>
          <router-link to="/riwayat"
            class="px-8 py-3.5 bg-blue-800/40 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-800/60 transition-all active:scale-95 flex items-center gap-2 backdrop-blur-sm cursor-pointer">
            <ClipboardDocumentListIcon class="w-5 h-5" />
            Cek Riwayat Saya
          </router-link>
        </div>
      </div>
    </div>

    <!-- TATA CARA PEMINJAMAN -->
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Tata Cara Peminjaman</h2>
        <p class="text-slate-500 mt-1 text-sm font-medium">Ikuti 6 langkah mudah berikut untuk meminjam alat di Laboratorium PLP TIK.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-blue-50/50 transition-colors z-0 select-none">1</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <MagnifyingGlassIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Pilih Barang</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Buka menu <b>Katalog</b>, cari alat atau komponen yang kamu butuhkan, dan pastikan stoknya tersedia.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-indigo-50/50 transition-colors z-0 select-none">2</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShoppingCartIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Masukkan Keranjang</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Tambahkan barang ke keranjang dan tentukan jumlah unit yang ingin kamu pinjam sesuai kebutuhan.
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-violet-50/50 transition-colors z-0 select-none">3</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <DocumentTextIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Isi Formulir</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Lakukan <i>Checkout</i> dan isi detail permohonan seperti tujuan peminjaman, tanggal, dan nama dosen.
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-amber-50/50 transition-colors z-0 select-none">4</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ClockIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Tunggu Konfirmasi</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Permohonanmu akan berstatus <b>Menunggu</b>. Silakan tunggu Admin Lab untuk menyetujui permohonanmu.
            </p>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-emerald-50/50 transition-colors z-0 select-none">5</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <HandRaisedIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Ambil Barang</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Jika status sudah <b>Disetujui</b>, datanglah ke Lab untuk mengambil barang. Status akan berubah menjadi <b>Dipinjam</b>.
            </p>
          </div>
        </div>

        <!-- Step 6 -->
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 text-[100px] font-black text-slate-50/50 group-hover:text-rose-50/50 transition-colors z-0 select-none">6</div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <ArrowPathIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">Kembalikan Tepat Waktu</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">
              Jaga barang dengan baik dan kembalikan ke Lab sesuai tanggal yang disepakati agar status menjadi <b>Selesai</b>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- INFORMASI PENTING -->
    <div class="bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div class="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
        <ExclamationTriangleIcon class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-xl font-black text-slate-900 mb-2">Informasi Penting</h3>
        <p class="text-sm text-slate-700 font-medium leading-relaxed">
          Peminjaman yang terlambat dikembalikan, hilang, atau rusak menjadi tanggung jawab penuh peminjam. 
          Pastikan untuk selalu memeriksa kondisi barang saat pengambilan dan sebelum pengembalian.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { 
  MagnifyingGlassIcon, 
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ClockIcon,
  HandRaisedIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

// Logika cerdas untuk mengambil nama sapaan yang paling tepat
const namaPengguna = computed(() => {
  const user = authStore.user;
  if (!user) return 'Pengguna';
  
  // 1. Ambil dari properti 'nama' yang sudah distandardisasi oleh fetch profile
  if (user.nama) return user.nama;

  // 2. Fallback terakhir: ambil dari email sebelum tanda @ jika nama kosong
  if (user.email) return user.email.split('@')[0];
  
  return 'Mahasiswa/Dosen';
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
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