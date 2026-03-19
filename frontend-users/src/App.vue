<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar v-if="!isAuthPage" />

    <main :class="['flex-1', !isAuthPage ? 'ml-64 p-8' : '']">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();

// Logika untuk mengecek apakah sedang di halaman login atau register
const isAuthPage = computed(() => {
  return ['Login', 'Register'].includes(route.name);
});
</script>