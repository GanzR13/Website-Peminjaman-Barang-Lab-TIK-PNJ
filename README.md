# SI-LAB TIK

## Sistem Manajemen Barang Lab PLP TIK PNJ

SI-LAB TIK merupakan sistem manajemen barang laboratorium berbasis web yang dikembangkan untuk mendukung proses peminjaman barang pada Lab PLP TIK Politeknik Negeri Jakarta. Proyek ini merupakan bagian dari penelitian skripsi berjudul:

**"Rancang Bangun Dashboard Analitik pada Sistem Manajemen Barang Lab PLP TIK PNJ Berbasis Express.js dan Vue.js sebagai Pendukung Keputusan Pengadaan"**

Sistem ini menyediakan portal peminjaman barang bagi mahasiswa dan dosen, serta dashboard pengelolaan barang bagi admin atau pengelola laboratorium. Selain itu, sistem dilengkapi dengan dashboard analitik untuk membantu pengelola dalam memantau data peminjaman, stok barang, barang bermasalah, dan rekomendasi pengadaan barang.

---

## Tujuan Sistem

Sistem ini dikembangkan untuk membantu proses pengelolaan barang laboratorium agar lebih terstruktur, transparan, dan mudah dipantau. Dengan adanya sistem ini, pengguna dapat melihat ketersediaan barang secara digital, mengajukan peminjaman, memantau status peminjaman, serta mencetak surat peminjaman. Di sisi admin, sistem membantu proses validasi peminjaman, pengelolaan stok, pelaporan kendala barang, dan analisis kebutuhan pengadaan.

---

## Fitur Utama

### Fitur Pengguna

Fitur pengguna digunakan oleh mahasiswa dan dosen untuk melakukan proses peminjaman barang laboratorium.

* Registrasi dan login pengguna
* Melihat katalog barang laboratorium
* Melihat detail barang, stok, dan informasi barang
* Menambahkan barang ke daftar peminjaman
* Mengajukan peminjaman barang harian
* Mengajukan peminjaman barang khusus
* Melihat riwayat peminjaman
* Membatalkan pengajuan peminjaman yang masih menunggu
* Melihat status approval dosen penanggung jawab dan kepala laboratorium
* Mencetak surat peminjaman dari sistem
* Membuat pengingat pengembalian melalui Google Calendar
* Melaporkan kendala barang saat barang sedang dipinjam

### Fitur Admin

Fitur admin digunakan oleh pengelola laboratorium untuk mengelola data barang dan proses peminjaman.

* Login admin
* Mengelola data barang
* Menambahkan, mengubah, dan menghapus data barang
* Melihat daftar pengajuan peminjaman
* Memverifikasi pengajuan peminjaman
* Menolak pengajuan peminjaman
* Mengelola proses pengembalian barang
* Melihat laporan kendala barang
* Mengelola status barang bermasalah
* Mencetak atau menghasilkan surat peminjaman
* Mengelola data peminjam
* Melihat dashboard analitik

### Fitur Dashboard Analitik

Dashboard analitik digunakan untuk membantu pengelola laboratorium dalam memahami kondisi peminjaman dan kebutuhan barang.

* Menampilkan ringkasan data peminjaman
* Menampilkan tren peminjaman per bulan
* Menampilkan daftar barang paling sering dipinjam
* Menampilkan data barang bermasalah
* Menampilkan rekomendasi pengadaan barang berbasis rule-based scoring
* Membantu pengelola dalam mempertimbangkan kebutuhan pengadaan barang laboratorium

---

Keterangan struktur utama:

| Folder               | Keterangan                                                            |
| -------------------- | --------------------------------------------------------------------- |
| `backend-dashboard`  | API server menggunakan Node.js, Express.js, Sequelize, dan PostgreSQL |
| `frontend-admin`     | Aplikasi dashboard admin berbasis Vue.js                              |
| `frontend-users`     | Aplikasi portal peminjaman pengguna berbasis Vue.js                   |
| `docker-compose.yml` | Konfigurasi untuk menjalankan service dengan Docker                   |
| `.env.example`       | Contoh konfigurasi environment variable                               |

---

## Teknologi yang Digunakan

### Backend

* Node.js
* Express.js
* Sequelize ORM
* PostgreSQL
* JWT Authentication
* Multer
* Cloudinary
* PDFKit
* Google Drive API

### Frontend

* Vue.js
* Vue Router
* Pinia
* Axios
* Tailwind CSS
* Heroicons
* Vite

### Tools Pendukung

* Docker
* Docker Compose
* PostgreSQL
* PgAdmin4
* Postman
* Git

---

## Prasyarat

Sebelum menjalankan project, pastikan perangkat sudah memiliki beberapa kebutuhan berikut:

* Node.js versi 18 atau lebih baru
* NPM
* Docker Desktop
* Docker Compose
* PostgreSQL
* PgAdmin4
* Postman
* Git

---

## Konfigurasi Environment

Setiap bagian project memiliki file konfigurasi environment masing-masing. Duplikat file `.env.example` menjadi `.env`, lalu sesuaikan nilainya.

### Backend

Lokasi file:

```bash
backend-dashboard/.env
```

Contoh konfigurasi:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=silab_tik
DB_USER=postgres
DB_PASSWORD=password_database

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

### Frontend Admin

Lokasi file:

```bash
frontend-admin/.env
```

Contoh konfigurasi:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Frontend Users

Lokasi file:

```bash
frontend-users/.env
```

Contoh konfigurasi:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Catatan: nilai environment harus disesuaikan dengan konfigurasi lokal atau server yang digunakan.

---

## Cara Menjalankan Project dengan Docker

Cara ini direkomendasikan karena seluruh service dapat dijalankan melalui satu perintah dari root project.

### 1. Masuk ke root project

```bash
cd SI-LAB-TIK
```

### 2. Jalankan Docker Compose

```bash
docker compose up -d
```

### 3. Melihat container yang berjalan

```bash
docker compose ps
```

### 4. Melihat log service

```bash
docker compose logs -f
```

Untuk melihat log service tertentu:

```bash
docker compose logs -f backend
```

### 5. Menghentikan service

```bash
docker compose down
```

---

## Cara Menjalankan Project Secara Manual

Selain menggunakan Docker, setiap service juga dapat dijalankan secara manual.

### 1. Menjalankan Backend

```bash
cd backend-dashboard
npm install
npm run dev
```

Backend akan berjalan pada:

```bash
http://localhost:3000
```

### 2. Menjalankan Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev
```

Frontend admin akan berjalan pada:

```bash
http://localhost:5173
```

### 3. Menjalankan Frontend Users

```bash
cd frontend-users
npm install
npm run dev
```

Frontend users akan berjalan pada:

```bash
http://localhost:5174
```

---

## Konfigurasi Database

Sistem ini menggunakan PostgreSQL sebagai database utama.

### 1. Buat database baru

Contoh nama database:

```sql
silab_tik
```

### 2. Sesuaikan konfigurasi database

Pastikan konfigurasi database pada file `.env` backend sudah sesuai.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=silab_tik
DB_USER=postgres
DB_PASSWORD=password_database
```

### 3. Jalankan migrasi database

Jika project menggunakan Sequelize CLI, jalankan perintah berikut dari folder backend:

```bash
npx sequelize-cli db:migrate
```

### 4. Jalankan seeder database

Jika tersedia data awal atau akun default, jalankan:

```bash
npx sequelize-cli db:seed:all
```

---

## Akses Aplikasi

Setelah seluruh service berjalan, aplikasi dapat diakses melalui alamat berikut:

| Aplikasi       | URL                         |
| -------------- | --------------------------- |
| Backend API    | `http://localhost:3000/api` |
| Frontend Admin | `http://localhost:5173`     |
| Frontend Users | `http://localhost:5174`     |

---

## Dokumentasi API

Pengujian API dapat dilakukan menggunakan Postman. Dokumentasi API mencakup beberapa modul utama berikut:

* Authentication
* User
* Barang
* Peminjaman
* Peminjaman Admin
* Laporan Masalah
* Dashboard Analitik
* Surat Peminjaman

Contoh endpoint utama:

```bash
POST /api/auth/login
GET /api/barang
GET /api/user/peminjaman/riwayat
POST /api/user/peminjaman
GET /api/admin/peminjaman
PUT /api/admin/peminjaman/:id/status
GET /api/admin/dashboard/analitik
```

---

## Alur Umum Penggunaan Sistem

### Alur Pengguna

1. Pengguna melakukan registrasi atau login.
2. Pengguna melihat katalog barang.
3. Pengguna memilih barang yang ingin dipinjam.
4. Pengguna mengisi data peminjaman.
5. Sistem menyimpan pengajuan peminjaman.
6. Pengguna memantau status peminjaman melalui halaman riwayat.
7. Jika pengajuan disetujui, pengguna dapat mencetak surat peminjaman.
8. Pengguna mengembalikan barang sesuai jadwal.
9. Jika terdapat kendala, pengguna dapat membuat laporan masalah barang.

### Alur Admin

1. Admin melakukan login.
2. Admin melihat daftar pengajuan peminjaman.
3. Admin melakukan validasi peminjaman.
4. Admin memproses pengembalian barang.
5. Admin mengelola data barang dan stok.
6. Admin meninjau laporan barang bermasalah.
7. Admin memantau dashboard analitik.
8. Admin menggunakan hasil analitik sebagai bahan pertimbangan pengadaan barang.

---

## Rule-Based Scoring Rekomendasi Pengadaan

Dashboard analitik menggunakan pendekatan rule-based scoring untuk membantu memberikan rekomendasi pengadaan barang. Sistem mempertimbangkan beberapa indikator utama, yaitu:

| Indikator         | Bobot |
| ----------------- | ----- |
| Total peminjaman  | 40%   |
| Kendala barang    | 25%   |
| Stok rendah       | 20%   |
| Status rule-based | 15%   |

Aturan status rekomendasi:

| Kondisi                                                 | Status             | Skor |
| ------------------------------------------------------- | ------------------ | ---- |
| Dipinjam minimal 50 kali dan memiliki minimal 2 kendala | Kritis             | 1.00 |
| Dipinjam minimal 50 kali dan stok maksimal 5            | Prioritas Tinggi   | 0.85 |
| Memiliki minimal 1 kendala                              | Perlu Penggantian  | 0.70 |
| Dipinjam minimal 50 kali atau stok maksimal 5           | Prioritas Menengah | 0.50 |
| Selain kondisi di atas                                  | Aman               | 0.00 |

Hasil scoring digunakan sebagai bahan pendukung keputusan, bukan sebagai keputusan akhir pengadaan barang.

---

## Pengujian Sistem

Pengujian sistem dilakukan untuk memastikan fitur berjalan sesuai kebutuhan.

Jenis pengujian yang digunakan:

* Pengujian API menggunakan Postman
* Black Box Testing
* User Acceptance Testing

### Pengujian API

Pengujian API dilakukan untuk memastikan endpoint backend dapat menerima request, memproses data, dan menghasilkan response sesuai kebutuhan sistem.

### Black Box Testing

Black Box Testing dilakukan untuk menguji fungsi sistem berdasarkan input dan output tanpa melihat struktur kode program.

### User Acceptance Testing

User Acceptance Testing dilakukan untuk mengetahui tingkat penerimaan pengguna terhadap sistem yang telah dikembangkan.

---

## Keamanan

Beberapa penerapan keamanan pada sistem:

* Autentikasi menggunakan JSON Web Token
* Pembatasan akses berdasarkan role pengguna
* Validasi input pada backend
* Penyimpanan konfigurasi sensitif pada file `.env`
* File `.env` tidak disertakan ke repository
* Middleware autentikasi untuk endpoint yang membutuhkan akses login

---

## Catatan Pengembangan

Beberapa hal yang perlu diperhatikan saat melakukan pengembangan:

* Pastikan file `.env` sudah dibuat dan dikonfigurasi dengan benar.
* Pastikan database PostgreSQL sudah berjalan.
* Pastikan relasi Sequelize sudah sesuai dengan struktur database.
* Pastikan service backend berjalan sebelum frontend digunakan.
* Jangan memasukkan file `.env`, kredensial, atau file konfigurasi rahasia ke repository.
* Gunakan Postman untuk menguji API sebelum menghubungkan fitur ke frontend.

---

## Perintah Docker yang Sering Digunakan

Menjalankan semua service:

```bash
docker compose up -d
```

Menjalankan ulang service:

```bash
docker compose restart
```

Melihat log semua service:

```bash
docker compose logs -f
```

Melihat log backend:

```bash
docker compose logs -f backend
```

Menghentikan semua service:

```bash
docker compose down
```

Melakukan build ulang:

```bash
docker compose up -d --build
```

---

## Perintah Git yang Disarankan

Inisialisasi repository:

```bash
git init
```

Menambahkan file ke staging:

```bash
git add .
```

Menyimpan perubahan:

```bash
git commit -m "Initial commit"
```

Melihat status repository:

```bash
git status
```

---

## Lisensi

Project ini dikembangkan untuk kebutuhan penelitian skripsi dan pembelajaran. Penggunaan, pengembangan, atau distribusi lebih lanjut dapat disesuaikan dengan ketentuan dari pemilik project dan institusi terkait.

---

## Pengembang

Nama: Muhammad Rizki Awaluddin Mubin
Program Studi: Teknik Informatika
Jurusan: Teknik Informatika dan Komputer
Institusi: Politeknik Negeri Jakarta