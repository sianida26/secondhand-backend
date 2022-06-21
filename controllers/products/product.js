const { Products } = require('../../models');

module.exports = {
  async getProduct(req, res) {
    const getAllProducts = await Products.findAndCountAll()
      .then((allProducts) => {
        res.status(200).json({
          status: 'Success',
          data: allProducts.rows,
          count: allProducts.count,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async getProductbyId(req, res) {
    const productId = await Products.findOne({ where: { id: req.params.id } })
      .then((productId) => {
        res.status(200).json({
          status: 'Success',
          data: productId,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async getMyProduct(req, res) {
    const myProducts = await Products.findAndCountAll({ where: { createdBy: req.params.id } })
      .then((allMyProducts) => {
        res.status(200).json({
          status: 'Success',
          data: allMyProducts.rows,
          count: allMyProducts.count,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async getMyProductbyId(req, res) {
    const myProductId = await Products.findOne({
      where: {
        id: req.params.id,
        createdBy: req.params.user,
      },
    })
      .then((productId) => {
        res.status(200).json({
          status: 'Success',
          data: productId,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async handleCreateProduct(req, res) {
    try {
      const { name, price, category, description, createdBy } = req.body;
      const filenames = req.files['filenames'].map((e) => e.filename);
      const files = JSON.stringify(filenames);

      if (!req.files && !req.body) {
        res.status(422).json({
          message: 'Semua input harus diisi',
        });
      }

      await Products.create({
        name,
        price,
        category,
        description,
        filenames: files,
        createdBy: req.user.id,
      });

      res.status(200).json({
        product: { name, filenames },
        message: 'Produk berhasil diterbitkan',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },
};
