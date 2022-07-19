require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Users } = require('../../models');

const { JWT_KEY, FRONTEND_URL } = process.env;

const handleVerifyEmail = async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, JWT_KEY);
    const user = await Users.findByPk(id);

    if (id != user.id) {
      return res.status(404).json({
        message: 'User belum terdaftar',
      });
    }

    if (user.emailVerifiedAt != null) {
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    await user.update({ emailVerifiedAt: new Date() });

    return res.render('verification-success', { FRONTEND_URL });
  } catch (err) {
    return res.status(500).json({
      name: err.name,
      message: err.message,
    });
  }
};

module.exports = { handleVerifyEmail };
