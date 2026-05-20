const express = require('express');
const router = express.Router();
const dataanalitikController = require('../controllers/dataanalitikController');

// Route Untuk Mendapatkan Data Analitik
router.get('/pengadaan', dataanalitikController.getPengadaanAnalytics);
router.get("/peminjaman-bulanan", dataanalitikController.getPeminjamanBulanan);

module.exports = router;