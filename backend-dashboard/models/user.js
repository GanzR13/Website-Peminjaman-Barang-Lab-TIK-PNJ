"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasOne(models.Pegawai, { foreignKey: "user_id", as: "pegawai" });
			User.hasOne(models.Mahasiswa, { foreignKey: "user_id", as: "mahasiswa" });
			User.belongsTo(models.Role, { foreignKey: "role_id" });

			User.hasMany(models.Peminjaman, { foreignKey: "user_id", as: "peminjaman" });
			User.hasMany(models.AdminActionLog, { foreignKey: "user_id", as: "admin_action_logs" });
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.STRING, 
				primaryKey: true,
				allowNull: false,
			},
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			no_telepon: DataTypes.STRING,
			tanggal_daftar: DataTypes.DATE,
			email_verified: DataTypes.BOOLEAN,
			role_id: DataTypes.INTEGER,
			ttd_digital: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
			tableName: "user",
			freezeTableName: true,
			timestamps: true,
		},
	);
	return User;
};
