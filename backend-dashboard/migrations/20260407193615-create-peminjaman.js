'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('peminjaman', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // PERHATIAN: Pastikan ini sesuai dengan nama tabel usermu (biasanya 'Users' atau 'users')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Jika user dihapus, riwayat peminjamannya ikut terhapus
      },
      kategori_kebutuhan: {
        type: Sequelize.ENUM('Akademik', 'Non-Akademik'),
        allowNull: false
      },
      tujuan_peminjaman: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nama_acara: {
        type: Sequelize.STRING,
        allowNull: true
      },
      organisasi_penyelenggara: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dosen_penanggung_jawab: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tanggal_pinjam: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tanggal_kembali: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Menunggu', 'Disetujui', 'Dipinjam', 'Ditolak', 'Selesai'),
        defaultValue: 'Menunggu'
      },
      catatan_admin: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('peminjaman');
    
    // Trik Khusus PostgreSQL: Harus menghapus ENUM secara manual saat rollback
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_peminjaman_kategori_kebutuhan";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_peminjaman_status";');
  }
};