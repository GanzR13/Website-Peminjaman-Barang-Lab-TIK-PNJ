# Gunakan image Node.js yang ringan
FROM node:22-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Instal semua library
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# Salin seluruh kode program frontend ke dalam container
COPY . .

# Mengekspos port aplikasi
EXPOSE 5174

# Jalankan perintah untuk development
CMD ["npm", "run", "dev", "--", "--host"]