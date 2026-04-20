'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ref_Kelas extends Model {
    static associate(models) {
      // Relasi ke Mahasiswa
      ref_Kelas.hasMany(models.Mahasiswa, { foreignKey: 'kelas_id' });
    }
  }
  ref_Kelas.init({
    nama_kelas: DataTypes.STRING
  }, {
            sequelize,
            modelName: "ref_Kelas",
            tableName: "ref_kelas",
            freezeTableName: true, 
            timestamps: true 
        });
  return ref_Kelas;
};