const express = require('express');
const router = express.Router();
const refController = require('../controllers/refController');

// Route Referensi (Prodi & Kelas)
router.get('/prodi', refController.getAllProdi);
router.get('/kelas', refController.getAllKelas);
router.get('/role', refController.getAllRoles);

module.exports = router;