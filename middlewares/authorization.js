const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';
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
  },

  async optionalAuth(req, res, next){
    const token = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : false;

    if (!token) {
      return next();
    }

    const tokenPayLoad = jwt.verify(token, JWT_KEY);
    req.user = await Users.findByPk(tokenPayLoad.id);

    next();
  }
};
