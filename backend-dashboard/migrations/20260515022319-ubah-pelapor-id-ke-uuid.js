'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Hapus constraint foreign key lama (agar kolom bisa dihapus)
    // Nama default dari sequelize biasanya: namaTabel_namaKolom_fkey
    await queryInterface.removeConstraint('laporan_masalah', 'laporan_masalah_pelapor_id_fkey').catch(() => {});

    // 2. Hapus kolom pelapor_id yang bertipe Integer
    await queryInterface.removeColumn('laporan_masalah', 'pelapor_id').catch(() => {});

    // 3. Buat ulang kolom pelapor_id dengan tipe UUID dan sambungkan kembali relasinya
    await queryInterface.addColumn('laporan_masalah', 'pelapor_id', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'user', // SESUAIKAN: pastikan ini nama tabel fisik user kamu (users / Users)
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Kembalikan ke Integer jika di-rollback
    await queryInterface.removeConstraint('laporan_masalah', 'laporan_masalah_pelapor_id_fkey').catch(() => {});
    await queryInterface.removeColumn('laporan_masalah', 'pelapor_id').catch(() => {});
    await queryInterface.addColumn('laporan_masalah', 'pelapor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};