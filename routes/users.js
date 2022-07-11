const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const users = require('../controllers/users');
const middlewares = require('../middlewares');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './images/profiles'),
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${Math.floor(Math.random()*1E6)}.${file.originalname.split('.').pop()}`; //random filename
    cb(null, fileName)
  }
});

// multer configuration for file upload
const upload = multer({ storage: storage })

const createAccountLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute = 60000
  max: 10, // Limit each IP to 10 create account requests per `window` (here, per minute)
  message: {
    message: "Terlalu banyak akun yang dibuat, silakan tunggu beberapa menit!"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/login', users.login.handleLogin);
router.post('/lengkapi-profil',[middlewares.authorization.authorize, upload.single('file') ], users.profile.editUserId);
router.post('/register', [middlewares.registerRules.checkCondition, createAccountLimiter], users.register.handleRegister);
router.get('/whoami', middlewares.authorization.authorize, users.login.handleGetUser);

router.get('/data/:id', middlewares.authorization.authorize, users.profile.getUserId);
router.put('/data/:id', middlewares.authorization.authorize, users.profile.editUserId);

module.exports = router;
