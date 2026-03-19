const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Sistem Peminjaman Barang - Lab PLP TIK PNJ",
			version: "1.0.0",
			description: "Dokumentasi REST API Sistem Manajemen Barang",
		},
		servers: [{ url: "http://localhost:3000" }],
		paths: {
			// --- AUTHENTICATION ---
			"/api/auth/login": {
				post: {
					summary: "Login untuk mendapatkan akses token (Pilih Portal)",
					description:
						"Gunakan portal 'admin' untuk Pegawai/Laboran dan 'user' untuk Mahasiswa/Peminjam.",
					tags: ["Authentication"],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["email", "password", "portal"],
									properties: {
										email: { type: "string", example: "admin@pnj.ac.id" },
										password: { type: "string", example: "password123" },
										portal: {
											type: "string",
											enum: ["admin", "user"],
											example: "admin",
										},
									},
								},
							},
						},
					},
					responses: {
						200: { description: "Login Berhasil" },
						401: { description: "Email atau Password salah" },
						403: { description: "Akses Ditolak (Salah masuk portal)" },
					},
				},
			},
			"/api/auth/me": {
				get: {
					summary: "Cek profil user yang sedang login (Join Data Pegawai/Mhs)",
					tags: ["Authentication"],
					security: [{ bearerAuth: [] }],
					responses: {
						200: {
							description: "Data profil berhasil diambil",
							content: {
								"application/json": {
									example: {
										status: "success",
										data: {
											id: 1,
											email: "admin.tik@pnj.ac.id",
											nama_lengkap: "Budi Santoso",
											role_id: 1,
											nama_role: "Super Admin",
											nip: "198701012023011001",
											no_telepon: "08123456789",
										},
									},
								},
							},
						},
						401: { description: "Token tidak valid atau kadaluarsa" },
					},
				},
			},

			// --- USERS MANAGEMENT ---
			"/api/users": {
				get: {
					summary: "Mengambil semua daftar user",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Daftar user berhasil diambil" },
					},
				},
				post: {
					summary: "Tambah User Baru (Register Mahasiswa/Pegawai)",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										email: { type: "string" },
										password: { type: "string" },
										no_telepon: { type: "string" },
										role_id: {
											type: "integer",
											description:
												"1: Super Admin, 2: Admin, 3: Laboran, 5: Mahasiswa",
										},
										nama_lengkap: { type: "string" },
										nip: { type: "string" },
										nim: { type: "string" },
										angkatan: { type: "integer" },
										prodi_id: { type: "integer" },
										kelas_id: { type: "integer" },
									},
								},
							},
						},
					},
					responses: {
						201: { description: "User Berhasil Dibuat" },
						400: { description: "Validasi Gagal" },
					},
				},
			},
			"/api/users/pegawai": {
				get: {
					summary: "Mengambil daftar pegawai dengan Pagination",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							in: "query",
							name: "page",
							schema: { type: "integer", default: 1 },
						},
						{
							in: "query",
							name: "limit",
							schema: { type: "integer", default: 10 },
						},
					],
					responses: { 200: { description: "Berhasil" } },
				},
			},
			"/api/users/peminjam": {
				get: {
					summary: "Mengambil daftar peminjam (Mahasiswa & Dosen)",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							in: "query",
							name: "page",
							schema: { type: "integer", default: 1 },
						},
						{
							in: "query",
							name: "limit",
							schema: { type: "integer", default: 10 },
						},
					],
					responses: { 200: { description: "Berhasil" } },
				},
			},
			"/api/users/{id}": {
				put: {
					summary: "Update data user dan profil",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "integer" },
						},
					],
					requestBody: {
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										nama_lengkap: { type: "string" },
										no_telepon: { type: "string" },
									},
								},
							},
						},
					},
					responses: { 200: { description: "Update Berhasil" } },
				},
				delete: {
					summary: "Hapus user dan profil terkait",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "integer" },
						},
					],
					responses: { 200: { description: "Hapus Berhasil" } },
				},
			},
			"/api/users/pegawai/{id}": {
				get: {
					summary: "Ambil detail profil pegawai berdasarkan ID",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "integer" },
						},
					],
					responses: { 200: { description: "Ditemukan" } },
				},
			},
			"/api/users/peminjam/{id}": {
				get: {
					summary: "Ambil detail profil peminjam berdasarkan ID",
					tags: ["Users"],
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "integer" },
						},
					],
					responses: { 200: { description: "Ditemukan" } },
				},
			},
			"/api/ref/prodi": {
				get: {
					summary: "Ambil daftar Program Studi",
					tags: ["Reference"],
					responses: { 200: { description: "Berhasil" } },
				},
			},
			"/api/ref/kelas": {
				get: {
					summary: "Ambil daftar Kelas",
					tags: ["Reference"],
					responses: { 200: { description: "Berhasil" } },
				},
			},
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Masukkan token JWT (tanpa kata Bearer)",
				},
			},
		},
	},
	apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			swaggerOptions: { persistAuthorization: true },
		}),
	);
	console.log("📄 Swagger Docs: http://localhost:3000/api-docs");
};

module.exports = swaggerDocs;
