<template>
    <div class="p-4 md:p-8 h-full flex flex-col">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 md:mb-8">
            <div>
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-3">
                    Audit Trail
                </span>

                <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Log Action Admin
                </h1>

                <p class="text-sm text-slate-500 mt-1 font-medium max-w-2xl">
                    Riwayat aktivitas admin dan super admin.
                </p>
            </div>

            <button type="button" @click="refreshLogs"
                class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-sm font-black transition-all shadow-sm active:scale-95 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="{ 'animate-spin': isLoading }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Segarkan
            </button>
        </div>

        <!-- Summary Card -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
            <div class="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total Log
                </p>
                <h3 class="text-2xl md:text-3xl font-black text-slate-900 mt-2">
                    {{ totalItems }}
                </h3>
            </div>

            <div class="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Data Halaman Ini
                </p>
                <h3 class="text-2xl md:text-3xl font-black text-blue-600 mt-2">
                    {{ logs.length }}
                </h3>
            </div>

            <div class="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Update
                </p>
                <h3 class="text-2xl md:text-3xl font-black text-amber-600 mt-2">
                    {{ updateLogsCount }}
                </h3>
            </div>

            <div class="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Delete
                </p>
                <h3 class="text-2xl md:text-3xl font-black text-red-600 mt-2">
                    {{ deleteLogsCount }}
                </h3>
            </div>
        </div>

        <!-- Main Card -->
        <div
            class="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-128">
            <!-- Toolbar -->
            <div
                class="p-4 md:p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <h2 class="text-lg md:text-xl font-black text-slate-900">
                        Riwayat Aktivitas
                    </h2>
                    <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
                        Menampilkan {{ logs.length }} aktivitas dari {{ totalItems }} total log
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
                    <!-- Search -->
                    <div class="relative sm:col-span-1 xl:w-72">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input v-model="searchQuery" type="text" placeholder="Cari aktivitas..."
                            class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm font-bold text-slate-700 transition-all" />
                    </div>

                    <!-- Filter -->
                    <div class="relative custom-dropdown">
                        <button type="button" @click.stop="toggleDropdown('module')"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-sm font-black text-slate-700 flex items-center justify-between gap-2 transition-all cursor-pointer">
                            <span class="truncate">{{ selectedModuleLabel }}</span>

                            <svg class="w-4 h-4 text-slate-400 transition-transform"
                                :class="{ 'rotate-180': activeDropdown === 'module' }" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="activeDropdown === 'module'"
                                class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-80 overflow-hidden">
                                <button v-for="option in moduleOptions" :key="option.value" type="button"
                                    @click="selectModule(option.value)"
                                    class="w-full px-4 py-3 text-sm text-left font-bold hover:bg-blue-50 transition-colors"
                                    :class="selectedModule === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'">
                                    {{ option.label }}
                                </button>
                            </div>
                        </transition>
                    </div>

                    <!-- Action Filter -->
                    <div class="relative custom-dropdown">
                        <button type="button" @click.stop="toggleDropdown('action')"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-sm font-black text-slate-700 flex items-center justify-between gap-2 transition-all cursor-pointer">
                            <span class="truncate">{{ selectedActionLabel }}</span>

                            <svg class="w-4 h-4 text-slate-400 transition-transform"
                                :class="{ 'rotate-180': activeDropdown === 'action' }" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="activeDropdown === 'action'"
                                class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-80 overflow-hidden">
                                <button v-for="option in actionOptions" :key="option.value" type="button"
                                    @click="selectAction(option.value)"
                                    class="w-full px-4 py-3 text-sm text-left font-bold hover:bg-blue-50 transition-colors"
                                    :class="selectedAction === option.value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'">
                                    {{ option.label }}
                                </button>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div class="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mb-4">
                </div>

                <p class="text-sm font-bold text-slate-500">
                    Memuat log aktivitas...
                </p>
            </div>

            <!-- Empty -->
            <div v-else-if="logs.length === 0"
                class="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                    </svg>
                </div>

                <h3 class="text-lg font-black text-slate-800">
                    Log tidak ditemukan
                </h3>

                <p class="text-sm text-slate-500 font-medium mt-1">
                    Coba ubah kata kunci pencarian atau filter yang digunakan.
                </p>
            </div>

            <!-- Mobile Cards -->
            <div v-if="!isLoading && logs.length > 0"
                class="md:hidden flex-1 overflow-y-auto hidden-scrollbar p-4 bg-slate-50/50 space-y-3">
                <div v-for="log in logs" :key="log.id"
                    class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="min-w-0">
                            <span
                                class="inline-flex px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2"
                                :class="getActionBadgeClass(log.action)">
                                {{ log.action }}
                            </span>

                            <h3 class="font-black text-slate-900 text-sm leading-snug">
                                {{ log.description || '-' }}
                            </h3>
                        </div>

                        <div
                            class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0">
                            {{ getInitial(log.admin?.email) }}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-50 rounded-xl p-3">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Modul
                            </p>
                            <p class="font-bold text-slate-700">
                                {{ log.module || '-' }}
                            </p>
                        </div>

                        <div class="bg-slate-50 rounded-xl p-3">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Waktu
                            </p>
                            <p class="font-bold text-slate-700">
                                {{ formatDate(log.created_at || log.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-3 pt-3 border-t border-slate-100">
                        <p class="text-xs text-slate-500 font-medium">
                            Oleh:
                            <span class="font-black text-slate-700">
                                {{ log.admin?.email || 'Unknown Admin' }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Desktop Table -->
            <div v-if="!isLoading && logs.length > 0" class="hidden md:block flex-1 overflow-y-auto hidden-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 z-10">
                        <tr
                            class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-100">
                            <th class="px-6 py-4 font-black">Admin</th>
                            <th class="px-6 py-4 font-black">Aktivitas</th>
                            <th class="px-6 py-4 font-black">Modul</th>
                            <th class="px-6 py-4 font-black">Aksi</th>
                            <th class="px-6 py-4 font-black">Waktu</th>
                            <th class="px-6 py-4 font-black">IP</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="log in logs" :key="log.id" class="hover:bg-blue-50/30 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black uppercase shrink-0">
                                        {{ getInitial(log.admin?.email) }}
                                    </div>

                                    <div class="min-w-0">
                                        <p class="font-black text-slate-800 text-sm truncate">
                                            {{ log.admin?.email || 'Unknown Admin' }}
                                        </p>
                                        <p class="text-xs text-slate-400 font-medium truncate">
                                            {{ log.user_id || '-' }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td class="px-6 py-4 max-w-md">
                                <p class="text-sm font-bold text-slate-700 leading-relaxed">
                                    {{ log.description || '-' }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">
                                    {{ log.module || '-' }}
                                </span>
                            </td>

                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                    :class="getActionBadgeClass(log.action)">
                                    {{ log.action || '-' }}
                                </span>
                            </td>

                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-slate-700">
                                    {{ formatDate(log.created_at || log.createdAt) }}
                                </p>
                                <p class="text-xs text-slate-400 font-medium">
                                    {{ formatTime(log.created_at || log.createdAt) }} WIB
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <p class="text-xs font-mono text-slate-500">
                                    {{ formatIpAddress(log.ip_address) }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="!isLoading && totalItems > 0"
                class="border-t border-slate-100 bg-slate-50 px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <p class="text-xs font-bold text-slate-500">
                        Total
                        <span class="text-slate-900 font-black">{{ totalItems }}</span>
                        log
                    </p>

                    <div class="relative custom-dropdown">
                        <button type="button" @click.stop="isLimitDropdownOpen = !isLimitDropdownOpen"
                            class="w-full sm:w-40 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black flex items-center justify-between gap-2 hover:border-blue-300 transition-all cursor-pointer">
                            <span>{{ limit }} / halaman</span>

                            <svg class="w-4 h-4 text-slate-400 transition-transform"
                                :class="{ 'rotate-180': isLimitDropdownOpen }" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="isLimitDropdownOpen"
                                class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-80 overflow-hidden">
                                <button v-for="option in limitOptions" :key="option" type="button"
                                    @click="selectLimit(option)"
                                    class="w-full px-4 py-3 text-xs text-left font-black hover:bg-blue-50 transition-colors"
                                    :class="limit === option ? 'bg-blue-50 text-blue-700' : 'text-slate-700'">
                                    {{ option }} / halaman
                                </button>
                            </div>
                        </transition>
                    </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3">
                    <button type="button" @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-600 hover:text-blue-700 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                        Prev
                    </button>

                    <span class="text-xs font-black text-slate-500 whitespace-nowrap">
                        Halaman
                        <span class="text-blue-600">{{ currentPage }}</span>
                        dari {{ totalPages }}
                    </span>

                    <button type="button" @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
                        class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-600 hover:text-blue-700 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import api from '../plugins/axios';

const isLoading = ref(false);
const searchQuery = ref('');
const selectedModule = ref('all');
const selectedAction = ref('all');
const activeDropdown = ref(null);

const logs = ref([]);

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);
const limitOptions = [10, 20, 50, 100];
const isLimitDropdownOpen = ref(false);

let searchTimeout = null;

const moduleOptions = [
    { label: 'Semua Modul', value: 'all' },
    { label: 'Barang', value: 'Barang' },
    { label: 'Peminjaman', value: 'Peminjaman' },
    { label: 'Laporan Masalah', value: 'Laporan Masalah' },
    { label: 'Pegawai', value: 'Pegawai' },
    { label: 'Peminjam', value: 'Peminjam' },
    { label: 'Auth', value: 'Auth' },
];

const actionOptions = [
    { label: 'Semua Aksi', value: 'all' },
    { label: 'Create', value: 'CREATE' },
    { label: 'Update', value: 'UPDATE' },
    { label: 'Delete', value: 'DELETE' },
    { label: 'Approve', value: 'APPROVE' },
    { label: 'Reject', value: 'REJECT' },
    { label: 'Update Role', value: 'UPDATE_ROLE' },
    { label: 'Update Status', value: 'UPDATE_STATUS' },
];

const selectedModuleLabel = computed(() => {
    return moduleOptions.find((item) => item.value === selectedModule.value)?.label || 'Semua Modul';
});

const selectedActionLabel = computed(() => {
    return actionOptions.find((item) => item.value === selectedAction.value)?.label || 'Semua Aksi';
});

const updateLogsCount = computed(() => {
    return logs.value.filter((log) => String(log.action).includes('UPDATE')).length;
});

const deleteLogsCount = computed(() => {
    return logs.value.filter((log) => log.action === 'DELETE').length;
});

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

const selectModule = (value) => {
    selectedModule.value = value;
    activeDropdown.value = null;
};

const selectAction = (value) => {
    selectedAction.value = value;
    activeDropdown.value = null;
};

const getInitial = (value) => {
    if (!value) return '?';
    return String(value).charAt(0).toUpperCase();
};

const getActionBadgeClass = (action) => {
    const normalized = String(action || '').toUpperCase();

    if (normalized === 'CREATE') {
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }

    if (normalized.includes('UPDATE')) {
        return 'bg-amber-50 text-amber-700 border border-amber-100';
    }

    if (normalized === 'DELETE') {
        return 'bg-red-50 text-red-700 border border-red-100';
    }

    if (normalized === 'APPROVE') {
        return 'bg-blue-50 text-blue-700 border border-blue-100';
    }

    if (normalized === 'REJECT') {
        return 'bg-rose-50 text-rose-700 border border-rose-100';
    }

    return 'bg-slate-100 text-slate-700 border border-slate-200';
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    });
};

const formatTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
    });
};

const formatIpAddress = (ip) => {
	if (!ip) return "-";

	let cleanIp = String(ip).trim();

	if (cleanIp === "::1") {
		return "127.0.0.1";
	}

	if (cleanIp.startsWith("::ffff:")) {
		cleanIp = cleanIp.replace("::ffff:", "");
	}

	if (cleanIp.includes(",")) {
		cleanIp = cleanIp.split(",")[0].trim();
	}

	return cleanIp;
};

const fetchLogs = async () => {
    isLoading.value = true;

    try {
        const response = await api.get('/admin-action-logs', {
            params: {
                search: searchQuery.value,
                module: selectedModule.value,
                action: selectedAction.value,
                page: currentPage.value,
                limit: limit.value,
            },
        });

        logs.value = response.data?.data || [];

        if (response.data?.pagination) {
            totalPages.value = response.data.pagination.totalPages || 1;
            totalItems.value = response.data.pagination.totalItems || 0;
            currentPage.value = response.data.pagination.currentPage || 1;
            limit.value = response.data.pagination.itemsPerPage || 10;
        }
    } catch (error) {
        console.error('Gagal memuat admin action logs:', error);
        logs.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
    } finally {
        isLoading.value = false;
    }
};

const refreshLogs = () => {
    currentPage.value = 1;
    fetchLogs();
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchLogs();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchLogs();
    }
};

const selectLimit = (newLimit) => {
    limit.value = newLimit;
    currentPage.value = 1;
    isLimitDropdownOpen.value = false;
    fetchLogs();
};

watch([selectedModule, selectedAction], () => {
    currentPage.value = 1;
    fetchLogs();
});

watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchLogs();
    }, 400);
});

const closeDropdownOutside = (event) => {
    if (!event.target.closest('.custom-dropdown')) {
        activeDropdown.value = null;
        isLimitDropdownOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener('click', closeDropdownOutside);
    fetchLogs();
});

onUnmounted(() => {
    window.removeEventListener('click', closeDropdownOutside);

    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
});
</script>

<style scoped>
.hidden-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hidden-scrollbar::-webkit-scrollbar {
    display: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>