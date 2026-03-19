<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: "", password: "" });

// State untuk fitur Show/Hide Password
const isPasswordVisible = ref(false);

const togglePassword = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

const handleSubmit = async () => {
    authStore.error = null;

    try {
        const success = await authStore.login(form);
        if (success) {
            router.push("/dashboard");
        }
    } catch (err) {
        console.error("Login Error:", err);
        // Alert otomatis hilang setelah 5 detik
        setTimeout(() => {
            if (authStore.error) authStore.error = null;
        }, 5000);
    }
};

const goToRegister = () => {
	authStore.error = null; // Reset error manual
	router.push("/register");
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
		<div
			class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
			<div class="text-center">
				<div
					class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</div>
				<h2 class="text-3xl font-black text-gray-900 tracking-tight">
					SI-LAB TIK
				</h2>
				<p class="mt-2 text-sm text-gray-500 font-medium">
					Sistem Peminjam Barang Laboratorium
				</p>
			</div>
			<Transition name="slide-fade">
				<div
					v-if="authStore.error"
					class="flex items-center p-4 rounded-2xl bg-red-50 border border-red-100 shadow-sm relative overflow-hidden group animate-shake">
					<div
						class="absolute bottom-0 left-0 h-1 bg-red-200 animate-progress"></div>

					<div class="flex items-center">
						<div class="bg-red-100 p-2 rounded-xl mr-3">
							<svg
								class="w-5 h-5 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>
						<div>
							<p
								class="text-[10px] uppercase font-black text-red-400 tracking-widest">
								Gagal Masuk
							</p>
							<p class="text-sm font-bold text-red-800 leading-tight">
								{{ authStore.error }}
							</p>
						</div>
					</div>

					<button
						@click="authStore.error = null"
						class="ml-auto text-red-300 hover:text-red-500 transition-colors outline-none cursor-pointer">
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</Transition>
			<form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-bold text-gray-700 mb-1 ml-1"
							>Email Institusi</label
						>
						<input
							v-model="form.email"
							type="email"
							required
							class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
							placeholder="nama@pnj.ac.id" />
					</div>

					<div>
						<label class="block text-sm font-bold text-gray-700 mb-1 ml-1"
							>Password</label
						>
						<div class="relative">
							<input
								v-model="form.password"
								:type="isPasswordVisible ? 'text' : 'password'"
								required
								class="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
								placeholder="••••••••" />
							<button
								type="button"
								@click="togglePassword"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
								<svg
									v-if="!isPasswordVisible"
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								<svg
									v-else
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.146 5.147m13.71 13.71l-4.738-4.736m-4.568-4.568L18.854 3.146" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div
					v-if="authStore.error"
					class="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 animate-shake">
					{{ authStore.error }}
				</div>

				<div>
					<button
						type="submit"
						:disabled="authStore.loading"
						class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed">
						<span v-if="authStore.loading" class="flex items-center">
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Memproses...
						</span>
						<span v-else>Masuk ke Akun</span>
					</button>
				</div>
			</form>

			<div class="text-center space-y-4 mt-6">
				<p class="text-sm text-gray-600 font-medium">
					Belum punya akun?
					<button
						@click="goToRegister"
						class="text-blue-600 hover:text-blue-800 font-bold transition-colors">
						Daftar di sini
					</button>
				</p>
				<p class="text-xs text-gray-400 font-medium">
					Masalah login? Hubungi Teknisi PLP TIK
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Transisi Masuk/Keluar */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Animasi Progress Bar Waktu */
.animate-progress {
    animation: progress 5s linear forwards;
}

@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}

/* Animasi Shake */
.animate-shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
