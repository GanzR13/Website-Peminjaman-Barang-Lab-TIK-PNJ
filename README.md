# SI-LAB TIK: Sistem Manajemen Barang Lab PLP TIK PNJ

Proyek ini merupakan bagian dari penelitian skripsi berjudul **"Rancang Bangun Dashboard Analitik pada Sistem Manajemen Barang Lab PLP TIK PNJ Berbasis Express.js dan Vue.js sebagai Pendukung Keputusan Pengadaan"**.

Sistem ini memfasilitasi peminjaman barang laboratorium untuk Mahasiswa dan Dosen, serta menyediakan dashboard analitik bagi Admin (Pengelola Lab) untuk mendukung keputusan pengadaan barang.

## 🏗️ Struktur Proyek

Proyek ini terdiri dari tiga bagian utama:
- `backend-dashboard`: API Server menggunakan Node.js & Express.js.
- `frontend-admin`: Dashboard pengelola menggunakan Vue.js.
- `frontend-users`: Portal peminjaman untuk mahasiswa dan dosen menggunakan Vue.js.

## 🚀 Prasyarat

Sebelum menjalankan proyek ini, pastikan sistem kamu sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- [Docker Desktop](https://www.docker.com/)
- PostgreSQL dan PgAdmin4
- Postman

## 🛠️ Cara Menjalankan Proyek

### 1. Konfigurasi Environment (`.env`)
Duplikat file `.env.example` menjadi `.env` di masing-masing folder dan sesuaikan nilainya (kredensial database, port, dll).

### 2. Menjalankan dengan Docker (Rekomendasi)
Cara termudah untuk menjalankan keseluruhan sistem (Database, Backend, dan Frontend) secara bersamaan.
Di terminal root proyek, jalankan:
```bash
docker-compose up -d