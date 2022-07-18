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
    const password = "pass123";
    const password_confirmation = "pass123";

    return request(app)
      .post('/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token: userTest.accessToken, password, password_confirmation })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String)
          })
        );
      });
  });

  it('Should return 404 if return message for user not found', () => {
    const tokenW = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OTk5OTksImlhdCI6MTY1NzIwNDg0Mn0.WJ2B4JDyHQh7bNURLPPHDqCB0ash_wllZEDy4MqnDBQ"
    const password = "pass123";
    const password_confirmation = "pass123";

    return request(app)
      .post('/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token: tokenW, password, password_confirmation })
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String)
          })
        );
      });
  });

  it('Should return 422 if return message for password length < 5', () => {
    const password = "pass";
    const password_confirmation = "pass";

    return request(app)
      .post('/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token: userTest.accessToken, password, password_confirmation })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: {
              password: expect.any(String)
            }
          })
        );
      });
  });

  it('Should return 422 if return message for wrong password', () => {
    const password = "pass123";
    const password_confirmation = "pass12";

    return request(app)
      .post('/reset-password')
      .set('Content-Type', 'application/json')
      .send({ token: userTest.accessToken, password, password_confirmation })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: {
              password: expect.any(String)
            }
          })
        );
      });
  });
});
