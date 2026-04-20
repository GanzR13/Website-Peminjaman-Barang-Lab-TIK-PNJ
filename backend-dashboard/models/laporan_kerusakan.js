module.exports = (sequelize, DataTypes) => {
  const LaporanKerusakan = sequelize.define(
    "LaporanKerusakan",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      barang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Barang",
          key: "id",
        },
      },
      jumlah_rusak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deskripsi_kerusakan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      foto_kerusakan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tindakan_perbaikan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Perlu Perbaikan", "Sedang Diservis", "Selesai Diperbaiki", "Rusak Total"),
        defaultValue: "Perlu Perbaikan",
        allowNull: false,
      },
    },
    {
      modelName: 'LaporanKerusakan',
      tableName: "laporan_kerusakan",
      freezeTableName: true,
      timestamps: true,
    }
  );

  LaporanKerusakan.associate = function (models) {
    LaporanKerusakan.belongsTo(models.Barang, {
      foreignKey: "barang_id",
      as: "barang",
    });
  };

  return LaporanKerusakan;
};