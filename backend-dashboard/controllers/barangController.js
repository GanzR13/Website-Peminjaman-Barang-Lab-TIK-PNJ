const { Barang } = require("../models");
const { cloudinary } = require("../middlewares/uploadCloudinary");
const { Op } = require("sequelize");

// --- FUNGSI BANTUAN UNTUK MENGHAPUS GAMBAR DI CLOUDINARY ---
const getPublicIdFromUrl = (url) => {
	if (!url) return null;
	const splitUrl = url.split("/");
	const folderAndFile = splitUrl.slice(-2).join("/");
	return folderAndFile.split(".")[0]; 
};

const barangController = {
	// 1. Mengambil Semua Data Barang (Dengan Paginasi & Filter)
	getAllBarang: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;
			const offset = (page - 1) * limit;

			const search = req.query.search || "";
            const filterStok = req.query.stok; // Menangkap parameter 'stok' dari frontend

			let whereCondition = {};
            
            // Logika Pencarian Teks
			if (search) {
				whereCondition.nama_barang = { [Op.iLike]: `%${search}%` };
			}

            // Logika Filter Stok
            if (filterStok === 'tersedia') {
                whereCondition.stok = { [Op.gt]: 0 }; // Stok lebih dari 0
            } else if (filterStok === 'habis') {
                // Dianggap habis jika 0 atau null (mencegah error jika data kosong)
                whereCondition.stok = { [Op.or]: [0, null] }; 
            }

            // Query Data sesuai Filter
			const { count: filteredCount, rows } = await Barang.findAndCountAll({
				where: whereCondition,
				limit: limit,
				offset: offset,
				order: [["id", "DESC"]],
			});

			// Hitung statistik GLOBAL (TIDAK terpengaruh pencarian & filter)
			const globalTotal = await Barang.count();
			const globalHabis = await Barang.count({
				where: {
					stok: { [Op.or]: [0, null] },
				},
			});
			const globalTersedia = Math.max(0, globalTotal - globalHabis);
            
            // Hitung total halaman berdasarkan data yang sudah difilter
			const totalPages = Math.ceil(filteredCount / limit);

			return res.status(200).json({
				status: "success",
				data: rows,
				summary: {
					total: globalTotal, 
					tersedia: globalTersedia,
					habis: globalHabis,
				},
				pagination: {
					totalItems: filteredCount, 
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
				// Hapus file lama di Cloudinary
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
				// Set path gambar baru
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

			// Hapus file gambar dari Cloudinary
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