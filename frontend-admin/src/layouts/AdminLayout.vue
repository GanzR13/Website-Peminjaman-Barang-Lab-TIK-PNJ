<template>
    <div class="flex min-h-screen bg-slate-50 relative overflow-hidden">
        
        <transition name="fade">
            <div v-if="isSidebarOpen" @click="isSidebarOpen = false" 
                class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden cursor-pointer">
            </div>
        </transition>

        <div :class="[
            'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <Sidebar @close-mobile="isSidebarOpen = false" />
        </div>

        <div class="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
            
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0 z-30">
                
                <div class="flex items-center gap-3">
                    <button @click="isSidebarOpen = true" class="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition-colors cursor-pointer active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <h1 class="text-lg md:text-xl font-bold text-slate-800 italic">SI-LAB TIK</h1>
                </div>
                
                <div class="flex items-center gap-3 md:gap-4">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-bold text-slate-900 leading-tight">{{ authStore.user?.nama || "Pengguna" }}</p>
                        <span class="px-2 py-0.5 mt-0.5 inline-block rounded text-[9px] md:text-[10px] font-black uppercase tracking-wide ring-1 bg-blue-100 text-blue-700 ring-blue-200">
                            {{ authStore.user?.Role?.nama_role || "Admin" }}
                        </span>
                    </div>

                    <router-link to="/profile" class="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm md:text-base border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        {{ authStore.user?.nama?.charAt(0)?.toUpperCase() || "A" }}
                    </router-link>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
                <router-view /> 
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from "../components/Sidebar.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const route = useRoute();

// State untuk mengatur buka/tutup sidebar di Mobile
const isSidebarOpen = ref(false);

// Otomatis menutup sidebar di HP ketika user mengeklik menu (pindah halaman)
watch(() => route.path, () => {
    if (window.innerWidth < 768) { // 768px adalah batas breakpoint 'md' di Tailwind
        isSidebarOpen.value = false;
    }
});
</script>

<style scoped>
/* Transisi untuk efek layar gelap (overlay) */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>