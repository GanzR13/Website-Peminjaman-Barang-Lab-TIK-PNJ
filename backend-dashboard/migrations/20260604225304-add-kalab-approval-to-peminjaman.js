"use strict";

const addColumnIfNotExists = async (queryInterface, tableName, columnName, options) => {
	const table = await queryInterface.describeTable(tableName);

	if (!table[columnName]) {
		await queryInterface.addColumn(tableName, columnName, options);
	}
};

const removeColumnIfExists = async (queryInterface, tableName, columnName) => {
	const table = await queryInterface.describeTable(tableName);

	if (table[columnName]) {
		await queryInterface.removeColumn(tableName, columnName);
	}
};

module.exports = {
	async up(queryInterface, Sequelize) {
		await addColumnIfNotExists(queryInterface, "peminjaman", "status_approve_kalab", {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "Menunggu",
		});

		await addColumnIfNotExists(queryInterface, "peminjaman", "kalab_approved_by", {
			type: Sequelize.STRING,
			allowNull: true,
			references: {
				model: "user",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		await addColumnIfNotExists(queryInterface, "peminjaman", "kalab_approved_at", {
			type: Sequelize.DATE,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await removeColumnIfExists(queryInterface, "peminjaman", "kalab_approved_at");
		await removeColumnIfExists(queryInterface, "peminjaman", "kalab_approved_by");
		await removeColumnIfExists(queryInterface, "peminjaman", "status_approve_kalab");
	},
};