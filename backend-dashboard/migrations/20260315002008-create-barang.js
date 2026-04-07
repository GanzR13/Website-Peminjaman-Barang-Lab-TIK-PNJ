'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_barang: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nama_barang: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      kondisi: {
        type: Sequelize.STRING,
        defaultValue: 'Baik'
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      gambar: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('barang');
  }
};