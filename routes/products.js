var express = require('express');
var router = express.Router();
const multer = require('multer');


const bids = require('../controllers/bids');
const products = require('../controllers/products');
const middlewares = require('../middlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/products');
  },
  filename: (res, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    return cb(new Error('Gunakan format jpeg/jpg/png'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const cpUpload = upload.fields([{ name: 'filenames', maxCount: 5 }]);

router.get('/', function (req, res) {
  res.send('Products');
});


router.get('/user/:id', middlewares.authorization.authorize, products.getMyProduct);
router.get('/user/:user/:id', middlewares.authorization.authorize, products.getMyProductbyId);

router.post('/', middlewares.authorization.authorize, cpUpload, products.handleCreateProduct);
router.put('/:id', middlewares.authorization.authorize, cpUpload, products.handleEditProductById);
router.get('/all', middlewares.authorization.authorize, products.product.handleGetAllProducts);
router.get('/detail/:id', middlewares.authorization.authorize, products.product.handleGetProductbyId);
router.get('/history/:id', middlewares.authorization.authorize, bids.bid.handleBidHistory);
router.get('/my-products', middlewares.authorization.authorize, products.product.handleListMyProducts);

// router.post('/', products.product.handleCreateProduct);

module.exports = router;
