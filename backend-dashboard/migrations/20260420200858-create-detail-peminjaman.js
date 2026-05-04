'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_peminjaman', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      peminjaman_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'peminjaman',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      barang_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'barang',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Jika barang dihapus, histori peminjamannya ikut terhapus
      },
      jumlah_pinjam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      // Status per barang (karena kadang pinjam 3 alat, tapi yang 1 dikembalikan duluan atau rusak)
      status_barang: {
        type: Sequelize.ENUM('Dipinjam', 'Dikembalikan', 'Rusak', 'Hilang'),
        defaultValue: 'Dipinjam',
        allowNull: false
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_peminjaman');
  }
};