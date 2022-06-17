var express = require('express');
var router = express.Router();
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: '',
//   filename: ''
// });
const middlewares = require('../middlewares');
const users = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', middlewares.registerRules.checkCondition, users.register.register);
router.put('/lengkapi-profil', middlewares.authorization.authorize, users.profile.editUserId);
// router.get('/data/:id', middlewares.authorization.authorize, users.profile.getUserId);

module.exports = router;
