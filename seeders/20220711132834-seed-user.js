"use strict";
const bcrypt = require('bcryptjs');

module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("Users", [{
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
    await queryInterface.bulkDelete('Users', null, {});
	},
};
