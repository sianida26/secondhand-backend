const request = require('supertest');
const app = require('../../app');
const { Users, Products, Bids } = require('../../models');

describe('GET notifications', () => {
  let bearerToken = [];
  let userProfile = [];
  let userProduct = null;
  let bidProduct = null;

  beforeAll(async () => {
    for (let i = 0; i < 2; i++) {
      let registerData = {
        email: `test${i}@gmail.com`,
        password: "test123",
        name: `test${i}`
      };
      let response = await request(app)
        .post('/users/register')
        .set('Accept', 'application/json')
        .send(registerData);

      bearerToken.push(`Bearer ${response.body.token}`);
      userProfile.push(await Users.findOne({ where: { email: registerData.email } }));
    }

    const productData = {
      name: "test",
      price: 10000,
      category: "test",
      description: "test",
      filenames: JSON.stringify(["test.png", "test.jpg"]),
      createdBy: userProfile[0].id
    };
    userProduct = await Products.create(productData);

    const bidData = {
      buyerId: userProfile[1].id,
      productId: userProduct.id,
      bidPrice: 20000
    };
    bidProduct = await Bids.create(bidData);
  });

  afterAll(async () => {
    await bidProduct.destroy();
    await userProduct.destroy();
    await Promise.all(userProfile.map(async (x) => x.destroy()));
  });

  it('Should return 200 if successfully get bid history', () => {
    return request(app)
      .get(`/products/history/${bidProduct.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken[0])
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            buyerName: expect.any(String),
            buyerCity: res.body.buyerCity ? expect.any(String) : null,
            buyerPhone: res.body.buyerPhone ? expect.any(String) : null,
            productName: expect.any(String),
            productImage: expect.any(String),
            productPrice: expect.any(Number),
            bidPrice: expect.any(Number),
            bidAt: expect.any(String),
            acceptedAt: res.body.acceptedAt ? expect.any(String) : null,
            declinedAt: res.body.declinedAt ? expect.any(String) : null,
            soldAt: res.body.soldAt ? expect.any(String) : null,
            isAcceptable: expect.any(Boolean)
          })
        );
      });
  });

  it('Should return 401 if return errors for unauthenticated', () => {
    return request(app)
      .get(`/products/history/${bidProduct.id}`)
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

  it('Should return 404 if return errors for product not found', () => {
    return request(app)
      .get('/products/history/99999')
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken[0])
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
