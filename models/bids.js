'use strict';
const {
  Model
} = require('sequelize');
const { Products, Users } = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Bids extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bids.init({
    buyerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Products,
        key: 'id'
      }
    },
    bidPrice: DataTypes.INTEGER,
    acceptedAt: DataTypes.DATE,
    declinedAt: DataTypes.DATE,
    soldAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Bids',
  });
  return Bids;
};