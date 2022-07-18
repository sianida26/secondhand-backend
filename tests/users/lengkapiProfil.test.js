const request = require('supertest');
const path = require('path');

const app = require('../../app');
const UserFactory = require('../../models/factories/UserFactory');

describe('POST users/lengkapi-profil', () => {
  let userProfile = null;

  beforeAll(async () => {
    userProfile = await UserFactory();
  });

  afterAll(async () => {
    await userProfile.destroy();
  });

  it('Should return 201 if successfully update', () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "085123456789";
    const filenames = path.resolve(__dirname, './img-test/test.jpg');

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${userProfile.accessToken}`)
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

  it('Should return 401 if return errors for unauthenticated', () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "085123456789";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', '')
      .field('name', name)
      .field('city', city)
      .field('address', address)
      .field('phone', phone)
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

  it('Should return 422 if return errors for data null', () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${userProfile.accessToken}`)
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

  it('Should return 422 if return errors for phone length < 10', () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "0851234";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${userProfile.accessToken}`)
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

  it('Should return 422 if return errors for wrong phone format', () => {
    const name = "test";
    const city = "test";
    const address = "test";
    const phone = "085qwe1234";

    return request(app)
      .post('/users/lengkapi-profil')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${userProfile.accessToken}`)
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
