"use strict";

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/peminjamanAdminController');
const { authenticateToken } = require('../middlewares/authMiddleware'); 
router.use(authenticateToken); 

// Route Untuk Admin Mengelola Peminjaman
router.get('/all', adminController.getAllPeminjaman);
router.put('/:id/status', adminController.updateStatusPeminjaman);

module.exports = router;