<template>
    <div class="p-4 md:p-8 h-full flex flex-col relative animate-fade-in">

        <!-- HEADER -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
                <span
                    class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 border border-blue-200">
                    Pengelolaan Barang
                </span>
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Katalog Barang</h2>
                <p class="text-slate-500 mt-1 text-xs md:text-sm font-medium">Kelola detail, gambar, dan stok barang
                    laboratorium.
                </p>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-2 md:gap-3 w-full sm:w-auto">
                <button @click="triggerFileInput"
                    class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 ring-1 ring-amber-200 transition-all active:scale-95 cursor-pointer text-sm">
                    <ArrowUpTrayIcon class="w-5 h-5 sm:w-4 sm:h-4" />
                    <span class="hidden sm:inline">Import CSV</span>
                </button>
                <input type="file" ref="fileInput" @change="handleFileUpload" accept=".csv, .xlsx, .xls"
                    class="hidden" />

                <button @click="exportCSV"
                    class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 ring-1 ring-emerald-200 transition-all active:scale-95 cursor-pointer text-sm">
                    <ArrowDownTrayIcon class="w-5 h-5 sm:w-4 sm:h-4" />
                    <span class="hidden sm:inline">Export CSV</span>
                </button>

                <button @click="openAddModal"
                    class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer text-sm">
                    <PlusIcon class="w-5 h-5" />
                    <span class="hidden xs:inline sm:inline">Tambah</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div
                class="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5">
                <div class="p-3 md:p-3.5 rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/50 shrink-0">
                    <CubeIcon class="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                    <p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                        Total Jenis
                    </p>
                    <p class="text-xl md:text-2xl font-black text-slate-800">{{ globalTotal }}<span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal"> Keseluruhan</span>
                    </p>
                </div>
            </div>
            <div
                class="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5">
                <div class="p-3 md:p-3.5 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100/50 shrink-0">
                    <CheckCircleIcon class="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                    <p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                        Tersedia
                    </p>
                    <p class="text-xl md:text-2xl font-black text-slate-800">
                        {{ globalTersedia }}<span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal"> Jenis</span>
                    </p>
                </div>
            </div>
            <div
                class="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5">
                <div class="p-3 md:p-3.5 rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100/50 shrink-0">
                    <ExclamationCircleIcon class="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                    <p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                        Stok Habis
                    </p>
                    <p class="text-xl md:text-2xl font-black text-slate-800">{{ globalHabis }}<span
                            class="text-xs font-semibold text-slate-400 normal-case tracking-normal"> Jenis</span></p>
                </div>
            </div>
        </div>

        <div
            class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 md:mb-8 flex flex-col md:flex-row gap-3">
            <div class="relative flex-1 group">
                <MagnifyingGlassIcon
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input v-model="searchQuery" type="text" placeholder="Cari nama barang..."
                    class="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 bg-slate-50/50 focus:bg-white" />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative w-full sm:w-36 flex-none" ref="limitDropdownRef">
                    <button type="button" @click="showLimitDropdown = !showLimitDropdown"
                        class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer hover:border-blue-400 transition-all">
                        <span>{{ limit }} Baris</span>
                        <ChevronDownIcon class="w-4 h-4 text-slate-500 transition-transform"
                            :class="showLimitDropdown ? 'rotate-180' : ''" />
                    </button>
                    <transition name="dropdown">
                        <div v-if="showLimitDropdown"
                            class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                            <button v-for="opt in [10, 20, 50, 100]" :key="opt" type="button" @click="pilihLimit(opt)"
                                class="w-full px-4 py-2.5 text-sm text-left font-medium transition-colors"
                                :class="limit === opt ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'">
                                {{ opt }} Baris
                            </button>
                        </div>
                    </transition>
                </div>

                <div class="relative w-full sm:w-52 flex-none" ref="stockDropdownRef">
                    <button type="button" @click="showStockDropdown = !showStockDropdown"
                        class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer hover:border-blue-400 transition-all">
                        <span class="truncate pr-2">{{ stockFilterLabel }}</span>
                        <ChevronDownIcon class="w-4 h-4 text-slate-500 transition-transform shrink-0"
                            :class="showStockDropdown ? 'rotate-180' : ''" />
                    </button>
                    <transition name="dropdown">
                        <div v-if="showStockDropdown"
                            class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                            <button v-for="opt in stockOptions" :key="opt.value" type="button"
                                @click="pilihStockFilter(opt.value)"
                                class="w-full px-4 py-2.5 text-sm text-left font-medium transition-colors"
                                :class="stockFilter === opt.value ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'">
                                {{ opt.label }}
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <div class="flex-1 flex flex-col">
            <div v-if="isLoading" class="text-center py-24">
                <div
                    class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4">
                </div>
                <p class="text-slate-500 font-bold animate-pulse">Memuat data dari server...</p>
            </div>

            <div v-else-if="filteredBarang.length === 0"
                class="text-center py-24 bg-white/50 rounded-3xl border border-slate-100 border-dashed mx-4 md:mx-0">
                <CubeTransparentIcon class="w-16 md:w-20 h-16 md:h-20 text-slate-300 mx-auto" />
                <h3 class="text-lg md:text-xl font-bold text-slate-700 mt-6">
                    Barang Tidak Ditemukan
                </h3>
                <p class="text-slate-500 mt-2 text-sm font-medium">
                    Coba ubah kata kunci atau filter stok di atas.
                </p>
            </div>

            <!-- GRID DATA BARANG (Disesuaikan menjadi 2 kolom di mobile) -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-8">
                <div v-for="barang in filteredBarang" :key="barang.id" @click="openDetailModal(barang)"
                    class="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-3 md:p-4 flex flex-col group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative overflow-hidden">

                    <div
                        class="relative w-full h-28 sm:h-36 md:h-44 rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 mb-3 md:mb-4 border border-slate-100/80 shrink-0">
                        <img :src="getImageUrl(barang.gambar)" :alt="barang.nama_barang"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                        <div
                            class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>

                        <div class="absolute top-2 right-2">
                            <span v-if="barang.stok > 0"
                                class="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-emerald-100/90 text-emerald-700 ring-1 ring-emerald-200/50 backdrop-blur-sm shadow-sm">
                                <CheckIcon class="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span class="hidden sm:inline">Tersedia
                                    ({{ barang.stok }})</span><span class="sm:hidden">{{ barang.stok }}</span>
                            </span>
                            <span v-else
                                class="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-red-100/90 text-red-700 ring-1 ring-red-200/50 backdrop-blur-sm shadow-sm">
                                <XMarkIcon class="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Habis
                            </span>
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col mb-3 md:mb-4 px-1">
                        <h3
                            class="text-sm md:text-base font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {{ barang.nama_barang }}
                        </h3>
                        <p class="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed line-clamp-2">
                            {{ barang.deskripsi || "Tidak ada deskripsi." }}
                        </p>
                    </div>

                    <div class="flex items-center gap-1.5 sm:gap-2 border-t border-slate-100 pt-3 sm:pt-4 mt-auto">
                        <button @click.stop="openEditModal(barang)"
                            class="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 bg-slate-50 text-slate-600 font-bold rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:ring-1 hover:ring-blue-200 transition-all duration-200 active:scale-95 text-[10px] sm:text-xs">
                            <PencilSquareIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span
                                class="hidden sm:inline">Edit</span>
                        </button>
                        <button @click.stop="confirmDelete(barang)"
                            class="px-2.5 sm:px-3.5 py-2 sm:py-2.5 bg-white text-red-500 font-bold rounded-lg sm:rounded-xl hover:bg-red-50 ring-1 ring-slate-200 hover:ring-red-200 transition-all duration-200 active:scale-95">
                            <TrashIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- PAGINASI -->
            <div v-if="!isLoading && totalItems > 0"
                class="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-5 md:pt-6 mt-auto pb-4 gap-4">
                <p class="text-sm text-slate-500 font-medium text-center sm:text-left w-full sm:w-auto">
                    Total: <span class="font-black text-slate-800">{{ totalItems }}</span> barang
                </p>
                <div class="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto px-4 sm:px-0">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="flex-1 sm:flex-none px-4 py-2.5 md:px-5 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 border flex items-center justify-center shadow-sm"
                        :class="currentPage === 1 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'">
                        <span class="sm:hidden">←</span>
                        <span class="hidden sm:inline">Sebelumnya</span>
                    </button>
                    <div
                        class="px-4 py-2.5 md:px-5 md:py-2.5 bg-blue-50 text-blue-700 text-xs md:text-sm font-black rounded-xl border border-blue-100/50 shrink-0">
                        Hal {{ currentPage }} / {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages || totalPages === 0"
                        class="flex-1 sm:flex-none px-4 py-2.5 md:px-5 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 border flex items-center justify-center shadow-sm"
                        :class="currentPage === totalPages || totalPages === 0 ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'">
                        <span class="sm:hidden">→</span>
                        <span class="hidden sm:inline">Selanjutnya</span>
                    </button>
                </div>
            </div>
        </div>

        <ModalDetailBarang :isOpen="isDetailOpen" :data="selectedBarang" @close="isDetailOpen = false"
            @edit="openEditModal" />

        <ModalFormBarang :isOpen="isModalFormOpen" :isEditMode="isEditMode" :dataEdit="selectedBarang"
            @close="isModalFormOpen = false" @refresh-data="fetchBarang" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import api from "../plugins/axios";
import { PlusIcon, CubeIcon, CheckCircleIcon, ExclamationCircleIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon, CubeTransparentIcon, ChevronDownIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/vue/24/outline";
import { useAlert } from "../composables/useAlert";
import { useConfirm } from "../composables/useConfirm";
import ModalDetailBarang from "../components/ModalDetailBarang.vue";
import ModalFormBarang from "../components/ModalFormBarang.vue";
import * as XLSX from "xlsx";

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const barangList = ref([]);
const isLoading = ref(false);
const searchQuery = ref("");
let searchTimeout = null;
const stockFilter = ref("semua");
const fileInput = ref(null);

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);
const globalTotal = ref(0);
const globalTersedia = ref(0);
const globalHabis = ref(0);

const showLimitDropdown = ref(false);
const showStockDropdown = ref(false);
const limitDropdownRef = ref(null);
const stockDropdownRef = ref(null);

const stockOptions = [
    { value: "semua", label: "Semua Status Stok" },
    { value: "tersedia", label: "Stok Tersedia" },
    { value: "habis", label: "Stok Habis" },
];

const stockFilterLabel = computed(() => stockOptions.find((o) => o.value === stockFilter.value)?.label || "Semua Status Stok");

const pilihLimit = (val) => {
    limit.value = val;
    showLimitDropdown.value = false;
    currentPage.value = 1;
    fetchBarang();
};

const pilihStockFilter = (val) => {
    stockFilter.value = val;
    showStockDropdown.value = false;
    currentPage.value = 1;
    fetchBarang();
};

const handleClickOutside = (e) => {
    if (limitDropdownRef.value && !limitDropdownRef.value.contains(e.target)) showLimitDropdown.value = false;
    if (stockDropdownRef.value && !stockDropdownRef.value.contains(e.target)) showStockDropdown.value = false;
};

const isDetailOpen = ref(false);
const isModalFormOpen = ref(false);
const isEditMode = ref(false);
const selectedBarang = ref(null);

watch(searchQuery, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchBarang();
    }, 500);
});

const fetchBarang = async () => {
    isLoading.value = true;
    try {
        const queryParams = {
            page: currentPage.value,
            limit: limit.value,
            search: searchQuery.value
        };

        if (stockFilter.value !== 'semua') {
            queryParams.stok = stockFilter.value;
        }

        const response = await api.get("/barang", { params: queryParams });

        if (response.data.status === "success") {
            barangList.value = response.data.data;
            totalPages.value = response.data.pagination.totalPages;
            totalItems.value = response.data.pagination.totalItems;

            if (response.data.summary) {
                globalTotal.value = response.data.summary.total;
                globalTersedia.value = response.data.summary.tersedia;
                globalHabis.value = response.data.summary.habis;
            }
        }
    } catch (error) {
        console.error("Gagal mengambil data katalog:", error);
        showAlert("Gagal memuat data barang.", "error");
    } finally {
        isLoading.value = false;
    }
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/400x300/f8fafc/94a3b8?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:3000${imagePath}`;
};

onMounted(() => {
    fetchBarang();
    window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchBarang();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

const filteredBarang = computed(() => {
    return barangList.value;
});

const openDetailModal = (barang) => { selectedBarang.value = barang; isDetailOpen.value = true; };
const openAddModal = () => { isEditMode.value = false; selectedBarang.value = null; isModalFormOpen.value = true; };
const openEditModal = (barang) => { isDetailOpen.value = false; isEditMode.value = true; selectedBarang.value = barang; isModalFormOpen.value = true; };

const confirmDelete = (barang) => {
    showConfirm(
        `Apakah Anda yakin ingin menghapus "${barang.nama_barang}" secara permanen?`,
        async () => {
            try {
                await api.delete(`/barang/${barang.id}`);

                if (barangList.value.length === 1 && currentPage.value > 1) {
                    currentPage.value--;
                }

                await fetchBarang();
                showAlert("Data barang berhasil dihapus!", "success");
            } catch (error) {
                console.error("Gagal menghapus barang:", error.response?.data || error);

                showAlert(
                    error.response?.data?.message || "Gagal menghapus data barang.",
                    "error"
                );
            }
        },
        null,
        "Ya, Hapus",
        "red",
        "Konfirmasi Hapus"
    );
};

const exportCSV = async () => {
    try {
        const response = await api.get("/barang", { params: { page: 1, limit: 10000 } });
        if (response.data.status === "success") {
            const allBarang = response.data.data;
            if (allBarang.length === 0) { showAlert("Tidak ada data untuk diekspor.", "error"); return; }
            const dataToExport = allBarang.map((b) => ({
                id: b.id, kode_barang: b.kode_barang || "-", nama_barang: b.nama_barang, stok: b.stok, deskripsi: b.deskripsi || "-", gambar: b.gambar ? getImageUrl(b.gambar) : "-", kategori: b.kategori || "-", createdAt: b.createdAt ? new Date(b.createdAt).toLocaleString("id-ID") : "-",
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport); const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Katalog_Barang");
            XLSX.writeFile(wb, `Katalog_Barang_${new Date().toISOString().split("T")[0]}.csv`, { bookType: "csv" });
            showAlert("Export CSV berhasil!", "success");
        }
    } catch (error) { showAlert("Terjadi kesalahan saat export CSV.", "error"); }
};

const triggerFileInput = () => { if (fileInput.value) fileInput.value.click(); };
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validExtensions = ["csv", "xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
        showAlert("Harap unggah file .csv, .xlsx, atau .xls", "error"); event.target.value = ""; return;
    }
    showConfirm(
        `Upload file "${file.name}" untuk menambahkan/memperbarui barang massal?`,
        async () => {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await api.post("/barang/import", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                if (response.data.status === "success") {
                    showAlert("Berhasil mengimpor data barang!", "success");
                    currentPage.value = 1;
                    await fetchBarang();
                }
            } catch (error) {
                console.error("Gagal import barang:", error.response?.data || error);

                showAlert(
                    error.response?.data?.message || "Gagal mengimpor file.",
                    "error"
                );
            } finally {
                event.target.value = "";
            }
        },
        () => {
            event.target.value = "";
        },
        "Ya, Import",
        "blue",
        "Konfirmasi Import"
    );
};
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

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>