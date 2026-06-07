<template>
    <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 md:px-8">
        <!-- Header -->
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="min-w-0">
                <span
                    class="mb-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700"
                >
                    Approval Dosen PJ
                </span>

                <h1 class="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    Approval Peminjaman
                </h1>

                <p class="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                    Daftar pengajuan peminjaman khusus yang membutuhkan persetujuan Anda sebagai dosen penanggung jawab.
                </p>
            </div>

            <button
                type="button"
                @click="fetchApprovalList"
                :disabled="isLoading"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                Segarkan
            </button>
        </div>

        <!-- Warning TTD -->
        <div
            v-if="!hasTtdDigital"
            class="mb-6 rounded-3xl border border-red-100 bg-red-50 p-4 shadow-sm sm:p-5"
        >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-lg font-black text-red-600"
                >
                    !
                </div>

                <div class="min-w-0">
                    <h3 class="text-sm font-black text-red-700">
                        TTD Digital Belum Tersedia
                    </h3>

                    <p class="mt-1 text-xs font-bold leading-relaxed text-red-600">
                        Anda belum dapat menyetujui peminjaman sebagai Dosen Penanggung Jawab sebelum mengunggah TTD digital pada halaman profil.
                    </p>

                    <router-link
                        to="/profile"
                        class="mt-3 inline-flex rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white transition-all hover:bg-red-700 active:scale-95"
                    >
                        Lengkapi TTD Digital
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Summary -->
        <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Total Pengajuan
                </p>
                <h3 class="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                    {{ approvalList.length }}
                </h3>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Menunggu
                </p>
                <h3 class="mt-2 text-2xl font-black text-amber-600 sm:text-3xl">
                    {{ pendingCount }}
                </h3>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Sudah Diproses
                </p>
                <h3 class="mt-2 text-2xl font-black text-emerald-600 sm:text-3xl">
                    {{ processedCount }}
                </h3>
            </div>
        </div>

        <!-- Main Card -->
        <div class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <!-- Toolbar -->
            <div class="border-b border-slate-100 p-4 md:p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div class="min-w-0">
                        <h2 class="text-lg font-black text-slate-900 md:text-xl">
                            Daftar Approval
                        </h2>
                        <p class="mt-1 text-xs font-medium text-slate-500 md:text-sm">
                            Menampilkan {{ filteredApprovalList.length }} pengajuan.
                        </p>
                    </div>

                    <div class="relative w-full md:w-80">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
                            placeholder="Cari nama, tujuan, atau antrian..."
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center p-10 text-center sm:p-12">
                <div class="mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent"></div>
                <p class="text-sm font-bold text-slate-500">
                    Memuat data approval...
                </p>
            </div>

            <!-- Empty -->
            <div v-else-if="filteredApprovalList.length === 0" class="p-10 text-center sm:p-12">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>

                <h3 class="text-lg font-black text-slate-800">
                    Tidak ada pengajuan
                </h3>
                <p class="mt-1 text-sm font-medium text-slate-500">
                    Belum ada peminjaman yang membutuhkan approval dosen penanggung jawab.
                </p>
            </div>

            <!-- List -->
            <div v-else class="grid grid-cols-1 gap-4 p-4 md:p-6 xl:grid-cols-2">
                <article
                    v-for="item in filteredApprovalList"
                    :key="item.id"
                    class="flex flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5"
                >
                    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0">
                            <div class="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                    class="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700"
                                >
                                    {{ item.antrian ? `Antrian #${item.antrian}` : shortId(item.id) }}
                                </span>

                                <span
                                    class="rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                                    :class="getApprovalBadgeClass(item.status_approve_dosen_pj)"
                                >
                                    {{ item.status_approve_dosen_pj || 'Menunggu' }}
                                </span>
                            </div>

                            <h3 class="wrap-break-word text-base font-black leading-snug text-slate-900">
                                {{ item.nama_peminjam || getNamaPeminjam(item) }}
                            </h3>

                            <p class="mt-1 wrap-break-word text-xs font-bold text-slate-400">
                                {{ item.email_peminjam || item.peminjam?.email || '-' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex-1 space-y-3">
                        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p class="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Jenis Kebutuhan
                            </p>
                            <p class="text-sm font-black text-slate-800">
                                {{ item.kategori_kebutuhan || '-' }}
                                <span v-if="item.jenis_khusus">- {{ item.jenis_khusus }}</span>
                            </p>
                        </div>

                        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p class="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Tujuan Peminjaman
                            </p>
                            <p class="wrap-break-word text-sm font-bold leading-relaxed text-slate-700">
                                {{ item.tujuan_peminjaman || '-' }}
                            </p>
                        </div>

                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p class="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Tanggal Pinjam
                                </p>
                                <p class="text-sm font-black text-slate-800">
                                    {{ formatDate(item.tanggal_pinjam) }}
                                </p>
                            </div>

                            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p class="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Tanggal Kembali
                                </p>
                                <p class="text-sm font-black text-slate-800">
                                    {{ formatDate(item.tanggal_kembali) }}
                                </p>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p class="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Barang Dipinjam
                            </p>

                            <div v-if="item.detail_barang?.length" class="space-y-2">
                                <div
                                    v-for="detail in item.detail_barang"
                                    :key="detail.id || detail.barang_id"
                                    class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2"
                                >
                                    <span class="min-w-0 truncate text-xs font-bold text-slate-700">
                                        {{ detail.barang?.nama_barang || 'Barang Dihapus' }}
                                    </span>
                                    <span class="shrink-0 text-xs font-black text-blue-600">
                                        {{ detail.jumlah_pinjam }} unit
                                    </span>
                                </div>
                            </div>

                            <p v-else class="text-xs font-bold text-slate-400">
                                Tidak ada detail barang.
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="item.status_approve_dosen_pj === 'Menunggu'"
                        class="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2"
                    >
                        <button
                            type="button"
                            @click="openConfirmModal(item, 'Ditolak')"
                            :disabled="processingId === item.id"
                            class="w-full rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-black text-red-700 transition-all hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Tolak
                        </button>

                        <button
                            type="button"
                            @click="openConfirmModal(item, 'Disetujui')"
                            :disabled="processingId === item.id || !hasTtdDigital"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-black text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            :title="!hasTtdDigital ? 'Upload TTD digital terlebih dahulu di halaman profil' : 'Setujui peminjaman'"
                        >
                            <span
                                v-if="processingId === item.id"
                                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                            ></span>
                            Setujui
                        </button>
                    </div>

                    <div v-else class="mt-5 rounded-2xl border-t border-slate-100 bg-slate-50 p-4">
                        <p class="text-xs font-bold text-slate-500">
                            Pengajuan ini sudah diproses pada:
                            <span class="font-black text-slate-700">
                                {{ formatDateTime(item.dosen_pj_approved_at) }}
                            </span>
                        </p>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '../plugins/axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';
import { useAuthStore } from '../stores/auth';

const { showAlert } = useAlert();
const authStore = useAuthStore();
const { showConfirm } = useConfirm();

const approvalList = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const processingId = ref(null);

const hasTtdDigital = computed(() => {
    return !!authStore.user?.ttd_digital;
});

const filteredApprovalList = computed(() => {
    const keyword = searchQuery.value.toLowerCase().trim();

    if (!keyword) return approvalList.value;

    return approvalList.value.filter((item) => {
        const searchable = [
            item.antrian,
            item.id,
            item.nama_peminjam,
            item.email_peminjam,
            getNamaPeminjam(item),
            item.tujuan_peminjaman,
            item.kategori_kebutuhan,
            item.jenis_khusus,
            item.status_approve_dosen_pj,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchable.includes(keyword);
    });
});

const pendingCount = computed(() => {
    return approvalList.value.filter(
        (item) => item.status_approve_dosen_pj === 'Menunggu'
    ).length;
});

const processedCount = computed(() => {
    return approvalList.value.filter(
        (item) => item.status_approve_dosen_pj !== 'Menunggu'
    ).length;
});

const fetchApprovalList = async () => {
    isLoading.value = true;

    try {
        const response = await api.get('/dosen/approval-peminjaman');
        approvalList.value = response.data?.data || [];
    } catch (error) {
        console.error('Gagal mengambil data approval dosen:', error);
        showAlert(
            error.response?.data?.message || 'Gagal mengambil data approval peminjaman.',
            'error'
        );
    } finally {
        isLoading.value = false;
    }
};

const openConfirmModal = (item, status) => {
  if (status === 'Disetujui' && !hasTtdDigital.value) {
    showAlert(
      'Anda belum dapat menyetujui peminjaman karena TTD digital belum diunggah. Silakan lengkapi TTD digital di halaman profil.',
      'warning'
    );
    return;
  }

  const isApprove = status === 'Disetujui';

  showConfirm(
    isApprove
      ? 'Apakah Anda yakin ingin menyetujui peminjaman ini sebagai Dosen Penanggung Jawab?'
      : 'Apakah Anda yakin ingin menolak peminjaman ini?',
    async () => {
      await submitApproval(item, status);
    },
    null,
    isApprove ? 'Ya, Setujui' : 'Ya, Tolak',
    isApprove ? 'emerald' : 'red',
    isApprove ? 'Konfirmasi Approval' : 'Konfirmasi Penolakan'
  );
};

const submitApproval = async (item, status) => {
  if (!item || !status) return;

  if (status === 'Disetujui' && !hasTtdDigital.value) {
    showAlert(
      'TTD digital belum tersedia. Silakan upload TTD digital di halaman profil sebelum menyetujui peminjaman.',
      'warning'
    );
    return;
  }

  processingId.value = item.id;

  try {
    await api.put(`/dosen/approval-peminjaman/${item.id}/status`, {
      status,
      catatan_approval_dosen_pj: null,
    });

    showAlert(
      status === 'Disetujui'
        ? 'Peminjaman berhasil disetujui.'
        : 'Peminjaman berhasil ditolak.',
      'success'
    );

    await fetchApprovalList();
  } catch (error) {
    console.error('Gagal memproses approval dosen:', error);

    showAlert(
      error.response?.data?.message || 'Gagal memproses approval peminjaman.',
      'error'
    );
  } finally {
    processingId.value = null;
  }
};

const getNamaPeminjam = (item) => {
    return (
        item?.peminjam?.mahasiswa?.nama_mahasiswa ||
        item?.peminjam?.pegawai?.nama_lengkap ||
        item?.peminjam?.nama_lengkap ||
        item?.nama_peminjam ||
        'Peminjam'
    );
};

const shortId = (id) => {
    if (!id) return '-';
    return String(id).slice(0, 8).toUpperCase();
};

const formatDate = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatDateTime = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getApprovalBadgeClass = (status) => {
    if (status === 'Disetujui') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }

    if (status === 'Ditolak') {
        return 'bg-red-50 text-red-700 border-red-100';
    }

    if (status === 'Tidak Diperlukan') {
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }

    return 'bg-amber-50 text-amber-700 border-amber-100';
};

onMounted(() => {
    fetchApprovalList();
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
</style>