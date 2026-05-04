'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mahasiswa', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // UBAH: Menjadi STRING/UUID
        // HAPUS: autoIncrement: true
      },
      nama_mahasiswa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nim: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // UBAH: Tambahkan unique agar NIM tidak duplikat
      },
      angkatan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING, // UBAH: Harus STRING karena ID User sekarang UUID
        allowNull: false,
        unique: true, // Satu akun user = satu mahasiswa
        references: { // Sangat disarankan untuk menjaga integritas data
          model: 'user', // Nama tabel referensi (huruf kecil)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      prodi_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kelas_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mahasiswa');
  }
};