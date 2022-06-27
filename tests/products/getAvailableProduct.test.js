const { faker } = require('@faker-js/faker');
const request = require('supertest');

const app = require('../../app');

const { Users, Products } = require('../../models');

describe('Get Available Products', () => {

    const ENDPOINT_PATH = '/products/available';

    const users = [];
    const products = [];

    beforeAll(async () => {
        //Generate Users
        const usersData = [
            { 
                name: 'test',
                email: 'test@test.com',
                password: 'test123',
            },
            { 
                name: 'test1',
                email: 'test1@test.com',
                password: 'test123',
            }
        ];

        //Registers each account
        for (const userData of usersData){
            const response = await request(app).post('/users/register')
                .set('Accept', 'application/json')
                .send(userData);
            
            const user = await Users.findOne({ where: { email: userData.email } });
            user.token = `Bearer ${ response.body.token }`;
            users.push(user);
        }

        //Generate products
        const productsData = [...new Array(10)]
            .map((_,i) => ({
                name: faker.animal.cat(),
                price: Math.floor(Math.random()*100000)+10000,
                category: '__test__',
                description: faker.lorem.paragraph(),
                filenames: JSON.stringify([faker.image.animals()]),
                createdBy: i > 7 ? users[1].id : users[0].id,
            }));

            
        for (const productData of productsData){
            console.log(productData);
            const product = await Products.create(productData);
            products.push(product);
        }
    });

    afterAll(async () => {
        //Deletes mock products
        await Promise.all(products.map(async (product) => await product.destroy()));

        //Deletes mock users
        await Promise.all(users.map(async (user) => await user.destroy()));
    });

    it('Should return all available products', async () => {
        const response = await request(app).get(ENDPOINT_PATH);
        expect(response.status).toBe(200);
        expect(response.body.filter(x => x.category === '__test__').length).toBe(10);
    });

    it('Should not show products that he made himself', async () => {
        const response = await request(app).get(ENDPOINT_PATH)
            .set('Authorization', users[1].token);
        expect(response.status).toBe(200);
        expect(response.body.filter(x => x.category === '__test__').length).toBe(8);
    });
});