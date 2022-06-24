const { getProduct, getProductbyId, getMyProduct, getMyProductbyId, handleCreateProduct, handleEditProductById } = require('./product');
const product = require('./productController');

module.exports = {
  product,
  getProduct,
  getProductbyId,
  getMyProduct,
  getMyProductbyId,
  handleCreateProduct,
  handleEditProductById,
};
