const { tb_users } = require('../../models');

module.exports = {
  async checkCondition(req, res, next) {
    const { email, password, name } = req.body;
    if (email == '' || password == '' || name == '') {
      return res.status(400).json({
        status: "Failed",
        message: "Fill all!"
      });
    }

    if (password.length < 7) {
      return res.status(400).json({
        status: "Failed",
        message: "Password must have at least 8 characters!"
      });
    }

    const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
    if (email.search(filter) == -1) {
      return res.status(400).json({
        status: "Failed",
        message: "Wrong email format!"
      });
    }

    const userName = await tb_users.findOne({ where: { name: name } });
    if (userName) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Name already exist!"
      });
    }

    const userEmail = await tb_users.findOne({ where: { email: email } });
    if (userEmail) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Email already exist!"
      });
    }

    next();
  }
}
