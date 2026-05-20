import { defineStore } from "pinia";
import api from "../plugins/axios";

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

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: JSON.parse(localStorage.getItem("user") || "null"),
		token: localStorage.getItem("token") || null,
		loading: false,
		error: null,
	}),

	actions: {
		async login(credentials) {
			this.loading = true;
			this.error = null;

			try {
				const response = await api.post("/auth/login", credentials);

				this.token = response.data.token;
				localStorage.setItem("token", this.token);
				api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

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
			if (!this.token) return;

			try {
				api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

				const response = await api.get("/auth/me");
				const userData = response.data.data;

				this.user = {
					...this.user,
					id: userData.id,
					nama: userData.nama_lengkap,
					email: userData.email,
					email_verified: normalizeVerified(
						userData.email_verified ??
							userData.emailVerified ??
							userData.is_verified ??
							userData.verified
					),
					no_telepon: userData.no_telepon || "Belum diatur",
					identitas: userData.nim || userData.nip,
					nim: userData.nim,
					nip: userData.nip,
					role_id: userData.role_id,
					role_name: userData.nama_role,
					level: userData.level_akses,

					prodi: userData.detail_tambahan?.prodi || "-",
					kelas: userData.detail_tambahan?.kelas || "-",
					angkatan: userData.detail_tambahan?.angkatan || "-",
				};

				localStorage.setItem("user", JSON.stringify(this.user));
			} catch (error) {
				console.error("Sesi tidak valid atau token kadaluarsa", error);

				if (error.response?.status === 401) {
					this.logout();
				}
			}
		},

		logout() {
			const isPeminjam =
				[4, 5].includes(this.user?.role_id) ||
				["Mahasiswa", "Dosen"].includes(this.user?.role_name) ||
				this.user?.level === "peminjam";

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