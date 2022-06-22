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
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenPayload = jwt.verify(token, JWT_KEY);
    const { name, city, address, phone } = req.body;

    //Validasi input user
    if (!(name && city && address && phone)) {
      return res.status(400).json({
        status: "Failed",
        message: "Terdapat data yang tidak sesuai.",
        errors: {
          name: name ? undefined : "Nama harus diisi!",
          city: city ? undefined : "Kota harus diisi!",
          address: address ? undefined : "Alamat harus diisi!",
          phone: phone ? undefined : "No. Handphone harus diisi!"
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

    const userInfo = await Users.findByPk(tokenPayload.id);

    await Users.update({
      name,
      city,
      address,
      phone,
      image: req.file ? req.file.filename : userInfo.image
    }, {
      where: { id: tokenPayload.id }
    }).then(() => {
      res.status(201).json({
        status: "Success",
        message: `User with id ${tokenPayload.id} has been updated!`
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
