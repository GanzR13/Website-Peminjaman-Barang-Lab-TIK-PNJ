const express = require('express');
const router = express.Router();
const multer = require('multer');
const barangController = require('../controllers/barangController');
const { uploadCloud } = require('../middlewares/uploadCloudinary');

const handleUpload = (req, res, next) => {
  const upload = uploadCloud.single('gambar');
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Jika error karena ukuran file (lebih dari 1 MB)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ status: 'error', message: 'Ukuran gambar terlalu besar! Maksimal 1 MB.' });
      }
    } else if (err) {
      // Jika error karena format file bukan WEBP
      if (err.message === 'FORMAT_TIDAK_VALID') {
        return res.status(400).json({ status: 'error', message: 'Format gambar wajib .webp!' });
      }
      return res.status(500).json({ status: 'error', message: err.message });
    }
    // Jika lolos tanpa error, lanjut ke controller
    next();
  });
};

// --- DAFTAR ENDPOINT API ---

router.get('/', barangController.getAllBarang);
router.get('/:id', barangController.getBarangById);

// Terapkan fungsi pembungkus 'handleUpload' sebelum masuk ke Controller
router.post('/', handleUpload, barangController.createBarang);
router.put('/:id', handleUpload, barangController.updateBarang);
router.delete('/:id', barangController.deleteBarang);

module.exports = router;