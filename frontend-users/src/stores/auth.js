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
        // --- ACTION LOGIN ---
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post("/auth/login", credentials);
                
                // 1. Simpan dan set token dulu
                this.token = response.data.token;
                localStorage.setItem("token", this.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                // 2. Trik Jitu: Panggil fetchMe() di sini agar data user di-mapping 
                // dengan rapi (nama_lengkap -> nama, role_id, dll) SEBELUM pindah halaman.
                await this.fetchMe();

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Login gagal, silakan coba lagi.";
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // --- ACTION REGISTER ---
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post("/auth/register", userData);
                return response.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Registrasi gagal. Silakan periksa kembali data Anda.";
                throw err;
            } finally {
                this.loading = false;
            }
        },

        // --- ACTION FETCH ME (Sinkronisasi Profil & Mapping Data) ---
        async fetchMe() {
            if (!this.token) return;
            
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                const response = await api.get("/auth/me");
                const userData = response.data.data;

                // Mapping yang sangat bagus, kita pertahankan ini
                this.user = {
                    ...this.user,
                    id: userData.id,
                    email: userData.email,
                    nama: userData.nama_lengkap || userData.nama,
                    level: userData.level_akses || userData.Role?.level_akses || this.user?.level,
                    role_name: userData.nama_role || userData.Role?.nama_role,
                    role_id: userData.role_id,
                    nip: userData.nip || '-',
                    nim: userData.nim || '-',
                    no_telepon: userData.no_telepon || '-'
                };

                localStorage.setItem("user", JSON.stringify(this.user));
            } catch (error) {
                console.error("Sesi tidak valid atau token kadaluarsa", error);
                if (error.response?.status === 401) {
                    this.logout(); 
                }
            }
        },

        // --- ACTION LOGOUT ---
        logout() {
            // 1. Cek level dengan aman (menggunakan role_id atau level)
            const isPeminjam = this.user?.role_id === 4 || this.user?.role_id === 5 || this.user?.level === 'peminjam';

            // 2. Bersihkan State & LocalStorage
            this.user = null;
            this.token = null;
            this.error = null;
            localStorage.clear(); 

            // 3. Cabut token dari Axios
            delete api.defaults.headers.common['Authorization'];

            // 4. Smart Redirect
            if (isPeminjam) {
                window.location.href = "/"; // Kembalikan Mahasiswa/Dosen ke Homepage
            } else {
                window.location.href = "/admin/login"; // Kembalikan Admin ke portalnya
            }
        },
    },
});