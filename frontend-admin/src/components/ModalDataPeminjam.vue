<template>
    <Teleport to="body">

        <transition name="fade">
            <div v-if="isOpen && mode === 'detail'"
                class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                @click.self="$emit('close')">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-0 overflow-hidden relative flex flex-col">

                    <div class="bg-linear-to-r from-emerald-500 to-teal-600 p-6 flex items-center gap-4 text-white">
                        <div
                            class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-2xl uppercase border border-white/30 shrink-0">
                            {{ detailUser.nama_lengkap?.charAt(0) || "?" }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-xl font-extrabold leading-tight truncate">{{ detailUser.nama_lengkap }}</h3>
                            <p class="text-teal-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                                {{ detailUser.user?.Role?.nama_role }}
                            </p>
                        </div>
                    </div>

                    <div class="p-6 space-y-3">
                        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identitas ({{
                                detailUser.nim ? "NIM" : "NIP" }})</p>
                            <p class="text-slate-900 font-bold font-mono">{{ detailUser.nim || detailUser.nip || "-" }}
                            </p>
                        </div>

                        <div v-if="detailUser.nim" class="grid grid-cols-2 gap-3">
                            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Angkatan / Prodi</p>
                                <p class="text-slate-900 font-bold text-xs">{{ detailUser.angkatan }} - {{
                                    detailUser.nama_prodi || detailUser.Prodi?.nama_prodi || "-" }}</p>
                            </div>
                            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Kelas</p>
                                <p class="text-slate-900 font-bold text-xs">{{ detailUser.nama_kelas ||
                                    detailUser.Kelas?.nama_kelas || "-" }}</p>
                            </div>
                        </div>

                        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                                <p class="text-slate-900 font-bold text-xs break-all">{{ detailUser.user?.email }}</p>
                                <span v-if="detailUser.user?.email_verified"
                                    class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 block">Terverifikasi</span>
                                <span v-else
                                    class="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1 block">Belum
                                    Verifikasi</span>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Telepon</p>
                                <p class="text-slate-900 font-bold text-xs">{{ detailUser.user?.no_telepon || "-" }}</p>
                            </div>
                        </div>

                        <button @click="$emit('close')"
                            class="w-full mt-4 px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition cursor-pointer active:scale-95">
                            Tutup Panel Detail
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div v-if="isOpen && mode === 'form'"
                class="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                @click.self="closeModal">
                <div
                    class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-select custom-scrollbar relative">

                    <div class="flex justify-between items-start gap-4 mb-6">
                        <h3 class="text-xl font-extrabold text-slate-900 leading-tight">
                            {{ isEditMode ? "Update Data " + formData.kategori : "Registrasi Peminjam Baru" }}
                        </h3>
                        <button @click="closeModal"
                            class="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors shrink-0 cursor-pointer active:scale-95"
                            title="Tutup Modal">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="handleSave" class="space-y-4">

                        <div v-if="!isEditMode" class="flex p-1 bg-slate-100 rounded-2xl mb-4 shadow-inner">
                            <button v-for="cat in ['Mahasiswa', 'Dosen']" :key="cat" type="button"
                                @click="formData.kategori = cat"
                                :class="formData.kategori === cat ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'"
                                class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-widest cursor-pointer">
                                {{ cat }}
                            </button>
                        </div>
                        <div v-else class="mb-4">
                            <span
                                class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ring-1 ring-emerald-100 bg-emerald-50 text-emerald-700">
                                Kategori: {{ formData.kategori }}
                            </span>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Nama Lengkap</label>
                            <input v-model="formData.nama_lengkap" type="text" required
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700" />
                        </div>

                        <div v-if="formData.kategori === 'Mahasiswa'" class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">NIM (Nomor
                                    Induk Mahasiswa)</label>
                                <input v-model="formData.nim" type="text" required
                                    class="w-full px-4 py-2.5 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none font-medium text-slate-700"
                                    placeholder="Contoh: 22071..." />
                            </div>

                            <div class="relative custom-select">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Program
                                    Studi</label>
                                <button type="button" @click.stop="toggleDropdown('prodi')"
                                    class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-sm font-bold cursor-pointer text-slate-700">
                                    <span class="truncate pr-2">{{validRefProdi.find((p) => p.id ===
                                        formData.prodi_id)?.nama_prodi || "Pilih Prodi"}}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 shrink-0"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <transition name="fade">
                                    <div v-if="activeDropdown === 'prodi'"
                                        class="absolute top-full left-0 right-0 mt-1  bg-white border border-slate-100 rounded-xl shadow-xl z-60 max-h-40 overflow-y-auto">
                                        <button v-for="p in validRefProdi" :key="p.id" type="button"
                                            @click="formData.prodi_id = p.id; activeDropdown = null;"
                                            class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium text-slate-700 transition-colors">
                                            {{ p.nama_prodi }}
                                        </button>
                                    </div>
                                </transition>
                            </div>

                            <div class="relative custom-select">
                                <label
                                    class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Angkatan</label>
                                <button type="button" @click.stop="toggleDropdown('angkatan')"
                                    class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-bold cursor-pointer text-slate-700">
                                    <span>{{ formData.angkatan }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <transition name="fade">
                                    <div v-if="activeDropdown === 'angkatan'"
                                        class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-60">
                                        <button v-for="y in years" :key="y" type="button"
                                            @click="formData.angkatan = y; activeDropdown = null;"
                                            class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium text-slate-700 transition-colors">
                                            {{ y }}
                                        </button>
                                    </div>
                                </transition>
                            </div>

                            <div class="col-span-2 relative custom-select">
                                <label
                                    class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Kelas</label>
                                <button type="button" @click.stop="toggleDropdown('kelas')"
                                    class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-bold cursor-pointer text-slate-700">
                                    <span>{{validRefKelas.find((k) => k.id === formData.kelas_id)?.nama_kelas || "Pilih Kelas" }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 shrink-0"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <transition name="fade">
                                    <div v-if="activeDropdown === 'kelas'"
                                        class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-60 max-h-40 overflow-y-auto">
                                        <button v-for="k in validRefKelas" :key="k.id" type="button"
                                            @click="formData.kelas_id = k.id; activeDropdown = null;"
                                            class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium text-slate-700 transition-colors">
                                            {{ k.nama_kelas }}
                                        </button>
                                    </div>
                                </transition>
                            </div>
                        </div>

                        <div v-if="formData.kategori === 'Dosen' || formData.kategori === 'Pegawai'">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Nomor Induk
                                Pegawai (NIP)</label>
                            <input v-model="formData.nip" type="text" required
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                                placeholder="Input NIP dosen..." />
                        </div>

                        <div v-if="isEditMode && isPegawaiForm" class="relative custom-select">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                                Role Pegawai
                            </label>

                            <button type="button" @click.stop="toggleDropdown('role')"
                                class="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-bold cursor-pointer hover:border-emerald-300 transition-colors text-slate-700">
                                <span class="truncate pr-2">
                                    {{validRoleOptions.find((role) => role.id === formData.role_id)?.nama_role ||
                                        'Pilih Role Pegawai'}}
                                </span>

                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 shrink-0"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="fade">
                                <div v-if="activeDropdown === 'role'"
                                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-60 max-h-44 overflow-y-auto">
                                    <button v-if="validRoleOptions.length === 0" type="button" disabled
                                        class="w-full px-4 py-2.5 text-sm text-left text-slate-400 font-bold cursor-not-allowed">
                                        Data role belum dimuat
                                    </button>

                                    <button v-for="role in validRoleOptions" :key="role.id" type="button"
                                        @click="formData.role_id = role.id; activeDropdown = null;"
                                        class="w-full px-4 py-2.5 text-sm text-left hover:bg-emerald-50 font-bold text-slate-700 transition-colors"
                                        :class="Number(formData.role_id) === Number(role.id) ? 'bg-emerald-50 text-emerald-700' : ''">
                                        {{ role.nama_role }}
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <div class="grid grid-cols-2 gap-4 items-start">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Email
                                    Institusi</label>
                                <input v-model="formData.email" type="email" required :disabled="isEditMode"
                                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 outline-none font-medium text-slate-700"
                                    placeholder="name@pnj.ac.id" />

                                <div class="mt-3">
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Status
                                        Verifikasi</label>
                                    <div class="flex p-1 bg-slate-100 rounded-xl shadow-inner">
                                        <button type="button" @click="formData.email_verified = true"
                                            :class="formData.email_verified ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'"
                                            class="flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer">
                                            Sudah
                                        </button>
                                        <button type="button" @click="formData.email_verified = false"
                                            :class="!formData.email_verified ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'"
                                            class="flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer">
                                            Belum
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                                    Nomor Telepon
                                </label>
                                <input v-model="formData.no_telepon" type="text" maxlength="13"
                                    class="w-full px-4 py-2.5 border focus:ring-2 focus:ring-emerald-500 border-slate-200 rounded-xl outline-none font-medium text-slate-700"
                                    placeholder="08..."
                                    @input="formData.no_telepon = formData.no_telepon.replace(/\D/g, '').slice(0, 13)" />
                                <p v-if="formData.no_telepon && formData.no_telepon.length < 10"
                                    class="text-[10px] text-red-500 font-bold mt-1 ml-1">
                                    Nomor telepon minimal 10 digit
                                </p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                                {{ isEditMode ? 'Ganti Password (Opsional)' : 'Password Awal' }}
                            </label>
                            <input v-model="formData.password" type="password" :required="!isEditMode"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                :placeholder="isEditMode ? 'Kosongkan jika tidak diganti' : 'Minimal 6 karakter...'" />
                        </div>

                        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
                            <button type="button" @click="closeModal"
                                class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition cursor-pointer active:scale-95">
                                Batalkan
                            </button>
                            <button type="submit"
                                class="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-100 transition cursor-pointer active:scale-95">
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    mode: { type: String, default: 'form' },
    isEditMode: { type: Boolean, default: false },
    detailUser: { type: Object, default: () => ({}) },
    initialFormData: { type: Object, default: () => ({}) },
    refProdi: { type: [Array, Object], default: () => [] },
    refKelas: { type: [Array, Object], default: () => [] },
    refRoles: { type: [Array, Object], default: () => [] },
    years: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({ ...props.initialFormData, email_verified: false });
const activeDropdown = ref(null);

watch(() => props.initialFormData, (newVal) => {
    formData.value = {
        ...newVal,
        email_verified: newVal.email_verified || false,
        // Pastikan password kosong saat modal edit dibuka
        password: ""
    };
}, { deep: true });

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

const closeAllDropdowns = (e) => {
    if (activeDropdown.value && !e.target.closest('.custom-select')) {
        activeDropdown.value = null;
    }
};

const closeModal = () => {
    activeDropdown.value = null;
    emit('close');
};

// ==========================================
// PENGAMAN ARRAY: Ekstraksi Object -> Array
// ==========================================
const validRefProdi = computed(() => {
    return Array.isArray(props.refProdi) ? props.refProdi : (props.refProdi?.data || []);
});

const validRefKelas = computed(() => {
    return Array.isArray(props.refKelas) ? props.refKelas : (props.refKelas?.data || []);
});

const validRoleOptions = computed(() => {
    return Array.isArray(props.refRoles) ? props.refRoles : (props.refRoles?.data || []);
});

const isPegawaiForm = computed(() => {
    return formData.value.kategori === 'Dosen' || formData.value.kategori === 'Pegawai';
});

const handleSave = () => {
    emit('save', { ...formData.value });
};

onMounted(() => window.addEventListener('click', closeAllDropdowns));
onUnmounted(() => window.removeEventListener('click', closeAllDropdowns));

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>