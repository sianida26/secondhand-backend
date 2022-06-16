const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SIGNATURE_KEY = process.env.JWT_SIGNATURE_KEY;

const { Users } = require('../../models');
const userModel = Users;

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });

    if (!user)
      return res.status(401).json({
        message: 'Wrong Email/Password!',
      });

    const isPasswordCorrect = verifyPassword(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({
        message: 'Wrong Email/Password!',
      });

    const accessToken = createToken(user);

    res.status(200).json({
      email: user.email,
      message: 'Login SUCCESS',
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      name: err.name,
      message: err.message,
    });
  }
};

const verifyPassword = (password, encriptedPassword) => {
  return bcrypt.compareSync(password, encriptedPassword);
};

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    JWT_SIGNATURE_KEY
  );
};

module.exports = { handleLogin };
