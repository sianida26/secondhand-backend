const { Products } = require('../../models');
const Validator = require('../../utils/Validator');

module.exports = {
  async getMyProduct(req, res) {
    const myProducts = await Products.findAndCountAll({ where: { createdBy: req.params.id } })
      .then((allMyProducts) => {
        res.status(200).json({
          status: 'Success',
          data: allMyProducts.rows,
          count: allMyProducts.count
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message
        });
      });
  },

  async getMyProductbyId(req, res) {
    const myProductId = await Products.findOne({
      where: {
        id: req.params.id,
        createdBy: req.params.user
      },
    })
      .then((productId) => {
        return res.status(200).json({
          status: 'Success',
          data: productId
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: 'Failed',
          message: err.message
        });
      });
  },

  async handleCreateProduct(req, res) {
    try {
      const { name, price, category, description } = req.body;

      const rules = Validator.rules;
      const validator = new Validator({
        name,
        price,
        category,
        description,
        files: req.files['filenames']
      }, {
        name: [ rules.required(), rules.max(255) ],
        price: [ rules.required(), rules.number(), rules.min(0) ],
        category: [ rules.required(), rules.max(255) ],
        description: [ rules.required() ],
        files: [ rules.required(), rules.array(), rules.max(4) ]
      })

      if (validator.fails()) {
        return res.status(422).json({
          message: "Ada data yang tidak sesuai.",
          errors: validator.getErrors()
        });
      }

      // get req.files filename property
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

      return res.status(200).json({
        message: 'Produk berhasil diterbitkan',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  async handleEditProductById(req, res) {
    try {
      const { name, price, category, description } = req.body;
      const product = await Products.findByPk(req.params.id);

      const rules = Validator.rules;
      const validator = new Validator({
        name,
        price,
        category,
        description,
        files: req.files['filenames']
      }, {
        name: [ rules.required(), rules.max(255) ],
        price: [ rules.required(), rules.number(), rules.min(0) ],
        category: [ rules.required(), rules.max(255) ],
        description: [ rules.required() ],
        files: [ rules.required(), rules.array(), rules.max(4) ]
      })

      if (product.createdBy != req.user.id) {
        return res.status(403).json({
          message: "Unauthorized"
        })
      }

      if (validator.fails()) {
        return res.status(422).json({
          message: "Ada data yang tidak sesuai.",
          errors: validator.getErrors()
        });
      }

      // get req.files filename property
      const filenames = req.files['filenames'].map((e) => e.filename);
      const files = JSON.stringify(filenames);

      if (filenames.length > 4) {
        return res.status(422).json({
          message: 'File maximal 4'
        });
      }

      await product.update({
        name,
        price,
        category,
        description,
        filenames: files,
        createdBy: req.user.id
      });

      return res.status(200).json({
        message: 'Produk berhasil diedit',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message
      });
    }
  },
};
