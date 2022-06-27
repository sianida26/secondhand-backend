const request = require('supertest');

const app = require('../../app');
const path = require('path');

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTY1NjI5NDAwM30.aJWiyCbfcgAJqH5C9lRG8fcF7IBKGfarlZIviD59_II';

describe('POST /products', () => {
  it('should response with 200 and return success message', async () => {
    const name = 'product65';
    const price = 900000;
    const category = 'product';
    const description = 'product desc';
    const filenames = path.resolve(__dirname, './img-test/test.jpg');

    return request(app)
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', name)
      .field('price', price)
      .field('category', category)
      .field('description', description)
      .attach('filenames', filenames)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Produk berhasil diterbitkan',
          })
        );
      });
  });

  it('should response with 422 and return message for required input', async () => {
    const name = 'product65';
    const price = 900000;
    const category = 'product';
    const filenames = path.resolve(__dirname, './img-test/test.jpg');

    return request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', name)
      .field('price', price)
      .field('category', category)
      .attach('filenames', filenames)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Semua input harus diisi',
          })
        );
      });
  });

  it('should response with 422 and return max file message', async () => {
    const name = 'product65';
    const price = 900000;
    const category = 'product';
    const description = 'product desc';
    const testFilenames = {
      img: path.resolve(__dirname, './img-test/test.jpg'),
      img2: path.resolve(__dirname, './img-test/test2.jpg'),
      img3: path.resolve(__dirname, './img-test/test3.jpg'),
      img4: path.resolve(__dirname, './img-test/test4.jpg'),
      img5: path.resolve(__dirname, './img-test/test5.jpg'),
    };

    return request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', name)
      .field('price', price)
      .field('category', category)
      .field('description', description)
      .attach('filenames', testFilenames.img)
      .attach('filenames', testFilenames.img2)
      .attach('filenames', testFilenames.img3)
      .attach('filenames', testFilenames.img4)
      .attach('filenames', testFilenames.img5)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'File maximal 4',
          })
        );
      });
  });
});
