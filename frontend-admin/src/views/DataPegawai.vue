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

            <button
                @click="fetchUsers"
                class="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all shadow-sm shrink-0 font-semibold text-sm cursor-pointer active:scale-95"
                title="Refresh Data"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :class="{ 'animate-spin': isLoading }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                <span>Segarkan Data</span>
            </button>
        </div>

        <!-- Container -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-125">
            <!-- Toolbar -->
            <div class="p-4 md:p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">
                        Daftar Pengelola Lab
                    </h2>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">
                        Total
                        <span class="font-bold text-blue-600">{{ totalItems }}</span>
                        pengelola terdaftar
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div class="relative w-full sm:w-64">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>

                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari pegawai..."
                            class="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <button
                        @click="openAddModal"
                        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 shrink-0 cursor-pointer active:scale-95 flex justify-center items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Pegawai
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center">
                <div class="animate-spin inline-block w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p class="text-gray-500 font-medium italic">
                    Menarik data dari server...
                </p>
            </div>

            <!-- Content -->
            <div v-else class="flex-1 flex flex-col">
                <!-- Empty -->
                <div
                    v-if="filteredUsers.length === 0"
                    class="p-12 md:p-20 text-center flex-1 flex flex-col items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-16 w-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <p class="text-gray-500 font-medium">
                        Data pegawai tidak ditemukan.
                    </p>
                </div>

                <!-- Mobile Card -->
                <div v-if="filteredUsers.length > 0" class="md:hidden flex flex-col gap-3 p-4 bg-gray-50/30">
                    <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative"
                    >
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md uppercase shrink-0">
                                {{ user.nama_lengkap?.charAt(0) || "?" }}
                            </div>

                            <div class="flex-1 overflow-hidden">
                                <h3 class="font-bold text-gray-900 leading-tight truncate">
                                    {{ user.nama_lengkap || "Belum Ada Profil" }}
                                </h3>
                                <p class="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                                    NIP: {{ user.nip || "-" }}
                                </p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 border border-gray-100">
                            <div class="flex justify-between items-center gap-2">
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Email
                                </span>
                                <span class="text-xs font-medium text-gray-700 truncate">
                                    {{ user.user?.email || "-" }}
                                </span>
                            </div>

                            <div class="flex justify-between items-center gap-2">
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Akses
                                </span>
                                <span
                                    class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide"
                                    :class="getLevelBadgeClass(user.user?.Role?.level_akses)"
                                >
                                    {{ formatLevelAkses(user.user?.Role?.level_akses) }}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <button
                                @click="openDetailModal(user)"
                                class="py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors active:scale-95 cursor-pointer"
                            >
                                Detail
                            </button>
                            <button
                                @click="openEditModal(user)"
                                class="py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs hover:bg-blue-100 transition-colors active:scale-95 cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                @click="deleteUser(user.id)"
                                class="py-2 bg-red-50 text-red-600 font-bold rounded-lg text-xs hover:bg-red-100 transition-colors active:scale-95 cursor-pointer"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Desktop Table -->
                <div v-if="filteredUsers.length > 0" class="hidden md:block overflow-x-auto flex-1">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest border-y border-gray-100">
                                <th class="px-6 py-4 font-black">Profil Pegawai</th>
                                <th class="px-6 py-4 font-black">Kontak Institusi</th>
                                <th class="px-6 py-4 font-black">Otoritas & Akses</th>
                                <th class="px-6 py-4 font-black text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-50">
                            <tr
                                v-for="user in filteredUsers"
                                :key="user.id"
                                class="hover:bg-blue-50/30 transition-colors"
                            >
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200 uppercase shrink-0">
                                            {{ user.nama_lengkap?.charAt(0) || "?" }}
                                        </div>

                                        <div>
                                            <span class="font-bold text-gray-900 block leading-tight mb-1">
                                                {{ user.nama_lengkap || "Belum Ada Profil" }}
                                            </span>
                                            <span class="text-[10px] text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                NIP: {{ user.nip || "-" }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="text-sm text-gray-700 font-medium">
                                            {{ user.user?.email || "-" }}
                                        </span>

                                        <span
                                            v-if="checkVerified(user.user?.email_verified)"
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider"
                                        >
                                            Terverifikasi
                                        </span>

                                        <span
                                            v-else
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-wider"
                                        >
                                            Unverified
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="font-bold text-gray-800 text-sm capitalize">
                                            {{ user.user?.Role?.nama_role || "Pegawai" }}
                                        </span>

                                        <span
                                            class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ring-1"
                                            :class="getLevelBadgeClass(user.user?.Role?.level_akses)"
                                        >
                                            {{ formatLevelAkses(user.user?.Role?.level_akses) }}
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center items-center gap-2">
                                        <button
                                            @click="openDetailModal(user)"
                                            class="text-indigo-600 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95"
                                        >
                                            Detail
                                        </button>
                                        <button
                                            @click="openEditModal(user)"
                                            class="text-blue-600 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            @click="deleteUser(user.id)"
                                            class="text-red-500 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div
                    v-if="totalItems > 0 && !searchQuery"
                    class="bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between mt-auto gap-4"
                >
                    <div class="flex items-center justify-between w-full sm:w-auto gap-4 text-sm text-gray-600">
                        <span class="hidden sm:inline font-bold text-xs">Tampilkan:</span>

                        <div class="relative custom-select-limit w-full sm:w-auto">
                            <button
                                @click.stop="toggleLimitDropdown"
                                class="flex items-center justify-between w-full sm:w-28 px-4 sm:px-3 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-blue-400 transition-all outline-none cursor-pointer shadow-sm"
                            >
                                <span>{{ limit }} Baris</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4 text-gray-400 transition-transform"
                                    :class="{ 'rotate-180': isLimitOpen }"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="fade">
                                <div
                                    v-if="isLimitOpen"
                                    class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30"
                                >
                                    <button
                                        v-for="opt in [5, 10, 25, 50]"
                                        :key="opt"
                                        @click="selectLimit(opt)"
                                        class="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="limit === opt ? 'text-blue-600 font-black bg-blue-50/50' : 'text-gray-600 font-bold'"
                                    >
                                        {{ opt }} Baris
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest text-center flex-1 sm:flex-none">
                            Hal
                            <span class="text-blue-600 font-black">{{ currentPage }}</span>
                            / {{ totalPages }}
                        </span>

                        <div class="flex gap-2 shrink-0">
                            <button
                                @click="prevPage"
                                :disabled="currentPage === 1"
                                class="p-2 sm:px-3 sm:py-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1"
                            >
                                Prev
                            </button>
                            <button
                                @click="nextPage"
                                :disabled="currentPage === totalPages"
                                class="p-2 sm:px-3 sm:py-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <div
            v-if="showDetailModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
            @click.self="closeDetailModal"
        >
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all relative">
                <button
                    @click="closeDetailModal"
                    class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all z-10 cursor-pointer"
                >
                    ✕
                </button>

                <div class="bg-linear-to-r from-blue-600 to-indigo-600 p-6 pt-8 flex items-center gap-5">
                    <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-3xl shadow-inner border border-white/30 uppercase shrink-0">
                        {{ detailUser.nama_lengkap?.charAt(0) || "?" }}
                    </div>

                    <div class="text-white pr-8">
                        <h3 class="text-xl font-black leading-tight">
                            {{ detailUser.nama_lengkap }}
                        </h3>
                        <span
                            class="inline-block px-2 py-0.5 mt-1.5 rounded text-[9px] font-black tracking-widest uppercase"
                            :class="detailUser.user?.Role?.level_akses === 'super_admin' ? 'bg-purple-500/50 border border-purple-300' : 'bg-blue-500/50 border border-blue-300'"
                        >
                            {{ formatLevelAkses(detailUser.user?.Role?.level_akses) }}
                        </span>
                    </div>
                </div>

                <div class="p-6 space-y-3">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Nomor Induk Pegawai (NIP)
                        </p>
                        <p class="text-gray-900 font-bold font-mono">
                            {{ detailUser.nip || "-" }}
                        </p>
                    </div>

                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Email Institusi
                        </p>
                        <p class="text-gray-900 font-bold text-sm">
                            {{ detailUser.user?.email || "-" }}
                        </p>

                        <span
                            v-if="checkVerified(detailUser.user?.email_verified)"
                            class="inline-block px-2.5 py-1 mt-2 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200"
                        >
                            Terverifikasi
                        </span>
                        <span
                            v-else
                            class="inline-block px-2.5 py-1 mt-2 rounded-md text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200"
                        >
                            Unverified
                        </span>
                    </div>

                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                No. Telepon / WA
                            </p>
                            <p class="text-gray-900 font-bold text-sm">
                                {{ detailUser.user?.no_telepon || "Belum diisi" }}
                            </p>
                        </div>

                        <div class="sm:text-right mt-1 sm:mt-0">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Level Akses
                            </p>
                            <p class="text-gray-900 font-black text-sm">
                                {{ formatLevelAkses(detailUser.user?.Role?.level_akses) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
            @click.self="closeModal"
        >
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-visible transform transition-all relative">
                <button
                    @click="closeModal"
                    class="absolute top-4 right-4 w-10 h-10 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors z-10 cursor-pointer active:scale-95"
                >
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
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            Nama Lengkap
                        </label>
                        <input
                            v-model="formData.nama_lengkap"
                            type="text"
                            required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            NIP
                        </label>
                        <input
                            v-model="formData.nip"
                            type="text"
                            required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold font-mono bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            Email Institusi
                        </label>
                        <input
                            v-model="formData.email"
                            type="email"
                            required
                            :disabled="isEditMode"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        />
                    </div>

                    <!-- Dropdown Level Akses -->
                    <div class="relative custom-select-role">
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            Level Akses Pegawai
                        </label>

                        <button
                            type="button"
                            @click.stop="isRoleDropdownOpen = !isRoleDropdownOpen"
                            class="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-700 cursor-pointer"
                        >
                            <span class="truncate pr-2">
                                {{ selectedRoleLabel }}
                            </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-gray-400 shrink-0 transition-transform"
                                :class="{ 'rotate-180': isRoleDropdownOpen }"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div
                                v-if="isRoleDropdownOpen"
                                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-80 max-h-48 overflow-y-auto"
                            >
                                <button
                                    v-if="refRoles.length === 0"
                                    type="button"
                                    disabled
                                    class="w-full px-4 py-3 text-sm text-left text-gray-400 font-bold cursor-not-allowed"
                                >
                                    Data level akses belum dimuat
                                </button>

                                <button
                                    v-for="role in refRoles"
                                    :key="role.id"
                                    type="button"
                                    @click="selectRole(role)"
                                    class="w-full px-4 py-3 text-sm text-left hover:bg-blue-50 font-bold text-gray-700 transition-colors"
                                    :class="Number(formData.role_id) === Number(role.id) ? 'bg-blue-50 text-blue-700' : ''"
                                >
                                    {{ formatLevelAkses(role.level_akses) }}
                                </button>
                            </div>
                        </transition>
                    </div>

                    <div v-if="isEditMode">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                            Status Verifikasi Email
                        </label>

                        <div class="flex p-1 bg-gray-100 rounded-xl shadow-inner w-full sm:w-2/3">
                            <button
                                type="button"
                                @click="formData.email_verified = true"
                                :class="formData.email_verified ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
                                class="flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                            >
                                Sudah
                            </button>
                            <button
                                type="button"
                                @click="formData.email_verified = false"
                                :class="!formData.email_verified ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
                                class="flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                            >
                                Belum
                            </button>
                        </div>
                    </div>

                    <div v-if="!isEditMode">
                        <label class="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                            Password
                        </label>

                        <div class="relative">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="formData.password"
                                required
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none pr-12 transition-all text-sm font-bold bg-gray-50 focus:bg-white"
                            />

                            <button
                                type="button"
                                @click="togglePassword"
                                class="absolute inset-y-0 right-2 px-2 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                            >
                                {{ showPassword ? "🙈" : "👁️" }}
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            @click="closeModal"
                            class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer active:scale-95"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer active:scale-95"
                        >
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

const apiBaseUrl = "http://localhost:3000/api";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const formData = ref({
    id: null,
    nama_lengkap: "",
    nip: "",
    email: "",
    email_verified: false,
    password: "",
    role_id: null,
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

const selectedRoleLabel = computed(() => {
    const selected = refRoles.value.find(
        (role) => Number(role.id) === Number(formData.value.role_id)
    );

    return selected?.level_akses
        ? formatLevelAkses(selected.level_akses)
        : "Pilih Level Akses";
});

const selectRole = (role) => {
    formData.value.role_id = role.id;
    isRoleDropdownOpen.value = false;
};

const fetchRoles = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/ref/role`, {
            headers: authHeader(),
        });

        refRoles.value = response.data?.data || [];
    } catch (error) {
        console.error("Gagal memuat data role:", error);
        showAlert("Gagal memuat data role.", "error");
    }
};

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;

    const term = searchQuery.value.toLowerCase();

    return users.value.filter((user) => {
        const nama = user.nama_lengkap?.toLowerCase() || "";
        const nip = user.nip?.toLowerCase() || "";
        const email = user.user?.email?.toLowerCase() || "";

        return nama.includes(term) || nip.includes(term) || email.includes(term);
    });
});

const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        const response = await axios.get(
            `${apiBaseUrl}/users/pegawai?page=${currentPage.value}&limit=${limit.value}`,
            { headers: authHeader() }
        );

        users.value = response.data?.data || [];

        if (response.data?.pagination) {
            totalPages.value = response.data.pagination.totalPages;
            totalItems.value = response.data.pagination.totalItems;
            currentPage.value = response.data.pagination.currentPage;
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

const openDetailModal = (user) => {
    detailUser.value = user;
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

    formData.value = {
        id: null,
        nama_lengkap: "",
        nip: "",
        email: "",
        email_verified: true,
        password: "",
        role_id: refRoles.value[0]?.id || null,
    };

    showModal.value = true;
};

const openEditModal = (user) => {
    isEditMode.value = true;
    showPassword.value = false;
    isRoleDropdownOpen.value = false;

    formData.value = {
        id: user.id,
        nama_lengkap: user.nama_lengkap || "",
        nip: user.nip || "",
        email: user.user?.email || "",
        email_verified: checkVerified(user.user?.email_verified),
        password: "",
        role_id: user.user?.role_id || user.user?.Role?.id || null,
    };

    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isRoleDropdownOpen.value = false;
};

const saveData = async () => {
    try {
        if (!formData.value.role_id) {
            showAlert("Level akses pegawai wajib dipilih.", "error");
            return;
        }

        const payload = {
            nama_lengkap: formData.value.nama_lengkap,
            nip: formData.value.nip,
            email: formData.value.email,
            email_verified: formData.value.email_verified,
            role_id: formData.value.role_id,
        };

        if (!isEditMode.value) {
            payload.password = formData.value.password;
        }

        if (isEditMode.value) {
            await axios.put(`${apiBaseUrl}/users/pegawai/${formData.value.id}`, payload, {
                headers: authHeader(),
            });

            showAlert("Data pegawai berhasil diperbarui.", "success");
        } else {
            await axios.post(`${apiBaseUrl}/users/pegawai`, payload, {
                headers: authHeader(),
            });

            showAlert("Data pegawai berhasil ditambahkan.", "success");
        }

        closeModal();
        await fetchUsers();
    } catch (err) {
        console.error("Save Error:", err);
        showAlert(err.response?.data?.message || "Gagal menyimpan data pegawai.", "error");
    }
};

const deleteUser = (id) => {
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
    fetchUsers();
    fetchRoles();
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