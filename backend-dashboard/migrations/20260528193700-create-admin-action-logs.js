"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("admin_action_logs", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.STRING,
				allowNull: true,
				references: {
					model: "user",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			action: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			module: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			ip_address: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			user_agent: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			target_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			metadata: {
				type: Sequelize.JSONB,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("admin_action_logs");
	},
};
