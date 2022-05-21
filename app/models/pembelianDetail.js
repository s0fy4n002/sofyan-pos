const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pembelianDetailSchema = new Schema(
  {
    pembelianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pembelian',
      unique: false,
    },
    produkId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Produk',
    },
    hargaBeli: {
      type: Number,
      required: true,
    },
    jumlah: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PembelianDetail', pembelianDetailSchema);
