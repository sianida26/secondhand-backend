const request = require('supertest');
const app = require('../../app');

const { Users } = require('../../models');
const userModel = Users;

describe('POST /users/login', () => {
  it('should response with 201 as status code and return access token', async () => {
    const email = 'user1@mail.com';
    const password = 'user123';
    const user = await userModel.findOne({ where: { email } });

    return request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
            name: user.name,
            accessToken: res.body.accessToken,
          })
        );
      });
  });

  it('should response with 401 as status code and return message for wrong password', async () => {
    const email = 'user1@mail.com';
    const password = 'use123';

    return request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Username atau password salah',
          })
        );
      });
  });

  it('should response with 401 as status code and return message if user not exist', async () => {
    const email = 'user@mail.com';
    const password = 'user123';

    return request(app)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Username atau password salah',
          })
        );
      });
  });
});
