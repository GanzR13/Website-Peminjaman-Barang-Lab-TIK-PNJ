const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Konfigurasi Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi pembuat uploader dinamis
const createUploader = (folderName) => {
	const storage = new CloudinaryStorage({
		cloudinary,
		params: async (req, file) => ({
			folder: folderName,
			format: "webp",
			transformation: [
				{
					width: 800,
					height: 800,
					crop: "limit",
				},
				{
					quality: 80,
				},
			],
		}),
	});

	return multer({
		storage,
		limits: {
			fileSize: 5 * 1024 * 1024, // 5 MB
		},
		fileFilter: (req, file, cb) => {
			if (file.mimetype && file.mimetype.startsWith("image/")) {
				return cb(null, true);
			}

			return cb(new Error("FORMAT_TIDAK_VALID"), false);
		},
	});
};

// Uploader berdasarkan kebutuhan folder
const uploadBarang = createUploader("barang");
const uploadLaporan = createUploader("laporan_masalah");
const uploadTtdDigital = createUploader("ttd_digital");

module.exports = {
	uploadBarang,
	uploadLaporan,
	uploadTtdDigital,
	cloudinary,
};