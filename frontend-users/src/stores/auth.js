import { defineStore } from "pinia";
import api from "../plugins/axios";

const safeParseUser = () => {
	try {
		return JSON.parse(localStorage.getItem("user") || "null");
	} catch (error) {
		localStorage.removeItem("user");
		return null;
	}
};

const savedToken = localStorage.getItem("token") || null;

if (savedToken) {
	api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

const normalizeVerified = (value) => {
	if (value === true || value === 1) return true;

	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();

		return (
			normalized === "true" ||
			normalized === "1" ||
			normalized === "verified" ||
			normalized === "terverifikasi"
		);
	}

	return false;
};

const normalizeRole = (userData = {}) => {
	const role = userData.Role || userData.role || userData.ref_role || {};

	const roleId = userData.role_id || role.id || null;

	const roleName =
		userData.nama_role ||
		userData.role_name ||
		role.nama_role ||
		role.name ||
		role.role_name ||
		"User";

	const levelAkses =
		userData.level_akses ||
		userData.level ||
		role.level_akses ||
		role.level ||
		"peminjam";

	return {
		role_id: roleId,
		role_name: roleName,
		nama_role: roleName,
		level: levelAkses,
		level_akses: levelAkses,
		role: {
			id: roleId,
			nama_role: roleName,
			role_name: roleName,
			level_akses: levelAkses,
			level: levelAkses,
		},
	};
};

const getUserPayload = (responseData) => {
	return responseData?.data || responseData?.user || responseData;
};

const getMahasiswaData = (userData = {}) => {
	return (
		userData.mahasiswa ||
		userData.Mahasiswa ||
		userData.detail_mahasiswa ||
		userData.detail_tambahan?.mahasiswa ||
		{}
	);
};

const getPegawaiData = (userData = {}) => {
	return (
		userData.pegawai ||
		userData.Pegawai ||
		userData.detail_pegawai ||
		userData.detail_tambahan?.pegawai ||
		{}
	);
};

const getNamaProdi = (userData = {}, mahasiswa = {}) => {
	return (
		mahasiswa.prodi?.nama_prodi ||
		mahasiswa.ref_prodi?.nama_prodi ||
		mahasiswa.nama_prodi ||
		userData.detail_tambahan?.prodi ||
		userData.prodi?.nama_prodi ||
		userData.prodi ||
		"-"
	);
};

const getNamaKelas = (userData = {}, mahasiswa = {}) => {
	return (
		mahasiswa.kelas?.nama_kelas ||
		mahasiswa.ref_kelas?.nama_kelas ||
		mahasiswa.nama_kelas ||
		userData.detail_tambahan?.kelas ||
		userData.kelas?.nama_kelas ||
		userData.kelas ||
		"-"
	);
};

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: safeParseUser(),
		token: savedToken,
		loading: false,
		error: null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,

		isPeminjam: (state) => {
			const level =
				state.user?.level_akses ||
				state.user?.level ||
				state.user?.role?.level_akses;

			const roleId = Number(state.user?.role_id);
			const roleName = state.user?.role_name || state.user?.nama_role;

			return (
				level === "peminjam" ||
				[4, 5].includes(roleId) ||
				["Mahasiswa", "Dosen"].includes(roleName)
			);
		},

		isAdmin: (state) => {
			const level =
				state.user?.level_akses ||
				state.user?.level ||
				state.user?.role?.level_akses;

			return ["admin", "super_admin"].includes(level);
		},

		isSuperAdmin: (state) => {
			const level =
				state.user?.level_akses ||
				state.user?.level ||
				state.user?.role?.level_akses;

			return level === "super_admin";
		},

		isMahasiswa: (state) => {
			return (
				Number(state.user?.role_id) === 5 ||
				state.user?.role_name === "Mahasiswa" ||
				state.user?.nama_role === "Mahasiswa"
			);
		},

		isDosen: (state) => {
			return (
				Number(state.user?.role_id) === 4 ||
				state.user?.role_name === "Dosen" ||
				state.user?.nama_role === "Dosen"
			);
		},

		isKalab: (state) => {
			return (
				Number(state.user?.role_id) === 1 ||
				state.user?.role_name === "Kepala Lab" ||
				state.user?.nama_role === "Kepala Lab"
			);
		},

		hasTtdDigital: (state) => {
			return !!state.user?.ttd_digital;
		},
	},

	actions: {
		setAuthHeader() {
			if (this.token) {
				api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
			} else {
				delete api.defaults.headers.common["Authorization"];
			}
		},

		async login(credentials) {
			this.loading = true;
			this.error = null;

			try {
				const response = await api.post("/auth/login", credentials);

				const token =
					response.data?.token ||
					response.data?.accessToken ||
					response.data?.access_token;

				if (!token) {
					throw new Error("Token login tidak ditemukan dari response backend.");
				}

				this.token = token;
				localStorage.setItem("token", this.token);

				this.setAuthHeader();

				await this.fetchMe();

				return true;
			} catch (err) {
				this.error =
					err.response?.data?.message ||
					err.message ||
					"Login gagal, silakan coba lagi.";

				throw err;
			} finally {
				this.loading = false;
			}
		},

		async register(userData) {
			this.loading = true;
			this.error = null;

			try {
				const response = await api.post("/auth/register", userData);
				return response.data;
			} catch (err) {
				this.error =
					err.response?.data?.message ||
					"Registrasi gagal. Silakan periksa kembali data Anda.";

				throw err;
			} finally {
				this.loading = false;
			}
		},

		async fetchMe() {
			if (!this.token) return null;

			try {
				this.setAuthHeader();

				const response = await api.get("/auth/me");
				const userData = getUserPayload(response.data);

				if (!userData || !userData.id) {
					throw new Error("Data user dari /auth/me tidak valid.");
				}

				const mahasiswa = getMahasiswaData(userData);
				const pegawai = getPegawaiData(userData);
				const roleData = normalizeRole(userData);

				const namaLengkap =
					userData.nama_lengkap ||
					userData.nama ||
					mahasiswa.nama_mahasiswa ||
					pegawai.nama_lengkap ||
					this.user?.nama_lengkap ||
					"Pengguna";

				const nim = userData.nim || mahasiswa.nim || null;
				const nip = userData.nip || pegawai.nip || null;

				this.user = {
					...this.user,

					id: userData.id,
					nama: namaLengkap,
					nama_lengkap: namaLengkap,

					email: userData.email || this.user?.email || null,

					email_verified: normalizeVerified(
						userData.email_verified ??
							userData.emailVerified ??
							userData.is_verified ??
							userData.verified
					),

					no_telepon:
						userData.no_telepon ||
						userData.telepon ||
						mahasiswa.no_telepon ||
						mahasiswa.telepon ||
						pegawai.no_telepon ||
						pegawai.telepon ||
						"Belum diatur",

					identitas: nim || nip || "-",
					nim,
					nip,

					...roleData,

					prodi: getNamaProdi(userData, mahasiswa),
					kelas: getNamaKelas(userData, mahasiswa),
					angkatan:
						userData.detail_tambahan?.angkatan ||
						userData.angkatan ||
						mahasiswa.angkatan ||
						"-",

					mahasiswa,
					pegawai,

					// ttd_digital ada di tabel user, jadi ambil dari userData langsung
					ttd_digital: userData.ttd_digital || null,
				};

				localStorage.setItem("user", JSON.stringify(this.user));

				return this.user;
			} catch (error) {
				console.error("Sesi tidak valid atau token kadaluarsa", error);

				if (error.response?.status === 401) {
					this.logout();
				}

				return null;
			}
		},

		updateLocalUser(payload = {}) {
			this.user = {
				...this.user,
				...payload,
			};

			localStorage.setItem("user", JSON.stringify(this.user));
		},

		logout() {
			const isPeminjam =
				this.user?.level === "peminjam" ||
				this.user?.level_akses === "peminjam" ||
				[4, 5].includes(Number(this.user?.role_id)) ||
				["Mahasiswa", "Dosen"].includes(this.user?.role_name);

			this.user = null;
			this.token = null;
			this.error = null;

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("cart_peminjaman");

			delete api.defaults.headers.common["Authorization"];

			if (isPeminjam) {
				window.location.href = "/";
			} else {
				window.location.href = "/admin/login";
			}
		},
	},
});