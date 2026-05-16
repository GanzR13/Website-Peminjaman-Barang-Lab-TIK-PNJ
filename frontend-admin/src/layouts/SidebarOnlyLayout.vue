<template>
    <div class="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <main class="flex-1 overflow-y-auto flex flex-col bg-gray-50">
                
                <div class="flex-1">
                    <router-view /> 
                </div>

                <footer class="bg-white border-t border-gray-200 shrink-0 mt-auto">
                    <div class="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                        <p class="text-sm text-gray-500 font-medium">
                            © 2026 Laboratorium PLP TIK Politeknik Negeri Jakarta.
                        </p>
                    </div>
                </footer>

            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>