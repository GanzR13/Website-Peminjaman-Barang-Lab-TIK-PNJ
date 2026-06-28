<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-if="isOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer transition-opacity"
                    @click="closeModal"></div>

                <div
                    :class="['modal-box bg-white rounded-4xl shadow-2xl ring-1 ring-slate-100 w-full relative z-10 flex flex-col max-h-[90vh]', maxWidth]">

                    <button @click="closeModal"
                        class="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all hover:rotate-90 cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <div :class="['overflow-y-auto w-full h-full', paddingClass]">
                        <slot name="header"></slot>

                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    isOpen: { type: Boolean, required: true },
    maxWidth: { type: String, default: 'max-w-xl' },
    paddingClass: {      
        type: String,
        default: 'p-6'  
    }
});

const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<style scoped>

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .modal-box {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-box {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>