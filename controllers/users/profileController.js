const { ref, getDownloadURL, deleteObject, uploadBytes } = require('firebase/storage');
const { Users } = require('../../models');
const storage = require('../../services/firebase');

module.exports = {
  async getUserId(req, res) {
    const user = await Users.findByPk(req.params.id, { include: ['products'] }).then((userData) => {
      if (!userData) {
        return res.status(404).json({
          status: "Failed",
          message: `User with id ${req.params.id} not found!`
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "OK",
        data: userData
      })
    }).catch((err) => {
      return res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  },

  async editUserId(req, res) {
    try {
      const userId = req.user;
      let { name, city, address, phone } = req.body;

      // Validasi input user
      if (!(name && city && address && phone)) {
        return res.status(422).json({
          message: "Terdapat data yang tidak sesuai.",
          errors: {
            name: name ? undefined : "Nama harus diisi!",
            city: city ? undefined : "Kota harus diisi!",
            address: address ? undefined : "Alamat harus diisi!",
            phone: phone ? undefined : "No. Handphone harus diisi!"
          }
        });
      }

      const filter = /^\+?[0-9]{10,14}$/;
      if (phone.search(filter) == -1) {
        return res.status(422).json({
          message: "Terdapat data yang tidak sesuai.",
          errors: {
            phone: "Format No. Handphone salah"
          }
        });
      }

      const fixPhone = slicePhone(phone);
      const userInfo = await Users.findByPk(userId.id);

      if (req.file) {
        userInfo.image ? await deleteImageFromFirebase(userInfo.image) : false;
      }

      const imageUrls = req.file ? await uploadImageToFirebase(req.file) : userInfo.image;

      await userInfo.update({
        name,
        city,
        address,
        phone: fixPhone,
        image: imageUrls
      });

      return res.status(201).json({
        message: "OK",
        detail: `User with id ${userId.id} has been updated!`,
        image: imageUrls
      });
    } catch (err) {
      return res.status(400).json({
        message: "Terdapat data yang tidak sesuai.",
        error: err.message
      });
    }
  }
};

const slicePhone = (phone) => {
  let fixPhone = '';

  if (phone.startsWith('0')) {
    fixPhone = `62${phone.slice(1)}`;
  }

  if (phone.startsWith('62') || fixPhone.startsWith('62')) {
    fixPhone = fixPhone ? `+${fixPhone}` : `+${phone}`;
  }

  if (!phone.startsWith('+62') && !fixPhone) {
    fixPhone = `+62${phone}`;
  }

  return fixPhone;
}

const uploadImageToFirebase = async (file) => {
  const storageRef = ref(storage, `images/profiles/${Date.now()}-${file.originalname}`);
  const image = file.buffer;
  const metadata = {
    contentType: file.mimetype
  };

  const snapshot = await uploadBytes(storageRef, image, metadata);
  const url = await getDownloadURL(snapshot.ref);

  return url;
};

const deleteImageFromFirebase = async (imageUrl) => {
  try {
    // Create image ref from image url in firebase storage
    const imageRef = ref(storage, imageUrl);

    // Delete the file
    await deleteObject(imageRef);
  } catch (err) {
    console.warn(err.message);
  }
};
