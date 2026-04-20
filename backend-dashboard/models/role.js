'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'role_id' });
    }
  }
  Role.init({
    nama_role: DataTypes.STRING,
    level_akses: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    freezeTableName: true,
    timestamps: true
  });
  return Role;
};