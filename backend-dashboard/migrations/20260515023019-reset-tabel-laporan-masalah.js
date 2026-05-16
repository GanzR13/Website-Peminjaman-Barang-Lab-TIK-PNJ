'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Hapus tabel yang cacat (jika ada)
    await queryInterface.dropTable('laporan_masalah').catch(() => {});
    
    // 2. Bersihkan sisa ENUM di database agar tidak bentrok
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_jenis_laporan" CASCADE;').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_status" CASCADE;').catch(() => {});

    // 3. Buat ulang tabel dengan struktur yang benar 100%
    await queryInterface.createTable('laporan_masalah', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barang_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'barang', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      peminjaman_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'peminjaman', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pelapor_id: {
        type: Sequelize.STRING, // <-- Tipe STRING sesuai dengan tabel Users kamu
        allowNull: true,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      jenis_laporan: {
        type: Sequelize.ENUM("Kerusakan", "Kehilangan"),
        allowNull: false,
      },
      jumlah: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tanggal_kejadian: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      foto_bukti: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tindakan_penyelesaian: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "Menunggu Tindakan",
          "Dalam Penyelidikan",
          "Dikonfirmasi Hilang",
          "Sudah Diganti",
          "Perlu Perbaikan",
          "Sedang Diservis",
          "Selesai Diperbaiki",
          "Rusak Total"
        ),
        defaultValue: "Menunggu Tindakan",
        allowNull: false,
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
    await queryInterface.dropTable('laporan_masalah');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_jenis_laporan" CASCADE;').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_status" CASCADE;').catch(() => {});
  }
};