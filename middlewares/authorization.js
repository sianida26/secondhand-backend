const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'qwerty';
const { Users } = require('../models');

module.exports = {
  async authorize(req, res, next) {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];

      if (!token) {
        return res.status(401).json({
          status: "Failed",
          message: "Unauthenticated. Token is required!"
        });
      }

      const tokenPayLoad = jwt.verify(token, JWT_KEY);
      req.user = await Users.findByPk(tokenPayLoad.id);

      next();
    } catch (err) {
      res.status(401).json({
        status: "Failed",
        message: "Unauthenticated. Invalid token!",
        error: err.message
      });
    }
  }
};
