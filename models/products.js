'use strict';
const { Model } = require('sequelize');
const sequelize = require('sequelize');
// const { bid } = require('../controllers/bids');
const { Users, Bids } = require('./index');
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
        as: 'users',
      });
      Products.hasMany(models.Bids, {
        foreignKey: 'productId',
        as: 'bids',
      });
    }

    async isBiddable() {
      //TODO: Filter items on database level for better performance
      const bids = await this.getBids();
      return bids.every((bid) => !bid.soldAt && (!bid.acceptedAt || (bid.acceptedAt && bid.declinedAt)));
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      category: DataTypes.STRING,
      description: DataTypes.TEXT,
      filenames: {
        type: DataTypes.TEXT,
        set(value){
          return Array.isArray(value) ? JSON.stringify(value) : value;
        }
      },
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Products',
    }
  );
  // Products.hasMany(Bids, { foreignKey: 'productId' });
  return Products;
};
