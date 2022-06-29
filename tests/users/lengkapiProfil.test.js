const request = require('supertest');
const path = require('path');
const app = require('../../app');
const { Users } = require('../../models');

describe('POST users/lengkapi-profil', () => {

  let bearerToken = '';
  let userProfile = null;

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
  });

  afterAll(async () => {
    await userProfile.destroy();
  });

  it('Should return 201 if successfully update', async () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "085123456789";
    const filenames = path.resolve(__dirname, './img-test/test.jpg');

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', bearerToken)
      .field('name', name)
      .field('city', city)
      .field('address', address)
      .field('phone', phone)
      .attach('file', filenames)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'OK',
            detail: expect.any(String)
          })
        );
      });
  });

  it('Should return 422 if return errors for data null', async () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', bearerToken)
      .field('name', name)
      .field('city', city)
      .field('address', address)
      .field('phone', phone)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
          })
        );
      });
  });

  it('Should return 422 if return errors for phone length < 10', async () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "0851234";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', bearerToken)
      .field('name', name)
      .field('city', city)
      .field('address', address)
      .field('phone', phone)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
          })
        );
      });
  });

  it('Should return 422 if return errors for wrong phone format', async () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "085qwe1234";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', bearerToken)
      .field('name', name)
      .field('city', city)
      .field('address', address)
      .field('phone', phone)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
          })
        );
      });
  });

});