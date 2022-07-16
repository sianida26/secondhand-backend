const request = require('supertest');

const app = require('../../app');
const ProductFactory = require('../../models/factories/ProductFactory');
const UserFactory = require('../../models/factories/UserFactory');
const { Users, Products } = require('../../models');

describe('GET products/my-products', () => {
  let userTest = null;
  let productTest = [];

  beforeAll(async () => {
    userTest = await UserFactory();
    for (let i = 0; i < 4; i++) {
      productTest.push(await ProductFactory(userTest));
    }
  });

  afterAll(async () => {
    await Promise.all(productTest.map(async (x) => await x.destroy()));
    await userTest.destroy();
  });

  it('Should return 200 if successfully get my products', () => {
    return request(app)
      .get('/products/my-products')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${userTest.accessToken}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            products: expect.any(Array),
            diminati: expect.any(Array),
            terjual: expect.any(Array),
            count: expect.any(Number)
          })
        );
      });
  });

  it('Should return 401 if return errors for unauthenticated', () => {
    return request(app)
      .get('/products/my-products')
      .set('Content-Type', 'application/json')
      .set('Authorization', '')
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
            // error: expect.any(String)
          })
        );
      });
  });
});
