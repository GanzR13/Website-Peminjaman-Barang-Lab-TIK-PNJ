const { AdminActionLog } = require("../models");

const normalizeIp = (ip) => {
	if (!ip) return null;

	let cleanIp = String(ip).trim();

	if (cleanIp.includes(",")) {
		cleanIp = cleanIp.split(",")[0].trim();
	}

	if (cleanIp === "::1") {
		return "127.0.0.1";
	}

	if (cleanIp.startsWith("::ffff:")) {
		return cleanIp.replace("::ffff:", "");
	}

	return cleanIp;
};

const getClientIp = (req) => {
	const forwardedFor = req.headers["x-forwarded-for"];
	const realIp = req.headers["x-real-ip"];
	const cfIp = req.headers["cf-connecting-ip"];

	return normalizeIp(
		cfIp ||
		realIp ||
		forwardedFor ||
		req.ip ||
		req.socket?.remoteAddress ||
		req.connection?.remoteAddress
	);
};

const createAdminLog = async ({
	req,
	action,
	module,
	description = null,
	target_id = null,
	metadata = null,
}) => {
	try {
		const plainUser = req.user?.toJSON ? req.user.toJSON() : req.user;

		await AdminActionLog.create({
			user_id: plainUser?.id || null,
			action,
			module,
			description,
			target_id,
			metadata,
			ip_address: getClientIp(req),
			user_agent: req.headers["user-agent"] || null,
		});
	} catch (error) {
		console.error("Gagal menyimpan admin action log:", error.message);
	}
};

module.exports = createAdminLog;