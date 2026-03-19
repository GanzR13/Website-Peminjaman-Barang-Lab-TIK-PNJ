import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  }),
  actions: {
    // --- ACTION LOGIN (Tetap Sama) ---
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
          portal: "admin", 
        });

        this.token = response.data.token;
        const userData = response.data.user;

        this.user = {
          id: userData.id,
          email: userData.email,
          nama: userData.nama || userData.nama_lengkap || 'Admin',
          level: userData.level || userData.Role?.nama_role || 'Staff',
          role_id: userData.role_id,
          nip: userData.nip || userData.pegawai?.nip || '-',
          no_telepon: userData.no_telepon || '-'
        };

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Gagal login.";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // --- ACTION BARU: FETCH ME ---
    async fetchMe() {
      if (!this.token) return;
      
      try {
        // Pastikan header auth terpasang
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        const response = await api.get("/auth/me");
        const userData = response.data.data;

        // Update state user dengan data terbaru dari database
        this.user = {
          ...this.user,
          id: userData.id,
          email: userData.email,
          nama: userData.nama_lengkap || userData.nama,
          level: userData.Role?.nama_role || this.user.level,
          role_id: userData.role_id,
          nip: userData.pegawai?.nip || userData.nip || '-',
          no_telepon: userData.no_telepon || '-'
        };

        // Update localStorage agar tetap sinkron saat refresh
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Session expired or invalid token");
        // Jika token tidak valid (401), otomatis logout
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },
    
    // --- ACTION LOGOUT (Tetap Sama) ---
    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common['Authorization'];
      window.location.href = "/admin/login"; 
    },
  },
});