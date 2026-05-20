const { body, validationResult } = require('express-validator');

// Middleware untuk menangkap error dari express-validator
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validasi data gagal.',
      // Hanya mengembalikan pesan error pertama agar respon lebih bersih di frontend
      errors: errors.array()[0].msg 
    });
  }
  next();
};

// ==========================================
// VALIDATOR: LOGIN
// ==========================================
const validateLogin = [
  body('email').trim().isEmail().withMessage('Format email tidak valid.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
  body('portal').optional().isIn(['admin', 'user']).withMessage('Portal tidak valid.'),
  checkValidation
];

// ==========================================
// VALIDATOR: REGISTRASI
// ==========================================
const validateRegister = [
  body('nama_lengkap').trim().notEmpty().withMessage('Nama lengkap wajib diisi.'),
  body('email').trim().isEmail().withMessage('Format email tidak valid.'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
  body('no_telepon').notEmpty().withMessage('Nomor telepon wajib diisi.')
    .isNumeric().withMessage('Nomor telepon hanya boleh berisi angka.'),
  body('role_id').notEmpty().withMessage('Role ID wajib ditentukan.'),
  
  // Validasi bersyarat untuk MAHASISWA (role_id === '5')
  body('nim').if(body('role_id').equals('5'))
    .notEmpty().withMessage('NIM wajib diisi untuk mahasiswa.')
    .isLength({ min: 10, max: 11 }).withMessage('NIM PNJ harus 10 atau 11 digit.'),
  body('angkatan').if(body('role_id').equals('5'))
    .notEmpty().withMessage('Tahun angkatan wajib diisi.')
    .isNumeric().withMessage('Angkatan harus berupa angka tahun (contoh: 2022).'),
  body('prodi_id').if(body('role_id').equals('5'))
    .notEmpty().withMessage('Program Studi wajib dipilih.'),
  body('kelas_id').if(body('role_id').equals('5'))
    .notEmpty().withMessage('Kelas wajib dipilih.'),
    
  // Validasi bersyarat untuk DOSEN / PEGAWAI (role_id !== '5')
  body('nip').if(body('role_id').not().equals('5'))
    .notEmpty().withMessage('NIP wajib diisi untuk dosen/pegawai.')
    .isLength({ min: 9, max: 18 }).withMessage('Format NIP tidak valid.'),

  checkValidation
];

// ==========================================
// VALIDATOR: LUPA KATA SANDI
// ==========================================
const validateForgotPassword = [
  body('email').trim().isEmail().withMessage('Format email tidak valid. Pastikan email terdaftar.'),
  checkValidation
];

// ==========================================
// VALIDATOR: RESET KATA SANDI
// ==========================================
const validateResetPassword = [
  body('token').notEmpty().withMessage('Token reset kata sandi tidak ditemukan atau tidak valid.'),
  body('new_password').isLength({ min: 6 }).withMessage('Kata sandi baru minimal 6 karakter.'),
  checkValidation
];

module.exports = { 
  validateLogin, 
  validateRegister,
  validateForgotPassword,
  validateResetPassword
};