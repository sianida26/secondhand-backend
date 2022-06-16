const { Users } = require('../models');

module.exports = {
  async checkCondition(req, res, next) {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          email: email ? "" : "Email harus diisi!",
          password: password ? "" : "Password harus diisi!",
          name: name ? "" : "Nama harus diisi!"
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "Password minimal 6 Karakter!"
      });
    }

    const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
    if (email.search(filter) == -1) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "Wrong email format!"
      });
    }

    const userName = await Users.findOne({ where: { name: name } });
    if (userName) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "Nama sudah ada!"
      });
    }

    const userEmail = await Users.findOne({ where: { email: email } });
    if (userEmail) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "Email sudah ada!"
      });
    }

    next();
  }
};
