const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'qwerty';
const { Products, Bids } = require('../../models');

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
        id: productId.id,
        images: productId.filenames,
        name: productId.name,
        category: productId.category,
        seller: {
          name: productId.users.name,
          city: productId.users.city
        },
        description: productId.description
      })
    }).catch((err) => {
      res.status(404).json({
        status: "Failed",
        message: "Product not found!",
        errors: err.message
      })
    });
  },

  async getMyProduct(req, res) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenPayLoad = jwt.verify(token, JWT_KEY);

    const myProducts = await Products.findAndCountAll({ where: { createdBy: tokenPayLoad.id }, include: ['bids'] }).then((allMyProducts) => {
      return {
        data: allMyProducts.rows,
        count: allMyProducts.count
      };
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });

    let products = [];
    let interestedProducts = [];
    let soldProducts = [];

    myProducts.data.map((product) => {
      let bidUser = [];

      if (product.bids == "") {
        products.push({
          id: product.id,
          image: product.filenames,
          name: product.name,
          price: product.price
        });
      }

      product.bids.map((bid) => {
        if (bid.bidPrice && !bid.soldAt) {
          bidUser.push({
            bidId: bid.id,
            bidPrice: bid.bidPrice
          })

          // interestedProducts.push({
          //   id: product.id,
          //   bidsId: bid.id,
          //   image: product.filenames,
          //   name: product.name,
          //   price: product.price,
          //   bidPrice: bid.bidPrice
          // });
        }

        if (bid.soldAt) {
          soldProducts.push({
            id: product.id,
            bidId: product.bids.id,
            image: product.filenames,
            name: product.name,
            price: product.price,
            bidPrice: product.bids.bidPrice
          });
        }
      });

      if (product.bids != "") {
        interestedProducts.push({
          id: product.id,
          image: product.filenames,
          name: product.name,
          price: product.price,
          bids: bidUser
        });
      }

    });

    res.status(200).json({
      status: "Success",
      products: products,
      diminati: interestedProducts,
      terjual: soldProducts,
      count: myProducts.count
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
