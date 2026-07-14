// Pastikan Anda memanggil model Kategori di sini
const { Barang, Kategori } = require("../models"); 
const { cloudinary } = require("../middlewares/uploadCloudinary");
const { Op } = require("sequelize");
const createAdminLog = require("../utils/adminActionLogger");

// Fungsi Bantuan Untuk Menghapus Gambar di Cloudinary Berdasarkan URL
const getPublicIdFromUrl = (url) => {
	if (!url) return null;

	const splitUrl = url.split("/");
	const folderAndFile = splitUrl.slice(-2).join("/");

	return folderAndFile.split(".")[0];
};

const getNumericTargetId = (id) => {
	const parsed = Number(id);
	return Number.isInteger(parsed) ? parsed : null;
};

const barangController = {
	// Mengambil Semua Data Barang
	getAllBarang: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;
			const offset = (page - 1) * limit;

			const search = req.query.search || "";
			const filterStok = req.query.stok;
            const filterKategori = req.query.id_kategori; // Opsi tambahan jika ingin filter by kategori

			const whereCondition = {};

			if (search) {
				whereCondition.nama_barang = {
					[Op.iLike]: `%${search}%`,
				};
			}

			if (filterStok === "tersedia") {
				whereCondition.stok = {
					[Op.gt]: 0,
				};
			} else if (filterStok === "habis") {
				whereCondition.stok = {
					[Op.or]: [0, null],
				};
			}
            
            // Tambahan filter kategori jika dikirim via query URL
            if (filterKategori) {
                whereCondition.id_kategori = filterKategori;
            }

			const { count: filteredCount, rows } = await Barang.findAndCountAll({
				where: whereCondition,
				limit,
				offset,
				order: [["id", "DESC"]],
                // Melampirkan data dari tabel Kategori
                include: [
                    {
                        model: Kategori,
						as: "kategori",
                        attributes: ['id', 'nama_kategori'] // Hanya mengambil field yang dibutuhkan
                    }
                ]
			});

			const globalTotal = await Barang.count();

			const globalHabis = await Barang.count({
				where: {
					stok: {
						[Op.or]: [0, null],
					},
				},
			});

			const globalTersedia = Math.max(0, globalTotal - globalHabis);
			const totalPages = Math.ceil(filteredCount / limit);

			const totalBHP = await Barang.count({ where: { id_kategori: 1 } });
            const totalAlat = await Barang.count({ where: { id_kategori: 2 } });

			return res.status(200).json({
				status: "success",
				data: rows,
				summary: {
					total: globalTotal,
					tersedia: globalTersedia,
					habis: globalHabis,
					totalBHP: totalBHP,
                    totalAlat: totalAlat
				},
				pagination: {
					totalItems: filteredCount,
					totalPages,
					currentPage: page,
					itemsPerPage: limit,
				},
			});
		} catch (error) {
			console.error("Error di getAllBarang:", error);

			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	},

	getBarangById: async (req, res) => {
		try {
			const { id } = req.params;
			const barang = await Barang.findByPk(id, {
                // Melampirkan detail kategori pada pencarian spesifik
                include: [
                    {
                        model: Kategori,
						as: "kategori",
                        attributes: ['id', 'nama_kategori']
                    }
                ]
            });

			if (!barang) {
				return res.status(404).json({
					status: "error",
					message: "Barang tidak ditemukan",
				});
			}

			return res.status(200).json({
				status: "success",
				data: barang,
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	},

	createBarang: async (req, res) => {
		try {
            // Tambahkan id_kategori dari request body
			const { nama_barang, stok, deskripsi, id_kategori } = req.body;

			const gambarUrl = req.file ? req.file.path : null;
			const stokAwal = stok !== undefined && stok !== "" ? Number(stok) : 0;

			const newBarang = await Barang.create({
				nama_barang,
				stok: stokAwal,
				deskripsi,
				gambar: gambarUrl,
                id_kategori: id_kategori || null // Menyimpan relasi kategori (1: BHP, 2: Alat)
			});

			await createAdminLog({
				req,
				action: "CREATE",
				module: "Barang",
				description: `Menambahkan barang baru: ${newBarang.nama_barang}`,
				target_id: getNumericTargetId(newBarang.id),
				metadata: {
					barang_id: newBarang.id,
					nama_barang: newBarang.nama_barang,
					stok: newBarang.stok,
					deskripsi: newBarang.deskripsi,
					gambar: newBarang.gambar,
                    id_kategori: newBarang.id_kategori
				},
			});

			return res.status(201).json({
				status: "success",
				message: "Barang berhasil ditambahkan",
				data: newBarang,
			});
		} catch (error) {
			console.error("Error dari Create Barang:", error);

			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	},

	updateBarang: async (req, res) => {
		try {
			const { id } = req.params;
            // Tambahkan id_kategori dari request body
			const { nama_barang, stok, deskripsi, id_kategori } = req.body;

			const barang = await Barang.findByPk(id);

			if (!barang) {
				return res.status(404).json({
					status: "error",
					message: "Barang tidak ditemukan",
				});
			}

			const oldData = {
				id: barang.id,
				nama_barang: barang.nama_barang,
				stok: barang.stok,
				deskripsi: barang.deskripsi,
				gambar: barang.gambar,
                id_kategori: barang.id_kategori
			};

			let gambarUrl = barang.gambar;

			if (req.file) {
				if (barang.gambar && barang.gambar.includes("cloudinary")) {
					const publicId = getPublicIdFromUrl(barang.gambar);

					if (publicId) {
						try {
							await cloudinary.uploader.destroy(publicId);
						} catch (err) {
							console.warn(
								"[Warning] Gagal menghapus gambar lama di Cloudinary:",
								err.message
							);
						}
					}
				}

				gambarUrl = req.file.path;
			}

			let stokBaru = barang.stok;

			if (stok !== undefined && stok !== null && stok !== "") {
				const parsedStok = parseInt(stok, 10);
				stokBaru = Number.isNaN(parsedStok) ? barang.stok : parsedStok;
			}

			await barang.update({
				nama_barang: nama_barang || barang.nama_barang,
				stok: stokBaru,
				deskripsi: deskripsi !== undefined ? deskripsi : barang.deskripsi,
				gambar: gambarUrl,
                id_kategori: id_kategori !== undefined ? id_kategori : barang.id_kategori
			});

			await createAdminLog({
				req,
				action: "UPDATE",
				module: "Barang",
				description: `Memperbarui data barang: ${barang.nama_barang}`,
				target_id: getNumericTargetId(barang.id),
				metadata: {
					barang_id: barang.id,
					before: oldData,
					after: {
						id: barang.id,
						nama_barang: barang.nama_barang,
						stok: barang.stok,
						deskripsi: barang.deskripsi,
						gambar: barang.gambar,
                        id_kategori: barang.id_kategori
					},
				},
			});

			return res.status(200).json({
				status: "success",
				message: "Data barang berhasil diperbarui",
				data: barang,
			});
		} catch (error) {
			console.error("Update Error:", error);

			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	},

	deleteBarang: async (req, res) => {
		try {
			const { id } = req.params;
			const barang = await Barang.findByPk(id);

			if (!barang) {
				return res.status(404).json({
					status: "error",
					message: "Barang tidak ditemukan",
				});
			}

			const deletedData = {
				id: barang.id,
				nama_barang: barang.nama_barang,
				stok: barang.stok,
				deskripsi: barang.deskripsi,
				gambar: barang.gambar,
                id_kategori: barang.id_kategori
			};

			if (barang.gambar && barang.gambar.includes("cloudinary")) {
				const publicId = getPublicIdFromUrl(barang.gambar);

				if (publicId) {
					try {
						await cloudinary.uploader.destroy(publicId);
					} catch (err) {
						console.warn(
							"[Warning] Gagal menghapus gambar di Cloudinary:",
							err.message
						);
					}
				}
			}

			await barang.destroy();

			await createAdminLog({
				req,
				action: "DELETE",
				module: "Barang",
				description: `Menghapus data barang: ${deletedData.nama_barang}`,
				target_id: getNumericTargetId(deletedData.id),
				metadata: {
					barang_id: deletedData.id,
					deleted_data: deletedData,
				},
			});

			return res.status(200).json({
				status: "success",
				message: "Barang berhasil dihapus",
			});
		} catch (error) {
			console.error("Delete Barang Error:", error);

			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	},
};

module.exports = barangController;