var fs = require('fs');
var ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
var pdf = require('html-pdf');
var options = { format: 'A4' };
const Produk = require('./models/produk');
const Member = require('./models/member');

function formatTanggal(timestamps) {
  var date = new Date(timestamps);
  var tahun = date.getFullYear();
  var bulan = date.getMonth();
  var tanggal = date.getDate();
  var hari = date.getDay();
  var jam = date.getHours();
  var menit = date.getMinutes();
  var detik = date.getSeconds();
  switch (hari) {
    case 0:
      hari = 'Minggu';
      break;
    case 1:
      hari = 'Senin';
      break;
    case 2:
      hari = 'Selasa';
      break;
    case 3:
      hari = 'Rabu';
      break;
    case 4:
      hari = 'Kamis';
      break;
    case 5:
      hari = "Jum'at";
      break;
    case 6:
      hari = 'Sabtu';
      break;
  }
  switch (bulan) {
    case 0:
      bulan = 'Januari';
      break;
    case 1:
      bulan = 'Februari';
      break;
    case 2:
      bulan = 'Maret';
      break;
    case 3:
      bulan = 'April';
      break;
    case 4:
      bulan = 'Mei';
      break;
    case 5:
      bulan = 'Juni';
      break;
    case 6:
      bulan = 'Juli';
      break;
    case 7:
      bulan = 'Agustus';
      break;
    case 8:
      bulan = 'September';
      break;
    case 9:
      bulan = 'Oktober';
      break;
    case 10:
      bulan = 'November';
      break;
    case 11:
      bulan = 'Desember';
      break;
  }
  var tampilTanggal = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
  var tampilWaktu = 'Jam: ' + jam + ':' + menit + ':' + detik;
  return tampilTanggal;
}

function numberFormat(number, decimals, decPoint, thousandsSep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
  var dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  var s = '';

  var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec);
    return '' + (Math.round(n * k) / k).toFixed(prec);
  };

  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec);
}

const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number);
};

function formatTerbilang(angka) {
  angka = Math.floor(Math.abs(angka));
  const baca = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];
  let terbilang = '';

  if (angka < 12) {
    terbilang = ' ' + baca[angka];
  } else if (angka < 20) {
    terbilang = formatTerbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    terbilang =
      formatTerbilang(angka / 10) + ' Puluh' + formatTerbilang(angka % 10);
  } else if (angka < 200) {
    terbilang = 'Seratus' + formatTerbilang(angka - 100);
  } else if (angka < 1000) {
    terbilang =
      formatTerbilang(angka / 100) + ' Ratus' + formatTerbilang(angka % 100);
  } else if (angka < 2000) {
    terbilang = 'Seribu' + formatTerbilang(angka - 1000);
  } else if (angka < 1000000) {
    terbilang =
      formatTerbilang(angka / 1000) +
      ' Ribu' +
      formatTerbilang(angka % 1000) +
      ' Rupiah';
  } else if (angka < 1000000000) {
    terbilang =
      formatTerbilang(angka / 1000000) +
      ' Juta' +
      formatTerbilang(angka % 1000000);
  }

  return terbilang;
}

const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.privateKey,
    { expiresIn: '30d' }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.privateKey, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token is not suppiled' });
  }
};
function compile(dataUrl) {
  const filePath = path.join(
    process.cwd(),
    'resources/views/produk/generateQr.ejs'
  );
  const compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'))({
    dataUrl,
    title: 'Qrcode Page',
  });
  return compiled;
}

function compileMember(dataUrl) {
  const filePath = path.join(
    process.cwd(),
    'resources/views/member/generateQr.ejs'
  );
  const compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'))({
    dataUrl,
    title: 'Qrcode Page',
  });
  return compiled;
}

async function generateDataUrl(res, dataClient) {
  //dataUrl akan berisi banyak url QRcode dalam bentuk Array sebagai src img
  let dataUrl = [];
  for (const item of dataClient) {
    if (typeof item.id === 'object') {
      for (var id of item.id) {
        const data = await QRCode.toDataURL(id);

        const produk = await Produk.findOne({ _id: id });
        const { hargaJual, _id } = produk._doc;
        dataUrl.push({
          data,
          id: _id,
          nama: item.nama,
          hargaJual: rupiah(hargaJual),
        });
      }
    } else {
      const data = await QRCode.toDataURL(item.id);

      const produk = await Produk.findOne({ _id: item.id });
      const { hargaJual, _id } = produk._doc;
      dataUrl.push({
        data,
        id: _id,
        nama: item.nama,
        hargaJual: rupiah(hargaJual),
      });
    }
  }
  return dataUrl;
}
async function usingPuppeteer(res, dataClient) {
  const dataUrl = await generateDataUrl(res, dataClient);

  const content = compile(dataUrl);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  await page.pdf({
    path: 'public/uploads/output.pdf',
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate:
      '<div id="header-template" style="font-size:10px !important; color:#808080; padding-left:10px"><span class="date"></span><span class="title"></span><span class="url"></span><span class="pageNumber"></span><span class="totalPages"></span></div>',
    footerTemplate:
      '<div id="footer-template" style="font-size:10px !important; color:#808080; padding-left:10px"><span class="date"></span><span class="title"></span><span class="url"></span><span class="pageNumber"></span><span class="totalPages"></span></div>',
    margin: {
      top: '60px',
      bottom: '60px',
      right: '30px',
      left: '30px',
    },
  });
  console.log('done creating pdf');
  await browser.close();
  const datafile = fs.readFileSync('./public/uploads/output.pdf');
  res.header('content-type', 'application/pdf');
  return res.send(datafile);
  // process.exit();
}

async function htmlPdf(res, dataClient) {
  const dataUrl = await generateDataUrl(dataClient);
  res.render(
    'produk/generateQr',
    {
      layout: 'layouts/layoutKosong',
      title: 'Qrcode Page',
      dataUrl,
    },
    function (err, html) {
      pdf
        .create(html, options)
        .toFile('./public/uploads/demopdf.pdf', function (err, result) {
          if (err) {
            return console.log(err);
          } else {
            console.log('html-pdf');
            var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
            res.header('content-type', 'application/pdf');
            res.send(datafile);
          }
        });
    }
  );
}

async function viewHtml(res, dataClient, fileName) {
  const dataUrl = await generateDataUrlMember(dataClient);
  res.render(fileName, {
    layout: 'layouts/layoutKosong',
    title: 'Qrcode Page',
    dataUrl,
  });
}

async function generateDataUrlMember(dataClient) {
  //dataUrl akan berisi banyak url QRcode dalam bentuk Array sebagai src img
  let dataUrl = [];
  for (const item of dataClient) {
    if (typeof item.id === 'object') {
      for (var id of item.id) {
        const member = await Member.findOne({ _id: id });
        const { _id, nama, alamat, telepon } = member._doc;
        const data = await QRCode.toDataURL(
          JSON.stringify({ _id, nama, telepon })
        );
        dataUrl.push({
          data,
          id: _id,
          nama,
          alamat,
          telepon,
        });
      }
    } else {
      const member = await Member.findOne({ _id: item.id });
      const { _id, nama, alamat, telepon } = member._doc;
      const data = await QRCode.toDataURL(
        JSON.stringify({ _id, nama, telepon })
      );
      dataUrl.push({
        data,
        id: _id,
        nama,
        alamat,
        telepon,
      });
    }
  }
  return dataUrl;
}

async function usingPuppeteerMember(res, dataClient) {
  const dataUrl = await generateDataUrlMember(dataClient);
  const content = compileMember(dataUrl);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  const pdfBuffer = await page.pdf({
    // path: 'public/uploads/member.pdf',
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate:
      '<div id="header-template" style="font-size:10px !important; color:#808080; padding-left:10px"><span class="date"></span><span class="title"></span><span class="url"></span><span class="pageNumber"></span><span class="totalPages"></span></div>',
    footerTemplate:
      '<div id="footer-template" style="font-size:10px !important; color:#808080; padding-left:10px"><span class="date"></span><span class="title"></span><span class="url"></span><span class="pageNumber"></span><span class="totalPages"></span></div>',
    margin: {
      top: '60px',
      bottom: '60px',
      right: '30px',
      left: '30px',
    },
  });

  console.log('done creating pdf');
  await browser.close();
  // const datafile = fs.readFileSync('./public/uploads/member.pdf');
  res.header('Content-Type', 'application/pdf');
  res.header('Content-Disposition', 'inline');
  return res.send(pdfBuffer);
}
module.exports = {
  generateDataUrl,
  usingPuppeteer,
  compile,
  numberFormat,
  rupiah,
  formatTerbilang,
  signToken,
  isAuth,
  htmlPdf,
  viewHtml,
  formatTanggal,
  usingPuppeteerMember,
};
