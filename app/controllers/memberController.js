const { usingPuppeteerMember, viewHtml } = require('../helpers');
const Member = require('../models/member');

const memberController = () => {
  return {
    async cetakBarcode(req, res) {
      const dataClient = Object.entries(req.body).map((item) => {
        return { nama: item[0], id: item[1] };
      });
      return usingPuppeteerMember(res, dataClient);
    },
    async index(req, res) {
      res.render('member/index', {
        layout: 'layouts/wrapper',
        title: 'Member Page',
      });
    },
    async api(req, res) {
      let data = await Member.find();
      data = data.reverse().map((item, index) => {
        return { ...item._doc, index: index + 1 };
      });

      return res.status(201).json({ data });
    },
    async store(req, res) {
      try {
        const newData = new Member({
          nama: req.body.nama.toUpperCase(),
          alamat: req.body.alamat.toUpperCase(),
          telepon: req.body.telepon,
        });
        await newData.save();
        res.status(201).json('berhasil simpan');
      } catch (error) {
        res.status(300).json(error._message);
      }
    },
    async delete(req, res) {
      try {
        await Member.findOneAndDelete({ _id: req.body.id });
        return res.status(201).json('berhasil Hapus');
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, success: false });
      }
    },

    async apiDetail(req, res) {
      const member = await Member.findById(req.body.id);
      !member && res.json('data tidak ditemukan');
      res.status(201).json(member);
      return;
    },
    async update(req, res) {
      const member = await Member.findByIdAndUpdate(req.body.id, {
        nama: req.body.nama.toUpperCase(),
        alamat: req.body.alamat.toUpperCase(),
        telepon: req.body.telepon,
      });
      !member && res.json('data tidak ditemukan');
      res.status(201).json('berhasil Update');
      return;
    },
  };
};

module.exports = memberController;
