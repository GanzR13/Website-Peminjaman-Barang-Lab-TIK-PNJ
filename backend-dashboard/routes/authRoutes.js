const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { validateLogin, validateRegister } = require('../middlewares/authValidator');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login untuk mendapatkan token
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi user baru (Publik/Self-service)
 * Catatan: Untuk admin nambah user, gunakan POST di userRoutes
 */
router.post('/register', validateRegister, userController.createUser);

/**
 * @route   GET /api/auth/me
 * @desc    Mendapatkan profil user yang sedang login (berdasarkan token)
 */
router.get('/me', authenticateToken, userController.getMe);

module.exports = router;