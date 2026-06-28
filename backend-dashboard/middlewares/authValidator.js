const { body, validationResult } = require("express-validator");

const checkValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: "fail",
			errors: errors.array()[0].msg,
		});
	}
	next();
};

// Helper: Validasi domain email PNJ
const isPnjEmail = (value) => {
	if (!value.toLowerCase().endsWith("pnj.ac.id")) {
		throw new Error("Bukan email institusi Politeknik Negeri Jakarta");
	}
	return true;
};

// Validator untuk Login
const validateLogin = [
	body("email")
		.trim()
		.isEmail()
		.withMessage("Format email tidak valid")
		.custom(isPnjEmail), // Memanggil fungsi validasi domain PNJ
	body("password").notEmpty().withMessage("Password wajib diisi"),
	body("portal")
		.optional()
		.isIn(["admin", "user"])
		.withMessage("Portal tidak valid"),
	checkValidation,
];

// Validator untuk registrasi user baru (Mahasiswa dan Dosen)
const validateRegister = [
	body("nama_lengkap")
		.trim()
		.notEmpty()
		.withMessage("Nama lengkap wajib diisi"),
	body("email")
		.trim()
		.isEmail()
		.withMessage("Format email tidak valid.")
		.custom(isPnjEmail), // Memanggil fungsi validasi domain PNJ
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password minimal 6 karakter"),
	body("no_telepon")
		.notEmpty()
		.withMessage("Nomor telepon wajib diisi")
		.isNumeric()
		.withMessage("Nomor telepon hanya boleh berisi angka"),
	body("role_id").notEmpty().withMessage("Role ID wajib ditentukan"),

	// Validasi untuk Mahasiswa (role_id === '5')
	body("nim")
		.if(body("role_id").equals("5"))
		.notEmpty()
		.withMessage("NIM wajib diisi untuk mahasiswa")
		.isLength({ min: 10, max: 11 })
		.withMessage("NIM PNJ harus 10 atau 11 digit"),
	body("angkatan")
		.if(body("role_id").equals("5"))
		.notEmpty()
		.withMessage("Tahun angkatan wajib diisi")
		.isNumeric()
		.withMessage("Angkatan harus berupa angka tahun (contoh: 2022)"),
	body("prodi_id")
		.if(body("role_id").equals("5"))
		.notEmpty()
		.withMessage("Program Studi wajib dipilih"),
	body("kelas_id")
		.if(body("role_id").equals("5"))
		.notEmpty()
		.withMessage("Kelas wajib dipilih"),

	// Validasi untuk Dosen atau Pegawai (role_id !== '5')
	body("nip")
		.if(body("role_id").not().equals("5"))
		.notEmpty()
		.withMessage("NIP wajib diisi untuk dosen/pegawai")
		.isLength({ min: 9, max: 18 })
		.withMessage("Format NIP tidak valid"),

	checkValidation,
];

// Validator lupa kata sandi
const validateForgotPassword = [
	body("email")
		.trim()
		.isEmail()
		.withMessage("Format email tidak valid. Pastikan email terdaftar")
		.custom(isPnjEmail),
	checkValidation,
];

// Validator reset kata sandi
const validateResetPassword = [
	body("token")
		.notEmpty()
		.withMessage("Token reset kata sandi tidak ditemukan atau tidak valid"),
	body("new_password")
		.isLength({ min: 6 })
		.withMessage("Kata sandi baru minimal 6 karakter"),
	checkValidation,
];

module.exports = {
	validateLogin,
	validateRegister,
	validateForgotPassword,
	validateResetPassword,
};
