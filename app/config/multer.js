const multer = require('multer');
const path = require('path');

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    // let ext = path.extname(file.originalname);
    // if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    //   req.fileValidationError = 'hanya upload gambar ya';
    //   cb(null, false, new Error('File type is not supported'));
    //   return;
    // }
    cb(null, true);
  },
});
