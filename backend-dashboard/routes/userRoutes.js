const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { validateRegister } = require("../middlewares/authValidator");
const { uploadTtdDigital } = require("../middlewares/uploadCloudinary");

// ===============================
// Route User
// ===============================

// Ambil semua user
router.get("/", authenticateToken, userController.getAllUsers);

router.get("/dosen", authenticateToken, userController.getDosenUsers);

// Ambil data spesifik
router.get("/pegawai", authenticateToken, userController.getPegawai);
router.get("/peminjam", authenticateToken, userController.getPeminjam);

// Ambil data detail per ID
router.get("/pegawai/:id", authenticateToken, userController.getPegawaiById);
router.get("/peminjam/:id", authenticateToken, userController.getPeminjamById);

// Tambah user baru + upload TTD digital
router.post(
	"/",
	authenticateToken,
	uploadTtdDigital.single("ttd_digital"),
	validateRegister,
	userController.createUser
);

// Update user + upload TTD digital
router.put(
	"/:id",
	authenticateToken,
	uploadTtdDigital.single("ttd_digital"),
	userController.updateUser
);

// Update password
router.put(
	"/password/:id",
	authenticateToken,
	userController.updatePassword
);

// Delete user
router.delete(
	"/:id",
	authenticateToken,
	userController.deleteUser
);

module.exports = router;