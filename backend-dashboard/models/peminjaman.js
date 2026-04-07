'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      // Relasi: 1 Peminjaman dimiliki oleh 1 User (Peminjam)
      Peminjaman.belongsTo(models.User, { 
        foreignKey: 'user_id', 
        as: 'peminjam' 
      });
      
      // Relasi ke tabel pivot (DetailPeminjaman) untuk mencatat barang apa saja yang dipinjam
      // Peminjaman.hasMany(models.DetailPeminjaman, { foreignKey: 'peminjaman_id' });
    }
  }
  
  Peminjaman.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kategori_kebutuhan: {
      type: DataTypes.ENUM('Akademik', 'Non-Akademik'),
      allowNull: false
    },
    tujuan_peminjaman: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // --- KHUSUS NON-AKADEMIK (Boleh Kosong) ---
    nama_acara: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organisasi_penyelenggara: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dosen_penanggung_jawab: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // --- WAKTU & STATUS ---
    tanggal_pinjam: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tanggal_kembali: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Menunggu', 'Disetujui', 'Dipinjam', 'Ditolak', 'Selesai'),
      defaultValue: 'Menunggu'
    },
    catatan_admin: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Peminjaman',
    tableName: 'peminjaman',
    freezeTableName: true
  });
  
  return Peminjaman;
};