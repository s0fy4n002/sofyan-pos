const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suplierSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    telepon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Suplier', suplierSchema);
