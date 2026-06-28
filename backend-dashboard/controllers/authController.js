const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Pegawai = db.Pegawai; 
const Mahasiswa = db.Mahasiswa;
require("dotenv").config();

exports.login = async (req, res) => {
    try {
        const { email, password, portal } = req.body;
        
        const user = await User.findOne({ 
            where: { email }, 
            include: [
                { model: Role },
                { model: Pegawai, as: "pegawai" },
                { model: Mahasiswa, as: "mahasiswa" }
            ] 
        });

    
        if (!user) {
            return res.status(401).json({ 
                status: "fail",
                message: "Email atau password yang Anda masukkan salah." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                status: "fail",
                message: "Email atau password yang Anda masukkan salah." 
            });
        }

        // Cek Verifikasi Email
        if (!user.email_verified || user.email_verified === 0 || user.email_verified === '0' || user.email_verified === 'false') {
            return res.status(403).json({ 
                status: "fail",
                message: "Akses ditolak: Email Anda belum diverifikasi. Silakan cek kotak masuk Anda." 
            });
        }

        // Cek Portal Akses
        if (portal === "admin") {
            if (user.role_id >= 4) {
                return res.status(403).json({ 
                    status: "fail",
                    message: "Akses Ditolak: Gunakan portal Peminjam" 
                });
            }
        }

        if (portal === "user" && user.Role.level_akses !== "peminjam") {
            return res.status(403).json({
                status: "fail",
                message: "Akses Ditolak: Gunakan portal khusus Pegawai/Admin",
            });
        }

        // Tentukan nama berdasarkan Role
        const isMahasiswa = user.Role.nama_role === "Mahasiswa";
        const namaUser = isMahasiswa ? user.mahasiswa?.nama_mahasiswa : user.pegawai?.nama_lengkap;

        // Generate Token
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.Role.nama_role,
                level_akses: user.Role.level_akses 
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.status(200).json({
            status: "success",
            token,
            user: {
                id: user.id,
                nama: namaUser || "Nama Tidak Ditemukan",
                role_id: user.role_id,
                level: user.Role.level_akses,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            status: "error",
            message: "Terjadi kesalahan pada server." 
        });
    }
};