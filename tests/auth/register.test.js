const request = require('supertest');
const app = require('../../app');
const { Users } = require('../../models');

function generateString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('POST /users/register', () => {
  let userProfile = null;

  beforeAll(async () => {
    const registerData = {
      email: "test@gmail.com",
      password: "test123",
      name: "test"
    }

    await request(app)
      .post('/users/register')
      .set('Accept', 'application/json')
      .send(registerData);

    userProfile = await Users.findOne({ where: { email: registerData.email } });
  });

  afterAll(async () => {
    await userProfile.destroy();
  });

  it('should response with 201 as status code and return token', () => {
    const randomName = generateString(6);
    const email = `${randomName}@gmail.com`;
    const password = "12345";
    const name = randomName;

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            token: expect.any(String),
            profilePhoto: expect.any(String)
          })
        );
      });
  });

  it('should response with 422 as status code and return errors for data null', () => {
    const email = "test@gmail.com";
    const password = "test123";
    const name = "";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
            // errors: {
            //   name: name ? name : "Nama harus diisi!"
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message for wrong password', () => {
    const email = "test@gmail.com";
    const password = "1234";
    const name = "test";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
            // message: 'Terdapat data yang tidak sesuai.',
            // errors: {
            //   password: 'Password minimal 5 karakter!'
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message for wrong email format', () => {
    const email = "@gmailcom";
    const password = "test123";
    const name = "test";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
            // message: "Terdapat data yang tidak sesuai.",
            // errors: {
            //   email: "Format email salah!"
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message & errors for email already exists', () => {
    const email = "test@gmail.com";
    const password = "test123";
    const name = "test";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            errors: res.body.errors
            // message: "Terdapat data yang tidak sesuai.",
            // errors: {
            //   email: "Email sudah ada!"
            // }
          })
        );
      });
  });

  // it('should response with 429 as status code and return too many request', async () => {
  //   for (let i = 0; i < 10; i++) {
  //     let randomName = generateString(6);
  //     let email = `${randomName}@gmail.com`;
  //     let password = "12345";
  //     let name = randomName;

  //     var response = await request(app)
  //       .post('/users/register')
  //       .set('Content-Type', 'application/json')
  //       .send({ email, password, name });

  //     // usersEmail.push(email);
  //     // usersTest.push(await Users.findOne({ where: { email: email} }));
  //     await Users.destroy({ where: { email } });
  //   }

  //   expect(response.statusCode).toBe(429)
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       message: expect.any(String)
  //     })
  //   )
  // });
});