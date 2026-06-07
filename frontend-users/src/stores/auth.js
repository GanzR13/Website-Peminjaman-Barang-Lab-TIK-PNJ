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
	const role = userData.Role || userData.role || {};

	const roleId = userData.role_id || role.id || null;

	const roleName =
		userData.nama_role ||
		userData.role_name ||
		role.nama_role ||
		role.name ||
		"User";

	const levelAkses =
		userData.level_akses ||
		userData.level ||
		role.level_akses ||
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
			level_akses: levelAkses,
		},
	};
};

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: safeParseUser(),
		token: localStorage.getItem("token") || null,
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

			return level === "peminjam";
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

				this.token = response.data.token;
				localStorage.setItem("token", this.token);

				this.setAuthHeader();

				await this.fetchMe();

				return true;
			} catch (err) {
				this.error =
					err.response?.data?.message || "Login gagal, silakan coba lagi.";

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
				const userData = response.data?.data || response.data?.user || response.data;

				const roleData = normalizeRole(userData);

				this.user = {
					...this.user,

					id: userData.id,
					nama: userData.nama_lengkap || userData.nama || this.user?.nama || "Pengguna",
					nama_lengkap:
						userData.nama_lengkap || userData.nama || this.user?.nama || "Pengguna",

					email: userData.email,
					email_verified: normalizeVerified(
						userData.email_verified ??
							userData.emailVerified ??
							userData.is_verified ??
							userData.verified
					),

					no_telepon: userData.no_telepon || "Belum diatur",

					identitas: userData.nim || userData.nip || "-",
					nim: userData.nim || null,
					nip: userData.nip || null,

					...roleData,

					prodi: userData.detail_tambahan?.prodi || userData.prodi || "-",
					kelas: userData.detail_tambahan?.kelas || userData.kelas || "-",
					angkatan:
						userData.detail_tambahan?.angkatan || userData.angkatan || "-",

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