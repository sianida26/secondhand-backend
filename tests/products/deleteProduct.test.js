const request = require('supertest');

const app = require('../../app');
const { Users, Products } = require('../../models');

describe('Handling Delete Product', () => {

    const ENDPOINT_PATH = '/products/delete-product';
    let bearerToken = ""
    let productCreator = null

    //Create mock user test and token
    beforeAll(async () => { 

        const registerData = { 
            name: 'test',
            email: 'test@test.com',
            password: 'test123',
        }

        const response = await request(app).post('/users/register')
            .set('Accept', 'application/json')
            .send(registerData);

        bearerToken = `Bearer ${ response.body.token }`;
        productCreator = await Users.findOne({ where: { email: registerData.email } });
    });

    //Cleanup mock user test and mock products
    afterAll(async () => { 
    
        //Clean mock products
        await Products.destroy({ 
            where: { createdBy: productCreator.id }
        });

        //Clean mock user
        await productCreator.destroy();
        
    });
    
    it('Should return 200 if successfully deleted', async () => { 
        //Create mock product
        const product = await Products.create({ 
            name: 'Test Product',
            price: 0,
            category: '__test__',
            description: 'this is desc',
            filenames: '[]',
            createdBy: productCreator.id,
        });

        //Endpoint testing
        const response = await request(app).delete(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', bearerToken);

        //Expect return success status code
        expect(response.status).toBe(200);

        //Expect data is deleted
        const ghostProduct = await Products.findByPk(product.id);
        expect(ghostProduct).toBeNull();
    });

    it('Should return 401 if unauthenticated', async () => { 
        //Create mock product
        const product = await Products.create({ 
            name: 'Test Product',
            price: 1,
            category: '__test__',
            description: 'this is desc',
            filenames: '[]',
            createdBy: productCreator.id,
        });

        //Endpoint testing
        const response = await request(app).delete(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', bearerToken + 'someInvalidData'); //Fakes bearer token

        //Expect return unauthenticated status code
        expect(response.status).toBe(401);

        //Expect data is not deleted
        const ghostProduct = await Products.findByPk(product.id);
        expect(ghostProduct).not.toBeNull();
    });

    it('Should return 403 if deleting other\'s product', async () => {
        //Generate other person account
        const registerData = { 
            name: 'test2',
            email: 'test2@test.com',
            password: 'test123',
        }

        const responseHacker = await request(app).post('/users/register')
            .set('Accept', 'application/json')
            .send(registerData);

        hackerToken = `Bearer ${ responseHacker.body.token }`;
        hackerAccount = await Users.findOne({ where: { email: registerData.email } });


        //Create mock product
        const product = await Products.create({ 
            name: 'Test Product',
            price: 1,
            category: '__test__',
            description: 'this is desc',
            filenames: '[]',
            createdBy: productCreator.id,
        });

        //Endpoint testing
        const response = await request(app).delete(`${ ENDPOINT_PATH }/${ product.id }`)
            .set('Authorization', hackerToken); //Logged in as other person

        //Expect return unauthorized status code
        expect(response.status).toBe(403);

        //Expect data is not deleted
        const ghostProduct = await Products.findByPk(product.id);
        expect(ghostProduct).not.toBeNull();

        //destroy test product
        await ghostProduct.destroy();

        //destroy hacker account
        await hackerAccount.destroy();
    });

    it('Should return 404 if id not found', async () => { 
        //Endpoint testing
        const response = await request(app).delete(`${ ENDPOINT_PATH }/9999999`)
            .set('Authorization', bearerToken);

        //Expect return not found status code
        expect(response.status).toBe(404);
    });
})