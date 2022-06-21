var express = require('express');
var router = express.Router();
const multer = require('multer');

const middlewares = require('../middlewares');
const products = require('../controllers/products');

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

router.get('/', function (req, res, next) {
  res.send('Products');
});

router.get('/all', middlewares.authorization.authorize, products.getProduct);
router.get('/:id', middlewares.authorization.authorize, products.getProductbyId);
router.get('/user/:id', middlewares.authorization.authorize, products.getMyProduct);
router.get('/user/:user/:id', middlewares.authorization.authorize, products.getMyProductbyId);

router.post('/', middlewares.authorization.authorize, cpUpload, products.handleCreateProduct);

module.exports = router;
