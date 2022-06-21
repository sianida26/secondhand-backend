const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'qwerty';
const { Products, Bids } = require('../../models');

module.exports = {
  async handleGetAllProducts(req, res) {
    // await Products.findAndCountAll({ include: ['users'] }).then((allProducts) => {
    //   res.status(200).json({
    //     data: allProducts.rows,
    //     count: allProducts.count
    //   })
    // }).catch((err) => {
    //   res.status(400).json({
    //     status: "Failed",
    //     message: err.message
    //   })
    // });
    try {
      const products = await Products.findAndCountAll({ include: ['users'] });
      res.status(200).json({
        data: products.rows,
        count: products.count
      });
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    }
  },

  async handleGetProductbyId(req, res) {
    const productId = await Products.findOne({ where: { id: req.params.id }, include: ['users'] }).then((productId) => {
      res.status(200).json({
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
        message: "Product not found!",
        errors: err.message
      })
    });
  },

  async handleListMyProducts(req, res) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenPayLoad = jwt.verify(token, JWT_KEY);

    const myProducts = await Products.findAndCountAll({
      where: {
        createdBy: tokenPayLoad.id
      },
      include: [{
        model: Bids,
        as: 'bids',
        include: ['users']
      }]
    }).then((allMyProducts) => {
      return {
        data: allMyProducts.rows,
        count: allMyProducts.count
      };
    }).catch((err) => {
      res.status(400).json({
        message: err.message
      })
    });

    myProducts.data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    let products = [];
    let interestedProducts = [];
    let soldProducts = [];


    //product.filename
    //'["gambar1.png","gamabr2.jpg","gambar3.jpg","gambar8000.jpg"]'

    myProducts.data.map((product) => {
      products.push({
        id: product.id,
        productName: product.name,
        price: product.price,
        image: product.filenames.map(filename => `https://balbalbla.com/uploads/${filename}`),
      });

      if (product.bids != '') {
        product.bids.map((bid) => {
          if (bid.bidPrice && !bid.soldAt) {
            interestedProducts.push({
              id: bid.id,
              productName: product.name,
              price: product.price,
              image: product.filenames,
              buyerName: bid.users.name,
              buyerPics: bid.users.image,
              bidPrice: bid.bidPrice
            });
          }

          if (bid.soldAt) {
            soldProducts.push({
              id: product.id,
              productName: product.name,
              price: product.price,
              image: product.filenames,
              buyerName: bid.users.name,
              buyerPics: bid.users.image,
              bidPrice: bid.bidPrice,
              soldAt: bid.soldAt
            });
          }
        });
      }
    });

    res.status(200).json({
      products: products,
      diminati: interestedProducts,
      terjual: soldProducts,
      count: myProducts.count
    });
  },

};
