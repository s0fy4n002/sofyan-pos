const Produk = require('../models/produk');
const Kategori = require('../models/kategori');
const { usingPuppeteer, viewHtml } = require('../helpers');

const produkController = () => {
  return {
    async cetakBarcode(req, res) {
      const dataClient = Object.entries(req.body).map((item) => {
        return { nama: item[0], id: item[1] };
      });

      // viewHtml(res, dataClient);
      // return;
      usingPuppeteer(res, dataClient);
    },
    async getAllData(req, res) {
      try {
        let data = await Produk.find().populate('kategoriId').exec();
        if (data) {
          var { rupiah } = req.app.get('helpers');
          data = data.reverse().map((item, index) => {
            return {
              ...item._doc,
              index: index + 1,
              hargaBeli: rupiah(item.hargaBeli),
              hargaJual: rupiah(item.hargaJual),
            };
          });
        }

        return res.status(201).json({ data });
      } catch (error) {
        return res.status(500).json({ error });
      }
    },

    async index(req, res) {
      const categories = await Kategori.find();
      res.render('produk/index', {
        layout: 'layouts/wrapper',
        title: 'Produk Page',
        categories,
      });
    },

    async store(req, res) {
      console.log(req.body);

      try {
        const produk = new Produk({
          nama: req.body.nama.toUpperCase(),
          kategoriId: req.body.kategoriId,
          merk: req.body.merk,
          hargaBeli: req.body.hargaBeli,
          hargaJual: req.body.hargaJual,
          diskon: req.body.diskon,
          stok: req.body.stok,
        });
        await produk.save();
        res.status(201).json('berhasil simpan');
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    },
    async delete(req, res) {
      console.log(req.body);
      try {
        const hapus = await Produk.findByIdAndDelete({ _id: req.body.id });
        if (!hapus) {
          throw new Error('Gagal Menghapus');
        }
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log({ error });
        res.status(500).json(error);
      }
    },
    async deleteSelected(req, res) {
      try {
        req.body.forEach(async (item) => {
          await Produk.findByIdAndDelete({ _id: item });
        });

        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log({ error });
        res.status(500).json(error);
      }
    },

    async apiDetail(req, res) {
      const produk = await Produk.findById(req.body.id);
      !produk && res.json('data tidak ditemukan');
      res.status(201).json(produk);
    },
    async update(req, res) {
      const produk = await Produk.findByIdAndUpdate(req.body.id, {
        nama: req.body.nama,
        kategoriId: req.body.kategoriId,
        merk: req.body.merk,
        stok: req.body.stok,
        hargaJual: req.body.hargaJual,
        hargaBeli: req.body.hargaBeli,
        diskon: req.body.diskon,
      });
      !produk && res.json('data tidak ditemukan');
      return res.status(201).json('berhasil Update');
    },
  };
};

module.exports = produkController;
