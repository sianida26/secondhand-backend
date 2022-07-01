const request = require('supertest');
const app = require('../../app');
const { Users, Products } = require('../../models');

describe('GET products/detail/:id', () => {
  let bearerToken = '';
  let userProfile = null;
  let userProduct = null;

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

    const productTest = {
      name: "test",
      price: 10000,
      category: "test",
      description: "test",
      filenames: JSON.stringify(["test.png", "test.jpg"]),
      createdBy: userProfile.id
    }

    userProduct = await Products.create(productTest);
  });

  afterAll(async () => {
    await userProduct.destroy();
    await userProfile.destroy();
  });

  it('Should return 200 if successfully get product', () => {
    return request(app)
      .get(`/products/detail/${userProduct.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
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
        )
      });
  });

  it('Should return 404 if return product not found', () => {
    return request(app)
      .get(`/products/detail/99999`)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
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
