const request = require('supertest');
const app = require('../../app');
const { Users, Products } = require('../../models');

describe('GET products/my-products', () => {
  let bearerToken = '';
  let userProfile = null;
  let userProduct = [];

  beforeAll(async () => {
    const registerData = {
      email: "test@gmail.com",
      password: "test123",
      name: "test"
    }

    const response = await request(app)
      .post('/users/register')
      .set('Accept', 'application/json')
      .send(registerData);

    bearerToken = `Bearer ${response.body.token}`;
    userProfile = await Users.findOne({ where: { email: registerData.email } });

    let productTest = []
    for (let i = 1; i < 4; i++) {
      productTest.push({
        name: `test${i}`,
        price: 10000,
        category: "test",
        description: "test",
        filenames: JSON.stringify(["test.png", "test.jpg"]),
        createdBy: userProfile.id
      });
    }

    for (let productData of productTest) {
      userProduct.push(await Products.create(productData));
    }
  });

  afterAll(async () => {
    await Promise.all(userProduct.map(async (x) => await x.destroy()));
    await userProfile.destroy();
  });

  it('Should return 200 if successfully get my products', () => {
    return request(app)
      .get('/products/my-products')
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
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
