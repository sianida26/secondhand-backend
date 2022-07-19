const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';
const sendEmail = require('../../services/sendEmail');
const { Users } = require('../../models');

module.exports = {
  async handleForgotPassword(req, res) {
    const userId = await Users.findOne({ where: { email: req.body.email } });

    if (!userId) {
      return res.status(404).json({
        message: "Email tidak terdaftar"
      });
    }

    const token = jwt.sign({ id: userId.id }, JWT_KEY);
    sendEmail.sendEmailToUserForgotPassword(userId.email, token);

    return res.status(200).json({
      message: "Email berhasil dikirim. Silakan periksa email Anda"
    });
  },

  async handleResetPassword(req, res) {
    const { token, password, password_confirmation } = req.body;

    const tokenPayload = jwt.verify(token, JWT_KEY);
    const userId = await Users.findByPk(tokenPayload.id);

    if (!userId) {
      return res.status(404).json({
        message: "User tidak ditemukan."
      });
    }

    if (password.length < 5) {
      return res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          password: "Password minimal 5 karakter!"
        }
      });
    }

    if (password_confirmation != password) {
      return res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          password: "Password tidak sesuai!"
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password_confirmation, 10);
    await userId.update({ password: hashedPassword });

    return res.status(200).json({
      message: "Password berhasil diubah!"
    });
  }
}