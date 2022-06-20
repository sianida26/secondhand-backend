const express = require('express');
const multer = require('multer');

const users = require('../controllers/users');
const middlewares = require('../middlewares');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './images/profiles'),
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${Math.floor(Math.random()*1E6)}.${file.originalname.split('.').pop()}`; //random filename
    cb(null, fileName)
  }
})

// multer configuration for file upload
const upload = multer({ storage: storage })

router.post('/lengkapi-profil',[middlewares.authorization.authorize, upload.single('file') ], users.profile.editUserId);
router.post('/register', middlewares.registerRules.checkCondition, users.register.handleRegister);

module.exports = router;
