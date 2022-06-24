const request = require('supertest');
const app = require('../../app');

function generateString(length) {
  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('POST /users/register', () => {
  it('should response with 201 as status code and return token', async () => {
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
            name: res.body.name,
            token: expect.any(String)
          })
        );
      });
  });

  it('should response with 422 as status code and return errors for data null', async () => {
    const email = "kuku@gmail.com";
    const password = "12345";
    const name = "";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: res.body.message, //'Terdapat data yang tidak sesuai.',
            errors: res.body.errors
            // errors: {
            //   name: name ? name : "Nama harus diisi!"
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message for wrong password', async () => {
    const email = "kuku@gmail.com";
    const password = "1234";
    const name = "kuku";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: res.body.message,
            errors: res.body.errors
            // message: 'Terdapat data yang tidak sesuai.',
            // errors: {
            //   password: 'Password minimal 5 karakter!'
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message for wrong email format', async () => {
    const email = "@gmailcom";
    const password = "12345";
    const name = "kuku";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: res.body.message,
            errors: res.body.errors
            // message: "Terdapat data yang tidak sesuai.",
            // errors: {
            //   email: "Format email salah!"
            // }
          })
        );
      });
  });

  it('should response with 422 as status code and return message & errors for email already exists', async () => {
    const email = "nana@gmail.com";
    const password = "12345";
    const name = "nana";

    return request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({ email, password, name })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: res.body.message,
            errors: res.body.errors
            // message: "Terdapat data yang tidak sesuai.",
            // errors: {
            //   email: "Email sudah ada!"
            // }
          })
        );
      });
  });
});