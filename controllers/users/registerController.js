const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'qwerty';
const { Users } = require('../../models');

module.exports = {
  async handleRegister(req, res) {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    }).then((createUser) => {
      const token = jwt.sign({ id: createUser.id, name: name, email: email }, JWT_KEY);
      res.status(201).json({
        name: createUser.name,
        token: token
      })
    }).catch((err) => {
      res.status(422).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: err.message
      })
    });
  }
};
