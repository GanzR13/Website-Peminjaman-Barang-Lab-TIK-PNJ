<template>
    <Teleport to="body">
        <transition name="slide-fade">
            <div
                v-if="isOpen"
                class="fixed z-9999 left-3 right-3 top-3 sm:left-auto sm:right-6 sm:top-6 sm:w-105 sm:max-w-[calc(100vw-3rem)]"
            >
                <div
                    class="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden cursor-pointer"
                    @click="closeAlert"
                >
                    <div class="p-4 sm:p-5">
                        <div class="flex items-start gap-3">
                            <!-- Success Icon -->
                            <div
                                v-if="alertType === 'success'"
                                class="shrink-0 p-2 bg-emerald-100 rounded-full text-emerald-600"
                            >
                                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <!-- Error Icon -->
                            <div
                                v-else-if="alertType === 'error'"
                                class="shrink-0 p-2 bg-red-100 rounded-full text-red-600"
                            >
                                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>

                            <!-- Warning Icon -->
                            <div
                                v-else-if="alertType === 'warning'"
                                class="shrink-0 p-2 bg-amber-100 rounded-full text-amber-600"
                            >
                                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                    />
                                </svg>
                            </div>

                            <!-- Info Icon -->
                            <div
                                v-else
                                class="shrink-0 p-2 bg-blue-100 rounded-full text-blue-600"
                            >
                                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M13 16h-1v-4h-1m1-4h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                                    />
                                </svg>
                            </div>

                            <!-- Text -->
                            <div class="flex-1 min-w-0">
                                <h4
                                    class="text-sm sm:text-base font-black leading-tight"
                                    :class="titleClass"
                                >
                                    {{ alertTitle }}
                                </h4>

                                <p class="text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-relaxed wrap-break-word">
                                    {{ message }}
                                </p>
                            </div>

                            <!-- Close Button -->
                            <button
                                type="button"
                                @click.stop="closeAlert"
                                class="shrink-0 p-1.5 -mt-1 -mr-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
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
import { useAlert } from '../composables/useAlert';

const {
    isOpen,
    message,
    alertType,
    closeAlert
} = useAlert();

const alertTitle = computed(() => {
    if (alertType.value === 'success') return 'Berhasil!';
    if (alertType.value === 'error') return 'Terjadi Kesalahan';
    if (alertType.value === 'warning') return 'Peringatan';
    return 'Informasi';
});

const titleClass = computed(() => {
    const map = {
        success: 'text-emerald-700',
        error: 'text-red-700',
        warning: 'text-amber-700',
        info: 'text-blue-700'
    };

    return map[alertType.value] || map.info;
});

const barClass = computed(() => {
    const map = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };

    return map[alertType.value] || map.info;
});
</script>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-18px);
    opacity: 0;
}

@media (min-width: 640px) {
    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(40px);
        opacity: 0;
    }
}
</style>