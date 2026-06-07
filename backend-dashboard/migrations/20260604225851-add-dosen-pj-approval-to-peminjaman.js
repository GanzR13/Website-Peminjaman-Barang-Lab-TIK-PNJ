"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("peminjaman", "dosen_pj_user_id", {
			type: Sequelize.STRING,
			allowNull: true,
			references: {
				model: "user",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		await queryInterface.addColumn("peminjaman", "status_approve_dosen_pj", {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "Tidak Diperlukan",
		});

		await queryInterface.addColumn("peminjaman", "dosen_pj_approved_at", {
			type: Sequelize.DATE,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("peminjaman", "dosen_pj_approved_at");
		await queryInterface.removeColumn("peminjaman", "status_approve_dosen_pj");
		await queryInterface.removeColumn("peminjaman", "dosen_pj_user_id");
	},
};