const { Users } = require('../models');

module.exports = {
  async checkCondition(req, res, next) {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          email: email ? undefined : "Email harus diisi!",
          password: password ? undefined : "Password harus diisi!",
          name: name ? undefined : "Nama harus diisi!"
        }
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

    const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
    if (email.search(filter) == -1) {
      return res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          email: "Format email salah!"
        }
      });
    }

    const userEmail = await Users.findOne({ where: { email: email } });
    if (userEmail) {
      // throw new Error('User already exist');
      return res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          email: "Email sudah ada!"
        }
      });
    }

    next();
  }
};
