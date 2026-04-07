<template>
    <div class="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <main class="flex-1 overflow-y-auto relative">
                <router-view /> 
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>