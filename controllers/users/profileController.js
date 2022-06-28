const { Users } = require('../../models');

module.exports = {
  async getUserId(req, res) {
    const user = await Users.findByPk(req.params.id, { include: ['products'] }).then((userData) => {
      if (!userData) {
        return res.status(404).json({
          status: "Failed",
          message: `User with id ${req.params.id} not found!`
        });
      }

      res.status(200).json({
        status: "Success",
        message: "OK",
        data: userData
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  },

  async editUserId(req, res) {
    const userId = req.user;
    let { name, city, address, phone } = req.body;

    //Validasi input user
    if (!(name && city && address && phone)) {
      return res.status(400).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          name: name ? undefined : "Nama harus diisi!",
          city: city ? undefined : "Kota harus diisi!",
          address: address ? undefined : "Alamat harus diisi!",
          phone: phone ? undefined : "No. Handphone harus diisi!"
        }
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          phone: "No. Handphone minimal 10 karakter"
        }
      });
    }

    const filter = /^\+?[0-9]{10,14}$/;
    if(phone.search(filter) == -1) {
      return res.status(400).json({
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          phone: "Format No. Handphone salah"
        }
      });
    }

    
    if (phone.startsWith('0')) {
      phone = `62${phone.slice(1)}`;
    }

    if (phone.startsWith('62')) {
      phone = `+${phone}`;
    }

    if (!phone.startsWith('+62')) {
      phone = `+62${phone}`;
    }
    
    const userInfo = await Users.findByPk(userId.id);

    if (userInfo.id !== req.user.id) {
      return res.status(403).json({
        message: 'Unauthorized!'
      });
    }

    await Users.update({
      name,
      city,
      address,
      phone,
      image: req.file ? req.file.filename : userInfo.image
    }, {
      where: { id: userId.id }
    }).then(() => {
      res.status(201).json({
        message: "OK",
        detail: `User with id ${userId.id} has been updated!`
      })
    }).catch((err) => {
      res.status(400).json({
        message: "Terdapat data yang tidak sesuai.",
        error: err.message
      })
    });
  }
};
