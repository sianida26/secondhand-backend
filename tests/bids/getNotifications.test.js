const request = require('supertest');
const app = require('../../app');
const { Users, Products, Bids } = require('../../models');

describe('GET notifications', () => {
  let bearerToken = [];
  let userProfile = [];
  let userProduct = [];
  let bidProduct = [];

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

    for (let i = 0; i < 4; i++) {
      let productData = {
        name: `test${i}`,
        price: 10000,
        category: "test",
        description: "test",
        filenames: JSON.stringify(["test.png", "test.jpg"]),
        createdBy: i < 2 ? userProfile[0].id : userProfile[1].id
      };
      userProduct.push(await Products.create(productData));
    }

    for (let i = 0; i < userProduct.length; i++) {
      let bidData = {
        buyerId: i < 2 ? userProfile[1].id : userProfile[0].id,
        productId: userProduct[i].id,
        bidPrice: 20000
      };
      bidProduct.push(await Bids.create(bidData));
    }
  });

  afterAll(async () => {
    await Promise.all(bidProduct.map(async (x) => x.destroy()));
    await Promise.all(userProduct.map(async (x) => x.destroy()));
    await Promise.all(userProfile.map(async (x) => x.destroy()));
  });

  it('Should return 200 if successfully get bid history', () => {
    return request(app)
      .get('/notifications')
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken[0])
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            // expect.objectContaining({
            //   id: expect.any(Number),
            //   productName: expect.any(String),
            //   price: expect.any(Number),
            //   image: expect.any(String),
            //   type: expect.any(String),
            //   bidPrice: expect.any(Number),
            //   time: expect.any(String)
            // })
          ])
        );
      });
  });

  it('Should return 401 if return errors for unauthenticated', () => {
    return request(app)
      .get('/notifications')
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
