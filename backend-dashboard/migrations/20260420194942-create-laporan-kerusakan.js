'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laporan_kerusakan', {
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
          model: 'barang', // Pastikan sesuai nama tabelmu
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jumlah_rusak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // Default 1 barang yang rusak
      },
      deskripsi_kerusakan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      foto_kerusakan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tindakan_perbaikan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Perlu Perbaikan', 'Sedang Diservis', 'Selesai Diperbaiki', 'Rusak Total'),
        defaultValue: 'Perlu Perbaikan',
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
    await queryInterface.dropTable('laporan_kerusakan');
  }
};