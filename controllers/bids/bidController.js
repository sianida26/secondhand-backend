const { Products, Bids } = require('../../models');

module.exports = {
  async handleBidHistory(req, res) {
    try {
      const bidHistory = await Bids.findOne({
        where: {
          id: req.params.id,
        },
        include: ['users', 'products'],
      });

      const productsCheck = await Products.findOne({
        where: {
          id: bidHistory.productId,
        },
        include: ['bids'],
      });

      let productAcc = productsCheck.bids.find((bid) => bid.acceptedAt);

      res.status(200).json({
        id: bidHistory.id,
        buyerName: bidHistory.users.name,
        buyerCity: bidHistory.users.city,
        buyerPhone: bidHistory.users.phone,
        productName: bidHistory.products.name,
        productImage: JSON.parse(bidHistory.products.filenames).map((image) => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0],
        productPrice: bidHistory.products.price,
        bidPrice: bidHistory.bidPrice,
        bidAt: bidHistory.createdAt,
        acceptedAt: bidHistory.acceptedAt,
        declinedAt: bidHistory.declinedAt,
        soldAt: bidHistory.soldAt,
        isAcceptable: !productAcc,
      });
    } catch (err) {
      res.status(404).json({
        message: `Product with id ${req.params.id} not found`,
        errors: err.message,
      });
    }
  },

  async handleAcceptBids(req, res) {
    try {
      const bid = await Bids.findByPk(req.params.id);
      const product = await Products.findOne({
        where: {
          id: bid.productId,
        },
      });

      if (!bid) {
        return res.status(404).json({
          message: `Bid tidak ditemukan`,
        });
      }

      if (req.user.id !== product.createdBy) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      if (bid.declinedAt !== null || bid.soldAt !== null) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      // await bid.update({
      //   acceptedAt: new Date(),
      // });

      return res.status(200).json({
        message: 'OK',
        sellerYgLoginNow: req.user.id,
        product,
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  async handleRejectBids(req, res) {
    try {
      const bid = await Bids.findByPk(req.params.id);
      const product = await Products.findOne({
        where: {
          id: bid.productId,
        },
      });

      if (!bid) {
        return res.status(404).json({
          message: `Bid tidak ditemukan`,
        });
      }

      if (req.user.id !== product.createdBy) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      if (bid.soldAt !== null) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      // await bid.update({
      //   declinedAt: new Date(),
      // });

      return res.status(200).json({
        message: 'OK',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  async handleFinishSale(req, res) {
    try {
      const bid = await Bids.findByPk(req.params.id);
      const product = await Products.findOne({
        where: {
          id: bid.productId,
        },
      });

      if (!bid) {
        return res.status(404).json({
          message: `Bid tidak ditemukan`,
        });
      }

      if (req.user.id !== product.createdBy) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      if (bid.declinedAt !== null) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      await bid.update({
        soldAt: new Date(),
      });

      return res.status(200).json({
        message: 'OK',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },
};
