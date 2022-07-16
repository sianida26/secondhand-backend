const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';

const { Users } = require('../../models');
const userModel = Users;

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });

    if (!user)
      return res.status(401).json({
        message: 'Username atau password salah',
      });

    const isPasswordCorrect = verifyPassword(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({
        message: 'Username atau password salah',
      });

    const accessToken = createToken(user);

    res.status(200).json({
      name: user.name,
      city: user.city,
      profilePhoto: user.profilePicUrl,
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      name: err.name,
      message: err.message,
    });
  }
};

const handleGetUser = async (req, res) => {
  const user = await userModel.findByPk(req.user.id);

  if (!user) {
    res.status(404).json({
      name: user.name,
      message: 'User not found!',
    });
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
  });
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
    JWT_KEY
  );
};

module.exports = {
  handleLogin,
  handleGetUser
};
