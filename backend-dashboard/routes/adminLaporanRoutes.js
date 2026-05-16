"use strict";

const express = require("express");
const router = express.Router();
const laporanAdminController = require("../controllers/laporanAdminController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
	LaporanMasalah,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
} = require("../models");

// ==========================================
// RUTE LAPORAN MASALAH (SISI ADMIN)
// Asumsi Base URL di index.js: /api/admin/laporan
// ==========================================

// Mengambil semua data laporan
router.get("/", laporanAdminController.getAllLaporan);

// Memperbarui status dan catatan penyelesaian laporan
router.put("/:id/status", laporanAdminController.updateStatusLaporan);
router.use(authenticateToken);
module.exports = router;
