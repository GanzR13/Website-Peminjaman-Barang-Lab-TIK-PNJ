<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useAlert } from "../composables/useAlert";

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const { showAlert } = useAlert();

const loginError = ref(false);
const errorMessage = ref("");

const passwordInputRef = ref(null);
const emailInputRef = ref(null);

const triggerError = (msg) => {
    errorMessage.value = msg;
    loginError.value = true;

    setTimeout(() => {
        if (passwordInputRef.value) {
            passwordInputRef.value.select();
        }
    }, 50);
};

const handleLogin = async () => {
    loginError.value = false;
    errorMessage.value = "";

    if (!email.value || !password.value) {
        triggerError("Email dan password wajib diisi lengkap.");
        return;
    }

    try {
        const success = await authStore.login({
            email: email.value,
            password: password.value,
            portal: 'admin'
        });

        if (success) {
            if (emailInputRef.value) emailInputRef.value.blur();
            if (passwordInputRef.value) passwordInputRef.value.blur();

            showAlert("Login berhasil!", "success");
            await router.push("/admin/dashboard");
        } else {
            triggerError(authStore.error || "Email atau password yang Anda masukkan salah.");
        }
    } catch (err) {
        console.error("Login Catch Error:", err);

        const msg = err.response?.data?.errors
            || err.response?.data?.message
            || authStore.error
            || "Gagal terhubung ke server. Periksa koneksi Anda.";

        triggerError(msg);
    }
};
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4 py-8 sm:px-6 lg:px-8">
        <div class="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100">

            <div class="text-center mb-6 sm:mb-8">
                <div>
                    <img src="../assets/logo_pnj.png" alt="Logo PNJ"
                        class="mx-auto h-16 sm:h-20 w-auto mb-4 drop-shadow-md" />
                </div>

                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SI-LAB ADMIN</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">Dashboard Admin Lab PLP TIK</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
                <div>
                    <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1 ml-1" for="email"
                        :class="{ 'text-red-500': loginError }">
                        Email PNJ<span class="text-red-500"> *</span>
                    </label>
                    <input id="email" name="email" ref="emailInputRef" v-model="email" type="email" required
                        autocomplete="username" placeholder="admin.tik@pnj.ac.id"
                        class="w-full px-4 py-3 sm:py-3.5 rounded-xl border focus:outline-none transition text-sm font-medium text-slate-800"
                        :class="loginError ? 'border-red-400 focus:ring-2 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'" />
                </div>

                <div>
                    <label class="block text-xs sm:text-sm font-bold text-slate-700 mb-1 ml-1" for="password"
                        :class="{ 'text-red-500': loginError }">
                        Password<span class="text-red-500"> *</span>
                    </label>
                    <div class="relative">
                        <input id="password" name="password" ref="passwordInputRef" v-model="password"
                            :type="showPassword ? 'text' : 'password'" required autocomplete="current-password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 sm:py-3.5 rounded-xl border focus:outline-none transition pr-12 text-sm font-medium text-slate-800"
                            :class="loginError ? 'border-red-400 focus:ring-2 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'" />

                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 px-3 flex items-center transition-colors cursor-pointer active:scale-95"
                            :class="loginError ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-blue-600'">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
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

                <button type="submit" :disabled="authStore.loading"
                    class="w-full py-3.5 sm:py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black transition shadow-lg shadow-slate-200 disabled:opacity-50 mt-4 cursor-pointer active:scale-95 text-sm sm:text-base flex justify-center items-center gap-2">
                    <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Memproses...
                    </span>
                    <span v-else>Masuk ke Sistem</span>
                </button>
            </form>

            <p
                class="text-center text-[9px] sm:text-[10px] text-slate-400 mt-6 sm:mt-8 uppercase tracking-widest font-bold">
                © 2026 LAB PLP TIK Politeknik Negeri Jakarta
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Transisi (Jika diperlukan untuk elemen lain) */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>