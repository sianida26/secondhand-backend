const bcrypt = require('bcryptjs');

const { faker } = require('@faker-js/faker');
const { Products } = require('../index');

const defaultProps = {
    name: faker.animal.cat(),
    price: Math.floor(Math.random()*9000000)+1000,
    category: '__test__',
    description: faker.lorem.paragraph(),
    filenames: ['test.png', 'test2.png'],
}

/**
 * Generates a product instance from the properties provided.
 * 
 * @param  {Object} creator A user instance that creates the product.
 * @param  {Object} props Properties to use for the product.
 * 
 * @return {Object}       A product instance
 */
module.exports = async (creator, props = {}) => {
    const data = {
        ...defaultProps,
        ...props,
        createdBy: creator.id,
    }

    return await Products.create(data)
}