"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("peminjaman", "file_surat_url", {
			type: Sequelize.TEXT,
			allowNull: true,
		});

		await queryInterface.addColumn("peminjaman", "file_surat_drive_id", {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("peminjaman", "file_surat_drive_id");
		await queryInterface.removeColumn("peminjaman", "file_surat_url");
	},
};