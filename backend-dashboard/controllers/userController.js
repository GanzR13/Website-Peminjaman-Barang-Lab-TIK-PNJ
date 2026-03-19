const {
	User,
	Role,
	Pegawai,
	Mahasiswa,
	ref_Prodi,
	ref_Kelas,
} = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

// FUNGSI 1: GET ALL USERS
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
		res.status(500).json({ message: "Gagal mengambil data user." });
	}
};

// FUNGSI 2: GET PEGAWAI (ADMIN/LABORAN)
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

// FUNGSI 3: GET PEMINJAM (GABUNGAN MHS & DOSEN)
exports.getPeminjam = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const result = await User.findAndCountAll({
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{ model: Role, where: { level_akses: "peminjam" } },
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
					? user.mahasiswa?.nama_mahasiswa || "Data Mhs Kosong"
					: user.pegawai?.nama_lengkap || "Data Pegawai Kosong",
				nim: user.mahasiswa?.nim || null,
				nip: user.pegawai?.nip || null,
				angkatan: user.mahasiswa?.angkatan || null,
				nama_prodi: user.mahasiswa?.prodi?.nama_prodi || "-",
				nama_kelas: user.mahasiswa?.kelas?.nama_kelas || "-",
				user: {
					email: user.email,
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

// FUNGSI 4: CREATE USER (LOGIC BERCABANG)
exports.createUser = async (req, res) => {
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
		} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			email,
			password: hashedPassword,
			no_telepon,
			role_id,
		});

		if (parseInt(role_id) === 5) {
			// Mahasiswa
			await Mahasiswa.create({
				nama_mahasiswa: nama_lengkap,
				nim,
				angkatan,
				prodi_id,
				kelas_id,
				user_id: newUser.id,
			});
		} else {
			// Pegawai/Dosen
			await Pegawai.create({ nama_lengkap, nip, user_id: newUser.id });
		}
		res
			.status(201)
			.json({ status: "success", message: "User berhasil dibuat" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// FUNGSI 5: UPDATE USER
exports.updateUser = async (req, res) => {
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
		} = req.body;
		const user = await User.findByPk(id, { include: [Role] });

		await user.update({ email, no_telepon });
		if (user.Role.nama_role === "Mahasiswa") {
			await Mahasiswa.update(
				{ nama_mahasiswa: nama_lengkap, nim, angkatan, prodi_id, kelas_id },
				{ where: { user_id: id } },
			);
		} else {
			await Pegawai.update({ nama_lengkap, nip }, { where: { user_id: id } });
		}
		res.status(200).json({
			status: "success",
			message: "Data user berhasil diperbarui",
			data: { id, email, nama_lengkap },
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// FUNGSI 6: DELETE
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await Pegawai.destroy({ where: { user_id: id } });
		await Mahasiswa.destroy({ where: { user_id: id } });
		await User.destroy({ where: { id } });
		res.status(200).json({
			status: "success",
			message: "User berhasil dihapus",
			deletedId: id,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// --- FUNGSI TAMBAHAN SESUAI ROUTER ---

exports.getMahasiswa = async (req, res) => {
	// Menggunakan logic getPeminjam tapi filter hanya role Mahasiswa
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
				.json({ status: "error", message: "User tidak ditemukan" });
		}

		res.status(200).json({
			status: "success",
			data: data,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

exports.getMe = async (req, res) => {
  try {
    // req.user.id didapat dari middleware auth (JWT)
    const userId = req.user.id; 

    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "no_telepon", "role_id"],
      include: [
        { 
          model: Role, 
          attributes: ["nama_role", "level_akses"] 
        },
        { 
          model: Pegawai, 
          as: "pegawai", // Pastikan alias sesuai dengan models/index.js
          required: false 
        },
        { 
          model: Mahasiswa, 
          as: "mahasiswa", // Pastikan alias sesuai dengan models/index.js
          include: [
            { model: ref_Prodi, as: "prodi", attributes: ["nama_prodi"] },
            { model: ref_Kelas, as: "kelas", attributes: ["nama_kelas"] }
          ],
          required: false
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    // Format data agar mudah dibaca di Frontend (Profile.vue)
    const isMahasiswa = user.Role.nama_role === "Mahasiswa";
    
    const responseData = {
      id: user.id,
      email: user.email,
      no_telepon: user.no_telepon,
      role_id: user.role_id,
      nama_role: user.Role.nama_role,
      level_akses: user.Role.level_akses,
      // Gabungkan detail profile
      nama_lengkap: isMahasiswa ? user.mahasiswa?.nama_mahasiswa : user.pegawai?.nama_lengkap,
      nip: user.pegawai?.nip || null,
      nim: user.mahasiswa?.nim || null,
      detail_tambahan: isMahasiswa ? {
        angkatan: user.mahasiswa?.angkatan,
        prodi: user.mahasiswa?.prodi?.nama_prodi,
        kelas: user.mahasiswa?.kelas?.nama_kelas
      } : null
    };

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPeminjamById = exports.getPegawaiById;
