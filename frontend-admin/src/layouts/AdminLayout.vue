<template>
    <div class="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
                <h1 class="text-xl font-bold text-gray-800 italic">SI-LAB TIK</h1>
                
                <div class="flex items-center space-x-4">
                    <div class="text-right">
                        <p class="text-sm font-bold text-gray-900">{{ authStore.user?.nama || "Pengguna" }}</p>
                        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ring-1 bg-blue-100 text-blue-700 ring-blue-200">
                            Admin
                        </span>
                    </div>
                    <router-link to="/profile" class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all">
                        {{ authStore.user?.nama?.charAt(0) || "A" }}
                    </router-link>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto">
                <router-view /> 
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
</script>