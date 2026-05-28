<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useAlert } from "../composables/useAlert";

const authStore = useAuthStore();
const router = useRouter();
const { showAlert } = useAlert();

const form = reactive({ email: "", password: "", portal: "user" });

const isPasswordVisible = ref(false);
const loginError = ref(false);
const errorMessage = ref("");

const passwordInputRef = ref(null);
const emailInputRef = ref(null);

const togglePassword = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

// HELPER KHUSUS: Mengamankan pemunculan error dan menahan popup Chrome
const triggerError = (msg) => {
	errorMessage.value = msg;
	loginError.value = true;

	// Memberikan jeda waktu 50ms agar Vue selesai me-render warna merah di layar, 
	// barulah teks password di-block (highlight)
	setTimeout(() => {
		if (passwordInputRef.value) {
			passwordInputRef.value.select();
		}
	}, 50);
};

const handleSubmit = async () => {
	// 1. Reset state layar setiap kali tombol ditekan
	loginError.value = false;
	errorMessage.value = "";

	if (!form.email || !form.password) {
		triggerError("Email dan password wajib diisi lengkap.");
		return;
	}

	try {
		// 2. Eksekusi ke Pinia Store
		const success = await authStore.login(form);

		if (success) {
			// JIKA SUKSES: Lepas fokus input agar Chrome mau menyimpan sandi
			if (emailInputRef.value) emailInputRef.value.blur();
			if (passwordInputRef.value) passwordInputRef.value.blur();

			showAlert("Berhasil login!", "success");
			await router.push("/dashboard");
		} else {
			// JIKA GAGAL (Store me-return false tanpa melempar error)
			triggerError(authStore.error || "Email atau password yang Anda masukkan salah.");
		}
	} catch (err) {
		console.error("Login Catch Error:", err);

		// PERBAIKAN: Tukar posisi 'errors' agar dibaca duluan daripada 'message'!
		const msg = err.response?.data?.errors
			|| err.response?.data?.message
			|| authStore.error
			|| "Gagal terhubung ke server. Periksa koneksi Anda.";

		triggerError(msg);
	}
};

const goToRegister = () => {
	authStore.error = null;
	loginError.value = false;
	errorMessage.value = "";
	router.push("/register");
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

		<div class="max-w-md w-full bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100">

			<div class="text-center mb-6 sm:mb-8">
				<div>
					<img src="../assets/logo_pnj.png" alt="Logo PNJ"
						class="mx-auto h-16 sm:h-20 w-auto mb-3 sm:mb-4 drop-shadow-md" />
				</div>
				<h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
					SI-LAB TIK
				</h2>
				<p class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 font-medium">
					Sistem Informasi Manajemen Barang Laboratorium
				</p>
			</div>

			<form class="space-y-5 sm:space-y-6" @submit.prevent="handleSubmit">
				<div class="space-y-4 sm:space-y-5">

					<div>
						<label for="email" class="block text-xs sm:text-sm font-bold text-slate-700 mb-1 ml-1"
							:class="{ 'text-red-500': loginError }">
							Email PNJ<span class="text-red-500"> *</span>
						</label>
						<input id="email" name="email" ref="emailInputRef" v-model="form.email" type="email" required
							autocomplete="username"
							class="appearance-none relative block w-full px-4 py-3 sm:py-3.5 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm border"
							:class="loginError ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-blue-500'"
							placeholder="nama@pnj.ac.id" />
					</div>

					<div>
						<label for="password" class="block text-xs sm:text-sm font-bold text-slate-700 mb-1 ml-1"
							:class="{ 'text-red-500': loginError }">
							Password<span class="text-red-500"> *</span>
						</label>
						<div class="relative">
							<input id="password" name="password" ref="passwordInputRef" v-model="form.password"
								:type="isPasswordVisible ? 'text' : 'password'" required autocomplete="current-password"
								class="appearance-none relative block w-full px-4 py-3 sm:py-3.5 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm border"
								:class="loginError ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-blue-500'"
								placeholder="••••••••" />
							<button type="button" @click="togglePassword"
								class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors cursor-pointer active:scale-95"
								:class="loginError ? 'text-red-400' : 'text-slate-400'">
								<svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
									fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div v-show="loginError"
					class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 shadow-sm transition-all duration-300 transform"
					:class="loginError ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mt-0.5 shrink-0" fill="none"
						viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-[11px] sm:text-xs font-bold text-red-600 leading-snug">
						{{ errorMessage || "Kredensial tidak valid." }}
					</p>
				</div>

				<div class="pt-1">
					<button type="submit" :disabled="authStore.loading"
						class="w-full flex justify-center py-3.5 sm:py-4 px-4 text-sm font-black rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 cursor-pointer active:scale-95">
						<span v-if="authStore.loading" class="flex items-center gap-2">
							<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
								viewBox="0 0 24 24">
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

			<div class="text-center mt-6 sm:mt-8 space-y-4">
				<p class="text-xs sm:text-sm font-medium text-slate-500">
					Belum punya akun?
					<router-link to="/register" @click="goToRegister"
						class="text-blue-600 font-bold hover:text-blue-700 transition-colors">
						Daftar di sini
					</router-link>
				</p>
				<p class="text-xs text-slate-400 font-medium">
					Ada masalah login? Hubungi Teknisi LAB PLP TIK
				</p>
				<p class="text-[9px] sm:text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
					© 2026 LAB PLP TIK Politeknik Negeri Jakarta
				</p>
			</div>
		</div>
	</div>
</template>