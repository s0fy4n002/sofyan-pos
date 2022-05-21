const PembelianDetail = require('../models/pembelianDetail');
const Suplier = require('../models/suplier');
const Produk = require('../models/produk');
const { formatRupiah } = require('../helpers');

const pembelianDetailController = () => {
  return {
    async index(req, res) {
      const produk = await Produk.find();
      const suplier = await Suplier.findOne({ _id: req.session.suplierId });
      if (!suplier) {
        return res.redirect('/404');
      }
      const pembelianId = req.session.pembelianId;
      const suplierId = req.session.suplierId;
      res.render('pembelianDetail/index', {
        layout: 'layouts/wrapper',
        title: 'Pembelian Detail Page',
        produk,
        suplier,
        pembelianId,
        suplierId,
      });
    },
    async store(req, res) {
      try {
        const produk = await Produk.findOne({ _id: req.body.produkId });
        if (!produk) {
          return res.status(500).json('produk tidak ada');
        }
        const detail = new PembelianDetail();
        detail.pembelianId = req.body.pembelianId;
        detail.produkId = produk._id;
        detail.hargaBeli = produk.hargaBeli;
        detail.jumlah = 1;
        detail.subTotal = produk.hargaBeli;
        await detail.save();
        return res.status(201).json('Berhasil Simpan');
      } catch (error) {
        return res.status(201).json(error);
      }
    },

    async delete(req, res) {
      try {
        await PembelianDetail.findOneAndDelete({ _id: req.body.id });
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        return res.status(400).json({ message: error, success: false });
      }
    },
    async update(req, res) {
      try {
        if (req.body.jumlah < 1) {
          req.body.jumlah = 1;
        }
        let produk = await PembelianDetail.findById(req.body.id);
        const update = await PembelianDetail.findByIdAndUpdate(req.body.id, {
          jumlah: parseInt(req.body.jumlah),
          subTotal: parseInt(req.body.jumlah * produk.hargaBeli),
        });
        !update && res.json('data tidak ditemukan');

        return res.status(201).json(update);
      } catch (error) {
        return res.status(500).json(error);
      }
    },

    async data(req, res) {
      try {
        let detail = await PembelianDetail.find({
          pembelianId: req.body.pembelianId,
        })
          .populate('produkId')
          .exec();
        detail = detail.reverse().map((item, index) => {
          return {
            ...item._doc,
            hargaBeli: formatRupiah(item._doc.hargaBeli),
            subTotal: formatRupiah(item._doc.subTotal),
            index: (index += 1),
          };
        });

        return res.status(201).json({ data: detail });
      } catch (error) {
        return res.status(201).json(error);
      }
    },
  };
};

module.exports = pembelianDetailController;
