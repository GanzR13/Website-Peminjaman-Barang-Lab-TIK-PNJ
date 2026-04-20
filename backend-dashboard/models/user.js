"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.hasOne(models.Pegawai, { foreignKey: "user_id", as: "pegawai" });
			User.hasOne(models.Mahasiswa, { foreignKey: "user_id", as: "mahasiswa" });
			User.belongsTo(models.Role, { foreignKey: "role_id" });
		}
	}
	User.init(
		{
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			no_telepon: DataTypes.STRING,
			tanggal_daftar: DataTypes.DATE,
			email_verified: DataTypes.BOOLEAN,
			role_id: DataTypes.INTEGER,
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
