const { Products, Bids } = require('../../models');
const { Op } = require('sequelize');

const storage = require('../../services/firebase');
const { ref, deleteObject } = require('firebase/storage');

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

  async handleGetProductById(req, res) {
    try {
      const productId = await Products.findOne({ where: { id: req.params.id }, include: ['users'] });

      res.status(200).json({
        id: productId.id,
        name: productId.name,
        images: productId.imageUrls,
        category: productId.category,
        description: productId.description,
        seller: {
          name: productId.users.name,
          city: productId.users.city,
          profilePicture: productId.users.profilePicUrl,
        },
        price: productId.price,
      });
    } catch (err) {
      res.status(404).json({
        message: `Product with id ${req.params.id} not found`,
        errors: err.message,
      });
    }
  },

  async handleGetProductByIdForBuyer(req, res) {
    try {
      const product = await Products.findOne({ where: { id: req.params.id }, include: ['users'] });
      
      //return 404 if not found
      if (!product) return res.status(404).json({ message: `Produk dengan id ${ req.params.id } tidak ditemukan` });

      //return 403 if requesting his own product
      if (product.users.id === req.user?.id) return res.status(403).json({ message: `Anda tidak dapat memesan produk anda sendiri` });

      const productBids = await product.getBids();
      const isBiddable = await product.isBiddable();
      
      let bidStatus = "BIDDABLE";
      //if logged in
      if (req.isLoggedIn){
        const buyerBid = productBids.find(bid => bid.buyerId === req.user.id)
        //return this product status if bid available
        if (buyerBid){
          bidStatus = buyerBid.soldAt ? "TRANSACTION_COMPLETED"
            : buyerBid.declinedAt ? "TRANSACTION_DECLINED"
            : buyerBid.acceptedAt ? "TRANSACTION_ACCEPTED"
            : "WAITING_CONFIRMATION"
        }
        //return 404 if product is not biddable (either any other bids accepter or completed) 
        else if (!isBiddable) return res.status(404).json({ message: `Produk dengan id ${ req.params.id } tidak tersedia.` });
      } else {
        //return 404 if product is not biddable (either any other bids accepter or completed) 
        if (!isBiddable) return res.status(404).json({ message: `Produk dengan id ${ req.params.id } tidak tersedia.` });
      }

      res.status(200).json({
        id: product.id,
        name: product.name,
        images: product.imageUrls,
        category: product.category,
        description: product.description,
        seller: {
          name: product.users.name,
          city: product.users.city,
          profilePicture: product.users.profilePicUrl,
        },
        price: product.price,
        status: bidStatus,
      });
    } catch (err) {
      res.status(500).json({
        message: `Terjadi kesalahan pada server`,
        errors: err.message,
      });
    }
  },

  async handleListMyProducts(req, res) {
    try {
      const userId = req.user;
      const myProducts = await Products.findAndCountAll({
        where: {
          createdBy: userId.id,
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

        products.push({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.imageUrls,
        });

        if (product.bids != '') {
          product.bids.map((bid) => {
            if (bid.bidPrice && !bid.soldAt) {
              interestedProducts.push({
                id: bid.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.imageUrls,
                buyerName: bid.users.name,
                bidPrice: bid.bidPrice,
                bidTimestamp: bid.createdAt,
              });
            }

            if (bid.soldAt) {
              soldProducts.push({
                id: bid.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.imageUrls,
                buyerName: bid.users.name,
                bidPrice: bid.bidPrice,
                bidTimestamp: bid.createdAt,
                soldTimestamp: bid.soldAt,
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

  async deleteProduct(req, res, next) {
    const product = await Products.findByPk(req.params.id);

    // Delete image from firebase storage
    product.imageUrls.map(async (imgUrl) => {
      try {
        // Create image ref from image url in firebase storage
        const imageRef = ref(storage, imgUrl);

        // Delete the file
        await deleteObject(imageRef);
      } catch (err) {
        console.warn(err.message);
      }
    });

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
          image: product.imageUrls,
          price: product.price,
        }))
    );
  },
};
