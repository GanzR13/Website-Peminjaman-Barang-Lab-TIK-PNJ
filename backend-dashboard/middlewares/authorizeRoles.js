const normalizeRole = (value) => {
	if (!value) return "";

	return String(value)
		.trim()
		.toLowerCase()
		.replaceAll(" ", "_");
};

const authorizeRoles = (...allowedLevels) => {
	return (req, res, next) => {
		const plainUser = req.user?.toJSON ? req.user.toJSON() : req.user;

		const rawUserLevel =
			plainUser?.level_akses ||
			plainUser?.level ||
			plainUser?.Role?.level_akses ||
			plainUser?.role?.level_akses ||
			plainUser?.nama_role ||
			plainUser?.role_name ||
			plainUser?.Role?.nama_role ||
			plainUser?.role?.nama_role;

		const userLevel = normalizeRole(rawUserLevel);
		const allowed = allowedLevels.map(normalizeRole);

		if (!userLevel) {
			return res.status(403).json({
				status: "error",
				message: "Akses ditolak. Level akses tidak ditemukan.",
			});
		}

		if (!allowed.includes(userLevel)) {
			return res.status(403).json({
				status: "error",
				message: "Akses ditolak. Anda tidak memiliki izin.",
				current_level: userLevel,
				allowed_levels: allowed,
			});
		}

		next();
	};
};

module.exports = authorizeRoles;