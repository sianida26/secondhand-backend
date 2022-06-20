const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = {
  async authorize(req, res, next) {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];

      if (!token) {
        return res.status(401).json({
          status: "Failed",
          message: "Unauthorized. Token is required!"
        });
      }

      const tokenPayLoad = jwt.verify(token, process.env.JWT_KEY || "qwerty");
      req.user = await Users.findByPk(tokenPayLoad.id);

      next();
    } catch (err) {
      res.status(401).json({
        status: "Failed",
        message: "Unauthorized. Invalid token!",
        error: err.message
      });
    }
  }
};
