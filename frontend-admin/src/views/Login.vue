<template>
	<div
		class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4">
		<div
			class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
			<div class="text-center mb-8">
				<div
					class="bg-slate-800 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-slate-200 mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>

				<h2 class="text-2xl font-bold text-gray-800">Login Admin</h2>
				<p class="text-sm text-gray-500 mt-1">Dashboard Admin Lab PLP TIK</p>
			</div>

			<form @submit.prevent="handleLogin" class="space-y-5">
				<div>
					<label
						class="block text-sm font-bold text-gray-700 mb-1 ml-1"
						for="email">
						Email Institusi
					</label>
					<input
						id="email"
						v-model="email"
						type="email"
						required
						placeholder="admin.tik@pnj.ac.id"
						class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-500 outline-none transition" />
				</div>

				<div>
					<label
						class="block text-sm font-bold text-gray-700 mb-1 ml-1"
						for="password">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							required
							placeholder="••••••••"
							class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-500 outline-none transition pr-12" />

						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-slate-600 focus:outline-none transition-colors">
							<svg
								v-if="showPassword"
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
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
							</svg>
						</button>
					</div>
				</div>

				<Transition name="slide-fade">
					<div
						v-if="authStore.error"
						class="mb-6 flex items-center p-4 rounded-2xl bg-red-50 border border-red-100 shadow-sm relative overflow-hidden group animate-shake">
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
									Login Gagal
								</p>
								<p class="text-sm font-bold text-red-800 leading-tight">
									{{ authStore.error }}
								</p>
							</div>
						</div>

						<button
							@click="authStore.error = null"
							class="ml-auto text-red-400 hover:text-red-600 transition-colors outline-none">
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

				<button
					type="submit"
					:disabled="authStore.loading"
					class="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black transition shadow-lg shadow-slate-200 disabled:opacity-50">
					<span
						v-if="authStore.loading"
						class="flex items-center justify-center">
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
					<span v-else>Masuk ke Sistem</span>
				</button>
			</form>

			<p
				class="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
				© 2026 PLP TIK Politeknik Negeri Jakarta
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
    authStore.error = null;

    if (!email.value || !password.value) {
        authStore.error = "Email dan password wajib diisi.";
        return;
    }

    try {
        await authStore.login(email.value, password.value);
        router.push("/admin/dashboard");
    } catch (error) {
        // Auto hide alert setelah 5 detik
        setTimeout(() => {
            if (authStore.error) authStore.error = null;
        }, 5000);
    }
};
</script>

<style scoped>
/* Transisi Slide & Fade */
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

/* Animasi Progress Bar */
.animate-progress {
    animation: progress 5s linear forwards;
}

@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}

/* Animasi Shake yang sudah ada */
.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
