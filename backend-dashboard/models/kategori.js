"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Kategori extends Model {
		static associate(models) {
			Kategori.hasMany(models.Barang, {
				foreignKey: "id_kategori",
			});
		}
	}

	Kategori.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},

			nama_kategori: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},

			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Kategori",
			tableName: "kategori",
			freezeTableName: true,
		},
	);

	return Kategori;
};
