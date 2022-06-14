'use strict';
const {
  Model
} = require('sequelize');
const { tb_products, tb_users } = require('./index');
module.exports = (sequelize, DataTypes) => {
  class tb_bids extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_bids.init({
    buyerId: {
      type: DataTypes.INTEGER,
      references: {
        model: tb_users,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: tb_products,
        key: 'id'
      }
    },
    bidPrice: DataTypes.INTEGER,
    acceptedAt: DataTypes.DATE,
    declinedAt: DataTypes.DATE,
    soldAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'tb_bids',
  });
  return tb_bids;
};