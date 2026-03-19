const express = require('express');
const router = express.Router();
const refController = require('../controllers/refController');

router.get('/prodi', refController.getAllProdi);
router.get('/kelas', refController.getAllKelas);

module.exports = router;