const Pengeluaran = require('../models/pengeluaran');
const { formatTanggal, formatRupiah } = require('../helpers');

const pengeluaranController = () => {
  return {
    async index(req, res) {
      res.render('pengeluaran/index', {
        layout: 'layouts/wrapper',
        title: 'Pengeluaran Page',
      });
    },
    async api(req, res) {
      let data = await Pengeluaran.find();
      data = data.reverse().map((item, index) => {
        return {
          ...item._doc,
          index: index + 1,
          nominal: formatRupiah(item._doc.nominal),
          createdAt: formatTanggal(item._doc.createdAt),
        };
      });

      return res.status(201).json({ data });
    },
    async store(req, res) {
      try {
        const newData = new Pengeluaran({
          deskripsi: req.body.deskripsi.toUpperCase(),
          nominal: req.body.nominal,
        });
        await newData.save();
        res.status(201).json('berhasil simpan');
      } catch (error) {
        res.status(300).json(error);
      }
    },
    async delete(req, res) {
      try {
        await Pengeluaran.findOneAndDelete({ _id: req.body.id });
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, success: false });
      }
    },

    async apiDetail(req, res) {
      let data = await Pengeluaran.findById(req.body.id);
      !data && res.json('data tidak ditemukan');
      res.status(201).json(data);
      return;
    },
    async update(req, res) {
      const data = await Pengeluaran.findByIdAndUpdate(req.body.id, {
        deskripsi: req.body.deskripsi.toUpperCase(),
        nominal: req.body.nominal,
      });
      !data && res.json('data tidak ditemukan');
      res.status(201).json('berhasil Update');
      return;
    },
  };
};

module.exports = pengeluaranController;
