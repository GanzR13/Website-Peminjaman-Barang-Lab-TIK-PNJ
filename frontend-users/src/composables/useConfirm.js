import { ref } from 'vue';

const isOpen = ref(false);
const title = ref('Konfirmasi');
const message = ref('');
const confirmText = ref('Ya, Lanjutkan');
const cancelText = ref('Batal');
const confirmColor = ref('blue');

const onConfirmCallback = ref(null);
const onCancelCallback = ref(null);

const resetConfirm = () => {
    title.value = 'Konfirmasi';
    message.value = '';
    confirmText.value = 'Ya, Lanjutkan';
    cancelText.value = 'Batal';
    confirmColor.value = 'blue';
    onConfirmCallback.value = null;
    onCancelCallback.value = null;
};

export const useConfirm = () => {
    const showConfirm = (
        msg,
        onConfirm = null,
        onCancel = null,
        btnText = 'Ya, Lanjutkan',
        btnColor = 'blue',
        dialogTitle = 'Konfirmasi',
        btnCancelText = 'Batal'
    ) => {
        message.value = msg;
        title.value = dialogTitle;
        confirmText.value = btnText;
        confirmColor.value = btnColor;
        cancelText.value = btnCancelText;

        onConfirmCallback.value = typeof onConfirm === 'function' ? onConfirm : null;
        onCancelCallback.value = typeof onCancel === 'function' ? onCancel : null;

        isOpen.value = true;
    };

    const confirmAction = () => {
        const callback = onConfirmCallback.value;

        isOpen.value = false;
        resetConfirm();

        if (callback) callback();
    };

    const closeConfirm = () => {
        const callback = onCancelCallback.value;

        isOpen.value = false;
        resetConfirm();

        if (callback) callback();
    };

    return {
        isOpen,
        title,
        message,
        confirmText,
        cancelText,
        confirmColor,
        showConfirm,
        confirmAction,
        closeConfirm
    };
};