var express = require('express');
var router = express.Router();

const bids = require('../controllers/bids');
const middlewares = require('../middlewares');

router.get('/', function (req, res) {
  res.send('Bids');
});

router.post('/accept/:id', middlewares.authorization.authorize, bids.bid.handleAcceptBids);
router.post('/reject/:id', middlewares.authorization.authorize, bids.bid.handleRejectBids);
router.post('/finish/:id', middlewares.authorization.authorize, bids.bid.handleFinishSale);

module.exports = router;
