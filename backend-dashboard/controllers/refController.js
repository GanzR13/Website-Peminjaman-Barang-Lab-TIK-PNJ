const { ref_Prodi, ref_Kelas, Role } = require("../models");

exports.getAllProdi = async (req, res) => {
	try {
		const data = await ref_Prodi.findAll({
			order: [["nama_prodi", "ASC"]],
		});

		res.status(200).json({
			status: "success",
			data,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Gagal mengambil data prodi",
		});
	}
};

exports.getAllKelas = async (req, res) => {
	try {
		const data = await ref_Kelas.findAll({
			order: [["nama_kelas", "ASC"]],
		});

		res.status(200).json({
			status: "success",
			data,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Gagal mengambil data kelas",
		});
	}
};

exports.getAllRoles = async (req, res) => {
	try {
		const data = await Role.findAll({
			attributes: ["id", "nama_role", "level_akses"],
			order: [["id", "ASC"]],
		});

		res.status(200).json({
			status: "success",
			message: "Berhasil mengambil data roles",
			data: data,
		});
	} catch (error) {
		console.error("Gagal mengambil data roles:", error);

		res.status(500).json({
			status: "error",
			message: "Gagal mengambil data roles",
		});
	}
};