'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('barang', 'id_kategori', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'kategori',
        key: 'id_kategori'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('barang', 'id_kategori');
  }
};