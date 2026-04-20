"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Mahasiswa extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Mahasiswa.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
			Mahasiswa.belongsTo(models.ref_Prodi, {
				foreignKey: "prodi_id",
				as: "prodi",
			});
			Mahasiswa.belongsTo(models.ref_Kelas, {
				foreignKey: "kelas_id",
				as: "kelas",
			});
		}
	}

	Mahasiswa.init(
		{
			nama_mahasiswa: DataTypes.STRING,
			nim: DataTypes.STRING,
			angkatan: DataTypes.INTEGER,
			user_id: DataTypes.INTEGER,
			prodi_id: DataTypes.INTEGER,
			kelas_id: DataTypes.INTEGER,
		},
		{
			sequelize,
            modelName: "Mahasiswa",
			tableName: "mahasiswa",
			freezeTableName: true,
			timestamps: true,
		},
	);

	return Mahasiswa;
};
