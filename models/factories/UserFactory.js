const bcrypt = require('bcryptjs');

const { faker } = require('@faker-js/faker');
const { Users } = require('../index');

const defaultProps = {
    email: faker.internet.exampleEmail(),
    password: faker.random.alphaNumeric(10),
    name: faker.name.findName(),
    city: faker.address.city(),
    address: faker.address.streetAddress(),
    phone: faker.phone.number(),
    image: faker.image.avatar()+'?'+Math.floor(Math.random()*10000),
}

/**
 * Generates a user instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the user.
 * 
 * @return {Object}       A user instance
 */
module.exports = async (props = {}) => {
    const data = {
        ...defaultProps,
        ...props,
    }

    return await Users.create({
        ...data,
        password: await bcrypt.hash(data.password, 10)
    })
}