const Kategori = require('../models/kategori');
const Produk = require('../models/produk');

const kategoriController = () => {
  return {
    async api(req, res) {
      let data = await Kategori.find();
      data = data.reverse().map((item, index) => {
        return { ...item._doc, index: index + 1 };
      });

      return res.status(201).json({ data });
    },
    async store(req, res) {
      try {
        const newKate = new Kategori({
          kategori: req.body.kategori.toUpperCase(),
        });
        await newKate.save();
        res.status(201).json('berhasil simpan');
      } catch (error) {
        res.status(300).json(error._message);
      }
    },
    async delete(req, res) {
      try {
        const produk = await Produk.find();
        const bentrok = produk.find((p) => p.kategoriId == req.body.id);
        if (bentrok) {
          throw (
            'Masih Ada produk yang memakai Kategori Ini. Hapus Produk ' +
            bentrok.nama
          );
        }
        await Kategori.findOneAndDelete({ _id: req.body.id });
        res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, success: false });
      }
    },

    async index(req, res) {
      res.render('kategori/index', {
        layout: 'layouts/wrapper',
        title: 'Kategori Page',
      });
    },
    async apiDetail(req, res) {
      const kategori = await Kategori.findById(req.body.id);
      !kategori && res.json('data tidak ditemukan');
      res.status(201).json(kategori);
      return;
    },
    async update(req, res) {
      const kategori = await Kategori.findByIdAndUpdate(req.body.id, {
        kategori: req.body.kategori,
      });
      !kategori && res.json('data tidak ditemukan');
      res.status(201).json('berhasil Update');
      return;
    },
  };
};

module.exports = kategoriController;
