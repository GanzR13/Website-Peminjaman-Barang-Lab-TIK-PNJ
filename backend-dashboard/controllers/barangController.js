const { Barang } = require("../models");
// 1. IMPORT CLOUDINARY (Pastikan path ke file middleware-mu benar)
const { cloudinary } = require("../middlewares/uploadCloudinary");
const { Op } = require("sequelize");

// (Modul 'fs' dan 'path' sudah dihapus karena tidak dipakai lagi)

// --- FUNGSI BANTUAN UNTUK MENGHAPUS GAMBAR DI CLOUDINARY ---
// Cloudinary butuh "Public ID" (nama folder + nama file tanpa ekstensi) untuk menghapus gambar
const getPublicIdFromUrl = (url) => {
	if (!url) return null;
	const splitUrl = url.split("/");
	const folderAndFile = splitUrl.slice(-2).join("/"); // Contoh: skripsi_lab/barang-123.jpg
	return folderAndFile.split(".")[0]; // Menghilangkan .jpg -> skripsi_lab/barang-123
};

const barangController = {
	// 1. Mengambil Semua Data Barang (Dengan Paginasi)
	getAllBarang: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;
			const offset = (page - 1) * limit;

			const search = req.query.search || "";

			let whereCondition = {};
			if (search) {
				whereCondition = {
					nama_barang: { [Op.iLike]: `%${search}%` },
				};
			}

			const { count: filteredCount, rows } = await Barang.findAndCountAll({
				where: whereCondition,
				limit: limit,
				offset: offset,
				order: [["id", "DESC"]],
			});

			// 2. Hitung statistik GLOBAL (TIDAK terpengaruh pencarian)
			// Menghitung seluruh isi tabel barang tanpa klausa WHERE
			const globalTotal = await Barang.count();

			const globalHabis = await Barang.count({
				where: {
					stok: { [Op.or]: [0, null] },
				},
			});

			const globalTersedia = Math.max(0, globalTotal - globalHabis);
			const totalPages = Math.ceil(filteredCount / limit);

			return res.status(200).json({
				status: "success",
				data: rows,
				summary: {
					total: globalTotal, // <--- Tambahkan variabel total global di sini
					tersedia: globalTersedia,
					habis: globalHabis,
				},
				pagination: {
					totalItems: filteredCount, // <--- Ini tetap pakai filteredCount agar paginasi tidak rusak
					totalPages: totalPages,
					currentPage: page,
					itemsPerPage: limit,
				},
			});
		} catch (error) {
			console.error("Error di getAllBarang:", error);
			return res.status(500).json({ status: "error", message: error.message });
		}
	},

	// 2. Mengambil Detail 1 Barang
	getBarangById: async (req, res) => {
		try {
			const { id } = req.params;
			const barang = await Barang.findByPk(id);

			if (!barang) {
				return res
					.status(404)
					.json({ status: "error", message: "Barang tidak ditemukan" });
			}

			return res.status(200).json({ status: "success", data: barang });
		} catch (error) {
			return res.status(500).json({ status: "error", message: error.message });
		}
	},

	// 3. Menambah Barang Baru (Khusus Admin)
	createBarang: async (req, res) => {
		try {
			const { nama_barang, stok, deskripsi } = req.body;

			// PERUBAHAN: Gunakan req.file.path dari Cloudinary yang mengembalikan URL HTTPS langsung
			const gambarUrl = req.file ? req.file.path : null;

			const stokAwal = stok !== undefined && stok !== "" ? Number(stok) : 0;

			const newBarang = await Barang.create({
				nama_barang,
				stok: stokAwal,
				deskripsi,
				gambar: gambarUrl,
			});

			return res.status(201).json({
				status: "success",
				message: "Barang berhasil ditambahkan",
				data: newBarang,
			});
		} catch (error) {
			console.error("Error dari Create Barang:", error);
			return res.status(500).json({ status: "error", message: error.message });
		}
	},

	// 4. Update Barang (Khusus Admin)
	updateBarang: async (req, res) => {
		try {
			const { id } = req.params;
			const { nama_barang, stok, deskripsi } = req.body;

			const barang = await Barang.findByPk(id);
			if (!barang) {
				return res.status(404).json({
					status: "error",
					message: "Barang tidak ditemukan",
				});
			}

			let gambarUrl = barang.gambar;

			// Jika user mengupload file gambar baru
			if (req.file) {
				// PERUBAHAN: Hapus file lama di Cloudinary secara Asynchronous
				if (barang.gambar && barang.gambar.includes("cloudinary")) {
					const publicId = getPublicIdFromUrl(barang.gambar);
					if (publicId) {
						try {
							await cloudinary.uploader.destroy(publicId);
						} catch (err) {
							console.warn(
								`[Warning] Gagal menghapus gambar lama di Cloudinary:`,
								err.message,
							);
						}
					}
				}
				// Set path gambar baru dengan URL dari Cloudinary
				gambarUrl = req.file.path;
			}

			let stokBaru = barang.stok;
			if (stok !== undefined && stok !== null && stok !== "") {
				const parsedStok = parseInt(stok);
				stokBaru = isNaN(parsedStok) ? barang.stok : parsedStok;
			}

			await barang.update({
				nama_barang: nama_barang || barang.nama_barang,
				stok: stokBaru,
				deskripsi: deskripsi !== undefined ? deskripsi : barang.deskripsi,
				gambar: gambarUrl,
			});

			return res.status(200).json({
				status: "success",
				message: "Data barang berhasil diperbarui",
				data: barang,
			});
		} catch (error) {
			console.error("Update Error:", error);
			return res.status(500).json({ status: "error", message: error.message });
		}
	},

	// 5. Menghapus Barang (Khusus Admin)
	deleteBarang: async (req, res) => {
		try {
			const { id } = req.params;
			const barang = await Barang.findByPk(id);

			if (!barang) {
				return res
					.status(404)
					.json({ status: "error", message: "Barang tidak ditemukan" });
			}

			// PERUBAHAN: Hapus file gambar dari Cloudinary sebelum menghapus data dari database
			if (barang.gambar && barang.gambar.includes("cloudinary")) {
				const publicId = getPublicIdFromUrl(barang.gambar);
				if (publicId) {
					try {
						await cloudinary.uploader.destroy(publicId);
					} catch (err) {
						console.warn(
							`[Warning] Gagal menghapus gambar di Cloudinary:`,
							err.message,
						);
					}
				}
			}

			await barang.destroy();

			return res.status(200).json({
				status: "success",
				message: "Barang berhasil dihapus",
			});
		} catch (error) {
			return res.status(500).json({ status: "error", message: error.message });
		}
	},
};

module.exports = barangController;
