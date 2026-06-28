import { ref } from 'vue';

const isOpen = ref(false);
const message = ref('');
const alertType = ref('success');

let timeoutId = null;

const clearAlertTimeout = () => {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
};

export const useAlert = () => {
    const showAlert = (msg, type = 'success', duration = 3000) => {
        clearAlertTimeout();

        message.value = msg;
        alertType.value = type;
        isOpen.value = true;

        if (duration !== false) {
            timeoutId = setTimeout(() => {
                isOpen.value = false;
                clearAlertTimeout();
            }, duration);
        }
    };

    const closeAlert = () => {
        isOpen.value = false;
        clearAlertTimeout();
    };

    return {
        isOpen,
        message,
        alertType,
        showAlert,
        closeAlert
    };
};