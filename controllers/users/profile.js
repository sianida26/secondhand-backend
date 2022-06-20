const { Users } = require('../../models');

module.exports = {
  async getUserId(req, res) {
    const user = await Users.findByPk(req.params.id).then((userData) => {
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
    const { name, city, address, phone, filenames } = req.body;
    if (!name || !city || !address || !phone) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          name: name ? "" : "Nama harus diisi!",
          city: city ? "" : "Kota harus diisi!",
          address: address ? "" : "Alamat harus diisi!",
          phone: phone ? "" : "No. Handphone harus diisi!"
        }
      });
    }

    if (phone.length < 9) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "No. Handphone minimal 9 karakter"
      });
    }

    const userInfo = await Users.findOne({ where: { id: req.params.id } });
    if (userInfo.name && userInfo.name != name) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "Nama sudah ada!"
      });
    }

    if (userInfo.phone && userInfo.phone != phone) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: "No. Handphone sudah ada!"
      });
    }

    await Users.update({
      name,
      city,
      address,
      phone,
      filenames
    }, {
      where: { id: req.params.id}
    }).then(() => {
      res.status(201).json({
        status: "Success",
        message: `User with id ${req.params.id} has been updated!`
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        error: err.message
      })
    });
  }
};
