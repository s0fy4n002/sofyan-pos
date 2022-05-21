const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pembelianSchema = new Schema(
  {
    suplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Suplier',
      unique: true,
    },
    totalItem: {
      type: Number,
      required: true,
    },
    totalHarga: {
      type: Number,
      required: true,
    },
    diskon: {
      type: Number,
      required: true,
    },
    bayar: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pembelian', pembelianSchema);
