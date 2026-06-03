const express = require("express");
const router = express.Router();
const multer = require("multer");

const barangController = require("../controllers/barangController");
const { uploadBarang } = require("../middlewares/uploadCloudinary");
const { authenticateToken } = require("../middlewares/authMiddleware");

const handleUpload = (req, res, next) => {
	const upload = uploadBarang.single("gambar");

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({
					status: "error",
					message: "Ukuran gambar terlalu besar! Maksimal 5 MB.",
				});
			}

			return res.status(400).json({
				status: "error",
				message: err.message,
			});
		}

		if (err) {
			if (err.message === "FORMAT_TIDAK_VALID") {
				return res.status(400).json({
					status: "error",
					message:
						"Format file ditolak! Harap unggah file gambar (JPG, JPEG, PNG, WEBP).",
				});
			}

			return res.status(500).json({
				status: "error",
				message: err.message,
			});
		}

		next();
	});
};

// Route Read Barang
router.get("/", barangController.getAllBarang);
router.get("/:id", barangController.getBarangById);

// Route CRUD Barang yang butuh login admin
router.post("/", authenticateToken, handleUpload, barangController.createBarang);
router.put("/:id", authenticateToken, handleUpload, barangController.updateBarang);
router.delete("/:id", authenticateToken, barangController.deleteBarang);

module.exports = router;