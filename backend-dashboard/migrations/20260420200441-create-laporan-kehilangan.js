'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laporan_kehilangan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barang_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'barang', // Pastikan sesuai nama tabel di database (kecil/jamak)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jumlah_hilang: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      deskripsi_kejadian: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tanggal_kejadian: {
        type: Sequelize.DATEONLY, // Hanya tanggal tanpa jam
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Dalam Penyelidikan', 'Dikonfirmasi Hilang', 'Sudah Diganti'),
        defaultValue: 'Dalam Penyelidikan',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('laporan_kehilangan');
  }
};