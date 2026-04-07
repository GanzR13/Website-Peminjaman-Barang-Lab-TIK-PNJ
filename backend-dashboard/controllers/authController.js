const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Role = db.Role;
require("dotenv").config();

exports.login = async (req, res) => {
	try {
		const { email, password, portal } = req.body;
		const user = await User.findOne({ where: { email }, include: [Role] });

		if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ message: "Password salah" });

		if (portal === "admin") {
			if (user.role_id >= 4) {
				return res
					.status(403)
					.json({ message: "Akses Ditolak: Gunakan portal Peminjam" });
			}
		}

		if (portal === "user" && user.Role.level_akses !== "peminjam") {
			return res
				.status(403)
				.json({
					message: "Akses Ditolak: Gunakan portal khusus Pegawai/Admin",
				});
		}

		// Generate Token
		const token = jwt.sign(
			{ id: user.id, role: user.Role.nama_role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		res.status(200).json({
			status: "success",
			token,
			user: {
				id: user.id,
				nama: user.nama_lengkap,
				role_id: user.role_id,
				level: user.Role.level_akses,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
