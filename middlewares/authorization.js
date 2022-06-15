const jwt = require('jsonwebtoken');
const { tb_users } = require('../models');

module.exports = {
  async authorize(req, res, next) {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const tokenPayLoad = jwt.verify(token, process.env.JWT_KEY || "rahasia");

      req.user = await tb_users.findByPk(tokenPayLoad.id);

      next();
    } catch (err) {
      res.status(401).json({
        error: err.message,
        message: "Unauthorized. You must login first to perform this action!"
      });
    }
  }
}
