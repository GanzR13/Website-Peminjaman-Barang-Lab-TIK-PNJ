<template>
  <div class="p-4 md:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        <span
          class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-3"
        >
          Data Referensi
        </span>

        <h1 class="text-2xl md:text-3xl font-black text-slate-900">
          Referensi Program Studi
        </h1>

        <p class="text-sm text-slate-500 mt-1 font-medium">
          Kelola data program studi yang digunakan pada data mahasiswa.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="w-full md:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
      >
        + Tambah Prodi
      </button>
    </div>

    <!-- Card -->
    <div class="bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-lg font-black text-slate-900">
            Tabel Program Studi
          </h2>
          <p class="text-xs text-slate-500 font-medium mt-1">
            Total {{ filteredProdi.length }} data prodi.
          </p>
        </div>

        <div class="relative w-full md:w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari prodi..."
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm font-bold text-slate-700 transition-all"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="p-10 flex flex-col items-center justify-center text-center">
        <div class="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-bold text-slate-500">Memuat data prodi...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredProdi.length === 0" class="p-10 text-center">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h3 class="text-lg font-black text-slate-800">Data tidak ditemukan</h3>
        <p class="text-sm text-slate-500 font-medium mt-1">
          Belum ada data prodi atau kata kunci pencarian tidak sesuai.
        </p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-100">
              <th class="px-6 py-4 font-black w-24">ID</th>
              <th class="px-6 py-4 font-black">Nama Prodi</th>
              <th class="px-6 py-4 font-black text-right w-48">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="item in filteredProdi"
              :key="item.id"
              class="hover:bg-blue-50/30 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="font-mono text-xs font-black text-slate-500">
                  {{ item.id }}
                </span>
              </td>

              <td class="px-6 py-4">
                <p class="text-sm font-black text-slate-800">
                  {{ item.nama_prodi }}
                </p>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    @click="openEditModal(item)"
                    class="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-black border border-amber-100 hover:bg-amber-100 transition-all cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    @click="confirmDelete(item)"
                    class="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-black border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden p-4 space-y-3 bg-slate-50/60">
        <div
          v-for="item in filteredProdi"
          :key="item.id"
          class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                ID: {{ item.id }}
              </p>
              <h3 class="text-base font-black text-slate-900 mt-1">
                {{ item.nama_prodi }}
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              @click="openEditModal(item)"
              class="py-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-black border border-amber-100"
            >
              Edit
            </button>

            <button
              type="button"
              @click="confirmDelete(item)"
              class="py-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-black border border-red-100"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          @click.self="closeModal"
        >
          <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-slate-100">
              <h3 class="text-xl font-black text-slate-900">
                {{ isEditMode ? 'Edit Program Studi' : 'Tambah Program Studi' }}
              </h3>
              <p class="text-sm text-slate-500 font-medium mt-1">
                Masukkan nama program studi.
              </p>
            </div>

            <form @submit.prevent="submitForm" class="p-6 space-y-5">
              <div v-if="isEditMode">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  ID
                </label>
                <input
                  v-model="form.id"
                  type="text"
                  readonly
                  class="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm font-black outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Nama Prodi
                </label>
                <input
                  v-model="form.nama_prodi"
                  type="text"
                  required
                  placeholder="Contoh: Teknik Informatika"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-slate-700 text-sm font-bold outline-none transition-all"
                />
              </div>

              <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-black hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:flex-1 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span
                    v-if="isSubmitting"
                    class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                  ></span>
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useAlert } from '../composables/useAlert';
import { useConfirm } from '../composables/useConfirm';

const API_URL = 'http://localhost:3000/api/ref/prodi';

const { showAlert } = useAlert();
const { showConfirm } = useConfirm();

const prodiList = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const isEditMode = ref(false);

const form = ref({
  id: null,
  nama_prodi: '',
});

const filteredProdi = computed(() => {
  const keyword = searchQuery.value.toLowerCase().trim();

  if (!keyword) return prodiList.value;

  return prodiList.value.filter((item) =>
    String(item.nama_prodi || '').toLowerCase().includes(keyword) ||
    String(item.id || '').toLowerCase().includes(keyword)
  );
});

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const fetchProdi = async () => {
  isLoading.value = true;

  try {
    const response = await axios.get(API_URL, {
      headers: authHeaders(),
    });

    prodiList.value = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  } catch (error) {
    console.error('Gagal mengambil data prodi:', error);
    showAlert(error.response?.data?.message || 'Gagal mengambil data prodi.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    id: null,
    nama_prodi: '',
  };
};

const openCreateModal = () => {
  resetForm();
  isEditMode.value = false;
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  form.value = {
    id: item.id,
    nama_prodi: item.nama_prodi,
  };

  isEditMode.value = true;
  isModalOpen.value = true;
};

const closeModal = () => {
  if (isSubmitting.value) return;
  isModalOpen.value = false;
  resetForm();
};

const submitForm = async () => {
  if (!form.value.nama_prodi.trim()) {
    showAlert('Nama prodi wajib diisi.', 'warning');
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      nama_prodi: form.value.nama_prodi.trim(),
    };

    if (isEditMode.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload, {
        headers: authHeaders(),
      });

      showAlert('Data prodi berhasil diperbarui.', 'success');
    } else {
      await axios.post(API_URL, payload, {
        headers: authHeaders(),
      });

      showAlert('Data prodi berhasil ditambahkan.', 'success');
    }

    closeModal();
    await fetchProdi();
  } catch (error) {
    console.error('Gagal menyimpan data prodi:', error);
    showAlert(error.response?.data?.message || 'Gagal menyimpan data prodi.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (item) => {
  showConfirm(
    `Yakin ingin menghapus prodi "${item.nama_prodi}"?`,
    async () => {
      try {
        await axios.delete(`${API_URL}/${item.id}`, {
          headers: authHeaders(),
        });

        showAlert('Data prodi berhasil dihapus.', 'success');
        await fetchProdi();
      } catch (error) {
        console.error('Gagal menghapus data prodi:', error);
        showAlert(error.response?.data?.message || 'Gagal menghapus data prodi.', 'error');
      }
    },
    null,
    'Ya, Hapus',
    'red',
    'Konfirmasi Hapus'
  );
};

onMounted(() => {
  fetchProdi();
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
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>