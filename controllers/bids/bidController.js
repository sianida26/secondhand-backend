const { Products, Bids } = require('../../models');

module.exports = {
  async handleBidHistory(req, res) {
    try {
      const bidHistory = await Bids.findOne({
        where: {
          id: req.params.id
        },
        include: ['users', 'products']
      });

      const productsCheck = await Products.findOne({
        where: {
          id: bidHistory.productId
        },
        include: ['bids']
      });

      let productAcc = productsCheck.bids.find(bid => bid.acceptedAt);

      res.status(200).json({
        id: bidHistory.id,
        buyerName: bidHistory.users.name,
        buyerCity: bidHistory.users.city,
        buyerPhone: bidHistory.users.phone,
        productName: bidHistory.products.name,
        productImage: JSON.parse(bidHistory.products.filenames).map(image => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0],
        productPrice: bidHistory.products.price,
        bidAt: bidHistory.createdAt,
        acceptedAt: bidHistory.acceptedAt,
        declinedAt: bidHistory.declinedAt,
        soldAt: bidHistory.soldAt,
        isAcceptable: !productAcc
      });

    } catch (err) {
      res.status(404).json({
        message: `Product with id ${req.params.id} not found`,
        errors: err.message
      });
    }
  }

}
