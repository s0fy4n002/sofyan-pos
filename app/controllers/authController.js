const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController = () => {
  const _getRedirectUrl = (req) => {
    return req.user.role === 'admin' ? '/' : '/';
  };
  return {
    login(req, res) {
      res.render('user/login', {
        layout: 'layouts/user-layout',
        title: 'Login',
      });
    },
    register(req, res) {
      res.render('user/register', {
        layout: 'layouts/user-layout',
        title: 'Register',
        username: null,
        email: null,
        password: null,
      });
    },
    async postRegister(req, res) {
      try {
        const { username, email, password } = req.body;
        if (password.length < 5) {
          return res
            .status(500)
            .json({ message: 'password minimal 5 karakter' });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
          return res.status(500).json({ message: 'user sudah terdaftar' });
        }
        const hashpassword = await bcrypt.hash(password, 7);
        const user = new User({ username, email, password: hashpassword });
        const newUser = await user.save();
        if (!newUser) {
          throw new Error('gagal insert user karna jaringan Internet');
        }
        return res.status(201).json({ message: 'berhasil register' });
      } catch (error) {
        return res.status(500).json(error);
      }
    },
    async postLogin(req, res, next) {
      passport.authenticate('local', async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(500).json({ message: 'user/password salah' });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.status(201).json({ message: 'berhasil', success: true });
        });
      })(req, res, next);
    },
    async logout(req, res) {
      req.logout();
      return res.redirect('/login');
    },
  };
};

module.exports = authController;
