const express = require("express");
const cors = require("cors");
require("dotenv").config();


const db = require("./models"); 

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const refRoutes = require('./routes/refRoutes');
const barangRoutes = require('./routes/barang');
const userPeminjamanRoutes = require('./routes/userPeminjamanRoutes');
const adminPeminjamanRoutes = require('./routes/adminPeminjamanRoutes');
const dataanalitikRoutes = require('./routes/dataanalitikRoutes');
const adminLaporanRoutes = require('./routes/adminLaporanRoutes');
const adminActionLogRoutes = require("./routes/adminActionLogRoutes");
const dosenApprovalRoutes = require("./routes/dosenApprovalRoutes");



const app = express();

app.set("trust proxy", true);

// CUSTOM LOG MANUAL
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 400 ? '\x1b[31m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`${color}${req.method}${reset} ${req.originalUrl} ${color}${status}${reset} - ${duration}ms`);
    });
    next();
});

// Setup Middleware
app.use(
    cors({
        origin: [
          "http://localhost:5173", 
          "http://127.0.0.1:5173",
          "http://localhost:5174", 
          "http://127.0.0.1:5174"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, 
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ref', refRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/user/peminjaman', userPeminjamanRoutes);
app.use('/api/admin/peminjaman', adminPeminjamanRoutes);
app.use('/api/dataanalitik', dataanalitikRoutes);
app.use('/api/admin/laporan', adminLaporanRoutes);
app.use("/api/admin-action-logs", adminActionLogRoutes);
app.use("/api/dosen", dosenApprovalRoutes);

// REDIRECT Rute Utama
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "API SI-LAB PLP TIK berjalan normal 🚀",
        docs: "https://documenter.getpostman.com/view/40256156/2sBXiqFpKy"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${err.stack}`);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Terjadi kesalahan internal pada server'
    });
});

const PORT = process.env.PORT || 3000;

db.sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Koneksi PostgreSQL Berhasil.");
        return db.sequelize.sync({ force: false, logging: false });
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log("-----------------------------------------");
            console.log(`🕒 Waktu Server    : ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
            console.log(`🚀 Server Berjalan : http://localhost:${PORT}`);
            console.log(`📄 API Docs        : https://documenter.getpostman.com/view/40256156/2sBXiqFpKy`);
            console.log("-----------------------------------------");
        });
    })
    .catch((err) => {
        console.error("❌ Gagal terhubung ke database:", err.message);
        process.exit(1);
    });