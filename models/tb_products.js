'use strict';
const {
  Model
} = require('sequelize');
const { tb_users } = require('./index');
module.exports = (sequelize, DataTypes) => {
  class tb_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_products.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    filenames: DataTypes.TEXT,
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: tb_users,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'tb_products',
  });
  return tb_products;
};