const express = require('express');
const router = express.Router();
const dataanalitikController = require('../controllers/dataanalitikController');

// Route untuk mendapatkan data analitik
router.get('/pengadaan', dataanalitikController.getPengadaanAnalytics);

module.exports = router;