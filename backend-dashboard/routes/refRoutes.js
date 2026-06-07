"use strict";

const express = require("express");
const router = express.Router();

const refController = require("../controllers/refController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// ===============================
// PRODI
// ===============================
router.get("/prodi", refController.getAllProdi);
router.post("/prodi", authenticateToken, refController.createProdi);
router.put("/prodi/:id", authenticateToken, refController.updateProdi);
router.delete("/prodi/:id", authenticateToken, refController.deleteProdi);

// ===============================
// KELAS
// ===============================
router.get("/kelas", refController.getAllKelas);
router.post("/kelas", authenticateToken, refController.createKelas);
router.put("/kelas/:id", authenticateToken, refController.updateKelas);
router.delete("/kelas/:id", authenticateToken, refController.deleteKelas);

// ===============================
// ROLES
// ===============================
router.get("/role", authenticateToken, refController.getAllRoles);

module.exports = router;