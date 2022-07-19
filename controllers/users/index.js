const profile = require('./profileController');
const register = require('./registerController');
const login = require('./loginController');
const password = require('./passwordController');
const verifyEmail = require('./verifyEmailController');

module.exports = {
  profile,
  register,
  login,
  password,
  verifyEmail,
};
