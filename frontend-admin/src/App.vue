<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  
  <!-- Komponen Pop-up & Dialog Global -->
  <ToastAlert />
  <ConfirmDialog />
</template>

<script setup>
import ToastAlert from './components/ToastAlert.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent; 
}

#app {
  min-height: 100dvh; 
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (pointer: fine) {
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
}
</style>