var express = require('express');
var router = express.Router();

const middlewares = require('../middlewares');
const products = require('../controllers/products');

router.get('/', function (req, res, next) {
  res.send('Products');
});

router.get('/all', middlewares.authorization.authorize, products.getProduct);
router.get('/:id', middlewares.authorization.authorize, products.getProductbyId);
router.get('/user/:id', middlewares.authorization.authorize, products.getMyProduct);
router.get('/user/:user/:id', middlewares.authorization.authorize, products.getMyProductbyId);

router.post('/products', products.handleCreateProduct);

module.exports = router;
