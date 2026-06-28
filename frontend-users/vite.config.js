import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5174, // Mengunci port ke 5174
    strictPort: true, // Jika port 5174 dipakai, Vite akan error
    host: true // Penting agar bisa diakses dari luar container (Docker)
  }
})
