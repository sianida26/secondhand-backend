const { Products } = require('../../models');

module.exports = {
  async getProduct(req, res) {
    const getAllProducts = await Products.findAndCountAll({ include: ['users'] }).then((allProducts) => {
      res.status(200).json({
        status: "Success",
        data: allProducts.rows,
        count: allProducts.count
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  },

  async getProductbyId(req, res) {
    const productId = await Products.findOne({ where: { id: req.params.id }, include: ['users'] }).then((productId) => {
      res.status(200).json({
        status: "Success",
        data: productId
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  },

  async getMyProduct(req, res) {
    const myProducts = await Products.findAndCountAll({ where: { createdBy: req.params.id } }).then((allMyProducts) => {
      res.status(200).json({
        status: "Success",
        data: allMyProducts.rows,
        count: allMyProducts.count
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  },

  async getMyProductbyId(req, res) {
    const myProductId = await Products.findOne({
      where: {
        id: req.params.id,
        createdBy: req.params.user
      }
    }).then((productId) => {
      res.status(200).json({
        status: "Success",
        data: productId
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  }
};
