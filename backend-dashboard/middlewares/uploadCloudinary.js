const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setting Storage Cloudinary dengan Auto-Format & Resize
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skripsi_lab',
    // Instruksikan Cloudinary untuk selalu mengubah hasil akhir menjadi webp
    format: async (req, file) => 'webp', 
    // Proses manipulasi gambar langsung di server Cloudinary
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Maksimal 800x800px (tidak merusak rasio asli)
      { quality: 80 } // Kompresi kualitas menjadi 80% agar ukuran file sangat kecil
    ]
  }
});

// 3. Konfigurasi Multer
const uploadCloud = multer({ 
  storage: storage,
  limits: { 
    // Naikkan batas penerimaan mentah jadi 5MB agar kamera HP bisa masuk.
    // Jangan khawatir, hasil akhirnya di database & Cloudinary akan sangat kecil (WEBP).
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    // Izinkan semua tipe gambar standar (JPG, JPEG, PNG, WEBP) masuk untuk diproses
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); 
    } else {
      cb(new Error('FORMAT_TIDAK_VALID'), false); 
    }
  }
});

module.exports = { uploadCloud, cloudinary };