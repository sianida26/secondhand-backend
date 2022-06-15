const bcrypt = require('bcryptjs');
const { tb_users } = require('../../models');

module.exports = {
  async register(req, res) {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await tb_users.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    }).then((createUser) => {
      res.status(201).json({
        status: "Success",
        message: "User is already registered!",
        data: {
          id: createUser.id,
          email: createUser.email
        }
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  }
}
