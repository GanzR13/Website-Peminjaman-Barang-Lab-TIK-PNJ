import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router' // <-- Pastikan ini ada
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router) // <-- Aktifkan router
app.mount('#app')