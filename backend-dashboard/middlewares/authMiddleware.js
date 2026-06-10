const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			status: "error",
			message: "Akses ditolak, token tidak ada.",
		});
	}

	jwt.verify(
		token,
		process.env.JWT_SECRET,
		async (err, decodedUser) => {
			if (err) {
				return res.status(403).json({
					status: "error",
					message: "Token tidak valid atau sudah kadaluwarsa.",
				});
			}

			try {
				const currentUser = await User.findByPk(decodedUser.id, {
					include: [
						{
							model: Role,
							attributes: ["id", "nama_role", "level_akses"],
						},
					],
				});

				if (!currentUser) {
					return res.status(404).json({
						status: "error",
						message: "Sesi tidak valid, akun tidak ditemukan.",
					});
				}

				const isVerified =
					currentUser.email_verified === true ||
					currentUser.email_verified === 1 ||
					currentUser.email_verified === "1" ||
					currentUser.email_verified === "true";

				if (!isVerified) {
					return res.status(403).json({
						status: "error",
						message:
							"Akses ditolak. Email Anda belum diverifikasi atau telah dibatalkan.",
					});
				}

				req.user = currentUser;
				next();
			} catch (dbError) {
				console.error("Auth Middleware Error:", dbError);

				return res.status(500).json({
					status: "error",
					message: "Terjadi kesalahan server saat memverifikasi sesi.",
				});
			}
		}
	);
};

module.exports = { authenticateToken };