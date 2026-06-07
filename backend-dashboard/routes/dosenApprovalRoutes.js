"use strict";

const express = require("express");
const router = express.Router();

const dosenApprovalController = require("../controllers/dosenApprovalController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.get(
	"/approval-peminjaman",
	dosenApprovalController.getApprovalPeminjamanDosen
);

router.put(
	"/approval-peminjaman/:id/status",
	dosenApprovalController.updateApprovalPeminjamanDosen
);

module.exports = router;