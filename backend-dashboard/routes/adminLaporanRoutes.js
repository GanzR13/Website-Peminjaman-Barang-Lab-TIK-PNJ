"use strict";

const express = require("express");
const router = express.Router();

const laporanAdminController = require("../controllers/laporanAdminController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Route Laporan Masalah (Admin)

// Mengambil semua data laporan
router.get(
	"/",
	authenticateToken,
	laporanAdminController.getAllLaporan
);

// Memperbarui status dan catatan penyelesaian laporan
router.put(
	"/:id/status",
	authenticateToken,
	laporanAdminController.updateStatusLaporan
);

module.exports = router;