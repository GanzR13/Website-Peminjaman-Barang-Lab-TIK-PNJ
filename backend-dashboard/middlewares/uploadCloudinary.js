const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setting Storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skripsi_lab',
    allowed_formats: ['webp'], // Paksa Cloudinary hanya menerima webp
  }
});

// 3. Konfigurasi Multer dengan Filter & Limit
const uploadCloud = multer({ 
  storage: storage,
  limits: { 
    fileSize: 1 * 1024 * 1024 // Batas maksimal 1 MB (dalam bytes)
  },
  fileFilter: (req, file, cb) => {
    // Pengecekan tipe file dari sisi server sebelum diupload
    if (file.mimetype === 'image/webp') {
      cb(null, true); // Lolos filter
    } else {
      // Tolak dengan mengirimkan pesan error khusus
      cb(new Error('FORMAT_TIDAK_VALID'), false); 
    }
  }
});

module.exports = { uploadCloud, cloudinary };