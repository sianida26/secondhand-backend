'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_bids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tb_users',
          },
          key: 'id',
        }
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tb_products',
          },
          key: 'id',
        }
      },
      bidPrice: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      acceptedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      declinedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      soldAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_bids');
  }
};