<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
                <h2 class="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Manajemen Pegawai
                </h2>
                <p class="text-gray-600 mt-1 text-xs md:text-sm">
                    Kelola data, profil, dan otoritas akses staf pengelola laboratorium.
                </p>
            </div>

            <button type="button" @click="fetchUsers"
                class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all shadow-sm shrink-0 font-semibold text-sm cursor-pointer active:scale-95"
                title="Refresh Data">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isLoading }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Segarkan Data</span>
            </button>
        </div>

        <!-- Container -->
        <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-128">
            <!-- Toolbar -->
            <div
                class="p-4 md:p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">
                        Daftar Pengelola Lab
                    </h2>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">
                        Total <span class="font-bold text-blue-600">{{ totalItems }}</span> pengelola terdaftar
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div class="relative w-full sm:w-64">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input v-model="searchQuery" type="text" placeholder="Cari pegawai..."
                            class="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full transition-all bg-gray-50 focus:bg-white" />
                    </div>

                    <button type="button" @click="openAddModal"
                        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 shrink-0 cursor-pointer active:scale-95 flex justify-center items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Pegawai
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center">
                <div
                    class="animate-spin inline-block w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-gray-500 font-medium italic">
                    Menarik data dari server...
                </p>
            </div>

            <!-- Content -->
            <div v-else class="flex-1 flex flex-col">
                <!-- Empty -->
                <div v-if="filteredUsers.length === 0"
                    class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p class="text-gray-500 font-medium">
                        Data pegawai tidak ditemukan.
                    </p>
                </div>

                <!-- Mobile Card -->
                <div v-if="filteredUsers.length > 0" class="md:hidden flex flex-col gap-3 p-4 bg-gray-50/30">
                    <div v-for="pegawai in filteredUsers" :key="pegawai.id"
                        class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative">
                        <div class="flex items-center gap-4 mb-4">
                            <div
                                class="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md uppercase shrink-0">
                                {{ getInitial(pegawai.nama_lengkap) }}
                            </div>

                            <div class="flex-1 overflow-hidden">
                                <h3 class="font-bold text-gray-900 leading-tight truncate">
                                    {{ pegawai.nama_lengkap || "Belum Ada Profil" }}
                                </h3>
                                <p class="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                                    NIP: {{ pegawai.nip || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 border border-gray-100">
                            <div class="flex justify-between items-center gap-2">
                                <span
                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                                <span class="text-xs font-medium text-gray-700 truncate">{{ pegawai.user?.email || "-"
                                    }}</span>
                            </div>

                            <div class="flex justify-between items-center gap-2">
                                <span
                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Akses</span>
                                <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide"
                                    :class="getLevelBadgeClass(pegawai.user?.Role?.level_akses)">
                                    {{ formatLevelAkses(pegawai.user?.Role?.level_akses) }}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <button type="button" @click="openDetailModal(pegawai)"
                                class="py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors active:scale-95 cursor-pointer">
                                Detail
                            </button>
                            <button type="button" @click="openEditModal(pegawai)"
                                class="py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs hover:bg-blue-100 transition-colors active:scale-95 cursor-pointer">
                                Edit
                            </button>
                            <button type="button" @click="deleteUser(getUserId(pegawai))"
                                class="py-2 bg-red-50 text-red-600 font-bold rounded-lg text-xs hover:bg-red-100 transition-colors active:scale-95 cursor-pointer">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Desktop Table -->
                <div v-if="filteredUsers.length > 0" class="hidden md:block overflow-x-auto flex-1">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest border-y border-gray-100">
                                <th class="px-6 py-4 font-black">Profil Pegawai</th>
                                <th class="px-6 py-4 font-black">Kontak Institusi</th>
                                <th class="px-6 py-4 font-black">Otoritas & Akses</th>
                                <th class="px-6 py-4 font-black text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="pegawai in filteredUsers" :key="pegawai.id"
                                class="hover:bg-blue-50/30 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200 uppercase shrink-0">
                                            {{ getInitial(pegawai.nama_lengkap) }}
                                        </div>

                                        <div>
                                            <span class="font-bold text-gray-900 block leading-tight mb-1">
                                                {{ pegawai.nama_lengkap || "Belum Ada Profil" }}
                                            </span>
                                            <span
                                                class="text-[10px] text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                NIP: {{ pegawai.nip || "-" }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="text-sm text-gray-700 font-medium">{{ pegawai.user?.email || "-"
                                            }}</span>

                                        <span v-if="checkVerified(pegawai.user?.email_verified)"
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">
                                            Terverifikasi
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-wider">
                                            Unverified
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="font-bold text-gray-800 text-sm capitalize">
                                            {{ pegawai.user?.Role?.nama_role || "Pegawai" }}
                                        </span>
                                        <span
                                            class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ring-1"
                                            :class="getLevelBadgeClass(pegawai.user?.Role?.level_akses)">
                                            {{ formatLevelAkses(pegawai.user?.Role?.level_akses) }}
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center items-center gap-2">
                                        <button type="button" @click="openDetailModal(pegawai)"
                                            class="text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Detail
                                        </button>
                                        <button type="button" @click="openEditModal(pegawai)"
                                            class="text-blue-600 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Edit
                                        </button>
                                        <button type="button" @click="deleteUser(getUserId(pegawai))"
                                            class="text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalItems > 0 && !searchQuery"
                    class="bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between mt-auto gap-4">
                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 text-sm text-gray-600">
                        <span class="hidden sm:inline font-bold text-xs">Tampilkan:</span>

                        <div class="relative custom-select-limit w-full sm:w-auto">
                            <button type="button" @click.stop="toggleLimitDropdown"
                                class="flex items-center justify-between w-full sm:w-28 px-4 sm:px-3 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-blue-400 transition-all outline-none cursor-pointer shadow-sm">
                                <span>{{ limit }} Baris</span>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4 text-gray-400 transition-transform"
                                    :class="{ 'rotate-180': isLimitOpen }" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="fade">
                                <div v-if="isLimitOpen"
                                    class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-80">
                                    <button v-for="opt in [5, 10, 25, 50]" :key="opt" type="button"
                                        @click="selectLimit(opt)"
                                        class="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="limit === opt ? 'text-blue-600 font-black bg-blue-50/50' : 'text-gray-600 font-bold'">
                                        {{ opt }} Baris
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span
                            class="text-xs font-bold text-gray-500 uppercase tracking-widest text-center flex-1 sm:flex-none">
                            Hal <span class="text-blue-600 font-black">{{ currentPage }}</span> / {{ totalPages }}
                        </span>

                        <div class="flex gap-2 shrink-0">
                            <button type="button" @click="prevPage" :disabled="currentPage === 1"
                                class="p-2 sm:px-3 sm:py-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1">
                                Prev
                            </button>
                            <button type="button" @click="nextPage" :disabled="currentPage === totalPages"
                                class="p-2 sm:px-3 sm:py-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <div v-if="showDetailModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
            @click.self="closeDetailModal">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all relative">
                <!-- Header -->
                <div class="relative bg-linear-to-r from-blue-600 to-indigo-600 p-6 pt-8">
                    <button type="button" @click="closeDetailModal"
                        class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all z-10 cursor-pointer active:scale-95"
                        title="Tutup">
                        ✕
                    </button>

                    <div class="flex items-center gap-5 pr-10">
                        <div
                            class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-3xl shadow-inner border border-white/30 uppercase shrink-0">
                            {{ getInitial(detailUser.nama_lengkap) }}
                        </div>

                        <div class="text-white min-w-0">
                            <h3 class="text-xl font-black leading-tight truncate">
                                {{ detailUser.nama_lengkap || "Detail Pegawai" }}
                            </h3>

                            <p class="text-blue-100 text-xs font-bold mt-1 truncate">
                                {{ detailUser.user?.email || "-" }}
                            </p>

                            <div class="flex flex-wrap gap-2 mt-2">
                                <span
                                    class="inline-block px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase"
                                    :class="detailUser.user?.Role?.level_akses === 'super_admin'
                                            ? 'bg-purple-500/50 border border-purple-300 text-white'
                                            : 'bg-blue-500/50 border border-blue-300 text-white'
                                        ">
                                    {{ formatLevelAkses(detailUser.user?.Role?.level_akses) }}
                                </span>

                                <span v-if="checkVerified(detailUser.user?.email_verified)"
                                    class="inline-block px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase bg-emerald-400/30 border border-emerald-200 text-white">
                                    Terverifikasi
                                </span>

                                <span v-else
                                    class="inline-block px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase bg-red-400/30 border border-red-200 text-white">
                                    Belum Verifikasi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-6 space-y-3 max-h-[70vh] overflow-y-auto hidden-scrollbar">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Nomor Induk Pegawai
                            </p>
                            <p class="text-gray-900 font-bold font-mono wrap-break-word">
                                {{ detailUser.nip || "-" }}
                            </p>
                        </div>

                        <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Nomor Telepon
                            </p>
                            <p class="text-gray-900 font-bold font-mono wrap-break-word">
                                {{ detailUser.user?.no_telepon || detailUser.no_telepon || "-" }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Email Institusi
                        </p>

                        <p class="text-gray-900 font-bold text-sm wrap-break-word">
                            {{ detailUser.user?.email || "-" }}
                        </p>
                    </div>

                    <div
                        class="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Nama Role
                            </p>
                            <p class="text-gray-900 font-black text-sm">
                                {{ detailUser.user?.Role?.nama_role || "-" }}
                            </p>
                        </div>

                        <div class="sm:text-right">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Level Akses
                            </p>
                            <p class="text-gray-900 font-black text-sm">
                                {{ formatLevelAkses(detailUser.user?.Role?.level_akses) }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div class="flex items-center justify-between gap-3 mb-3">
                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    TTD Digital
                                </p>
                                <p class="text-xs font-bold text-gray-500">
                                    Tanda tangan digital pegawai
                                </p>
                            </div>

                            <span v-if="detailUser.user?.ttd_digital"
                                class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase tracking-widest">
                                Ada
                            </span>

                            <span v-else
                                class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-black uppercase tracking-widest">
                                Belum Ada
                            </span>
                        </div>

                        <div v-if="detailUser.user?.ttd_digital"
                            class="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-center">
                            <img :src="detailUser.user.ttd_digital" alt="TTD Digital"
                                class="max-h-28 max-w-full object-contain" />
                        </div>

                        <div v-else class="bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                            <p class="text-sm font-bold text-gray-400">
                                Belum ada file TTD digital.
                            </p>
                        </div>
                    </div>

                    <button type="button" @click="closeDetailModal"
                        class="w-full mt-4 px-6 py-3 text-sm font-black text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition cursor-pointer active:scale-95">
                        Tutup Detail
                    </button>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
            @click.self="closeModal">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto hidden-scrollbar transform transition-all relative">
                <button type="button" @click="closeModal"
                    class="absolute top-4 right-4 w-10 h-10 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors z-10 cursor-pointer active:scale-95">
                    ✕
                </button>

                <div class="mb-6 pr-8">
                    <h3 class="text-xl font-black text-gray-900 leading-tight">
                        {{ isEditMode ? "Edit Data Pegawai" : "Tambah Pegawai Baru" }}
                    </h3>
                    <p class="text-xs text-gray-500 mt-1 font-medium">
                        {{ isEditMode ? "Perbarui informasi dan level akses pegawai." : "Daftarkan akun pengelola laboratorium baru." }}
                    </p>
                </div>

                <form @submit.prevent="saveData" class="space-y-4">
                    <div>
                        <label
                            class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nama
                            Lengkap</label>
                        <input v-model="formData.nama_lengkap" type="text" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold bg-gray-50 focus:bg-white" />
                    </div>

                    <div>
                        <label
                            class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">NIP</label>
                        <input v-model="formData.nip" type="text" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold font-mono bg-gray-50 focus:bg-white" />
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            Nomor Telepon
                        </label>

                        <input v-model="formData.no_telepon" type="text" inputmode="numeric" maxlength="13"
                            placeholder="Contoh: 081234567890"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-bold text-gray-700"
                            @input="formData.no_telepon = formData.no_telepon.replace(/\D/g, '').slice(0, 13)" />
                    </div>

                    <div>
                        <label
                            class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email
                            Institusi</label>
                        <input v-model="formData.email" type="email" required :disabled="isEditMode"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" />
                    </div>

                    <!-- Dropdown Level Akses -->
                    <div class="relative custom-select-role">
                        <label
                            class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Level
                            Akses Pegawai</label>

                        <button type="button" @click.stop="isRoleDropdownOpen = !isRoleDropdownOpen"
                            class="w-full flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-left cursor-pointer">
                            <div class="min-w-0">
                                <p class="text-sm font-black truncate"
                                    :class="formData.role_id ? 'text-gray-800' : 'text-gray-400'">
                                    {{ selectedRoleLabel }}
                                </p>
                                <p v-if="formData.nama_role"
                                    class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                                    {{ formData.nama_role }}
                                </p>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-gray-400 shrink-0 transition-transform"
                                :class="{ 'rotate-180': isRoleDropdownOpen }" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="isRoleDropdownOpen"
                                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-80 max-h-56 overflow-y-auto hidden-scrollbar p-1">
                                <button v-if="pegawaiRoles.length === 0" type="button" disabled
                                    class="w-full px-4 py-3 text-sm text-left text-gray-400 font-bold cursor-not-allowed">
                                    Data level akses belum dimuat
                                </button>

                                <button v-for="role in pegawaiRoles" :key="role.id" type="button"
                                    @click="selectRole(role)"
                                    class="w-full px-4 py-3 rounded-xl text-left transition-all hover:bg-blue-50"
                                    :class="Number(formData.role_id) === Number(role.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'">
                                    <div class="flex items-center justify-between gap-3">
                                        <div class="min-w-0">
                                            <p class="text-sm font-black truncate">{{ formatLevelAkses(role.level_akses)
                                                }}</p>
                                            <p
                                                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                                                {{ role.nama_role }}</p>
                                        </div>
                                        <span v-if="Number(formData.role_id) === Number(role.id)"
                                            class="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                                    </div>
                                </button>
                            </div>
                        </transition>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Role
                                ID</label>
                            <input v-model="formData.role_id" type="text" readonly placeholder="Otomatis"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold outline-none cursor-not-allowed" />
                        </div>
                        <div>
                            <label
                                class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nama
                                Role</label>
                            <input v-model="formData.nama_role" type="text" readonly placeholder="Otomatis"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold outline-none cursor-not-allowed" />
                        </div>
                    </div>

                    <div v-if="isEditMode">
                        <label
                            class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status
                            Verifikasi Email</label>

                        <div class="flex p-1 bg-gray-100 rounded-xl shadow-inner w-full sm:w-2/3">
                            <button type="button" @click="formData.email_verified = true"
                                :class="formData.email_verified ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
                                class="flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider cursor-pointer">
                                Sudah
                            </button>
                            <button type="button" @click="formData.email_verified = false"
                                :class="!formData.email_verified ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
                                class="flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider cursor-pointer">
                                Belum
                            </button>
                        </div>
                    </div>

                    <div v-if="!isEditMode">
                        <label
                            class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>

                        <div class="relative">
                            <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" required
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none pr-12 transition-all text-sm font-bold bg-gray-50 focus:bg-white" />

                            <button type="button" @click="togglePassword"
                                class="absolute inset-y-0 right-2 px-2 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                                :title="showPassword ? 'Sembunyikan password' : 'Tampilkan password'">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 1.01-2.27 2.67-4.18 4.73-5.42M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.1 6.1L3 3m18 18l-3.1-3.1M9.88 9.88l4.24 4.24M15.53 8.47A2.99 2.99 0 0114.12 9.88M17.94 17.94C20.02 16.57 21.6 14.49 23 12c-1.73-3.89-6-7-11-7-1.04 0-2.04.14-2.98.39" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button type="button" @click="closeModal"
                            class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer active:scale-95">
                            Batal
                        </button>

                        <button type="submit"
                            class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95">
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useAlert } from "../composables/useAlert";
import { useConfirm } from "../composables/useConfirm";

const users = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const error = ref(null);
const refRoles = ref([]);

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);

const showModal = ref(false);
const isEditMode = ref(false);
const showPassword = ref(false);
const isRoleDropdownOpen = ref(false);
const showDetailModal = ref(false);
const detailUser = ref({});
const isLimitOpen = ref(false);
const isSubmitting = ref(false);

const apiBaseUrl = "http://localhost:3000/api";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const emptyForm = () => ({
    id: null,
    nama_lengkap: "",
    nip: "",
    email: "",
    email_verified: false,
    password: "",
    role_id: null,
    nama_role: "",
    level_akses: "",
});

const formData = ref({
    id: null,
    nama_lengkap: "",
    email: "",
    password: "",
    no_telepon: "",
    nip: "",
    role_id: "",
    nama_role: "",
    level_akses: "",
    email_verified: true,
    ttd_digital_file: null,
});

const resetForm = () => {
    formData.value = {
        id: null,
        nama_lengkap: "",
        email: "",
        password: "",
        no_telepon: "",
        nip: "",
        role_id: "",
        nama_role: "",
        level_akses: "",
        email_verified: true,
        ttd_digital_file: null,
    };
};

const pegawaiRoles = computed(() => {
    return refRoles.value.filter((role) => role.level_akses !== "peminjam");
});

const formatLevelAkses = (value) => {
    if (!value) return "N/A";

    return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getLevelBadgeClass = (level) => {
    if (level === "super_admin") {
        return "bg-purple-100 text-purple-700 ring-purple-200";
    }

    if (level === "admin") {
        return "bg-blue-100 text-blue-700 ring-blue-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
};

const checkVerified = (val) => {
    if (val === true || val === 1) return true;

    if (typeof val === "string") {
        const normalized = val.trim().toLowerCase();
        return normalized === "true" || normalized === "1";
    }

    return false;
};

const getInitial = (value) => {
    if (!value) return "?";
    return String(value).charAt(0).toUpperCase();
};

const getUserId = (pegawai) => {
    return pegawai?.user_id || pegawai?.user?.id || pegawai?.User?.id || null;
};

const selectedRoleLabel = computed(() => {
    const selected = refRoles.value.find(
        (role) => Number(role.id) === Number(formData.value.role_id)
    );

    return selected?.level_akses ? formatLevelAkses(selected.level_akses) : "Pilih Level Akses";
});

const selectRole = (role) => {
    formData.value.role_id = role.id;
    formData.value.nama_role = role.nama_role;
    formData.value.level_akses = role.level_akses;
    isRoleDropdownOpen.value = false;
};

const syncRoleFields = () => {
    const selectedRole = refRoles.value.find(
        (role) => Number(role.id) === Number(formData.value.role_id)
    );

    formData.value.nama_role = selectedRole?.nama_role || formData.value.nama_role || "";
    formData.value.level_akses = selectedRole?.level_akses || formData.value.level_akses || "";
};

const fetchRoles = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/ref/role`, {
            headers: authHeader(),
        });

        refRoles.value = response.data?.data || [];
        syncRoleFields();
    } catch (err) {
        console.error("Gagal memuat data role:", err);
        showAlert("Gagal memuat data role.", "error");
    }
};

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;

    const term = searchQuery.value.toLowerCase();

    return users.value.filter((pegawai) => {
        const nama = pegawai.nama_lengkap?.toLowerCase() || "";
        const nip = pegawai.nip?.toLowerCase() || "";
        const email = pegawai.user?.email?.toLowerCase() || "";
        const role = pegawai.user?.Role?.nama_role?.toLowerCase() || "";
        const level = pegawai.user?.Role?.level_akses?.toLowerCase() || "";

        return nama.includes(term) || nip.includes(term) || email.includes(term) || role.includes(term) || level.includes(term);
    });
});

const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        const response = await axios.get(`${apiBaseUrl}/users/pegawai?page=${currentPage.value}&limit=${limit.value}`, {
            headers: authHeader(),
        });

        users.value = response.data?.data || [];

        if (response.data?.pagination) {
            totalPages.value = response.data.pagination.totalPages || 1;
            totalItems.value = response.data.pagination.totalItems || 0;
            currentPage.value = response.data.pagination.currentPage || 1;
        } else {
            totalItems.value = users.value.length;
            totalPages.value = 1;
        }
    } catch (err) {
        error.value = "Koneksi ke server terputus.";
        console.error("Fetch Error:", err);
        showAlert("Gagal memuat data pegawai.", "error");
    } finally {
        isLoading.value = false;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchUsers();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchUsers();
    }
};

const openDetailModal = (pegawai) => {
    detailUser.value = pegawai;
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    detailUser.value = {};
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const openAddModal = () => {
    isEditMode.value = false;
    showPassword.value = false;
    isRoleDropdownOpen.value = false;
    formData.value = emptyForm();
    formData.value.email_verified = true;
    showModal.value = true;
};

const openEditModal = (pegawai) => {
    isEditMode.value = true;
    showPassword.value = false;
    isRoleDropdownOpen.value = false;

    const roleId = pegawai.user?.role_id || pegawai.user?.Role?.id || null;
    const selectedRole = refRoles.value.find((role) => Number(role.id) === Number(roleId));

    formData.value = {
        id: getUserId(pegawai),
        nama_lengkap: pegawai.nama_lengkap || "",
        nip: pegawai.nip || "",
        email: pegawai.user?.email || "",
        email_verified: checkVerified(pegawai.user?.email_verified),
        password: "",
        role_id: roleId,
        nama_role: selectedRole?.nama_role || pegawai.user?.Role?.nama_role || "",
        level_akses: selectedRole?.level_akses || pegawai.user?.Role?.level_akses || "",
    };

    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isRoleDropdownOpen.value = false;
    showPassword.value = false;
};

const saveData = async () => {
    // VALIDASI MASUK DI SINI
    if (!formData.value.nama_lengkap.trim()) {
        showAlert("Nama lengkap wajib diisi.", "error");
        return;
    }

    if (!formData.value.email.trim()) {
        showAlert("Email wajib diisi.", "error");
        return;
    }

    if (!isEditMode.value && !formData.value.password.trim()) {
        showAlert("Password wajib diisi.", "error");
        return;
    }

    if (!formData.value.no_telepon.trim()) {
        showAlert("Nomor telepon wajib diisi.", "error");
        return;
    }

    if (formData.value.no_telepon.length < 10) {
        showAlert("Nomor telepon minimal 10 digit.", "error");
        return;
    }

    if (!formData.value.nip.trim()) {
        showAlert("NIP wajib diisi.", "error");
        return;
    }

    if (!formData.value.role_id) {
        showAlert("Level akses pegawai wajib dipilih.", "error");
        return;
    }

    // BARU MULAI PROSES SIMPAN
    isSubmitting.value = true;

    try {
        const payload = new FormData();

        payload.append("nama_lengkap", formData.value.nama_lengkap);
        payload.append("email", formData.value.email);
        payload.append("no_telepon", formData.value.no_telepon);
        payload.append("nip", formData.value.nip);
        payload.append("role_id", formData.value.role_id);
        payload.append("email_verified", formData.value.email_verified);

        if (!isEditMode.value) {
            payload.append("password", formData.value.password);
        }

        if (formData.value.ttd_digital_file) {
            payload.append("ttd_digital", formData.value.ttd_digital_file);
        }

        if (isEditMode.value) {
            await axios.put(`${apiBaseUrl}/users/${formData.value.id}`, payload, {
                headers: {
                    ...authHeader(),
                    "Content-Type": "multipart/form-data",
                },
            });

            showAlert("Data pegawai berhasil diperbarui.", "success");
        } else {
            await axios.post(`${apiBaseUrl}/users`, payload, {
                headers: {
                    ...authHeader(),
                    "Content-Type": "multipart/form-data",
                },
            });

            showAlert("Data pegawai berhasil ditambahkan.", "success");
        }

        closeModal();
        await fetchUsers();
    } catch (error) {
        console.error("Save Error:", error);
        console.error("Response Error:", JSON.stringify(error.response?.data, null, 2));

        showAlert(
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            "Gagal menyimpan data pegawai.",
            "error"
        );
    } finally {
        isSubmitting.value = false;
    }
};

const deleteUser = (id) => {
    if (!id) {
        showAlert("ID user tidak ditemukan.", "error");
        return;
    }

    showConfirm(
        "Apakah Anda yakin ingin menghapus data pegawai ini?",
        async () => {
            try {
                await axios.delete(`${apiBaseUrl}/users/${id}`, {
                    headers: authHeader(),
                });

                showAlert("Data pegawai berhasil dihapus.", "success");

                if (filteredUsers.value.length === 1 && currentPage.value > 1) {
                    currentPage.value--;
                }

                await fetchUsers();
            } catch (err) {
                console.error("Delete Error:", err);
                showAlert(err.response?.data?.message || "Gagal menghapus data pegawai.", "error");
            }
        },
        null,
        "Ya, Hapus",
        "red",
        "Konfirmasi Hapus"
    );
};

const toggleLimitDropdown = () => {
    isLimitOpen.value = !isLimitOpen.value;
};

const selectLimit = (newLimit) => {
    limit.value = newLimit;
    currentPage.value = 1;
    isLimitOpen.value = false;
    fetchUsers();
};

const handleClickOutside = (e) => {
    if (!e.target.closest(".custom-select-limit")) {
        isLimitOpen.value = false;
    }

    if (!e.target.closest(".custom-select-role")) {
        isRoleDropdownOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener("click", handleClickOutside);
    fetchRoles();
    fetchUsers();
});

onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
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

.hidden-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hidden-scrollbar::-webkit-scrollbar {
    display: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
