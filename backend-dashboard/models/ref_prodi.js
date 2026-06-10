'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ref_Prodi extends Model {
		static associate(models) {
			ref_Prodi.hasMany(models.Mahasiswa, {
				foreignKey: 'prodi_id',
				as: 'mahasiswa',
			});
		}
	}

	ref_Prodi.init(
		{
			nama_prodi: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'ref_Prodi',
			tableName: 'ref_prodi',
			freezeTableName: true,
			timestamps: true,
		},
	);

	return ref_Prodi;
};