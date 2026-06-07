const { ref_Prodi, ref_Kelas, Role } = require("../models");

// ===============================
// PRODI
// ===============================
exports.getAllProdi = async (req, res) => {
	try {
		const data = await ref_Prodi.findAll({
			order: [["nama_prodi", "ASC"]],
		});

		return res.status(200).json({
			status: "success",
			data,
		});
	} catch (error) {
		console.error("Gagal mengambil data prodi:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal mengambil data prodi",
		});
	}
};

exports.createProdi = async (req, res) => {
	try {
		const { nama_prodi } = req.body;

		if (!nama_prodi || !nama_prodi.trim()) {
			return res.status(400).json({
				status: "error",
				message: "Nama prodi wajib diisi.",
			});
		}

		const data = await ref_Prodi.create({
			nama_prodi: nama_prodi.trim(),
		});

		return res.status(201).json({
			status: "success",
			message: "Data prodi berhasil ditambahkan.",
			data,
		});
	} catch (error) {
		console.error("Gagal menambahkan data prodi:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal menambahkan data prodi.",
		});
	}
};

exports.updateProdi = async (req, res) => {
	try {
		const { id } = req.params;
		const { nama_prodi } = req.body;

		const prodi = await ref_Prodi.findByPk(id);

		if (!prodi) {
			return res.status(404).json({
				status: "error",
				message: "Data prodi tidak ditemukan.",
			});
		}

		if (!nama_prodi || !nama_prodi.trim()) {
			return res.status(400).json({
				status: "error",
				message: "Nama prodi wajib diisi.",
			});
		}

		await prodi.update({
			nama_prodi: nama_prodi.trim(),
		});

		return res.status(200).json({
			status: "success",
			message: "Data prodi berhasil diperbarui.",
			data: prodi,
		});
	} catch (error) {
		console.error("Gagal memperbarui data prodi:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal memperbarui data prodi.",
		});
	}
};

exports.deleteProdi = async (req, res) => {
	try {
		const { id } = req.params;

		const prodi = await ref_Prodi.findByPk(id);

		if (!prodi) {
			return res.status(404).json({
				status: "error",
				message: "Data prodi tidak ditemukan.",
			});
		}

		await prodi.destroy();

		return res.status(200).json({
			status: "success",
			message: "Data prodi berhasil dihapus.",
		});
	} catch (error) {
		console.error("Gagal menghapus data prodi:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal menghapus data prodi. Pastikan data belum digunakan oleh mahasiswa.",
		});
	}
};

// ===============================
// KELAS
// ===============================
exports.getAllKelas = async (req, res) => {
	try {
		const data = await ref_Kelas.findAll({
			order: [["nama_kelas", "ASC"]],
		});

		return res.status(200).json({
			status: "success",
			data,
		});
	} catch (error) {
		console.error("Gagal mengambil data kelas:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal mengambil data kelas",
		});
	}
};

exports.createKelas = async (req, res) => {
	try {
		const { nama_kelas } = req.body;

		if (!nama_kelas || !nama_kelas.trim()) {
			return res.status(400).json({
				status: "error",
				message: "Nama kelas wajib diisi.",
			});
		}

		const data = await ref_Kelas.create({
			nama_kelas: nama_kelas.trim(),
		});

		return res.status(201).json({
			status: "success",
			message: "Data kelas berhasil ditambahkan.",
			data,
		});
	} catch (error) {
		console.error("Gagal menambahkan data kelas:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal menambahkan data kelas.",
		});
	}
};

exports.updateKelas = async (req, res) => {
	try {
		const { id } = req.params;
		const { nama_kelas } = req.body;

		const kelas = await ref_Kelas.findByPk(id);

		if (!kelas) {
			return res.status(404).json({
				status: "error",
				message: "Data kelas tidak ditemukan.",
			});
		}

		if (!nama_kelas || !nama_kelas.trim()) {
			return res.status(400).json({
				status: "error",
				message: "Nama kelas wajib diisi.",
			});
		}

		await kelas.update({
			nama_kelas: nama_kelas.trim(),
		});

		return res.status(200).json({
			status: "success",
			message: "Data kelas berhasil diperbarui.",
			data: kelas,
		});
	} catch (error) {
		console.error("Gagal memperbarui data kelas:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal memperbarui data kelas.",
		});
	}
};

exports.deleteKelas = async (req, res) => {
	try {
		const { id } = req.params;

		const kelas = await ref_Kelas.findByPk(id);

		if (!kelas) {
			return res.status(404).json({
				status: "error",
				message: "Data kelas tidak ditemukan.",
			});
		}

		await kelas.destroy();

		return res.status(200).json({
			status: "success",
			message: "Data kelas berhasil dihapus.",
		});
	} catch (error) {
		console.error("Gagal menghapus data kelas:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal menghapus data kelas. Pastikan data belum digunakan oleh mahasiswa.",
		});
	}
};

// ===============================
// ROLES
// ===============================
exports.getAllRoles = async (req, res) => {
	try {
		const data = await Role.findAll({
			attributes: ["id", "nama_role", "level_akses"],
			order: [["id", "ASC"]],
		});

		return res.status(200).json({
			status: "success",
			message: "Berhasil mengambil data roles",
			data,
		});
	} catch (error) {
		console.error("Gagal mengambil data roles:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal mengambil data roles",
		});
	}
};