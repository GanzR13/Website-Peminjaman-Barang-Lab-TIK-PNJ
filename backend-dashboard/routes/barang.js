const express = require('express');
const router = express.Router();
const multer = require('multer');
const barangController = require('../controllers/barangController');

// 1. IMPORT DISESUAIKAN: Gunakan uploadBarang dari factory function yang baru dibuat
const { uploadBarang } = require('../middlewares/uploadCloudinary'); // Sesuaikan nama file path-nya

const handleUpload = (req, res, next) => {
  // 2. PANGGIL uploadBarang
  const upload = uploadBarang.single('gambar');
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        // 3. PESAN DISESUAIKAN: Maksimal 5 MB sesuai config
        return res.status(400).json({ status: 'error', message: 'Ukuran gambar terlalu besar! Maksimal 5 MB.' });
      }
    } else if (err) {
      if (err.message === 'FORMAT_TIDAK_VALID') {
        // 4. PESAN DISESUAIKAN: Penjelasan yang lebih tepat
        return res.status(400).json({ status: 'error', message: 'Format file ditolak! Harap unggah file gambar (JPG, JPEG, PNG, WEBP).' });
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