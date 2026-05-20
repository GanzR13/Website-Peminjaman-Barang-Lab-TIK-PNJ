const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateRegister } = require('../middlewares/authValidator');

// Daftar Route User

// Ambil Semua User
router.get('/', authenticateToken, userController.getAllUsers);

// Ambil Data Spesifik
router.get('/pegawai', authenticateToken, userController.getPegawai);
router.get('/peminjam', authenticateToken, userController.getPeminjam);

// Ambil Data Detail per ID
router.get('/pegawai/:id', authenticateToken, userController.getPegawaiById);
router.get('/peminjam/:id', authenticateToken, userController.getPeminjamById);

// Tambah User Baru
router.post('/', authenticateToken, validateRegister, userController.createUser);

// Update & Delete Data User
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;