const request = require('supertest');

const app = require('../../app');
const UserFactory = require('../../models/factories/UserFactory');

describe('POST reset-password', () => {
  let userTest = null;

  beforeAll(async () => {
    userTest = await UserFactory();
  });

  afterAll(async () => {
    await userTest.destroy();
  });

  it('Should return 200 if successfully update', () => {
    return request(app)
      .post('/request-forgot-password')
      .set('Content-Type', 'application/json')
      .send({ email: userTest.email })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String)
          })
        );
      });
  });

  // it('Should return 404 if return message for user not found', () => {
  //   const email = "test9999@gmail.com"

  //   return request(app)
  //     .post('/request-forgot-password')
  //     .set('Content-Type', 'application/json')
  //     .send({ email })
  //     .then((res) => {
  //       expect(res.statusCode).toBe(404);
  //       expect(res.body).toEqual(
  //         expect.objectContaining({
  //           message: expect.any(String)
  //         })
  //       );
  //     });
  // });

  // it('Should return 429 if return too many request', async () => {
  //   for (let i = 0; i < 2; i++) {
  //     let email = `test${i}@gmail.com`
  //     var response = await request(app)
  //       .post('/request-forgot-password')
  //       .set('Content-Type', 'application/json')
  //       .send({ email })
  //   }

  //   expect(response.statusCode).toBe(429);
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       message: expect.any(String)
  //     })
  //   )
  // });

});
