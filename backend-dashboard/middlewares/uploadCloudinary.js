const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Fungsi Pembuat Storage Dinamis (Factory Function)
const createUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName, // Nama folder akan menyesuaikan parameter yang dikirim
      format: async (req, file) => 'webp', 
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, 
        { quality: 80 } 
      ]
    }
  });

  return multer({ 
    storage: storage,
    limits: { 
      fileSize: 5 * 1024 * 1024 // Batas 5MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
      } else {
        cb(new Error('FORMAT_TIDAK_VALID'), false); 
      }
    }
  });
};

// 3. Eksekusi Fungsi untuk Masing-masing Kebutuhan Folder
const uploadBarang = createUploader('barang');
const uploadLaporan = createUploader('laporan_masalah');

module.exports = { 
  uploadBarang, 
  uploadLaporan, 
  cloudinary 
};