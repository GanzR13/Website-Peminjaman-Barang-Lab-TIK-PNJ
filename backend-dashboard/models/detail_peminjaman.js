// models/detail_peminjaman.js
module.exports = (sequelize, DataTypes) => {
  const DetailPeminjaman = sequelize.define("DetailPeminjaman", {
    peminjaman_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    barang_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah_pinjam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    modelName: 'DetailPeminjaman',
    tableName: "detail_peminjaman",
    timestamps: true
  });

  DetailPeminjaman.associate = function(models) {
    // Relasi ke model Peminjaman yang baru kamu buat
    DetailPeminjaman.belongsTo(models.Peminjaman, {
      foreignKey: "peminjaman_id",
      as: "peminjaman"
    });
    // Relasi ke model Barang
    DetailPeminjaman.belongsTo(models.Barang, {
      foreignKey: "barang_id",
      as: "barang"
    });
  };

  return DetailPeminjaman;
};