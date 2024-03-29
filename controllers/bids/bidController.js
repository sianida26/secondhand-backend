const { Products, Bids, Users } = require('../../models');
const sendEmail = require('../../services/sendEmail');

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

      return res.status(200).json({
        id: bidHistory.id,
        buyerName: bidHistory.users.name,
        buyerCity: bidHistory.users.city,
        buyerPhone: bidHistory.users.phone,
        buyerPic: bidHistory.users.profilePicUrl,
        productName: bidHistory.products.name,
        productImage: bidHistory.products.imageUrls,
        productPrice: bidHistory.products.price,
        bidPrice: bidHistory.bidPrice,
        bidAt: bidHistory.createdAt,
        acceptedAt: bidHistory.acceptedAt,
        declinedAt: bidHistory.declinedAt,
        soldAt: bidHistory.soldAt,
        isAcceptable: !(productAcc || bidHistory.declinedAt),
      });
    } catch (err) {
      return res.status(404).json({
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
        notif.push({
          id: 0,
          productName: product.name,
          productId: product.id,
          category: product.category,
          description: product.description,
          price: product.price,
          image: product.imageUrls,
          type: 'Berhasil diterbitkan',
          time: product.updatedAt,
        });

        if (product.bids != '') {
          product.bids.map((bid) => {
            if (bid.bidPrice) {
              notif.push({
                id: 0,
                productName: product.name,
                productId: product.id,
                bidId: bid.id,
                price: product.price,
                image: product.imageUrls,
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
                productId: product.id,
                bidId: bid.id,
                image: product.imageUrls,
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
                productId: product.id,
                bidId: bid.id,
                image: product.imageUrls,
                type: 'Berhasil terjual',
                bidPrice: bid.bidPrice,
                time: bid.soldAt,
              });
            }
          });
        }
      });

      myBids.rows.map((bid) => {
        notif.push({
          id: 0,
          productName: bid.products.name,
          price: bid.products.price,
          productId: bid.products.id,
          bidId: bid.id,
          image: bid.products.imageUrls,
          type: 'Anda menawar produk',
          bidPrice: bid.bidPrice,
          time: bid.createdAt,
        });

        if (bid.acceptedAt) {
          notif.push({
            id: 0,
            productName: bid.products.name,
            price: bid.products.price,
            productId: bid.products.id,
            bidId: bid.id,
            image: bid.products.imageUrls,
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
            productId: bid.products.id,
            bidId: bid.id,
            image: bid.products.imageUrls,
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

      return res.status(200).json(notif);
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
      const product = await Products.findByPk(bid.productId);
      const buyer = await Users.findByPk(bid.buyerId);
      const seller = await Users.findByPk(product.createdBy);

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
          message: 'Penawaran telah ditolak atau sudah terjual',
        });
      }

      await bid.update({
        acceptedAt: new Date(),
      });

      const emailData = {
        buyerName: buyer.name,
        sellerName: seller.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: buyer.email,
        subject: 'Penawaran Kamu Sudah Diterima',
        status: 'Diterima',
        datetime: bid.acceptedAt,
      };

      sendEmail.sendAcceptBidToBuyer(emailData.buyerName, emailData.sellerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status, emailData.datetime);

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
      const product = await Products.findByPk(bid.productId);
      const buyer = await Users.findByPk(bid.buyerId);
      const seller = await Users.findByPk(product.createdBy);

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
        buyerName: buyer.name,
        sellerName: seller.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: buyer.email,
        subject: 'Penawaran Kamu Ditolak',
        status: 'Ditolak',
        datetime: bid.acceptedAt,
      };

      sendEmail.sendRejectBidToBuyer(emailData.buyerName, emailData.sellerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status, emailData.datetime);

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
      const product = await Products.findByPk(bid.productId);
      const buyer = await Users.findByPk(bid.buyerId);
      const seller = await Users.findByPk(product.createdBy);

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
          message: 'Penawaran telah ditolak',
        });
      }

      await bid.update({
        soldAt: new Date(),
      });

      const emailData = {
        buyerName: buyer.name,
        sellerName: seller.name,
        bidId: bid.id,
        productName: product.name,
        bidPrice: bid.bidPrice,
        buyerEmail: buyer.email,
        subject: 'Pembayaran Pesanan Telah Kami Terima',
        status: 'Lunas',
        datetime: bid.acceptedAt,
      };

      sendEmail.sendInvoiceToBuyer(emailData.buyerName, emailData.sellerName, emailData.bidId, emailData.productName, emailData.bidPrice, emailData.buyerEmail, emailData.subject, emailData.status, emailData.datetime);

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

  async createBid(req, res) {
    try {
      const product = await Products.findByPk(req.body.id);
      const seller = await Users.findByPk(product.createdBy);

      //if product not found, return 404
      if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

      //if product already been sold, return 404
      if (!(await product.isBiddable())) return res.status(404).json({ message: 'Produk telah ditarik penjual atau telah berhasil terjual' });

      //if buys her product
      console.log(`Created by ${product.createdBy} and requested by ${req.user.id}`);
      if (product.createdBy == req.user.id) return res.status(403).json({ message: 'Anda tidak dapat menawar produk anda sendiri' });

      //if price is less than 0
      if (req.body.bidPrice < 0) return res.status(422).json({ errors: { bidPrice: 'Harga harus lebih dari Rp0!' } });

      const emailData = {
        buyerName: req.user.name,
        productName: product.name,
        bidPrice: req.body.bidPrice,
        sellerEmail: seller.email,
        subject: 'Kamu mendapatkan penawaran baru',
        datetime: new Date(),
      };

      sendEmail.sendNewBidNotifToSeller(emailData.buyerName, emailData.productName, emailData.bidPrice, emailData.sellerEmail, emailData.subject, emailData.datetime);

      await Bids.create({ buyerId: req.user.id, productId: req.body.id, bidPrice: req.body.bidPrice });
      return res.json({ message: 'Tawaran berhasil dibuat' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  },
};
