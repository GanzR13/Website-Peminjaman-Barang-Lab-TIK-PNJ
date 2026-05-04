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
    // --- ACTION LOGIN ---
    // Ubah parameter menjadi 'payload' agar bisa menerima object { email, password, portal }
    async login(payload) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post("/auth/login", payload);

        this.token = response.data.token;
        const userData = response.data.user;

        // Mapping disesuaikan dengan response authController backend
        this.user = {
          id: userData.id,
          email: payload.email, // Ambil email dari form
          nama: userData.nama,
          level: userData.level, // 'peminjam', 'admin', 'super_admin'
          role_name: userData.role_name, // 'Mahasiswa', 'Dosen', 'Kepala Lab', dll
          role_id: userData.role_id,
        };

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        return true;
      } catch (error) {
        // Tangkap pesan error dari backend
        this.error = error.response?.data?.message || "Gagal login. Periksa koneksi Anda.";
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // --- ACTION FETCH ME ---
    async fetchMe() {
      if (!this.token) return;
      
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        const response = await api.get("/auth/me");
        const userData = response.data.data;

        // Mapping disesuaikan dengan response authController.getMe backend
        this.user = {
          ...this.user,
          id: userData.id,
          email: userData.email,
          nama: userData.nama_lengkap,
          level: userData.level_akses, 
          role_name: userData.nama_role, 
          role_id: userData.role_id,
          nip: userData.nip || '-',
          nim: userData.nim || '-', // Tambahkan NIM untuk Mahasiswa
          no_telepon: userData.no_telepon || '-'
        };

        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Session expired or invalid token");
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },
    
    // --- ACTION LOGOUT ---
    logout() {
      // 1. Cek dulu user ini admin atau peminjam sebelum datanya dihapus
      const isPeminjam = this.user?.level === 'peminjam';

      // 2. Bersihkan State & Storage
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common['Authorization'];

      // 3. Redirect Cerdas (Admin ke login admin, Peminjam ke login biasa)
      if (isPeminjam) {
        window.location.href = "/"; // Sesuaikan path login mahasiswa
      } else {
        window.location.href = "/admin/login"; 
      }
    },
  },
});