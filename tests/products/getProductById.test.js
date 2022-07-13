const request = require('supertest');

const app = require('../../app');
const ProductFactory = require('../../models/factories/ProductFactory');
const UserFactory = require('../../models/factories/UserFactory');

describe('GET products/detail/:id', () => {
  let userTest = null;
  let productTest = null;

  beforeAll(async () => {
    userTest = await UserFactory();
    productTest = await ProductFactory(userTest);
  });

  afterAll(async () => {
    await productTest.destroy();
    await userTest.destroy();
  });

  it('Should return 200 if successfully get product', () => {
    return request(app)
      .get(`/products/detail/${productTest.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', userTest.accessToken)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            images: expect.any(Array),
            category: expect.any(String),
            seller: expect.objectContaining({
              name: expect.any(String),
              city: res.body.seller.city
            }),
            description: expect.any(String)
          })
        );
      });
  });

  it('Should return 404 if return product not found', () => {
    return request(app)
      .get(`/products/detail/99999`)
      .set('Content-Type', 'application/json')
      .set('Authorization', userTest.accessToken)
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: expect.any(String)
          })
        );
      });
  });
});
