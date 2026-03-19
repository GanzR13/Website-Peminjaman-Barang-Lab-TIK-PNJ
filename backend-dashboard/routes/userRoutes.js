const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateRegister } = require('../middlewares/authValidator');

// --- DAFTAR RUTE USER ---

// 1. Ambil Semua User (General)
router.get('/', authenticateToken, userController.getAllUsers);

// 2. Ambil Data Spesifik (Grup)
router.get('/pegawai', authenticateToken, userController.getPegawai);
router.get('/peminjam', authenticateToken, userController.getPeminjam);

// 3. Ambil Data Detail per ID
router.get('/pegawai/:id', authenticateToken, userController.getPegawaiById);
router.get('/peminjam/:id', authenticateToken, userController.getPeminjamById);

// 4. Tambah User Baru (Gunakan POST / untuk createUser)
router.post('/', authenticateToken, validateRegister, userController.createUser);

// 5. Update & Delete
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;