var express = require('express');
var router = express.Router();
const middlewares = require('../middlewares');
const products = require('../controllers/products');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/all', middlewares.authorization.authorize, products.product.getProduct);
router.get('/:id', middlewares.authorization.authorize, products.product.getProductbyId);
router.get('/user/:id', middlewares.authorization.authorize, products.product.getMyProduct);
router.get('/user/:user/:id', middlewares.authorization.authorize, products.product.getMyProductbyId);

router.post('/', products.product.handleCreateProduct);

module.exports = router;
