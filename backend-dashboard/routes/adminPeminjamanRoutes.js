"use strict";

const express = require('express');
const router = express.Router();

// Ini yang benar: Mengimpor CONTROLLER, bukan mengimpor ROUTES
const adminController = require('../controllers/peminjamanAdminController');

// Mengimpor middleware (sesuaikan dengan namamu, jika ada)
const { authenticateToken } = require('../middlewares/authMiddleware'); 
router.use(authenticateToken); 

// Rute-rutenya
router.get('/all', adminController.getAllPeminjaman);
router.put('/:id/status', adminController.updateStatusPeminjaman);

module.exports = router;