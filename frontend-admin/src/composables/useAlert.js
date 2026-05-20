import { ref } from 'vue';

// State Global
const isOpen = ref(false);
const message = ref('');
const alertType = ref('success'); // 'success', 'error', 'confirm'
let timeoutId = null;

// Menyimpan fungsi yang akan dijalankan jika user klik "Ya" atau "Batal"
const onConfirmCallback = ref(null);
const onCancelCallback = ref(null);

// TAMBAHAN STATE BARU UNTUK UI DINAMIS
const confirmText = ref('Ya, Lanjutkan');
const confirmColor = ref('blue');

export const useAlert = () => {
    // Tambahkan parameter btnText dan btnColor di akhir
    const showAlert = (msg, type = 'success', onConfirm = null, onCancel = null, btnText = 'Ya, Lanjutkan', btnColor = 'blue') => {
        message.value = msg;
        alertType.value = type;
        isOpen.value = true;
        
        onConfirmCallback.value = onConfirm;
        onCancelCallback.value = onCancel;

        // Set teks dan warna dinamis khusus untuk tipe confirm
        if (type === 'confirm') {
            confirmText.value = btnText;
            confirmColor.value = btnColor;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Timer 3 detik HANYA berjalan jika BUKAN tipe 'confirm'
        if (type !== 'confirm') {
            timeoutId = setTimeout(() => {
                isOpen.value = false;
            }, 3000);
        }
    };

    const closeAlert = () => {
        isOpen.value = false;
        if (timeoutId) clearTimeout(timeoutId);
        
        // Jalankan fungsi batal jika ada
        if (onCancelCallback.value) onCancelCallback.value();
    };

    const confirmAction = () => {
        isOpen.value = false;
        
        // Jalankan fungsi persetujuan (contoh: fungsi logout)
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