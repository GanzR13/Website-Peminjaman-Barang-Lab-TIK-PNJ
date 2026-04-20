module.exports = (sequelize, DataTypes) => {
  const RekomendasiPengadaan = sequelize.define("RekomendasiPengadaan", {
    barang_id: { type: DataTypes.INTEGER, allowNull: false },
    jumlah_rekomendasi: { type: DataTypes.INTEGER, allowNull: false },
    tingkat_urgensi: DataTypes.ENUM('Normal', 'Perlu Perhatian', 'Sangat Mendesak'),
    alasan_rekomendasi: DataTypes.TEXT,
    prediksi_stok_habis: DataTypes.DATEONLY,
  }, { tableName: "rekomendasi_pengadaan" });

  RekomendasiPengadaan.associate = (models) => {
    RekomendasiPengadaan.belongsTo(models.Barang, { foreignKey: 'barang_id', as: 'barang' });
  };

  return RekomendasiPengadaan;
};