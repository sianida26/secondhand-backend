var express = require('express');
var router = express.Router();
const middlewares = require('../middlewares');
const users = require('../controllers/users');
const products = require('../controllers/products');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', middlewares.registerRules.checkCondition, users.register.register);
router.get('/data/:id', middlewares.authorization.authorize, users.profile.getUserId);
router.put('/lengkapi-profil', middlewares.authorization.authorize, users.profile.editUserId);

module.exports = router;
