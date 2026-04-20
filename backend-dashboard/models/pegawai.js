"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Pegawai extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Pegawai.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		}
	}

	Pegawai.init(
		{
			nama_lengkap: DataTypes.STRING,
			nip: DataTypes.STRING,
			user_id: DataTypes.INTEGER,
		},
		{
			sequelize,
            modelName: "Pegawai",
			tableName: "pegawai",
			freezeTableName: true,
			timestamps: true,
		},
	);

	return Pegawai;
};
