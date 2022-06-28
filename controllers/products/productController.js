const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'Rahasia';
const { Products, Bids } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  async handleGetAllProducts(req, res) {
    try {
      const products = await Products.findAndCountAll({ include: ['users'] });
      res.status(200).json({
        data: products.rows,
        count: products.count,
      });
    } catch (err) {
      res.status(400).json({
        message: 'Failed',
        errors: err.message,
      });
    }
  },

  async handleGetProductbyId(req, res) {
    try {
      const productId = await Products.findOne({ where: { id: req.params.id }, include: ['users'] });
      res.status(200).json({
        id: productId.id,
        name: productId.name,
        images: productId.filenames ? JSON.parse(productId.filenames).map((image) => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`) : [],
        category: productId.category,
        description: productId.description,
        seller: {
          name: productId.users.name,
          city: productId.users.city,
        },
      });
    } catch (err) {
      res.status(404).json({
        message: `Product with id ${req.params.id} not found`,
        errors: err.message,
      });
    }
  },

  async handleListMyProducts(req, res) {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      const tokenPayload = jwt.verify(token, JWT_KEY);
      const myProducts = await Products.findAndCountAll({
        where: {
          createdBy: tokenPayload.id,
        },
        include: [
          {
            model: Bids,
            as: 'bids',
            include: ['users'],
          },
        ],
      });

      let products = [];
      let interestedProducts = [];
      let soldProducts = [];

      myProducts.rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      myProducts.rows.map((product) => {
        let images = product.filenames ? JSON.parse(product.filenames).map((image) => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0] : '';

        products.push({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: images,
        });

        if (product.bids != '') {
          product.bids.map((bid) => {
            if (bid.bidPrice && !bid.soldAt) {
              interestedProducts.push({
                id: bid.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: images,
                buyerName: bid.users.name,
                bidPrice: bid.bidPrice,
              });
            }

            if (bid.soldAt) {
              soldProducts.push({
                id: bid.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: images,
                buyerName: bid.users.name,
                bidPrice: bid.bidPrice,
                soldAt: bid.soldAt,
              });
            }
          });
        }
      });

      res.status(200).json({
        products: products,
        diminati: interestedProducts,
        terjual: soldProducts,
        count: myProducts.count,
      });
    } catch (err) {
      res.status(400).json({
        message: 'Failed',
        errors: err.message,
      });
    }
  },

  async deleteProduct(req, res) {
    const product = await Products.findByPk(req.params.id);

    //Return 404 if not found
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    //Return 403 if unauthorized
    if (product.createdBy !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    //delete instance
    await product.destroy();
    return res.status(200).json({ message: 'Produk berhasil dihapus' });
  },

  async getAvailableProducts(req, res) {
    //TODO: Filter items on database level for better performance
    const products = await Products.findAll({ include: ['bids'] });

    return res.json(
      products
        .filter((product) => product.isBiddable() && product.createdBy !== req.user?.id)
        .map((product) => ({
          id: product.id,
          category: product.category,
          image: JSON.parse(product.filenames),
          price: product.price,
        }))
    );
  },
};
