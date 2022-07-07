const { Products, Bids } = require('../../models');
const sendEmailToBuyer = require('../../services/sendEmail');

const { Op } = require('sequelize');
const moment = require('moment');

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

  async handleGetNotifications(req, res) {
    try {
      const userId = req.user;
      const months = 2;
      const myProducts = await Products.findAndCountAll({
        where: {
          createdBy: userId.id,
          updatedAt: {
            [Op.gte]: moment().subtract(months, 'months'),
          },
        },
        include: ['bids'],
      });
      const myBids = await Bids.findAndCountAll({
        where: {
          buyerId: userId.id,
          updatedAt: {
            [Op.gte]: moment().subtract(months, 'months'),
          },
        },
        include: ['products'],
      });

      let id = 0;
      let notif = [];

      myProducts.rows.map((product) => {
        let images = product.filenames ? JSON.parse(product.filenames).map((image) => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0] : '';

        notif.push({
          id: 0,
          productName: product.name,
          price: product.price,
          image: images,
          type: 'Berhasil diterbitkan',
          time: product.updatedAt,
        });

        if (product.bids != '') {
          product.bids.map((bid) => {
            if (bid.bidPrice) {
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: 'Penawaran produk',
                bidPrice: bid.bidPrice,
                time: bid.createdAt,
              });
            }

            if (bid.declinedAt) {
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: 'Penawaran ditolak',
                bidPrice: bid.bidPrice,
                time: bid.declinedAt,
              });
            }

            if (bid.soldAt) {
              notif.push({
                id: 0,
                productName: product.name,
                price: product.price,
                image: images,
                type: 'Berhasil terjual',
                bidPrice: bid.bidPrice,
                time: bid.soldAt,
              });
            }
          });
        }
      });

      myBids.rows.map((bid) => {
        let images = bid.products.filenames ? JSON.parse(bid.products.filenames).map((image) => `https://secondhand-backend-kita.herokuapp.com/images/products/${image}`)[0] : '';

        notif.push({
          id: 0,
          productName: bid.products.name,
          price: bid.products.price,
          image: images,
          type: 'Penawaran produk',
          bidPrice: bid.bidPrice,
          time: bid.createdAt,
        });

        if (bid.acceptedAt) {
          notif.push({
            id: 0,
            productName: bid.products.name,
            price: bid.products.price,
            image: images,
            type: 'Penawaran diterima',
            bidPrice: bid.bidPrice,
            time: bid.acceptedAt,
          });
        }

        if (bid.declinedAt) {
          notif.push({
            id: 0,
            productName: bid.products.name,
            price: bid.products.price,
            image: images,
            type: 'Penawaran ditolak',
            bidPrice: bid.bidPrice,
            time: bid.declinedAt,
          });
        }
      });

      notif.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      notif.map((rows) => (rows.id = id++));

      // if (notif.length > 10) {
      //   notif = notif.slice(0, 10);
      // }

      res.status(200).json({
        data: notif,
      });
    } catch (err) {
      return res.status(403).json({
        message: '',
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

      await bid.update({
        acceptedAt: new Date(),
      });

      const emailData = {
        buyerName: req.user.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: req.user.email,
        subject: 'Penawaran Kamu Sudah Diterima',
        status: 'Diterima',
      };

      sendEmailToBuyer(emailData.buyerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status);

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

      await bid.update({
        declinedAt: new Date(),
      });

      const emailData = {
        buyerName: req.user.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: req.user.email,
        subject: 'Penawaran Kamu Ditolak',
        status: 'Ditolak',
      };

      sendEmailToBuyer(emailData.buyerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status);

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

      const emailData = {
        buyerName: req.user.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: req.user.email,
        subject: 'Pembayaran Pesanan Telah Kami Terima',
        status: 'Lunas',
      };

      sendEmailToBuyer(emailData.buyerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status);

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
