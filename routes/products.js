var express = require('express');
var router = express.Router();
const middlewares = require('../middlewares');
const products = require('../controllers/products');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/all', middlewares.authorization.authorize, products.product.handleGetAllProducts);
router.get('/my-products', middlewares.authorization.authorize, products.product.handleListMyProducts);
router.get('/detail/:id', middewares.authorization.authorize, products.product.handleGetProductbyId);

router.post('/', products.product.handleCreateProduct);

module.exports = router;
