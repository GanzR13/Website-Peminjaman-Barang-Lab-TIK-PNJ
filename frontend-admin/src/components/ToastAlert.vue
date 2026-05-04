<template>
    <Teleport to="body">
        <transition name="slide-fade">
            <div v-if="isOpen"
                class="fixed top-6 right-6 z-9999 p-4 w-fit max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100"
                :class="alertType !== 'confirm' ? 'cursor-pointer flex items-center gap-3' : 'flex flex-col gap-3'"
                @click="alertType !== 'confirm' ? closeAlert() : null">
                
                <div class="flex items-center gap-3">
                    <div v-if="alertType === 'success'" class="shrink-0 p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    
                    <div v-else-if="alertType === 'error'" class="shrink-0 p-2 bg-red-100 rounded-full text-red-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>

                    <div v-else-if="alertType === 'confirm'" class="shrink-0 p-2 bg-blue-100 rounded-full text-blue-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>

                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-slate-800" 
                            :class="{
                                'text-emerald-700': alertType === 'success', 
                                'text-red-700': alertType === 'error',
                                'text-blue-700': alertType === 'confirm'
                            }">
                            {{ alertType === 'success' ? 'Berhasil!' : (alertType === 'error' ? 'Terjadi Kesalahan' : 'Konfirmasi') }}
                        </h4>
                        <p class="text-xs font-medium text-slate-500 mt-0.5">{{ message }}</p>
                    </div>

                    <button v-if="alertType !== 'confirm'" @click.stop="closeAlert" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div v-if="alertType === 'confirm'" class="flex gap-2 mt-2">
                    <button @click="closeAlert" class="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                        Batal
                    </button>
                    <button @click="confirmAction" class="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-md shadow-red-200">
                        Ya, Keluar
                    </button>
                </div>

            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { useAlert } from '../composables/useAlert';

// Ekstrak fungsi confirmAction
const { isOpen, message, alertType, closeAlert, confirmAction } = useAlert();
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(50px); opacity: 0; }
</style>