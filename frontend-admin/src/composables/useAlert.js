import { ref } from 'vue';

// State Global
const isOpen = ref(false);
const message = ref('');
const alertType = ref('success');
let timeoutId = null;

const onConfirmCallback = ref(null);
const onCancelCallback = ref(null);

const confirmText = ref('Ya, Lanjutkan');
const confirmColor = ref('blue');

export const useAlert = () => {

    const showAlert = (msg, type = 'success', onConfirm = null, onCancel = null, btnText = 'Ya, Lanjutkan', btnColor = 'blue') => {
        message.value = msg;
        alertType.value = type;
        isOpen.value = true;
        
        onConfirmCallback.value = onConfirm;
        onCancelCallback.value = onCancel;

        if (type === 'confirm') {
            confirmText.value = btnText;
            confirmColor.value = btnColor;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        if (type !== 'confirm') {
            timeoutId = setTimeout(() => {
                isOpen.value = false;
            }, 3000);
        }
    };

    const closeAlert = () => {
        isOpen.value = false;
        if (timeoutId) clearTimeout(timeoutId);
        
        if (onCancelCallback.value) onCancelCallback.value();
    };

    const confirmAction = () => {
        isOpen.value = false;
        
        if (onConfirmCallback.value) onConfirmCallback.value();
    };

    return {
        isOpen,
        message,
        alertType,
        confirmText,
        confirmColor,
        showAlert,
        closeAlert,
        confirmAction
    };
};