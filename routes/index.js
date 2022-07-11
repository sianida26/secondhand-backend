const express = require('express');
const rateLimit = require('express-rate-limit');

const bids = require('../controllers/bids');
const users = require('../controllers/users');
const middlewares = require('../middlewares');

const router = express.Router();

const sendForgotPassword = rateLimit({
  windowMs: 12 * 60 * 60 * 1000, // 1 hour = 3600000
  max: 1, // Limit each IP to 1 send email requests per `window` (here, per half-day)
  message: {
    message: "Permintaan telah dikirim. Periksa email Anda termasuk folder spam!"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/notifications', middlewares.authorization.authorize, bids.bid.handleGetNotifications);
router.post('/request-forgot-password', sendForgotPassword, users.password.handleForgotPassword);
router.post('/reset-password', users.password.handleResetPassword);

module.exports = router;
