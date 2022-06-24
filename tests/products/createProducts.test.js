const request = require('supertest');
const app = require('../../app');
const multer = require('multer');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InVzZXIyIiwiZW1haWwiOiJ1c2VyMkBtYWlsLmNvbSIsImlhdCI6MTY1NTczNzIzMX0.eMPu2PlTQNDNmWaFxSmXybcGtg5ekK6NlaQSwdjVdVc';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/products');
  },
  filename: (res, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([{ name: 'filenames', maxCount: 4 }]);

describe('POST /products', () => {
  it('should response with 200 as status code and return success message', async () => {
    const name = 'product65';
    const price = 900000;
    const category = 'product';
    const description = 'product desc';

    return request(app)
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, price, category, description })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Produk berhasil diterbitkan',
          })
        );
      });
  });

  it('should response with 422 as status code and return message for required input', async () => {
    const name = 'product65';
    const price = 900000;
    const category = 'product';
    // const description = 'product desc';
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InVzZXIyIiwiZW1haWwiOiJ1c2VyMkBtYWlsLmNvbSIsImlhdCI6MTY1NTczNzIzMX0.eMPu2PlTQNDNmWaFxSmXybcGtg5ekK6NlaQSwdjVdVc';

    return (
      request(app)
        .post('/products')
        .set('Content-Type', 'application/json')
        // .setHeader('Authorization', `Bearer ${token}`)
        .send({ name, price, category })
        .then((res) => {
          expect(res.statusCode).toBe(422);
          expect(res.body).toEqual(
            expect.objectContaining({
              message: 'Semua input harus diisi',
            })
          );
        })
    );
  });
});
