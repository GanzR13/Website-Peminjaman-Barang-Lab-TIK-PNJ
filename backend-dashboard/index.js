const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 1. Import Database
const db = require("./models"); 

// 2. Import Routes & Swagger
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const refRoutes = require('./routes/refRoutes');
const swaggerDocs = require("./config/swagger"); 

// INISIALISASI app DULU
const app = express();

// 3. Setup Middleware
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

// 4. Inisialisasi Swagger (Taruh sebelum rute lain agar terbaca)
swaggerDocs(app);

// 5. Daftarkan Routes Utama
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/ref', refRoutes);

// 6. REDIRECT Rute Utama ke Swagger
// Taruh paling bawah di bagian rute agar tidak bertabrakan dengan /api-docs
app.get("/", (req, res) => {
    res.redirect('/api-docs');
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Terjadi kesalahan internal pada server'
    });
});

// 8. Tentukan PORT & Jalankan Server
const PORT = process.env.PORT || 3000;

db.sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Koneksi PostgreSQL Berhasil.");
        return db.sequelize.sync({ force: false }); 
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
            console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error("❌ Gagal terhubung ke database:", err.message);
        process.exit(1);
    });