const express = require('express');
const router = express.Router();
const multer = require('multer');
const barangController = require('../controllers/barangController');
const { uploadBarang } = require('../middlewares/uploadCloudinary');

const handleUpload = (req, res, next) => {
 
  const upload = uploadBarang.single('gambar');
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ status: 'error', message: 'Ukuran gambar terlalu besar! Maksimal 5 MB.' });
      }
    } else if (err) {
      if (err.message === 'FORMAT_TIDAK_VALID') {
        return res.status(400).json({ status: 'error', message: 'Format file ditolak! Harap unggah file gambar (JPG, JPEG, PNG, WEBP).' });
      }
      return res.status(500).json({ status: 'error', message: err.message });
    }
    next();
  });
};

// Route CRUD Barang
router.get('/', barangController.getAllBarang);
router.get('/:id', barangController.getBarangById);
router.post('/', handleUpload, barangController.createBarang);
router.put('/:id', handleUpload, barangController.updateBarang);
router.delete('/:id', barangController.deleteBarang);

module.exports = router;