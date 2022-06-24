var express = require('express');
var router = express.Router();
const bids = require('../controllers/bids');
const products = require('../controllers/products');
const middlewares = require('../middlewares');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/all', middlewares.authorization.authorize, products.product.handleGetAllProducts);
router.get('/detail/:id', middlewares.authorization.authorize, products.product.handleGetProductbyId);
router.get('/history/:id', middlewares.authorization.authorize, bids.bid.handleBidHistory);
router.get('/my-products', middlewares.authorization.authorize, products.product.handleListMyProducts);

// router.post('/', products.product.handleCreateProduct);

module.exports = router;
