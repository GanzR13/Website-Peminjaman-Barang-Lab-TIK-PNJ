"use strict";

module.exports = (sequelize, DataTypes) => {
	const AdminActionLog = sequelize.define(
		"AdminActionLog",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			action: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			module: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			target_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			metadata: {
				type: DataTypes.JSONB,
				allowNull: true,
			},
			ip_address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			user_agent: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			tableName: "admin_action_logs",
			underscored: true,
		}
	);

	AdminActionLog.associate = (models) => {
		AdminActionLog.belongsTo(models.User, {
			foreignKey: "user_id",
			as: "admin",
		});
	};

	return AdminActionLog;
};