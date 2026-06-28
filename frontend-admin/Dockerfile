# Gunakan image Node.js yang ringan
FROM node:22-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Instal semua library
RUN npm install

# Salin seluruh kode program frontend ke dalam container
COPY . .

# Mengekspos port aplikasi
EXPOSE 5173

# Jalankan perintah untuk development
CMD ["npm", "run", "dev", "--", "--host"]