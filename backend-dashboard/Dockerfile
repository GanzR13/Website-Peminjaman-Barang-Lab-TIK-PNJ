# Menggunakan image Node.js versi LTS
FROM node:22-alpine

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Instal semua library
RUN npm install

# Menyalin seluruh kode sumber
COPY . .

# Mengekspos port aplikasi
EXPOSE 3000

# Jalankan perintah untuk development
CMD ["npm", "run", "dev"]