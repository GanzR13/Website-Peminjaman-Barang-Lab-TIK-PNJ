import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: JSON.parse(localStorage.getItem("user")) || null,
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
				this.user = response.data.user;

				localStorage.setItem("token", this.token);
				localStorage.setItem("user", JSON.stringify(this.user));

				return true;
			} catch (err) {
				this.error = err.response?.data?.message || "Login gagal";
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
					err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.";
				throw err;
			} finally {
				this.loading = false;
			}
		},
		logout() {
			this.user = null;
			this.token = null;
			localStorage.clear();
			window.location.href = "/login";
		},
	},
});
