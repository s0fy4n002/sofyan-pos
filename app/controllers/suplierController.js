const Suplier = require('../models/suplier');

const suplierController = () => {
  return {
    async index(req, res) {
      res.render('suplier/index', {
        layout: 'layouts/wrapper',
        title: 'Suplier Page',
      });
    },
    async api(req, res) {
      let data = await Suplier.find();
      data = data.reverse().map((item, index) => {
        return { ...item._doc, index: index + 1 };
      });

      return res.status(201).json({ data });
    },
    async store(req, res) {
      try {
        const newData = new Suplier({
          nama: req.body.nama.toUpperCase(),
          alamat: req.body.alamat.toUpperCase(),
          telepon: req.body.telepon,
        });
        await newData.save();
        res.status(201).json('berhasil simpan');
      } catch (error) {
        res.status(300).json(error);
      }
    },
    async delete(req, res) {
      try {
        await Suplier.findOneAndDelete({ _id: req.body.id });
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, success: false });
      }
    },

    async apiDetail(req, res) {
      const suplier = await Suplier.findById(req.body.id);
      !suplier && res.json('data tidak ditemukan');
      res.status(201).json(suplier);
      return;
    },
    async update(req, res) {
      const suplier = await Suplier.findByIdAndUpdate(req.body.id, {
        nama: req.body.nama.toUpperCase(),
        alamat: req.body.alamat.toUpperCase(),
        telepon: req.body.telepon,
      });
      !suplier && res.json('data tidak ditemukan');
      res.status(201).json('berhasil Update');
      return;
    },
  };
};

module.exports = suplierController;
