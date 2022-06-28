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
        bidPrice: bidHistory.bidPrice,
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
  },

  async handleGetNotifications(req, res) {
    try {
      const userId = req.user;
      const myProducts = await Products.findAndCountAll({
        where: { createdBy: userId.id },
        include: ['bids']
      });
      const myBids = await Bids.findAndCountAll({
        where: { buyerId: userId.id },
        include: ['products']
      });

      // myProducts.rows.sort((a, b) => {
      //   if (a.bids != '' && b.bids != '') {
      //     return new Date(b.bids.updatedAt).getTime() - new Date(a.bids.updatedAt).getTime()
      //   }
      //   if (a.bids != '') {
      //     return new Date(b.updatedAt).getTime() - new Date(a.bids.updatedAt).getTime()
      //   }
      //   if (b.bids != '') {
      //     return new Date(b.bids.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      //   }
      //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      // });

      let id = 0;
      let notif = [];

      myProducts.rows.map((product) => {
        let images = product.filenames ? JSON.parse(product.filenames).map(image => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0] : "";

        notif.push({
          id: 0,
          productName: product.name,
          price: product.price,
          image: images,
          type: "Berhasil diterbitkan",
          time: product.updatedAt
        });

        if (product.bids != '') {
          product.bids.map((bid) => {
            if (bid.bidPrice) {
              // && !bid.declinedAt && !bid.soldAt
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: "Penawaran Produk",
                bidPrice: bid.bidPrice,
                time: bid.createdAt
              });
            }

            if (bid.declinedAt) {
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: "Penawaran ditolak",
                bidPrice: bid.bidPrice,
                time: bid.declinedAt
              });
            }

            if (bid.soldAt) {
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: "Berhasil Terjual",
                bidPrice: bid.bidPrice,
                time: bid.soldAt
              });
            }
          });
        }

      });

      myBids.rows.map((bid) => {
        let images = bid.products.filenames ? JSON.parse(bid.products.filenames).map(image => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0] : "";

        if (bid.acceptedAt) {
          notif.push({
            id: 0,
            productName: bid.products.name,
            price: bid.products.price,
            image: images,
            type: "Penawaran Produk",
            bidPrice: bid.bidPrice,
            time: bid.acceptedAt
          });
        }

        if (bid.declinedAt) {
          notif.push({
            id: 0,
            productName: bid.products.name,
            price: bid.products.price,
            image: images,
            type: "Penawaran ditolak",
            bidPrice: bid.bidPrice,
            time: bid.declinedAt
          })
        }

      });

      notif.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      notif.map(rows => rows.id = id++);

      if (notif.length > 10) {
        notif = notif.slice(0, 10);
      }

      res.status(200).json({
        data: notif,
        // asd: myProducts.rows[2].bids.bidPrice ? true : false
      });

    } catch (err) {
      return res.status(403).json({
        message: ``,
        errors: err.message
      })
    }
  }

}
