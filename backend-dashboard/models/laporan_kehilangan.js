module.exports = (sequelize, DataTypes) => {
  const LaporanKehilangan = sequelize.define(
    "LaporanKehilangan",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      barang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah_hilang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deskripsi_kejadian: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tanggal_kejadian: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Dalam Penyelidikan", "Dikonfirmasi Hilang", "Sudah Diganti"),
        defaultValue: "Dalam Penyelidikan",
        allowNull: false,
      },
    },
    {
      modelName: "LaporanKehilangan",
      tableName: "laporan_kehilangan",
      freezeTableName: true,
      timestamps: true,
    }
  );

  LaporanKehilangan.associate = function (models) {
    LaporanKehilangan.belongsTo(models.Barang, {
      foreignKey: "barang_id",
      as: "barang",
    });
  };

  return LaporanKehilangan;
};