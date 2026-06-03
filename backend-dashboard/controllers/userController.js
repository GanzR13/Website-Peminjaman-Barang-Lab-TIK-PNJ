"use strict";

const {
	User,
	Role,
	Pegawai,
	Mahasiswa,
	Peminjaman,
	DetailPeminjaman,
	ref_Prodi,
	ref_Kelas,
	sequelize, // Pastikan ini ter-import untuk transaction
} = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const createAdminLog = require("../utils/adminActionLogger");

// Fungsi GET All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: [
				"id",
				"email",
				"role_id",
				"no_telepon",
				"tanggal_daftar",
				"email_verified",
				"createdAt",
				"updatedAt",
			],
			include: [{ model: Role, attributes: ["nama_role", "level_akses"] }],
		});
		res.status(200).json(users);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Gagal mengambil data user.", error: error.message });
	}
};

// Fungsi GET Pegawai (Pengelola, admin, dan dosen)
exports.getPegawai = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const result = await Pegawai.findAndCountAll({
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: User,
					as: "user",
					required: true,
					include: [
						{
							model: Role,
							where: { level_akses: { [Op.ne]: "peminjam" } },
						},
					],
				},
			],
		});
		res.status(200).json({
			status: "success",
			data: result.rows,
			pagination: {
				totalItems: result.count,
				totalPages: Math.ceil(result.count / limit),
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Fungsi GET Peminjam (Gabungan Mahasiswa & Dosen)
exports.getPeminjam = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;
		const roleFilter = { level_akses: "peminjam" };
		if (req.query.role) {
			roleFilter.nama_role = req.query.role;
		}

		const result = await User.findAndCountAll({
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{ model: Role, where: roleFilter },
				{ model: Pegawai, as: "pegawai" },
				{
					model: Mahasiswa,
					as: "mahasiswa",
					include: [
						{ model: ref_Prodi, as: "prodi" },
						{ model: ref_Kelas, as: "kelas" },
					],
				},
			],
		});

		const formattedData = result.rows.map((user) => {
			const isMahasiswa = user.Role.nama_role === "Mahasiswa";
			return {
				id: user.id,
				nama_lengkap: isMahasiswa
					? user.mahasiswa?.nama_mahasiswa || "Data Mahasiswa Kosong"
					: user.pegawai?.nama_lengkap || "Data Pegawai Kosong",
				nim: user.mahasiswa?.nim || null,
				nip: user.pegawai?.nip || null,
				angkatan: user.mahasiswa?.angkatan || null,
				prodi_id: user.mahasiswa?.prodi_id || null,
				kelas_id: user.mahasiswa?.kelas_id || null,
				nama_prodi: user.mahasiswa?.prodi?.nama_prodi || "-",
				nama_kelas: user.mahasiswa?.kelas?.nama_kelas || "-",
				user: {
					email: user.email,
					email_verified: user.email_verified,
					no_telepon: user.no_telepon,
					Role: user.Role,
				},
			};
		});

		res.status(200).json({
			status: "success",
			data: formattedData,
			pagination: {
				totalItems: result.count,
				totalPages: Math.ceil(result.count / limit),
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Fungsi CREATE User dengan Transaction
exports.createUser = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const {
			email,
			password,
			no_telepon,
			role_id,
			nama_lengkap,
			nip,
			nim,
			angkatan,
			prodi_id,
			kelas_id,
			tanggal_daftar,
		} = req.body;

		const selectedRole = await Role.findByPk(role_id);

		if (!selectedRole) {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message: "Role tidak ditemukan.",
			});
		}

		const isMahasiswa = selectedRole.nama_role === "Mahasiswa";

		if (!isMahasiswa && !nip) {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message: "NIP wajib diisi untuk Dosen atau Pegawai.",
			});
		}

		if (isMahasiswa && !nim) {
			await t.rollback();
			return res.status(400).json({
				status: "error",
				message: "NIM wajib diisi untuk Mahasiswa.",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create(
			{
				id: uuidv4(),
				email,
				password: hashedPassword,
				no_telepon,
				role_id,
				tanggal_daftar: tanggal_daftar || new Date(),
				email_verified: true,
			},
			{ transaction: t },
		);

		if (isMahasiswa) {
			await Mahasiswa.create(
				{
					id: uuidv4(),
					nama_mahasiswa: nama_lengkap,
					nim,
					angkatan,
					prodi_id,
					kelas_id,
					user_id: newUser.id,
				},
				{ transaction: t },
			);
		} else {
			await Pegawai.create(
				{
					id: uuidv4(),
					nama_lengkap,
					nip,
					user_id: newUser.id,
				},
				{ transaction: t },
			);
		}

		await t.commit();

		await createAdminLog({
			req,
			action: "CREATE",
			module: selectedRole.level_akses === "peminjam" ? "Peminjam" : "Pegawai",
			description: `Menambahkan user ${selectedRole.nama_role}: ${nama_lengkap}`,
			target_id: null,
			metadata: {
				created_user_id: newUser.id,
				email,
				nama_lengkap,
				role_id,
				role: selectedRole.nama_role,
				level_akses: selectedRole.level_akses,
				nim: isMahasiswa ? nim : null,
				nip: !isMahasiswa ? nip : null,
			},
		});

		return res.status(201).json({
			status: "success",
			message: "User berhasil dibuat",
			data: {
				id: newUser.id,
				email: newUser.email,
				nama_lengkap,
				role_id,
			},
		});
	} catch (error) {
		await t.rollback();

		console.error("Error Register:", error);

		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({
				status: "error",
				message:
					"Email atau NIP/NIM sudah terdaftar di sistem. Silakan gunakan yang lain.",
			});
		}

		return res.status(500).json({
			status: "error",
			message: error.message || "Terjadi kesalahan pada server.",
		});
	}
};

// Fungsi UPDATE Users dengan Transaction
exports.updateUser = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;

		const {
			email,
			no_telepon,
			nama_lengkap,
			nip,
			nim,
			angkatan,
			prodi_id,
			kelas_id,
			email_verified,
			role_id,
		} = req.body;

		const user = await User.findByPk(id, {
			include: [
				{ model: Role, attributes: ["id", "nama_role", "level_akses"] },
				{ model: Pegawai, as: "pegawai" },
				{ model: Mahasiswa, as: "mahasiswa" },
			],
			transaction: t,
		});

		if (!user) {
			await t.rollback();
			return res.status(404).json({
				status: "error",
				message: "User tidak ditemukan",
			});
		}

		const plainBefore = user.toJSON ? user.toJSON() : user;

		const oldName =
			plainBefore.mahasiswa?.nama_mahasiswa ||
			plainBefore.pegawai?.nama_lengkap ||
			plainBefore.email;

		const oldData = {
			user_id: plainBefore.id,
			email: plainBefore.email,
			no_telepon: plainBefore.no_telepon,
			email_verified: plainBefore.email_verified,
			role_id: plainBefore.role_id,
			role: plainBefore.Role?.nama_role,
			level_akses: plainBefore.Role?.level_akses,
			nama_lengkap: oldName,
			nim: plainBefore.mahasiswa?.nim || null,
			nip: plainBefore.pegawai?.nip || null,
			angkatan: plainBefore.mahasiswa?.angkatan || null,
			prodi_id: plainBefore.mahasiswa?.prodi_id || null,
			kelas_id: plainBefore.mahasiswa?.kelas_id || null,
		};

		const updateAkunUtama = {
			email,
			no_telepon,
			email_verified,
		};

		if (role_id) {
			updateAkunUtama.role_id = role_id;
		}

		await user.update(updateAkunUtama, { transaction: t });

		const currentRoleName = plainBefore.Role?.nama_role;

		if (currentRoleName === "Mahasiswa") {
			const updateMahasiswa = {
				nama_mahasiswa: nama_lengkap,
			};

			if (nim) updateMahasiswa.nim = nim;
			if (angkatan) updateMahasiswa.angkatan = angkatan;
			if (prodi_id) updateMahasiswa.prodi_id = prodi_id;
			if (kelas_id) updateMahasiswa.kelas_id = kelas_id;

			await Mahasiswa.update(updateMahasiswa, {
				where: { user_id: id },
				transaction: t,
			});
		} else {
			const updatePegawai = {
				nama_lengkap,
			};

			if (nip) updatePegawai.nip = nip;

			await Pegawai.update(updatePegawai, {
				where: { user_id: id },
				transaction: t,
			});
		}

		const newRole = role_id
			? await Role.findByPk(role_id, { transaction: t })
			: plainBefore.Role;

		await t.commit();

		await createAdminLog({
			req,
			action:
				role_id && Number(role_id) !== Number(oldData.role_id)
					? "UPDATE_ROLE"
					: "UPDATE",
			module: newRole?.level_akses === "peminjam" ? "Peminjam" : "Pegawai",
			description:
				role_id && Number(role_id) !== Number(oldData.role_id)
					? `Mengubah role user ${oldName} dari ${oldData.role} menjadi ${newRole?.nama_role || role_id}`
					: `Memperbarui data user: ${nama_lengkap || oldName}`,
			target_id: null,
			metadata: {
				updated_user_id: id,
				before: oldData,
				after: {
					user_id: id,
					email,
					no_telepon,
					email_verified,
					role_id: role_id || oldData.role_id,
					role: newRole?.nama_role || oldData.role,
					level_akses: newRole?.level_akses || oldData.level_akses,
					nama_lengkap: nama_lengkap || oldName,
					nim: nim || oldData.nim,
					nip: nip || oldData.nip,
					angkatan: angkatan || oldData.angkatan,
					prodi_id: prodi_id || oldData.prodi_id,
					kelas_id: kelas_id || oldData.kelas_id,
				},
			},
		});

		return res.status(200).json({
			status: "success",
			message: "Data user dan otoritas berhasil diperbarui",
			data: {
				id,
				email,
				nama_lengkap,
				role_id: role_id || oldData.role_id,
			},
		});
	} catch (error) {
		await t.rollback();

		console.error("Error Update User:", error);

		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

// Fungsi DELETE User
exports.deleteUser = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { id } = req.params;

		const user = await User.findByPk(id, {
			include: [
				{ model: Role, attributes: ["nama_role", "level_akses"] },
				{ model: Pegawai, as: "pegawai" },
				{ model: Mahasiswa, as: "mahasiswa" },
			],
			transaction: t,
		});

		if (!user) {
			await t.rollback();
			return res.status(404).json({
				status: "error",
				message: "User tidak ditemukan",
			});
		}

		const plainUser = user.toJSON ? user.toJSON() : user;

		const deletedName =
			plainUser.pegawai?.nama_lengkap ||
			plainUser.mahasiswa?.nama_mahasiswa ||
			plainUser.email;

		const deletedRole = plainUser.Role?.nama_role || "User";

		const peminjamanList = await Peminjaman.findAll({
			where: { user_id: id },
			attributes: ["id"],
			transaction: t,
		});

		const peminjamanIds = peminjamanList.map((p) => p.id);

		if (peminjamanIds.length > 0) {
			await DetailPeminjaman.destroy({
				where: {
					peminjaman_id: {
						[Op.in]: peminjamanIds,
					},
				},
				transaction: t,
			});
		}

		await Peminjaman.destroy({
			where: { user_id: id },
			transaction: t,
		});

		await Pegawai.destroy({
			where: { user_id: id },
			transaction: t,
		});

		await Mahasiswa.destroy({
			where: { user_id: id },
			transaction: t,
		});

		await User.destroy({
			where: { id },
			transaction: t,
		});
		
		await t.commit();

		await createAdminLog({
			req,
			action: "DELETE",
			module:
				deletedRole === "Mahasiswa" || deletedRole === "Dosen"
					? "Peminjam"
					: "Pegawai",
			description: `Menghapus user ${deletedRole}: ${deletedName}`,
			target_id: null,
			metadata: {
				deleted_user_id: id,
				email: plainUser.email,
				nama: deletedName,
				role: deletedRole,
				role_id: plainUser.role_id,
			},
		});

		return res.status(200).json({
			status: "success",
			message:
				"User dan semua data profil terkait berhasil dihapus secara permanen.",
			deletedId: id,
		});
	} catch (error) {
		await t.rollback();

		console.error("Error Delete User:", error);

		return res.status(500).json({
			status: "error",
			message: "Gagal menghapus user secara permanen dari server.",
			error: error.message,
		});
	}
};

// --- Fungsi Tambahan Sesuai Router ---

exports.getMahasiswa = async (req, res) => {
	req.query.role = "Mahasiswa";
	return exports.getPeminjam(req, res);
};

exports.getPegawaiById = async (req, res) => {
	try {
		const data = await Pegawai.findOne({
			where: { user_id: req.params.id },
			include: [{ model: User, as: "user", include: [Role] }],
		});

		if (!data) {
			return res
				.status(404)
				.json({ status: "error", message: "Pegawai tidak ditemukan" });
		}

		res.status(200).json({ status: "success", data: data });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

exports.getPeminjamById = async (req, res) => {
	try {
		const user = await User.findByPk(req.params.id, {
			include: [
				{ model: Role },
				{ model: Pegawai, as: "pegawai" },
				{
					model: Mahasiswa,
					as: "mahasiswa",
					include: [
						{ model: ref_Prodi, as: "prodi" },
						{ model: ref_Kelas, as: "kelas" },
					],
				},
			],
		});

		if (!user) {
			return res
				.status(404)
				.json({ status: "error", message: "Peminjam tidak ditemukan" });
		}

		const isMahasiswa = user.Role.nama_role === "Mahasiswa";

		res.status(200).json({
			status: "success",
			data: {
				id: user.id,
				email: user.email,
				email_verified: user.email_verified,
				no_telepon: user.no_telepon,
				nama_lengkap: isMahasiswa
					? user.mahasiswa?.nama_mahasiswa
					: user.pegawai?.nama_lengkap,
				identitas: isMahasiswa ? user.mahasiswa?.nim : user.pegawai?.nip,
				role: user.Role.nama_role,
				detail: isMahasiswa ? user.mahasiswa : user.pegawai,
			},
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

exports.getMe = async (req, res) => {
	try {
		const userId = req.user.id;

		const user = await User.findByPk(userId, {
			// FIX PENTING: Tambahkan 'email_verified' di dalam attributes agar bisa diakses
			attributes: ["id", "email", "email_verified", "no_telepon", "role_id"],
			include: [
				{ model: Role, attributes: ["nama_role", "level_akses"] },
				{ model: Pegawai, as: "pegawai", required: false },
				{
					model: Mahasiswa,
					as: "mahasiswa",
					include: [
						{ model: ref_Prodi, as: "prodi", attributes: ["nama_prodi"] },
						{ model: ref_Kelas, as: "kelas", attributes: ["nama_kelas"] },
					],
					required: false,
				},
			],
		});

		if (!user) {
			return res
				.status(404)
				.json({ status: "error", message: "User tidak ditemukan" });
		}

		const isMahasiswa = user.Role.nama_role === "Mahasiswa";

		const responseData = {
			id: user.id,
			email: user.email,
			email_verified: user.email_verified,
			no_telepon: user.no_telepon,
			role_id: user.role_id,
			nama_role: user.Role.nama_role,
			level_akses: user.Role.level_akses,
			nama_lengkap: isMahasiswa
				? user.mahasiswa?.nama_mahasiswa
				: user.pegawai?.nama_lengkap,
			nip: user.pegawai?.nip || null,
			nim: user.mahasiswa?.nim || null,
			detail_tambahan: isMahasiswa
				? {
						angkatan: user.mahasiswa?.angkatan,
						prodi: user.mahasiswa?.prodi?.nama_prodi,
						kelas: user.mahasiswa?.kelas?.nama_kelas,
					}
				: null,
		};

		res.status(200).json({
			status: "success",
			data: responseData,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

exports.updatePassword = async (req, res) => {
	try {
		const { id } = req.params; // UUID dari user yang sedang login
		const { old_password, new_password } = req.body;

		// 1. Cari user di database
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User tidak ditemukan di sistem.",
			});
		}

		// 2. Cek kecocokan password lama menggunakan bcrypt
		const isMatch = await bcrypt.compare(old_password, user.password);
		if (!isMatch) {
			// Menggunakan format { errors: ... } agar ditangkap presisi oleh validasi Vue kamu
			return res.status(400).json({
				status: "fail",
				errors: "Kata sandi lama yang Anda masukkan salah.",
			});
		}

		// 3. Enkripsi (Hash) password baru
		const hashedNewPassword = await bcrypt.hash(new_password, 10);

		// 4. Update password ke database
		await user.update({ password: hashedNewPassword });

		res.status(200).json({
			status: "success",
			message: "Kata sandi berhasil diperbarui.",
		});
	} catch (error) {
		console.error("Error Update Password:", error);
		res.status(500).json({
			status: "error",
			message: error.message || "Terjadi kesalahan pada server.",
		});
	}
};
