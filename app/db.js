const mongoose = require('mongoose');
const db = () => {
  const dbString = process.env.MONGODB_URI;
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const connection = mongoose.connect(dbString, dbOptions);
  connection
    .then((res) => {
      console.log('terkoneksi ke db');
    })
    .catch((err) => {
      console.log('gagal terkoneksi ke db');
    });
};
module.exports = db;
