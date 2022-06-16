'use strict';
const {
  Model
} = require('sequelize');
const { Users } = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.belongsTo(models.Users, {
        foreignKey: 'createdBy',
        as: 'users'
      });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    filenames: DataTypes.TEXT,
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};