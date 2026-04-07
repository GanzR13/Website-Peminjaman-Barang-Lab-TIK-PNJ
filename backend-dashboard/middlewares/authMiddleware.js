const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari format "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada." });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_kamu', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };