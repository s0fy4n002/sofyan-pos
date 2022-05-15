const Kategori = require('../models/kategori');
const Produk = require('../models/produk');
const User = require('../models/user');
const Member = require('../models/member');

const homeController = () => {
  return {
    async index(req, res) {
      let kategori = await Kategori.find();
      let produk = await Produk.find();
      let users = await User.find();
      let member = await Member.find();
      res.render('home', {
        layout: 'layouts/wrapper',
        title: 'Home Page',

        kategori,
        produk,
        users,
        member,
      });
    },
  };
};

module.exports = homeController;
