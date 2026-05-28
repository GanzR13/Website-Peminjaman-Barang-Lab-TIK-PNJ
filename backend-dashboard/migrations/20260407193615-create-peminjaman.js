'use strict';
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
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      antrian: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kategori_kebutuhan: {
        type: Sequelize.ENUM('Akademik', 'Non-Akademik'),
        allowNull: false
      },
      jenis_khusus: {
				type: DataTypes.STRING,
				allowNull: true,
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
      nip_dosen_pj: {
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
  }
};