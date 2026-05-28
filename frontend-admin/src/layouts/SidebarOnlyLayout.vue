<template>
    <div class="flex min-h-screen bg-slate-50 overflow-hidden relative">

        <transition name="fade">
            <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
                class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden cursor-pointer">
            </div>
        </transition>

        <div :class="[
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <Sidebar class="h-full w-full" @close-mobile="isSidebarOpen = false" />
        </div>

        <div class="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
            <header
                class="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-30 shadow-sm">
                <div class="flex items-center gap-3">
                    <button @click="isSidebarOpen = true" type="button"
                        class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition-colors focus:outline-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <img src="../assets/logo_pnj.png" alt="Logo PNJ"
                            class="mx-auto h-8 sm:h-10 w-auto drop-shadow-md" />
                    </div>
                    <h1 class="font-black text-slate-800 text-5xs sm:text-sm md:text-lg tracking-tight leading-tight">
                        SI-LAB PLP TIK Admin
                    </h1>
                </div>

                <router-link to="/admin/profile"
                    class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-200 hover:bg-blue-200 hover:scale-105 transition-all cursor-pointer uppercase shadow-sm"
                    title="Buka Profil">
                    {{ userInitial }}
                </router-link>
            </header>

            <main class="flex-1 overflow-y-auto flex flex-col bg-slate-50 relative scroll-smooth">

                <div class="flex-1">
                    <router-view />
                </div>

                <footer class="bg-white border-t border-slate-200 shrink-0 mt-auto">
                    <div
                        class="px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
                        <p class="text-xs md:text-sm text-slate-500 font-medium">
                            © 2026 Laboratorium PLP TIK Politeknik Negeri Jakarta.
                        </p>
                    </div>
                </footer>

            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Sidebar from "../components/Sidebar.vue";

const authStore = useAuthStore();
const route = useRoute();
const isSidebarOpen = ref(false);

const userInitial = computed(() => {
    const name = authStore.user?.nama || authStore.user?.nama_lengkap || 'U';
    return name.charAt(0);
});

watch(() => route.path, () => {
    if (window.innerWidth < 768) {
        isSidebarOpen.value = false;
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>