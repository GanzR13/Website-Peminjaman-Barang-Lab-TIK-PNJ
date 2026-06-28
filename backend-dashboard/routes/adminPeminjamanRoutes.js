"use strict";

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/peminjamanAdminController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.put('/:id/kalab-approval', adminController.approveKalabPeminjaman);
// Route untuk admin mengelola peminjaman
router.get("/all", adminController.getAllPeminjaman);
router.get("/menunggu/count", adminController.getTotalPeminjamanMenunggu);
router.put("/:id/status", adminController.updateStatusPeminjaman);

module.exports = router;