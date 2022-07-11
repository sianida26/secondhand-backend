var express = require('express');
var router = express.Router();
const multer = require('multer');

const bids = require('../controllers/bids');
const products = require('../controllers/products');
const middlewares = require('../middlewares');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Gunakan format jpeg/jpg/png'));
  }
};

const upload = multer({ fileFilter: fileFilter });
const cpUpload = upload.array('filenames', 5);

router.get('/', function (req, res) {
  res.send('Products');
});

router.get('/user/:id', middlewares.authorization.authorize, products.getMyProduct);
router.get('/user/:user/:id', middlewares.authorization.authorize, products.getMyProductbyId);

router.post('/', [middlewares.authorization.authorize, cpUpload], products.handleCreateProduct);
router.get('/available', middlewares.authorization.optionalAuth, products.product.getAvailableProducts);
router.put('/:id', [middlewares.authorization.authorize, cpUpload], products.handleEditProductById);
router.get('/all', middlewares.authorization.authorize, products.product.handleGetAllProducts);
router.get('/detail-buyer/:id', middlewares.authorization.optionalAuth, products.product.handleGetProductByIdForBuyer);
router.get('/detail/:id', products.product.handleGetProductById);
router.get('/history/:id', middlewares.authorization.authorize, bids.bid.handleBidHistory);
router.get('/my-products', middlewares.authorization.authorize, products.product.handleListMyProducts);
router.delete('/delete-product/:id', middlewares.authorization.authorize, products.product.deleteProduct);

module.exports = router;
