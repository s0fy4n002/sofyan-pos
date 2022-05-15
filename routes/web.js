const homeController = require('../app/controllers/homeController');
const kategoriController = require('../app/controllers/kategoriController');
const produkController = require('../app/controllers/produkController');
const memberController = require('../app/controllers/memberController');
const authController = require('../app/controllers/authController');
const cloudinary = require('../app/config/cloudinary');
const upload = require('../app/config/multer');
const User = require('../app/models/user');
const bcrypt = require('bcrypt');

const init = (app) => {
  app.get('/upload', upload.single('image'), async (req, res) => {
    try {
      if (req.fileValidationError)
        return res.status(500).json(req.fileValidationError);
      // const hashpassword = await bcrypt.hash(req.body.password, 7);
      const result = await cloudinary.uploader.upload(req.file.path);
      const destroy = await cloudinary.uploader.destroy(user.cloudinary_id);
      // update = hapus yg lama masukkan yg baru

      // const user = new User({
      //   username: req.body.username,
      //   email: req.body.email,
      //   password: hashpassword,
      //   avatar: {
      //     url: result.secure_url,
      //     cloudinary_id: result.public_id,
      //   },
      // });
      const newUser = await user.save();

      return res.send(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

  function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
      return;
    }
    return next();
  }
  function toLogin(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }

  app.post('/logout', authController().logout);
  app.get('/register', toLogin, authController().register);
  app.get('/login', toLogin, authController().login);
  app.post('/register', authController().postRegister);
  app.post('/login', authController().postLogin);

  //Kategori
  app.get('/', isLoggedIn, homeController().index);
  app.get('/kategori', isLoggedIn, kategoriController().index);
  app.post('/kategori/detail', isLoggedIn, kategoriController().apiDetail);
  app.post('/kategori', isLoggedIn, kategoriController().store);
  app.delete('/kategori', isLoggedIn, kategoriController().delete);
  app.put('/kategori', isLoggedIn, kategoriController().update);
  app.get('/api/kategori', isLoggedIn, kategoriController().api);
  //Produk
  app.get('/produk', isLoggedIn, produkController().index);
  app.get('/api/produk', isLoggedIn, produkController().getAllData);
  app.post('/produk/store', isLoggedIn, produkController().store);
  app.post('/produk/detail', isLoggedIn, produkController().apiDetail);
  app.put('/produk/update', isLoggedIn, produkController().update);
  app.delete('/produk', isLoggedIn, produkController().delete);
  app.delete('/produk_selected', isLoggedIn, produkController().deleteSelected);
  app.post(
    '/produk/cetak_barcode',
    isLoggedIn,
    produkController().cetakBarcode
  );

  app.get('/member', isLoggedIn, memberController().index);
  app.get('/api/member', isLoggedIn, memberController().api);
  app.post('/member', isLoggedIn, memberController().store);
  app.post('/member/detail', isLoggedIn, memberController().apiDetail);
  app.put('/member', isLoggedIn, memberController().update);
  app.delete('/member', isLoggedIn, memberController().delete);
  app.post(
    '/member/cetak_barcode',
    isLoggedIn,
    memberController().cetakBarcode
  );

  app.get('*', function (req, res) {
    res.render('404', {
      layout: 'layouts/wrapper',
      title: 'Page not found',
    });
  });
};

module.exports = init;
