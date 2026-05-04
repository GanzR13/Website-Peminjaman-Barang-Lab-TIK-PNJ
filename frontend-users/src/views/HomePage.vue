<template>
    <div class="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-blue-200 selection:text-blue-900">

        <nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
            <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                    </div>
                    <span class="text-2xl font-black text-slate-800 tracking-tight">SI-LAB</span>
                </div>

                <div class="flex items-center gap-4">
                    <template v-if="authStore.token">
                        <router-link :to="dashboardRoute"
                            class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                            Buka Dashboard
                        </router-link>
                    </template>
                    <template v-else>
                        <router-link to="/login"
                            class="hidden sm:block px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                            Masuk
                        </router-link>
                        <router-link to="/register"
                            class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                            Daftar Akun
                        </router-link>
                    </template>
                </div>
            </div>
        </nav>

        <main class="flex-1 flex flex-col justify-center relative pt-20 overflow-hidden">
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-b from-blue-100/50 to-transparent rounded-full blur-3xl -z-10">
            </div>

            <div class="max-w-4xl mx-auto px-6 text-center py-20 animate-fade-in-up">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Laboratorium PLP TIK - PNJ
                </div>

                <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    Manajemen Peminjaman <br class="hidden md:block" />
                    <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Alat
                        Laboratorium</span> Lebih Mudah
                </h1>

                <p class="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                    Cari, pinjam, dan pantau status peminjaman alat praktikum maupun komponen proyek akhir secara
                    real-time
                    dalam satu platform terpadu.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <router-link :to="authStore.token ? dashboardRoute : '/register'"
                        class="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-base font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                        Mulai Pinjam Alat
                        <ArrowRightIcon class="w-5 h-5" />
                    </router-link>
                    <router-link to="/catalog"
                        class="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-base font-bold rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <MagnifyingGlassIcon class="w-5 h-5" /> Lihat Katalog
                    </router-link>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 bg-white w-full z-10">
                <div class="text-center mb-16">
                    <h2 class="text-2xl md:text-3xl font-black text-slate-900">Kenapa Menggunakan SI-LAB?</h2>
                    <p class="text-slate-500 mt-2 font-medium">Digitalisasi layanan untuk efisiensi kegiatan akademik.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div class="text-center group">
                        <div
                            class="w-20 h-20 mx-auto bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-blue-100/50">
                            <CubeIcon class="w-10 h-10" />
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-3">Katalog Terlengkap</h3>
                        <p class="text-slate-500 leading-relaxed text-sm">Cek ketersediaan stok fisik alat dan komponen
                            secara
                            langsung sebelum mengajukan peminjaman ke laboran.</p>
                    </div>

                    <div class="text-center group">
                        <div
                            class="w-20 h-20 mx-auto bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-emerald-100/50">
                            <ClockIcon class="w-10 h-10" />
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-3">Pantau Real-time</h3>
                        <p class="text-slate-500 leading-relaxed text-sm">Lacak status pengajuanmu dari tahap menunggu
                            konfirmasi, sedang dipinjam, hingga dikembalikan.</p>
                    </div>

                    <div class="text-center group">
                        <div
                            class="w-20 h-20 mx-auto bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-indigo-100/50">
                            <ShieldCheckIcon class="w-10 h-10" />
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-3">Aman & Terdata</h3>
                        <p class="text-slate-500 leading-relaxed text-sm">Semua riwayat transaksi tercatat rapi di
                            sistem untuk
                            mencegah kehilangan dan memastikan akuntabilitas alat lab.</p>
                    </div>
                </div>
            </div>
        </main>

        <footer class="bg-slate-900 py-8 border-t border-slate-800">
            <div
                class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div class="flex items-center gap-2 justify-center md:justify-start text-white">
                    <div class="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                    </div>
                    <span class="font-black tracking-wide text-lg">SI-LAB</span>
                </div>
                <p class="text-slate-400 text-sm font-medium">
                    &copy; {{ new Date().getFullYear() }} Teknik Informatika dan Komputer. Politeknik Negeri Jakarta.
                </p>
            </div>
        </footer>

    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    CubeIcon,
    ClockIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

const dashboardRoute = computed(() => {
    if (!authStore.user) return '/login';

    const role = authStore.user.role_id;
    const level = authStore.user.level?.toLowerCase();

    // Spesifikkan HANYA Super Admin dan Admin Lab yang masuk ke /admin/dashboard
    // Sesuaikan angka 1 dan 2 dengan ID Role Admin di database Anda
    const isAdmin = role === 1 ||
        role === 2 ||
        level === 'admin' ||
        level === 'super_admin' ||
        level === 'laboran';

    // Jika bukan admin (berarti Dosen, Pegawai, atau Mahasiswa), arahkan ke dashboard user
    return isAdmin ? '/admin/dashboard' : '/dashboard';
});
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>