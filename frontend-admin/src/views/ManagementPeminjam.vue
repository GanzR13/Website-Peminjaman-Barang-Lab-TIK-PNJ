<template>
	<div class="flex min-h-screen bg-gray-50 relative">
		<Sidebar />

		<div class="flex-1 flex flex-col h-screen overflow-hidden">
			<header
				class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
				<h1 class="text-xl font-bold text-gray-800 tracking-tight">
					Manajemen Peminjam
				</h1>
				<button
					@click="fetchUsers"
					class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
					title="Refresh Data">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						:class="{ 'animate-spin': isLoading }"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
			</header>

			<main class="p-8 overflow-y-auto flex-1 relative">
				<div
					class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-125">
					<div
						class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
						<div>
							<h2 class="text-lg font-bold text-gray-800">
								Daftar Peminjam Lab
							</h2>
							<p class="text-sm text-gray-500">
								Total
								<span class="font-bold text-blue-600">{{ totalItems }}</span>
								peminjam terdaftar
							</p>
						</div>
						<div class="flex items-center gap-3 w-full md:w-auto">
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Cari nama, NIM/NIP, email..."
								class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all" />
							<button
								@click="openAddModal"
								class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 shrink-0">
								+ Tambah Peminjam
							</button>
						</div>
					</div>

					<div
						v-if="isLoading"
						class="p-20 text-center flex-1 flex flex-col items-center justify-center">
						<div
							class="animate-spin inline-block w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full mb-4"></div>
						<p class="text-gray-500 font-medium italic">
							Menarik data dari server...
						</p>
					</div>

					<div v-else class="flex-1 flex flex-col">
						<div class="overflow-x-auto flex-1">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr
										class="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest border-b border-gray-100">
										<th class="px-8 py-4 font-black">Profil Peminjam</th>
										<th class="px-8 py-4 font-black">Kontak Institusi</th>
										<th class="px-8 py-4 font-black">Kategori</th>
										<th class="px-8 py-4 font-black text-center">Aksi</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									<tr
										v-for="user in filteredUsers"
										:key="user.id"
										class="hover:bg-blue-50/30 transition">
										<td class="px-8 py-5">
											<div class="flex items-center">
												<div
													class="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold mr-4 text-sm shadow-md shadow-emerald-200 uppercase">
													{{ user.nama_lengkap?.charAt(0) || "?" }}
												</div>
												<div>
													<span
														class="font-bold text-gray-900 block leading-tight mb-1"
														>{{ user.nama_lengkap }}</span
													>
													<span
														class="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
														{{
															user.nim ? "NIM: " + user.nim : "NIP: " + user.nip
														}}
													</span>
												</div>
											</div>
										</td>
										<td class="px-8 py-5 text-sm text-gray-600 font-medium">
											{{ user.user?.email || "-" }}
										</td>
										<td class="px-8 py-5">
											<span
												class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide ring-1"
												:class="
													user.user?.Role?.nama_role === 'Dosen'
														? 'bg-amber-100 text-amber-700 ring-amber-200'
														: 'bg-teal-100 text-teal-700 ring-teal-200'
												">
												{{ user.user?.Role?.nama_role || "Peminjam" }}
											</span>
										</td>
										<td class="px-8 py-5 text-center">
											<div class="flex justify-center items-center gap-2">
												<button
													@click="openDetailModal(user)"
													class="text-emerald-600 hover:text-emerald-800 font-semibold text-sm hover:underline bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
													Detail
												</button>
												<button
													@click="openEditModal(user)"
													class="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
													Edit
												</button>
												<button
													@click="handleDelete(user.id)"
													class="text-red-500 hover:text-red-700 font-semibold text-sm hover:underline bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors cursor-pointer">
													Hapus
												</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div
							v-if="totalItems > 0 && !searchQuery"
							class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<span class="hidden sm:inline font-medium">Tampilkan:</span>
								<div class="relative custom-select">
									<button
										@click.stop="toggleDropdown('limit')"
										class="flex items-center justify-between w-28 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 cursor-pointer">
										<span>{{ limit }} Data</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 text-gray-400 transition-transform"
											:class="{ 'rotate-180': activeDropdown === 'limit' }"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<transition name="fade">
										<div
											v-if="activeDropdown === 'limit'"
											class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 z-30">
											<button
												v-for="opt in [5, 10, 25, 50]"
												:key="opt"
												@click="pilihLimit(opt)"
												class="w-full px-4 py-2 text-sm text-left hover:bg-blue-50 cursor-pointer"
												:class="
													limit === opt
														? 'text-blue-600 font-bold bg-blue-50/50'
														: 'text-gray-600'
												">
												{{ opt }} Data
											</button>
										</div>
									</transition>
								</div>
							</div>
							<div class="flex items-center gap-6">
								<span
									class="text-xs font-bold text-gray-400 uppercase tracking-widest"
									>Hal <span class="text-emerald-600">{{ currentPage }}</span> /
									{{ totalPages }}</span
								>
								<div class="flex gap-2">
									<button
										@click="prevPage"
										:disabled="currentPage === 1"
										class="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 cursor-pointer hover:border-emerald-300 transition-colors">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										@click="nextPage"
										:disabled="currentPage === totalPages"
										class="p-2 border border-gray-200 rounded-xl bg-white disabled:opacity-30 cursor-pointer hover:border-emerald-300 transition-colors">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<transition name="fade">
				<div
					v-if="showDetailModal"
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div
						class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-0 overflow-hidden">
						<div
							class="bg-linear-to-r from-emerald-500 to-teal-600 p-6 flex items-center gap-4 text-white">
							<div
								class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-2xl uppercase border border-white/30">
								{{ detailUser.nama_lengkap?.charAt(0) || "?" }}
							</div>
							<div>
								<h3 class="text-xl font-black leading-tight">
									{{ detailUser.nama_lengkap }}
								</h3>
								<p
									class="text-teal-100 text-[10px] font-bold uppercase tracking-widest mt-1">
									{{ detailUser.user?.Role?.nama_role }}
								</p>
							</div>
						</div>
						<div class="p-6 space-y-3">
							<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
								<p
									class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
									Identitas ({{ detailUser.nim ? "NIM" : "NIP" }})
								</p>
								<p class="text-gray-900 font-bold font-mono">
									{{ detailUser.nim || detailUser.nip || "-" }}
								</p>
							</div>
							<div v-if="detailUser.nim" class="grid grid-cols-2 gap-3">
								<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
									<p
										class="text-[10px] font-black text-gray-400 uppercase mb-1">
										Angkatan / Prodi
									</p>
									<p class="text-gray-900 font-bold text-xs">
										{{ detailUser.angkatan }} - {{ detailUser.nama_prodi }}
									</p>
								</div>
								<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
									<p
										class="text-[10px] font-black text-gray-400 uppercase mb-1">
										Kelas
									</p>
									<p class="text-gray-900 font-bold text-xs">
										{{ detailUser.nama_kelas }}
									</p>
								</div>
							</div>
							<div
								class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between">
								<div>
									<p
										class="text-[10px] font-black text-gray-400 uppercase mb-1">
										Email
									</p>
									<p class="text-gray-900 font-bold text-xs">
										{{ detailUser.user?.email }}
									</p>
								</div>
								<div class="text-right">
									<p
										class="text-[10px] font-black text-gray-400 uppercase mb-1">
										Telepon
									</p>
									<p class="text-gray-900 font-bold text-xs">
										{{ detailUser.user?.no_telepon || "-" }}
									</p>
								</div>
							</div>
							<button
								@click="closeDetailModal"
								class="w-full mt-4 px-6 py-3 text-sm font-black text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition cursor-pointer">
								Tutup Panel Detail
							</button>
						</div>
					</div>
				</div>
			</transition>

			<div
				v-if="showModal"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div
					class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-select">
					<h3 class="text-xl font-black text-gray-900 mb-6">
						{{
							isEditMode
								? "Update Data " + formData.kategori
								: "Registrasi Peminjam Baru"
						}}
					</h3>

					<form @submit.prevent="saveData" class="space-y-4">
						<div
							v-if="!isEditMode"
							class="flex p-1 bg-gray-100 rounded-2xl mb-4 shadow-inner">
							<button
								v-for="cat in ['Mahasiswa', 'Dosen']"
								:key="cat"
								type="button"
								@click="formData.kategori = cat"
								:class="
									formData.kategori === cat
										? 'bg-white text-emerald-600 shadow-sm'
										: 'text-gray-500'
								"
								class="flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest cursor-pointer">
								{{ cat }}
							</button>
						</div>

						<div v-else class="mb-4">
							<span
								class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-emerald-100 bg-emerald-50 text-emerald-700">
								Kategori: {{ formData.kategori }}
							</span>
						</div>

						<div>
							<label
								class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
								>Nama Lengkap</label
							>
							<input
								v-model="formData.nama_lengkap"
								type="text"
								required
								class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
						</div>

						<div
							v-if="formData.kategori === 'Mahasiswa'"
							class="grid grid-cols-2 gap-4">
							<div class="col-span-2">
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>NIM (Nomor Induk Mahasiswa)</label
								>
								<input
									v-model="formData.nim"
									type="text"
									required
									class="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none"
									placeholder="Contoh: 432210..." />
							</div>

							<div class="relative custom-select">
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>Program Studi</label
								>
								<button
									type="button"
									@click.stop="toggleDropdown('prodi')"
									class="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold cursor-pointer">
									<span>{{
										ref_prodi.find((p) => p.id === formData.prodi_id)
											?.nama_prodi || "Pilih Prodi"
									}}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<transition name="fade">
									<div
										v-if="activeDropdown === 'prodi'"
										class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
										<button
											v-for="p in ref_prodi"
											:key="p.id"
											type="button"
											@click="
												formData.prodi_id = p.id;
												activeDropdown = null;
											"
											class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium">
											{{ p.nama_prodi }}
										</button>
									</div>
								</transition>
							</div>

							<div class="relative custom-select">
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>Angkatan</label
								>
								<button
									type="button"
									@click.stop="toggleDropdown('angkatan')"
									class="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold cursor-pointer">
									<span>{{ formData.angkatan }}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<transition name="fade">
									<div
										v-if="activeDropdown === 'angkatan'"
										class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50">
										<button
											v-for="y in years"
											:key="y"
											type="button"
											@click="pilihAngkatan(y)"
											class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium">
											{{ y }}
										</button>
									</div>
								</transition>
							</div>

							<div class="col-span-2 relative custom-select">
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>Kelas</label
								>
								<button
									type="button"
									@click.stop="toggleDropdown('kelas')"
									class="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold cursor-pointer">
									<span>{{
										ref_kelas.find((k) => k.id === formData.kelas_id)
											?.nama_kelas || "Pilih Kelas Mahasiswa"
									}}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<transition name="fade">
									<div
										v-if="activeDropdown === 'kelas'"
										class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
										<button
											v-for="k in ref_kelas"
											:key="k.id"
											type="button"
											@click="
												formData.kelas_id = k.id;
												activeDropdown = null;
											"
											class="w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 font-medium">
											{{ k.nama_kelas }}
										</button>
									</div>
								</transition>
							</div>
						</div>

						<div v-if="formData.kategori === 'Dosen'">
							<label
								class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
								>Nomor Induk Pegawai (NIP)</label
							>
							<input
								v-model="formData.nip"
								type="text"
								required
								class="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none"
								placeholder="Input NIP dosen..." />
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>Email Institusi</label
								>
								<input
									v-model="formData.email"
									type="email"
									required
									:disabled="isEditMode"
									class="w-full px-4 py-2.5 border border-gray-200 rounded-xl disabled:bg-gray-100 outline-none"
									placeholder="name@pnj.ac.id" />
							</div>
							<div>
								<label
									class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
									>Nomor Telepon</label
								>
								<input
									v-model="formData.no_telepon"
									type="text"
									class="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none"
									placeholder="08..." />
							</div>
						</div>

						<div v-if="!isEditMode">
							<label
								class="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1"
								>Password Awal</label
							>
							<input
								v-model="formData.password"
								type="password"
								required
								class="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none"
								placeholder="Minimal 6 karakter..." />
						</div>

						<div class="flex justify-end gap-3 pt-6 border-t mt-4">
							<button
								type="button"
								@click="closeModal"
								class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition cursor-pointer">
								Batalkan
							</button>
							<button
								type="submit"
								class="px-6 py-2.5 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-100 transition cursor-pointer">
								Simpan Perubahan
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import Sidebar from "../components/Sidebar.vue";
import api from "../plugins/axios";

// DATA STATE
const users = ref([]);
const ref_prodi = ref([]);
const ref_kelas = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(10);

// UI STATE
const activeDropdown = ref(null);
const showModal = ref(false);
const showDetailModal = ref(false);
const isEditMode = ref(false);
const detailUser = ref({});

const formData = reactive({
	id: null,
	kategori: "Mahasiswa",
	nama_lengkap: "",
	nim: "",
	nip: "",
	angkatan: new Date().getFullYear(),
	prodi_id: "",
	kelas_id: "",
	email: "",
	no_telepon: "",
	password: "",
});

// LOGIKA DROPDOWN
const toggleDropdown = (name) => {
	activeDropdown.value = activeDropdown.value === name ? null : name;
};

const pilihAngkatan = (year) => {
	formData.angkatan = year;
	activeDropdown.value = null;
};

const pilihLimit = (newLimit) => {
	limit.value = newLimit;
	currentPage.value = 1;
	activeDropdown.value = null;
	fetchUsers();
};

// API ACTIONS
const fetchUsers = async () => {
	isLoading.value = true;
	try {
		const res = await api.get(
			`/users/peminjam?page=${currentPage.value}&limit=${limit.value}`,
		);
		users.value = res.data.data;
		totalItems.value = res.data.pagination.totalItems;
		totalPages.value = res.data.pagination.totalPages;
	} catch (err) {
		console.error("Fetch Error:", err);
	} finally {
		isLoading.value = false;
	}
};

onMounted(async () => {
	fetchUsers();
	try {
		const [resProdi, resKelas] = await Promise.all([
			api.get("/ref/prodi"),
			api.get("/ref/kelas"),
		]);
		ref_prodi.value = resProdi.data;
		ref_kelas.value = resKelas.data;
	} catch (err) {
		console.error("Gagal memuat referensi:", err);
	}

	window.addEventListener("click", (e) => {
		if (!e.target.closest(".custom-select")) activeDropdown.value = null;
	});
});

// COMPUTED PROPERTIES
const currentYear = new Date().getFullYear();
const years = computed(() => {
	const list = [];
	for (let i = currentYear; i >= currentYear - 5; i--) list.push(i);
	return list;
});

const filteredUsers = computed(() => {
	if (!searchQuery.value) return users.value;
	const term = searchQuery.value.toLowerCase();
	return users.value.filter(
		(u) =>
			u.nama_lengkap?.toLowerCase().includes(term) ||
			(u.nim || u.nip || "").toLowerCase().includes(term) ||
			u.user?.email?.toLowerCase().includes(term),
	);
});

// MODAL ACTIONS
const openAddModal = () => {
	isEditMode.value = false;
	activeDropdown.value = null;
	Object.assign(formData, {
		id: null,
		kategori: "Mahasiswa",
		nama_lengkap: "",
		nim: "",
		nip: "",
		angkatan: currentYear,
		prodi_id: "",
		kelas_id: "",
		email: "",
		no_telepon: "",
		password: "",
	});
	showModal.value = true;
};

const openEditModal = (user) => {
    isEditMode.value = true;
    activeDropdown.value = null;
    
    // Tentukan kategori berdasarkan nama role
    const namaRole = user.user?.Role?.nama_role;
    const kategoriSekarang = namaRole === "Mahasiswa" ? "Mahasiswa" : "Dosen";

    Object.assign(formData, {
        id: user.id,
        kategori: kategoriSekarang,
        nama_lengkap: user.nama_lengkap,
        nim: user.nim || "",
        nip: user.nip || "",
        angkatan: user.angkatan || currentYear,
        prodi_id: user.prodi_id || "",
        kelas_id: user.kelas_id || "",
        email: user.user?.email || "",
        no_telepon: user.user?.no_telepon || "",
    });
    showModal.value = true;
};

const openDetailModal = (user) => {
	detailUser.value = { ...user };
	showDetailModal.value = true;
};

const closeDetailModal = () => {
	showDetailModal.value = false;
};

const closeModal = () => {
	showModal.value = false;
	activeDropdown.value = null;
};

// DATA PERSISTENCE
const saveData = async () => {
	try {
		const payload = {
			...formData,
			role_id: formData.kategori === "Mahasiswa" ? 5 : 4,
		};

		if (isEditMode.value) {
			await api.put(`/users/${formData.id}`, payload);
		} else {
			await api.post("/users", payload);
		}

		closeModal();
		fetchUsers();
	} catch (err) {
		alert(err.response?.data?.message || "Gagal menyimpan data");
	}
};

const handleDelete = async (id) => {
	if (
		confirm("Apakah anda yakin ingin menghapus peminjam ini secara permanen?")
	) {
		try {
			await api.delete(`/users/${id}`);
			fetchUsers();
		} catch (err) {
			alert("Gagal menghapus data");
		}
	}
};

// NAVIGASI
const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		fetchUsers();
	}
};
const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		fetchUsers();
	}
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.2s,
		transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
::-webkit-scrollbar {
	width: 5px;
	height: 5px;
}
::-webkit-scrollbar-thumb {
	background: #e2e8f0;
	border-radius: 10px;
}
</style>
