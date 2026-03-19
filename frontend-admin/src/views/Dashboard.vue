<template>
	<div class="flex min-h-screen bg-gray-50">
		<Sidebar />

		<div class="flex-1 flex flex-col">
			<header
				class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
				<h1 class="text-xl font-bold text-gray-800 italic">Dashboard</h1>
				<div class="flex items-center space-x-4">
					<div class="text-right">
						<p class="text-sm font-bold text-gray-900">
							{{ authStore.user?.nama || "Pengguna" }}
						</p>
						<span
							class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ring-1"
							:class="
								authStore.user?.role_id === 1 ||
								authStore.user?.level_akses === 'super_admin'
									? 'bg-purple-100 text-purple-700 ring-purple-200'
									: 'bg-blue-100 text-blue-700 ring-blue-200'
							">
							{{
								(
									authStore.user?.level ||
									authStore.user?.level_akses ||
									"Staff"
								).replace("_", " ")
							}}
						</span>
					</div>
					<router-link
						to="/profile"
						class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer group shadow-sm"
						title="Lihat Profil">
						<span class="group-hover:hidden">
							{{ authStore.user?.nama?.charAt(0) || "A" }}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 hidden group-hover:block"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</router-link>
				</div>
			</header>

			<main class="p-8">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div
						class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<p class="text-sm text-gray-500 font-medium">Total User</p>
						<h3 class="text-3xl font-bold text-gray-900">124</h3>
					</div>
					<div
						class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<p class="text-sm text-gray-500 font-medium">Jenis Alat</p>
						<h3 class="text-3xl font-bold text-indigo-600">42</h3>
					</div>
					<div
						class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<p class="text-sm text-gray-500 font-medium">Alat Rusak</p>
						<h3 class="text-3xl font-bold text-red-500">3</h3>
					</div>
					<div
						class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<p class="text-sm text-gray-500 font-medium">Aktif Meminjam</p>
						<h3 class="text-3xl font-bold text-blue-600">12</h3>
					</div>
				</div>

				<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-lg font-bold text-gray-800">Aktivitas Peminjam</h2>
						<router-link
							to="/riwayat"
							class="text-sm text-blue-600 font-semibold hover:underline"
							>Lihat Semua</router-link
						>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full text-left">
							<thead>
								<tr
									class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
									<th class="pb-3 px-2">Peminjam</th>
									<th class="pb-3 px-2">Alat</th>
									<th class="pb-3 px-2">Status</th>
									<th class="pb-3 px-2 text-right">Waktu</th>
								</tr>
							</thead>
							<tbody class="text-sm">
								<tr
									class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
									<td class="py-4 px-2 font-medium text-gray-900">
										Andi Saputra
									</td>
									<td class="py-4 px-2 text-gray-600">Oscilloscope Rigol</td>
									<td class="py-4 px-2">
										<span
											class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold"
											>Menunggu</span
										>
									</td>
									<td class="py-4 px-2 text-right text-gray-400">Baru saja</td>
								</tr>
								<tr
									class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
									<td class="py-4 px-2 font-medium text-gray-900">
										Budi Santoso
									</td>
									<td class="py-4 px-2 text-gray-600">Multimeter Fluke</td>
									<td class="py-4 px-2">
										<span
											class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold"
											>Dipinjam</span
										>
									</td>
									<td class="py-4 px-2 text-right text-gray-400">
										10 Menit lalu
									</td>
								</tr>
								<tr
									class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
									<td class="py-4 px-2 font-medium text-gray-900">
										Siti Aminah
									</td>
									<td class="py-4 px-2 text-gray-600">Solder Station</td>
									<td class="py-4 px-2">
										<span
											class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
											>Kembali</span
										>
									</td>
									<td class="py-4 px-2 text-right text-gray-400">1 Jam lalu</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>
