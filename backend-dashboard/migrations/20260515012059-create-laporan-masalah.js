'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Bersihkan tipe ENUM jika sudah ada (mencegah error 'type already exists' di PostgreSQL)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_jenis_laporan" CASCADE;').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_status" CASCADE;').catch(() => {});

    // Buat tabel laporan_masalah
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
        references: {
          model: 'barang', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      peminjaman_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'peminjaman', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pelapor_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'user', 
          key: 'id'
        },
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
    // Hapus tabel laporan_masalah
    await queryInterface.dropTable('laporan_masalah');

    // Hapus tipe ENUM agar database kembali bersih saat di-rollback
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_jenis_laporan" CASCADE;').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_laporan_masalah_status" CASCADE;').catch(() => {});
  }
};