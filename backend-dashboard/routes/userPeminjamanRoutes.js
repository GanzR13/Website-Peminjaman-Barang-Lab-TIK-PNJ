"use strict";

const express = require('express');
const router = express.Router();
const peminjamanUserController = require('../controllers/peminjamanUserController');
const { authenticateToken } = require('../middlewares/authMiddleware'); 
const laporanUserController = require('../controllers/laporanUserController');
const { uploadLaporan } = require('../middlewares/uploadCloudinary');

router.use(authenticateToken);

// ==========================================
// Route Peminjaman(User)
// Base URL asumsi: /api/user/peminjaman
// ==========================================

// Checkout (Submit Keranjang Peminjaman)
router.post('/checkout', peminjamanUserController.checkoutPeminjaman);

// Lihat Riwayat Peminjaman
router.get('/riwayat', peminjamanUserController.getRiwayatSaya);

// Batalkan Peminjaman (Hanya jika status masih "Menunggu")
router.delete('/:id/batal', peminjamanUserController.batalkanPeminjaman);

router.put('/:id/edit', peminjamanUserController.updatePeminjamanSaya);

// ==========================================
// Route Laporan Masalah (RUSAK / HILANG)
// ==========================================

router.post('/laporan', (req, res, next) => {
    const upload = uploadLaporan.single('foto_bukti');
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
}, laporanUserController.buatLaporan)

router.get('/laporan', laporanUserController.getRiwayatLaporan);
router.get('/laporan/:id', laporanUserController.getDetailLaporan);

module.exports = router;