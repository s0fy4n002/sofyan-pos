const Pembelian = require('../models/pembelian');
const Suplier = require('../models/suplier');
const { formatTanggal } = require('../helpers');

const pembelianController = () => {
  return {
    async create(req, res) {
      try {
        const newPembelian = new Pembelian({
          suplierId: req.body.id,
          totalItem: 0,
          totalHarga: 0,
          diskon: 0,
          bayar: 0,
        });
        const pembelian = await newPembelian.save();
        req.session.pembelianId = pembelian._id;
        req.session.suplierId = pembelian.suplierId;

        return res.status(201).json({ success: true });
      } catch (error) {
        return res.status(500).json(error);
      }
    },
    async index(req, res) {
      const suplier = await Suplier.find();
      res.render('pembelian/index', {
        layout: 'layouts/wrapper',
        title: 'Pembelian Page',
        suplier,
      });
    },
    async api(req, res) {
      try {
        let data = await Pembelian.find().populate('suplierId').exec();
        data = data.reverse().map((item, index) => {
          return {
            ...item._doc,
            index: index + 1,
            createdAt: formatTanggal(item._doc.createdAt),
          };
        });

        return res.status(201).json({ data });
      } catch (error) {
        return res.status(500).json(error);
      }
    },

    async delete(req, res) {
      try {
        await Pembelian.findOneAndDelete({ _id: req.body.id });
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        return res.status(400).json({ message: error, success: false });
      }
    },

    async update(req, res) {
      const data = await Pembelian.findByIdAndUpdate(req.body.id, {
        deskripsi: req.body.deskripsi.toUpperCase(),
        nominal: req.body.nominal,
      });
      !data && res.json('data tidak ditemukan');
      res.status(201).json('berhasil Update');
      return;
    },
  };
};

module.exports = pembelianController;
