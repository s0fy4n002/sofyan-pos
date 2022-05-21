const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pengeluaranSchema = new Schema(
  {
    deskripsi: {
      type: String,
      required: true,
    },
    nominal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pengeluaran', pengeluaranSchema);
