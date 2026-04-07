const { body, validationResult } = require('express-validator');

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validasi data gagal.',
      errors: errors.array()
    });
  }
  next();
};

const validateLogin = [
  body('email').isEmail().withMessage('Format email salah.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
  body('portal').optional().isIn(['admin', 'user']).withMessage('Portal tidak valid.'),
  checkValidation
];

const validateRegister = [
  body('nama_lengkap').trim().notEmpty().withMessage('Nama wajib diisi.'),
  body('email').isEmail().withMessage('Format email institusi salah.'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
  body('no_telepon').notEmpty().withMessage('Nomor telepon wajib diisi.')
    .isNumeric().withMessage('Nomor telepon harus berupa angka.'),
  body('role_id').notEmpty().withMessage('Role ID wajib ditentukan.'),
  
  // Validasi bersyarat: Kalau Mahasiswa wajib NIM, kalau Dosen wajib NIP
  body('nim').if(body('role_id').equals('5'))
    .notEmpty().withMessage('NIM wajib diisi untuk mahasiswa.')
    .isLength({ min: 10, max: 11 }).withMessage('NIM PNJ biasanya 10-11 digit.'),
    
  body('nip').if(body('role_id').equals('4'))
    .notEmpty().withMessage('NIP wajib diisi untuk dosen/pegawai.')
    .isLength({ min: 9, max: 18 }).withMessage('Format NIP tidak valid.'),

  checkValidation
];

module.exports = { 
  validateLogin, 
  validateRegister 
};