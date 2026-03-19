<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import api from "../plugins/axios";

const authStore = useAuthStore();
const router = useRouter();

// DEKLARASI STATE
const ref_prodi = ref([]);
const ref_kelas = ref([]);
const activeDropdown = ref(null); 
const isPasswordVisible = ref(false);

const toggleDropdown = (name) => {
    activeDropdown.value = activeDropdown.value === name ? null : name;
};

// Fungsi Memilih Item
const pilihProdi = (prodi) => {
    form.prodi_id = prodi.id;
    activeDropdown.value = null;
};

const pilihAngkatan = (year) => {
    form.angkatan = year;
    activeDropdown.value = null;
};

const pilihKelas = (kelas) => {
    form.kelas_id = kelas.id;
    activeDropdown.value = null;
};

// Generate Daftar Tahun (Angkatan)
const currentYear = new Date().getFullYear();
const years = computed(() => {
    const list = [];
    for (let i = currentYear; i >= currentYear - 4; i--) {
        list.push(i);
    }
    return list;
});

const form = reactive({
    kategori: "Mahasiswa",
    nama_lengkap: "",
    email: "",
    password: "",
    no_telepon: "",
    nim: "",
    nip: "",
    angkatan: currentYear,
    prodi_id: "",
    kelas_id: "",
});

// GABUNGAN ONMOUNTED
onMounted(async () => {
    // Ambil Data Referensi
    try {
        const [resProdi, resKelas] = await Promise.all([
            api.get("/ref/prodi"),
            api.get("/ref/kelas"),
        ]);
        ref_prodi.value = resProdi.data;
        ref_kelas.value = resKelas.data;
    } catch (err) {
        console.error("Gagal memuat data referensi:", err);
    }

    // Klik Luar untuk Tutup Dropdown
    window.addEventListener("click", (e) => {
        if (!e.target.closest(".custom-select")) {
            activeDropdown.value = null;
        }
    });
});

const handleRegister = async () => {
    authStore.error = null;
    try {
        const payload = {
            ...form,
            role_id: form.kategori === "Mahasiswa" ? 5 : 4,
        };
        await authStore.register(payload);
        router.push("/login");
    } catch (err) {
        setTimeout(() => {
            if (authStore.error) authStore.error = null;
        }, 5000);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div class="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            
            <div class="text-center">
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">Daftar Akun</h2>
                <p class="mt-2 text-sm text-gray-500 font-medium">Lengkapi data diri sesuai identitas institusi</p>
            </div>

            <div class="flex p-1 bg-gray-100 rounded-2xl shadow-inner mb-6">
                <button @click="form.kategori = 'Mahasiswa'" type="button"
                    :class="form.kategori === 'Mahasiswa' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
                    class="flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer">Mahasiswa</button>
                <button @click="form.kategori = 'Dosen'" type="button"
                    :class="form.kategori === 'Dosen' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
                    class="flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer">Dosen</button>
            </div>

            <form class="space-y-4" @submit.prevent="handleRegister">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nama Lengkap</label>
                        <input v-model="form.nama_lengkap" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Masukkan nama lengkap" />
                    </div>

                    <div v-if="form.kategori === 'Mahasiswa'">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">NIM</label>
                        <input v-model="form.nim" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="2207..." />
                    </div>
                    <div v-else class="md:col-span-1">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">NIP</label>
                        <input v-model="form.nip" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="19XXXXXXXXXX" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">No. Telepon</label>
                        <input v-model="form.no_telepon" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0812..." />
                    </div>

                    <template v-if="form.kategori === 'Mahasiswa'">
                        <div class="md:col-span-1 relative custom-select">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Program Studi</label>
                            <button type="button" @click.stop="toggleDropdown('prodi')"
                                class="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span :class="!form.prodi_id ? 'text-gray-400' : 'text-gray-900'">
                                    {{ ref_prodi.find((p) => p.id === form.prodi_id)?.nama_prodi || "Pilih Prodi" }}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 transition-transform" :class="activeDropdown === 'prodi' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'prodi'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30 max-h-60 overflow-y-auto">
                                    <button v-for="p in ref_prodi" :key="p.id" type="button" @click="pilihProdi(p)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.prodi_id === p.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'">
                                        {{ p.nama_prodi }}
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <div class="md:col-span-1 relative custom-select">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Angkatan</label>
                            <button type="button" @click.stop="toggleDropdown('angkatan')"
                                class="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span class="text-gray-900">{{ form.angkatan }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'angkatan'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30">
                                    <button v-for="year in years" :key="year" type="button" @click="pilihAngkatan(year)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.angkatan === year ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'">
                                        {{ year }}
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <div class="md:col-span-2 relative custom-select">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Kelas</label>
                            <button type="button" @click.stop="toggleDropdown('kelas')"
                                class="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium cursor-pointer">
                                <span :class="!form.kelas_id ? 'text-gray-400' : 'text-gray-900'">
                                    {{ ref_kelas.find((k) => k.id === form.kelas_id)?.nama_kelas || "Pilih Kelas" }}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <transition name="fade">
                                <div v-if="activeDropdown === 'kelas'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30 max-h-60 overflow-y-auto">
                                    <button v-for="k in ref_kelas" :key="k.id" type="button" @click="pilihKelas(k)"
                                        class="w-full flex items-center px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                                        :class="form.kelas_id === k.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'">
                                        {{ k.nama_kelas }}
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </template>

                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email Institusi</label>
                        <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="user@pnj.ac.id" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
                        <input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="********" />
                    </div>
                </div>

                <transition name="fade">
                    <div v-if="authStore.error" class="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                        {{ authStore.error }}
                    </div>
                </transition>

                <button type="submit" :disabled="authStore.loading" class="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer">
                    {{ authStore.loading ? 'Sedang Memproses...' : 'Buat Akun Sekarang' }}
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.animate-shake { animation: shake 0.5s; }
@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
}
</style>