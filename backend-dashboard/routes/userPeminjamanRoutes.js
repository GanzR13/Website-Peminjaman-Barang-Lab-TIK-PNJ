"use strict";

const express = require('express');
const router = express.Router();
const peminjamanUserController = require('../controllers/peminjamanUserController');
const { authenticateToken } = require('../middlewares/authMiddleware'); 

router.use(authenticateToken);

// ==========================================
// RUTE PEMINJAMAN (SISI USER / MAHASISWA)
// Base URL asumsi: /api/user/peminjaman
// ==========================================

// 1. Checkout (Submit Keranjang Peminjaman)
// Method: POST
router.post('/checkout', peminjamanUserController.checkoutPeminjaman);

// 2. Lihat Riwayat Peminjaman Pribadi
// Method: GET
router.get('/riwayat', peminjamanUserController.getRiwayatSaya);

// 3. Batalkan Peminjaman (Hanya jika masih "Menunggu")
// Method: DELETE
router.delete('/:id/batal', peminjamanUserController.batalkanPeminjaman);
router.put('/:id/edit', peminjamanUserController.updatePeminjamanSaya);

module.exports = router;