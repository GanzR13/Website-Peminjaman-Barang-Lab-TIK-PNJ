<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useAlert } from "../composables/useAlert"; // 1. Import Global Alert

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert(); // 2. Ekstrak fungsi showAlert

const form = reactive({ email: "", password: "", portal: "user" }); // Tambahkan portal user

// State untuk fitur Show/Hide Password
const isPasswordVisible = ref(false);

const togglePassword = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

const handleSubmit = async () => {
	// Validasi form kosong menggunakan Global Alert
	if (!form.email || !form.password) {
		showAlert("Email dan password wajib diisi.", "error");
		return;
	}

	try {
		const success = await authStore.login(form);
		if (success) {
			showAlert("Berhasil login!", "success");
			router.push("/dashboard"); // Pastikan rutenya benar ke dashboard peminjam
		}
	} catch (err) {
		console.error("Login Error:", err);
		// Ambil pesan error dari store atau tangkap langsung
		showAlert(authStore.error || "Gagal masuk. Periksa kembali email dan password Anda.", "error");
	}
};

const goToRegister = () => {
	authStore.error = null; // Reset error manual di store (opsional, untuk kebersihan state)
	router.push("/register");
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
		<div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
			<div class="text-center">
				<div>
					<img src="../assets/logo_pnj.png" alt="Logo PNJ" class="mx-auto h-20 w-auto mb-4 drop-shadow-md" />
				</div>
				<h2 class="text-3xl font-black text-gray-900 tracking-tight">
					SI-LAB TIK
				</h2>
				<p class="mt-2 text-sm text-gray-500 font-medium">
					Sistem Informasi Manajemen Barang Laboratorium
				</p>
			</div>

			<form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Email PNJ<span
								class="text-red-500"> *</span></label>
						<input v-model="form.email" type="email" required
							class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
							placeholder="nama@pnj.ac.id" />
					</div>

					<div>
						<label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Password<span
								class="text-red-500"> *</span></label>
						<div class="relative">
							<input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" required
								class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
								placeholder="••••••••" />
							<button type="button" @click="togglePassword"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
								<!-- Show (eye) -->
								<svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
									fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>

								<!-- Hide (eye slash) -->
								<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div>
					<button type="submit" :disabled="authStore.loading"
						class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 cursor-pointer">
						<span v-if="authStore.loading" class="flex items-center">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
								fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
									stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
								</path>
							</svg>
							Memproses...
						</span>
						<span v-else>Masuk ke Akun</span>
					</button>
				</div>
			</form>

			<div class="text-center space-y-4 mt-6">
				<p class="text-center text-xs font-medium text-slate-500 mt-6">
					Belum punya akun?
					<router-link to="/register" class="text-blue-600 font-bold">
						Daftar di sini
					</router-link>
				</p>
				<p class="text-xs text-gray-400 font-medium">
					Ada masalah login? Hubungi Teknisi LAB PLP TIK
				</p>
				<p class="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
					© 2026 LAB PLP TIK Politeknik Negeri Jakarta
				</p>
			</div>
		</div>
	</div>
</template>