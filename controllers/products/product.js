const { ref, getDownloadURL, deleteObject, uploadBytes } = require('firebase/storage');
const { Products } = require('../../models');
const storage = require('../../services/firebase');
const Validator = require('../../utils/Validator');

module.exports = {
  async getMyProduct(req, res) {
    const myProducts = await Products.findAndCountAll({ where: { createdBy: req.params.id } })
      .then((allMyProducts) => {
        res.status(200).json({
          status: 'Success',
          data: allMyProducts.rows,
          count: allMyProducts.count,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async getMyProductbyId(req, res) {
    const myProductId = await Products.findOne({
      where: {
        id: req.params.id,
        createdBy: req.params.user,
      },
    })
      .then((productId) => {
        return res.status(200).json({
          status: 'Success',
          data: productId,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: 'Failed',
          message: err.message,
        });
      });
  },

  async handleCreateProduct(req, res) {
    try {
      const { name, price, category, description } = req.body;

      const rules = Validator.rules;
      const validator = new Validator(
        {
          name,
          price,
          category,
          description,
          files: req.files,
        },
        {
          name: [rules.required(), rules.max(255)],
          price: [rules.required(), rules.number(), rules.min(0)],
          category: [rules.required(), rules.max(255)],
          description: [rules.required()],
          files: [rules.array(), rules.max(4)],
        }
      );

      if (req.files.length == 0) {
        return res.status(422).json({
          message: 'Semua Input harus diisi',
          errors: {
            files: 'Harus menyertakan setidaknya 1 gambar!',
          },
        });
      }

      if (validator.fails()) {
        return res.status(422).json({
          message: 'Ada data yang tidak sesuai.',
          errors: validator.getErrors(),
        });
      }

      // Uploading Image to firebase storage
      console.log('waktunya upload');
      const imageUrls = await uploadImageToFirebase(req);
      console.log('sudah selesai upload');

      await Products.create({
        name,
        price,
        category,
        description,
        imageUrls,
        createdBy: req.user.id,
      });

      return res.status(200).json({
        message: 'Produk berhasil diterbitkan',
        imageUrls,
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },

  async handleEditProductById(req, res) {
    try {
      const { name, price, category, description, oldFileUrls } = req.body;
      const product = await Products.findByPk(req.params.id);

      const rules = Validator.rules;
      const validator = new Validator(
        {
          name,
          price,
          category,
          description,
          // files: req.files,
        },
        {
          name: [rules.required(), rules.max(255)],
          price: [rules.required(), rules.number(), rules.min(0)],
          category: [rules.required(), rules.max(255)],
          description: [rules.required()],
          // files: [rules.array(), rules.max(4)],
        }
      );

      if (product.createdBy != req.user.id) {
        return res.status(403).json({
          message: 'Unauthorized',
        });
      }

      if (req.files.length == 0) {
        return res.status(422).json({
          message: 'Semua Input harus diisi',
        });
      }

      if (validator.fails()) {
        return res.status(422).json({
          message: 'Ada data yang tidak sesuai.',
          errors: validator.getErrors(),
        });
      }

      console.log('oldFIleUrls', req.body.oldFileUrls)

      if (!(req.files || req.body.oldFileUrls?.length === 0)){
        return res.status(422).json({
          message: 'Ada data yang tidak sesuai.',
          errors: {
            file: 'Harus menyertakan setidaknya 1 file!'
          }
        })
      }

      // Delete and upload new image urls
      await deleteImageFromFirebase(product.imageUrls.filter(url => req.body.oldFileUrls?.includes(url)));
      const imageUrls = await uploadImageToFirebase(req);

      await product.update({
        name,
        price,
        category,
        description,
        imageUrls: [...product.imageUrls.filter(url => !req.body.oldFileUrls?.includes(url)), ...imageUrls],
        createdBy: req.user.id,
      });

      return res.status(200).json({
        message: 'Produk berhasil diedit',
      });
    } catch (err) {
      return res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  },
};

const uploadImageToFirebase = async (req) => {
  try {
    let imageUrls = [];

    await Promise.all(
      req.files.map(async (e, i) => {
        console.log('Upload file yang ke ', i);
        const file = e.buffer;
        const storageRef = ref(storage, `images/products/${Date.now()}-${e.originalname}`);

        const metadata = {
          contentType: e.mimetype,
        };

        console.log('Upload bytes yang ke ', i);
        const snapshot = await uploadBytes(storageRef, file, metadata);
        console.log('GetDownloadURL yang ke ', i);
        const url = await getDownloadURL(snapshot.ref);
        console.log('selesai GetDownloadURL yang ke ', i);
        imageUrls.push(url);
      })
    );

    return imageUrls;
  } catch (err) {
    console.warn(err.message);
  }
};

const deleteImageFromFirebase = async (imageUrls) => {
  try {
    imageUrls.map(async (imgUrl) => {
      // Create image ref from image url in firebase storage
      const imageRef = ref(storage, imgUrl);

      // Delete the file
      await deleteObject(imageRef);
    });
  } catch (err) {
    console.warn(err.message);
  }
};
