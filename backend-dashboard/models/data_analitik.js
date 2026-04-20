module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DataAnalitik", {
    tanggal_pencatatan: { type: DataTypes.DATEONLY, allowNull: false },
    total_inventaris_global: DataTypes.INTEGER,
    total_barang_tersedia: DataTypes.INTEGER,
    total_barang_dipinjam: DataTypes.INTEGER,
    total_barang_rusak: DataTypes.INTEGER,
    jumlah_peminjaman_hari_ini: DataTypes.INTEGER,
    jumlah_pengembalian_hari_ini: DataTypes.INTEGER,
    skor_popularitas: DataTypes.FLOAT,
    laju_penyusutan: DataTypes.FLOAT,
  }, { tableName: "data_analitik" });
};