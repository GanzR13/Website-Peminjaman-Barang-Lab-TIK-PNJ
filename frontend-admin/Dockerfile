# Gunakan image Node.js yang ringan
FROM node:22-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Instal semua library (dependensi)
RUN npm install

# Salin seluruh kode program frontend ke dalam container
COPY . .

# Beritahu port yang digunakan (Vite default 5173, tapi kita sesuaikan di compose)
EXPOSE 5173

# Jalankan perintah untuk development
# Flag --host penting agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]