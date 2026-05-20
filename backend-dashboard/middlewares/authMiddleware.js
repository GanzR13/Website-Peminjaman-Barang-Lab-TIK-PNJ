const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Pastikan path model ini sesuai dengan struktur foldermu

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari format "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada." });
  }

  // Ubah callback menjadi async agar kita bisa melakukan operasi database (await)
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_kamu', async (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau sudah kadaluwarsa." });
    }

    try {
      // 1. Ambil data user terbaru langsung dari database
      const currentUser = await User.findByPk(decodedUser.id);

      // 2. Cek apakah user masih ada di database
      if (!currentUser) {
        return res.status(404).json({ message: "Sesi tidak valid, akun tidak ditemukan." });
      }

      // 3. Cek status verifikasi email (Mendukung tipe data PostgreSQL/MySQL)
      const isVerified = currentUser.email_verified === true || 
                         currentUser.email_verified === 1 || 
                         currentUser.email_verified === '1' || 
                         currentUser.email_verified === 'true';

      // 4. Blokir akses jika belum diverifikasi
      if (!isVerified) {
        return res.status(403).json({ 
            message: "Akses ditolak. Email Anda belum diverifikasi atau telah dibatalkan." 
        });
      }

      // 5. Jika lolos semua pengecekan, teruskan data user terbaru ke endpoint selanjutnya
      req.user = currentUser;
      next();

    } catch (dbError) {
      console.error("Auth Middleware Error:", dbError);
      return res.status(500).json({ message: "Terjadi kesalahan server saat memverifikasi sesi." });
    }
  });
};

module.exports = { authenticateToken };