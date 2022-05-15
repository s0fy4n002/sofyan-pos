const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kategoriSchema = new Schema(
  {
    kategori: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kategori', kategoriSchema);
