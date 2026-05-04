<template>
  <div class="space-y-8 animate-fade-in">

    <div
      class="relative bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-xl overflow-hidden">
      <div class="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-20 -mb-16 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <h1 class="text-3xl md:text-4xl font-black mb-3 tracking-tight">
          Halo, {{ authStore.user?.nama || 'Mahasiswa' }}! 👋
        </h1>
        <p class="text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed mb-8">
          Selamat datang di portal layanan Laboratorium PLP TIK. Temukan alat dan komponen yang kamu butuhkan untuk
          kelancaran praktikum atau proyek akhirmu hari ini.
        </p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/catalog"
            class="px-6 py-3 bg-white text-blue-700 font-black rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 text-sm cursor-pointer">
            Eksplor Katalog
            <ArrowRightIcon class="w-4 h-4 font-bold" />
          </router-link>
          <router-link to="/riwayat"
            class="px-6 py-3 bg-blue-800/40 border border-blue-400/30 text-white font-bold rounded-xl hover:bg-blue-800/60 transition-all active:scale-95 text-sm backdrop-blur-sm cursor-pointer">
            Cek Status Pinjaman
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <ClockIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Menunggu Konfirmasi</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
          <p v-else class="text-2xl font-black text-slate-900">
            {{ stats.menunggu || 0 }} <span class="text-sm font-bold text-slate-500 lowercase">Permintaan</span>
          </p>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <CubeIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Sedang Dipinjam</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
          <p v-else class="text-2xl font-black text-slate-900">
            {{ stats.dipinjam || 0 }} <span class="text-sm font-bold text-slate-500 lowercase">Barang</span>
          </p>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircleIcon class="w-7 h-7" />
        </div>
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Peminjaman Selesai</p>
          <div v-if="isLoading" class="h-8 w-16 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
          <p v-else class="text-2xl font-black text-slate-900">
            {{ stats.selesai || 0 }} <span class="text-sm font-bold text-slate-500 lowercase">Riwayat</span>
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Peminjaman Terkini</h2>
          <p class="text-sm text-slate-500 mt-1">Status transaksi terakhir kamu.</p>
        </div>
        <router-link to="/riwayat"
          class="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
          Lihat Semua
        </router-link>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i"
          class="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div class="space-y-2">
              <div class="h-4 bg-slate-200 rounded-md w-48"></div>
              <div class="h-3 bg-slate-200 rounded-md w-24"></div>
            </div>
          </div>
          <div class="h-8 bg-slate-200 rounded-xl w-20"></div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div v-for="item in recentHistory" :key="item.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl gap-4 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="{
              'bg-amber-100 text-amber-600': item.status === 'Menunggu',
              'bg-blue-100 text-blue-600': item.status === 'Dipinjam',
              'bg-emerald-100 text-emerald-600': item.status === 'Selesai' || item.status === 'Kembali',
              'bg-red-100 text-red-600': item.status === 'Ditolak' || item.status === 'Dibatalkan'
            }">
              <ClockIcon v-if="item.status === 'Menunggu'" class="w-6 h-6" />
              <CubeIcon v-else-if="item.status === 'Dipinjam'" class="w-6 h-6" />
              <XCircleIcon v-else-if="item.status === 'Ditolak' || item.status === 'Dibatalkan'" class="w-6 h-6" />
              <CheckCircleIcon v-else class="w-6 h-6" />
            </div>
            <div>
              <p class="font-bold text-slate-900 line-clamp-1">{{ item.Barang?.nama_barang || 'Item Peminjaman' }}</p>
              <p class="text-xs font-medium text-slate-500 mt-1">Diajukan pada: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>

          <div class="flex sm:justify-end shrink-0">
            <span class="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest" :class="{
              'bg-amber-100 text-amber-700': item.status === 'Menunggu',
              'bg-blue-100 text-blue-700': item.status === 'Dipinjam',
              'bg-emerald-100 text-emerald-700': item.status === 'Selesai' || item.status === 'Kembali',
              'bg-red-100 text-red-700': item.status === 'Ditolak' || item.status === 'Dibatalkan'
            }">
              {{ item.status }}
            </span>
          </div>
        </div>

        <div v-if="recentHistory.length === 0"
          class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <CubeIcon class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-slate-500 font-bold">Belum ada riwayat peminjaman.</p>
          <p class="text-slate-400 text-sm mt-1">Mulai pinjam alat pertamamu melalui katalog.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { ArrowRightIcon, CubeIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const { showAlert } = useAlert();

// State Data Dinamis
const recentHistory = ref([]);
const stats = ref({ menunggu: 0, dipinjam: 0, selesai: 0 });
const isLoading = ref(true);

// Fungsi Format Tanggal dari Database
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi Fetch Data Terintegrasi Database
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // Menggunakan Promise.all agar 2 request berjalan bersamaan, mempercepat loading
    const [responseStats, responseHistory] = await Promise.all([
      api.get('/peminjaman/stats/me'), // Ganti URL sesuai endpoint backend kamu
      api.get('/peminjaman/history/me?limit=3') // Mengambil 3 riwayat terakhir
    ]);

    if (responseStats.data?.status === 'success') {
      stats.value = responseStats.data.data;
    }

    if (responseHistory.data?.status === 'success') {
      recentHistory.value = responseHistory.data.data;
    }

  } catch (error) {
    console.error("Gagal memuat dashboard:", error);

    if (error.response?.status !== 401) {
      showAlert("Gagal memuat data dashboard dari server.", "error");
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
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