const { AdminActionLog, User } = require("../models");
const { Op } = require("sequelize");

const adminActionLogController = {
	getAllLogs: async (req, res) => {
		try {
			const {
				search = "",
				module = "all",
				action = "all",
				page = 1,
				limit = 10,
			} = req.query;

			const allowedLimits = [10, 20, 50, 100];

			const currentPage = Math.max(parseInt(page, 10) || 1, 1);
			const requestedLimit = parseInt(limit, 10) || 10;
			const perPage = allowedLimits.includes(requestedLimit)
				? requestedLimit
				: 10;
			const offset = (currentPage - 1) * perPage;

			const where = {};

			if (module !== "all") {
				where.module = module;
			}

			if (action !== "all") {
				where.action = action;
			}

			if (search) {
				where[Op.or] = [
					{ description: { [Op.iLike]: `%${search}%` } },
					{ module: { [Op.iLike]: `%${search}%` } },
					{ action: { [Op.iLike]: `%${search}%` } },
					{ ip_address: { [Op.iLike]: `%${search}%` } },
				];
			}

			const { count, rows } = await AdminActionLog.findAndCountAll({
				where,
				include: [
					{
						model: User,
						as: "admin",
						attributes: ["id", "email", "role_id"],
					},
				],
				order: [["created_at", "DESC"]],
				limit: perPage,
				offset,
				distinct: true,
			});

			const totalPages = Math.ceil(count / perPage);

			return res.status(200).json({
				status: "success",
				message: "Data log action admin berhasil diambil.",
				data: rows,
				pagination: {
					totalItems: count,
					totalPages,
					currentPage,
					itemsPerPage: perPage,
					hasNextPage: currentPage < totalPages,
					hasPrevPage: currentPage > 1,
				},
			});
		} catch (error) {
			console.error("Gagal mengambil admin action logs:", error);

			return res.status(500).json({
				status: "error",
				message: "Gagal mengambil data log action admin.",
				error: error.message,
			});
		}
	},
};

module.exports = adminActionLogController;
