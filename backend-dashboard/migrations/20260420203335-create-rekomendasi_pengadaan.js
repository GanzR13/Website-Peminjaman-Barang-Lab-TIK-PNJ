'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rekomendasi_pengadaan', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      barang_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'barang', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      jumlah_rekomendasi: {
        type: Sequelize.INTEGER, allowNull: false
      },
      tingkat_urgensi: {
        type: Sequelize.ENUM('Normal', 'Perlu Perhatian', 'Sangat Mendesak'),
        defaultValue: 'Normal'
      },
      alasan_rekomendasi: {
        type: Sequelize.TEXT, // Contoh: "Laju kerusakan tinggi (5 unit/tahun), stok saat ini menipis"
        allowNull: true
      },
      prediksi_stok_habis: {
        type: Sequelize.DATEONLY, // Kapan stok diperkirakan menyentuh angka 0 jika tidak beli baru
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rekomendasi_pengadaan');
  }
};