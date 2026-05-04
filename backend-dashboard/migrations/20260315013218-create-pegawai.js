'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pegawai', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // UBAH: Menjadi STRING/UUID
        // HAPUS: autoIncrement: true
      },
      nama_lengkap: {
        type: Sequelize.STRING,
        allowNull: false // Tambahkan agar nama wajib diisi
      },
      nip: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // NIP harus unik
      },
      user_id: {
        type: Sequelize.STRING, // UBAH: Harus STRING karena merujuk ke UUID User
        allowNull: false,
        unique: true, // Satu akun user = satu profil pegawai
        references: {
          model: 'user', // Nama tabel referensi di database (biasanya huruf kecil)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('pegawai');
  }
};