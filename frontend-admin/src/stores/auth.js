import { defineStore } from "pinia";
import api from "../plugins/axios";

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const normalizeRole = (userData = {}) => {
  const role = userData.Role || userData.role || {};

  return {
    role_id: userData.role_id || role.id || null,
    role_name:
      userData.nama_role ||
      userData.role_name ||
      role.nama_role ||
      role.name ||
      "User",
    level:
      userData.level_akses ||
      userData.level ||
      role.level_akses ||
      "peminjam",
    role: {
      id: userData.role_id || role.id || null,
      nama_role:
        userData.nama_role ||
        userData.role_name ||
        role.nama_role ||
        role.name ||
        "User",
      level_akses:
        userData.level_akses ||
        userData.level ||
        role.level_akses ||
        "peminjam",
    },
  };
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: safeParseUser(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    roleId: (state) => state.user?.role_id || state.user?.role?.id || null,
    roleName: (state) => state.user?.role_name || state.user?.role?.nama_role || null,
    level: (state) => state.user?.level || state.user?.role?.level_akses || null,
    isPeminjam: (state) => state.user?.level === "peminjam",
    isAdmin: (state) => ["admin", "super_admin"].includes(state.user?.level),
  },

  actions: {
    setAuthHeader() {
      if (this.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
    },

    async login(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/auth/login", payload);

        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        this.setAuthHeader();

        const loginUser = response.data.user || {};
        const roleData = normalizeRole(loginUser);

        this.user = {
          id: loginUser.id || null,
          email: loginUser.email || payload.email,
          nama: loginUser.nama || loginUser.nama_lengkap || "Pengguna",

          ...roleData,
        };

        localStorage.setItem("user", JSON.stringify(this.user));

        // Ambil data user terbaru dari /auth/me, termasuk role dari tabel role
        await this.fetchMe();

        return true;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Gagal login. Periksa koneksi Anda.";

        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return null;

      try {
        this.setAuthHeader();

        const response = await api.get("/auth/me");
        const userData = response.data.data || response.data.user || response.data;
        const roleData = normalizeRole(userData);

        this.user = {
          ...this.user,

          id: userData.id || this.user?.id,
          email: userData.email || this.user?.email,
          nama: userData.nama_lengkap || userData.nama || this.user?.nama,

          ...roleData,

          nip: userData.nip || "-",
          nim: userData.nim || "-",
          identitas: userData.nim || userData.nip || "-",
          no_telepon: userData.no_telepon || "-",

          prodi: userData.detail_tambahan?.prodi || userData.prodi || "-",
          kelas: userData.detail_tambahan?.kelas || userData.kelas || "-",
          angkatan: userData.detail_tambahan?.angkatan || userData.angkatan || "-",

          email_verified:
            userData.email_verified === true ||
            userData.email_verified === 1 ||
            userData.email_verified === "1" ||
            userData.email_verified === "true",
        };

        localStorage.setItem("user", JSON.stringify(this.user));
        return this.user;
      } catch (error) {
        console.error("Session expired or invalid token:", error);

        if (error.response?.status === 401) {
          this.logout();
        }

        return null;
      }
    },

    logout() {
      const isPeminjam =
        this.user?.level === "peminjam" ||
        ["Mahasiswa", "Dosen"].includes(this.user?.role_name);

      this.token = null;
      this.user = null;
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