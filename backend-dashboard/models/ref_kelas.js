"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ref_Kelas extends Model {
		static associate(models) {
			ref_Kelas.hasMany(models.Mahasiswa, {
				foreignKey: "kelas_id",
				as: "mahasiswa",
			});
		}
	}
	ref_Kelas.init(
		{
			nama_kelas: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ref_Kelas",
			tableName: "ref_kelas",
			freezeTableName: true,
			timestamps: true,
		},
	);
	return ref_Kelas;
};
