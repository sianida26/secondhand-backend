const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models');

module.exports = {
  async register(req, res) {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    }).then((createUser) => {
      const token = jwt.sign({ id: createUser.id, name: name }, process.env.JWT_KEY || "qwerty", { expiresIn: '1h' });
      res.status(201).json({
        status: "Success",
        message: "OK",
        data: {
          name: createUser.name,
          token: token
        }
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  }
};

