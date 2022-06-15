const { tb_users } = require('../../models');

module.exports = {
  async getUserId(req, res) {
    const user = await tb_users.findByPk(req.params.id).then((userData) => {
      res.status(200).json({
        status: "Success",
        data: userData
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: `User with id ${req.params.id} not found!`
      });
    }
  },

  async editUserId(req, res) {
    const { name, city, address, phone } = req.body;
    
    const userName = await tb_users.findOne({ where: { name: name } });
    if (userName) {
      // throw new Error('User already exist');
      return res.status(400).json({
        status: "Failed",
        message: "Name already exist!"
      });
    }

    const userPhone = await tb_users.findOne({ where: { phone: phone } });
    if (userPhone) {
      return res.status(400).json({
        status: "Failed",
        message: "Phone already exist!"
      });
    }

    await tb_users.update({
      name,
      city,
      address,
      phone
    }, {
      where: { id: req.params.id}
    }).then(() => {
      res.status(200).json({
        status: "Success",
        message: `User with id ${req.params.id} has been updated!`
      })
    }).catch((err) => {
      res.status(400).json({
        status: "Failed",
        message: err.message
      })
    });
  }
}