var express = require('express');
var router = express.Router();

const bids = require('../controllers/bids');
const middlewares = require('../middlewares');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/notifications', middlewares.authorization.authorize, bids.bid.handleGetNotifications);

module.exports = router;
