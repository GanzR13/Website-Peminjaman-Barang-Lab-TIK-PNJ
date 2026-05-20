<template>
    <Teleport to="body">
        <transition name="confirm-fade">
            <div
                v-if="isOpen"
                class="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
                <!-- Overlay -->
                <div class="absolute inset-0" @click="closeConfirm"></div>

                <!-- Dialog -->
                <div
                    class="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                    <div class="p-5 sm:p-6">
                        <div class="flex items-start gap-4">
                            <!-- Icon -->
                            <div
                                class="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                                :class="iconClass"
                            >
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <!-- Text -->
                            <div class="flex-1 min-w-0">
                                <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                    {{ title }}
                                </h3>

                                <p class="text-sm text-slate-500 font-medium leading-relaxed mt-2 wrap-break-word">
                                    {{ message }}
                                </p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                            <button
                                type="button"
                                @click="closeConfirm"
                                class="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-sm transition-all active:scale-95"
                            >
                                {{ cancelText }}
                            </button>

                            <button
                                type="button"
                                @click="confirmAction"
                                class="w-full py-3 px-4 rounded-xl text-white font-black text-sm transition-all active:scale-95 shadow-md"
                                :class="buttonClass"
                            >
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>

                    <!-- Accent Bar -->
                    <div class="h-1 w-full" :class="barClass"></div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useConfirm } from '../composables/useConfirm';

const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    confirmColor,
    confirmAction,
    closeConfirm
} = useConfirm();

const buttonClass = computed(() => {
    const map = {
        red: 'bg-red-600 hover:bg-red-700 shadow-red-200',
        blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
        emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        orange: 'bg-orange-600 hover:bg-orange-700 shadow-orange-200',
        slate: 'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
    };

    return map[confirmColor.value] || map.blue;
});

const iconClass = computed(() => {
    const map = {
        red: 'bg-red-100 text-red-600',
        blue: 'bg-blue-100 text-blue-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        orange: 'bg-orange-100 text-orange-600',
        slate: 'bg-slate-100 text-slate-700'
    };

    return map[confirmColor.value] || map.blue;
});

const barClass = computed(() => {
    const map = {
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500',
        orange: 'bg-orange-500',
        slate: 'bg-slate-700'
    };

    return map[confirmColor.value] || map.blue;
});
</script>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
    transition: opacity 0.2s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
    opacity: 0;
}

.confirm-fade-enter-active > div:last-child,
.confirm-fade-leave-active > div:last-child {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.confirm-fade-enter-from > div:last-child,
.confirm-fade-leave-to > div:last-child {
    transform: translateY(12px) scale(0.96);
    opacity: 0;
}
</style>