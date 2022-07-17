'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'emailVerifiedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'emailVerifiedAt');
  },
};
