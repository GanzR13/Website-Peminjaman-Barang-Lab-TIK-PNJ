const express = require("express");
const router = express.Router();

const adminActionLogController = require("../controllers/adminActionLogController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
	"/",
	authenticateToken,
	authorizeRoles("super_admin"),
	adminActionLogController.getAllLogs
);

module.exports = router;