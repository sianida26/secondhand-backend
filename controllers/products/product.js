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
      const { name, price, category, description } = req.body;

      if (!name || !price || !category || !description || !req.files['filenames']) {
        return res.status(422).json({
          message: 'Semua input harus diisi',
        });
      }

      const filenames = req.files['filenames'].map((e) => e.filename);
      const files = JSON.stringify(filenames);

      if (filenames.length > 4) {
        return res.status(422).json({
          message: 'File maximal 4',
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
