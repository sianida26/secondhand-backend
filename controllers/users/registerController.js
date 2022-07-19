const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';
const { Users } = require('../../models');
const { sendEmailVerification } = require('../../services/sendEmail');

module.exports = {
  async handleRegister(req, res) {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    })
      .then((createUser) => {
        const token = jwt.sign({ id: createUser.id, name: name, email: email }, JWT_KEY);

        sendEmailVerification(createUser.name, email, 'Verifikasi Email', token);

        res.status(201).json({
          name: createUser.name,
          city: createUser.city,
          token: token,
          profilePhoto: createUser.profilePicUrl,
        });
      })
      .catch((err) => {
        res.status(422).json({
          message: 'Terdapat data yang tidak sesuai.',
          errors: err.message,
        });
      });
  },

  async resendEmailVerification(req, res) {
    try {
      const user = await Users.findByPk(req.params.id);

      const token = jwt.sign({ id: user.id, name: user.name, email: user.name }, JWT_KEY);

      if (user.emailVerifiedAt != null) {
        return res.status(401).json({
          message: 'Email sudah terverifikasi.',
        });
      }

      sendEmailVerification(user.name, user.email, 'Verifikasi Email', token);

      return res.status(200).json({
        message: 'Kirim ulang email sukses.',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },
};
