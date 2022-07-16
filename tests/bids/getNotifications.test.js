const request = require('supertest');

const app = require('../../app');
const ProductFactory = require('../../models/factories/ProductFactory');
const UserFactory = require('../../models/factories/UserFactory');
const { Products, Bids } = require('../../models');

describe('GET notifications', () => {
  let usersTest = [];
  let productsTest = [];
  let bidProduct = [];

  beforeAll(async () => {
    for (let i = 0; i < 2; i++) {
      usersTest.push(await UserFactory());
    }

    for (let i = 0; i < 4; i++) {
      let productData = {
        name: `test${i}`,
        price: Math.floor(Math.random()*9000000)+1000,
        category: "test",
        description: "test",
        filenames: JSON.stringify(["test.png", "test.jpg"]),
        createdBy: i < 2 ? usersTest[0].id : usersTest[1].id
      };
      productsTest.push(await Products.create(productData));
      // productTest.push(await ProductFactory(i < 2 ? usersTest[0].id : usersTest[1].id));
    }

    for (let i = 0; i < productsTest.length; i++) {
      let bidData = {
        buyerId: i < 2 ? usersTest[1].id : usersTest[0].id,
        productId: productsTest[i].id,
        bidPrice: Math.floor(Math.random()*9000000)+1000
      };
      bidProduct.push(await Bids.create(bidData));
    }
  });

  afterAll(async () => {
    await Promise.all(bidProduct.map(async (x) => x.destroy()));
    await Promise.all(productsTest.map(async (x) => x.destroy()));
    await Promise.all(usersTest.map(async (x) => x.destroy()));
  });

  it('Should return 200 if successfully get bid history', () => {
    return request(app)
      .get('/notifications')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${usersTest[0].accessToken}`)
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
