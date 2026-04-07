<template>
  <div class="space-y-8 animate-fade-in">
    
    <div class="relative bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-xl overflow-hidden">
      <div class="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-20 -mb-16 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <h1 class="text-3xl md:text-4xl font-black mb-3 tracking-tight">
          Halo, {{ authStore.user?.nama || 'Mahasiswa' }}! 👋
        </h1>
        <p class="text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed mb-8">
          Selamat datang di portal layanan Laboratorium PLP TIK. Mulai eksplorasi katalog untuk menemukan alat dan komponen yang kamu butuhkan untuk praktikum atau proyek akhirmu hari ini.
        </p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/catalog" class="px-6 py-3 bg-white text-blue-700 font-black rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 text-sm">
            Eksplor Katalog <ArrowRightIcon class="w-4 h-4 font-bold" />
          </router-link>
          <router-link to="/riwayat" class="px-6 py-3 bg-blue-800/40 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-800/60 transition-all active:scale-95 text-sm backdrop-blur-sm">
            Cek Status Pinjaman
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-100 hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <ClockIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Menunggu Konfirmasi</p>
          <p class="text-2xl font-black text-gray-900">1 <span class="text-sm font-bold text-gray-500 lowercase">Permintaan</span></p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-100 hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <CubeIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Sedang Dipinjam</p>
          <p class="text-2xl font-black text-gray-900">2 <span class="text-sm font-bold text-gray-500 lowercase">Barang</span></p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-100 hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircleIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Peminjaman Selesai</p>
          <p class="text-2xl font-black text-gray-900">12 <span class="text-sm font-bold text-gray-500 lowercase">Riwayat</span></p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-black text-gray-900 tracking-tight">Peminjaman Terkini</h2>
          <p class="text-sm text-gray-500 mt-1">Status 3 transaksi terakhir kamu.</p>
        </div>
        <router-link to="/riwayat" class="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline">
          Lihat Semua
        </router-link>
      </div>

      <div class="space-y-4">
        <div v-for="item in recentHistory" :key="item.id" class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl gap-4 hover:bg-white hover:shadow-sm transition-all">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                :class="{
                  'bg-amber-100 text-amber-600': item.status === 'Menunggu',
                  'bg-blue-100 text-blue-600': item.status === 'Dipinjam',
                  'bg-emerald-100 text-emerald-600': item.status === 'Selesai' || item.status === 'Kembali'
                }">
              <ClockIcon v-if="item.status === 'Menunggu'" class="w-6 h-6" />
              <CubeIcon v-else-if="item.status === 'Dipinjam'" class="w-6 h-6" />
              <CheckCircleIcon v-else class="w-6 h-6" />
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ item.barang }}</p>
              <p class="text-xs font-medium text-gray-500 mt-1">Diajukan pada: {{ item.tanggal }}</p>
            </div>
          </div>
          
          <div class="flex sm:justify-end">
             <span class="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest"
                :class="{
                  'bg-amber-100 text-amber-700': item.status === 'Menunggu',
                  'bg-blue-100 text-blue-700': item.status === 'Dipinjam',
                  'bg-emerald-100 text-emerald-700': item.status === 'Selesai' || item.status === 'Kembali'
                }">
                {{ item.status }}
              </span>
          </div>
        </div>

        <div v-if="recentHistory.length === 0" class="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
          <p class="text-gray-500 font-medium">Belum ada riwayat peminjaman.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { ArrowRightIcon, CubeIcon, ClockIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

// Inisialisasi Auth Store untuk mengambil nama user yang login
const authStore = useAuthStore();

// --- DATA DUMMY (Nanti akan diganti dengan data dari API Express.js) ---
const recentHistory = ref([
    { id: 1, barang: 'Oscilloscope Rigol DS1054Z (+1 Item lain)', tanggal: '08 April 2026', status: 'Menunggu' },
    { id: 2, barang: 'Multimeter Digital Fluke 17B+', tanggal: '05 April 2026', status: 'Dipinjam' },
    { id: 3, barang: 'Kit Arduino Mega 2560', tanggal: '28 Maret 2026', status: 'Selesai' }
]);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>