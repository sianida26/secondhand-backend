'use strict';
const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Products, {
        foreignKey: 'createdBy',
        as: 'products',
      });
      Users.hasMany(models.Bids, {
        foreignKey: 'buyerId',
        as: 'bids',
      });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      image: DataTypes.TEXT,
      accessToken: {
        type: DataTypes.VIRTUAL,
        get() {
          return jwt.sign({ id: this.id, name: this.name, email: this.email }, JWT_KEY);
        },
      },
      profilePicUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.image ? this.image : `https://avatars.dicebear.com/api/bottts/${this.id}.svg`;
        },
        set(value) {
          this.setDataValue('image', value);
        },
      },
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  return Users;
};
