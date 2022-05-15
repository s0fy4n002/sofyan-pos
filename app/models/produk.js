const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produkSchema = new Schema(
  {
    kategoriId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Kategori',
      unique: false,
    },
    nama: {
      type: String,
      required: true,
    },
    merk: {
      type: String,
      required: true,
    },
    hargaBeli: {
      type: Number,
      required: true,
    },
    hargaJual: {
      type: Number,
      required: true,
    },
    diskon: {
      type: Number,
    },
    stok: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Produk', produkSchema);
