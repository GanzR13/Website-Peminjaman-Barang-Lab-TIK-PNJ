"use strict";

const express = require('express');
const router = express.Router();
const peminjamanUserController = require('../controllers/peminjamanUserController');
const { authenticateToken } = require('../middlewares/authMiddleware'); 
const laporanUserController = require('../controllers/laporanUserController');
const { uploadCloud } = require('../middlewares/uploadCloudinary');

router.use(authenticateToken);

// ==========================================
// RUTE PEMINJAMAN (SISI USER / MAHASISWA)
// Base URL asumsi: /api/user/peminjaman
// ==========================================

// Checkout (Submit Keranjang Peminjaman)
// Method: POST
router.post('/checkout', peminjamanUserController.checkoutPeminjaman);

// Lihat Riwayat Peminjaman Pribadi
// Method: GET
router.get('/riwayat', peminjamanUserController.getRiwayatSaya);

// Batalkan Peminjaman (Hanya jika masih "Menunggu")
// Method: DELETE
router.delete('/:id/batal', peminjamanUserController.batalkanPeminjaman);

router.put('/:id/edit', peminjamanUserController.updatePeminjamanSaya);

// ==========================================
// RUTE LAPORAN MASALAH (RUSAK / HILANG)
// ==========================================

// Gunakan uploadCloud.single('foto_bukti')
// Tambahkan error handler kecil jika upload gagal karena format/ukuran
router.post('/laporan', (req, res, next) => {
    const upload = uploadCloud.single('foto_bukti');
    upload(req, res, function (err) {
        if (err) {
            if (err.message === 'FORMAT_TIDAK_VALID') {
                return res.status(400).json({ status: 'error', message: 'Format file tidak diizinkan. Harap upload gambar.' });
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ status: 'error', message: 'Ukuran foto maksimal 5MB.' });
            }
            return res.status(500).json({ status: 'error', message: 'Gagal mengunggah foto ke server.' });
        }
        next();
    });
}, laporanUserController.buatLaporan);

router.get('/laporan', laporanUserController.getRiwayatLaporan);
router.get('/laporan/:id', laporanUserController.getDetailLaporan);

module.exports = router;