const cookieSession = require('cookie-session');
const path = require('path');
const express = require('express');
const app = express();
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const expressLayout = require('express-ejs-layouts');
const init = require('./routes/web');
const db = require('./app/db');
var cors = require('cors');
const { formatTerbilang, rupiah, formatTanggal } = require('./app/helpers');
require('dotenv').config();
var cookieParser = require('cookie-parser');
const passport = require('passport');
const initPassport = require('./app/config/passport');
const session = require('express-session');

app.use(
  cors({
    origin: [
      'http://192.168.100.27:3000',
      'http://localhost:3000',
      'https://pos-nodejs.vercel.app/',
      'https://sofyanpos.herokuapp.com',
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: 'test',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 48,
    },
  })
);
app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('helpers', { rupiah, formatTerbilang, formatTanggal });
app.set('eventEmitter', eventEmitter);

const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));
app.use(expressLayout);
app.use(express.static(__dirname + '/public'));

db();
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.formatTanggal = formatTanggal;
  res.locals.formatTerbilang = formatTerbilang;
  next();
});
init(app);

app.listen(PORT, () => console.log(`server is running on port :${PORT}`));
