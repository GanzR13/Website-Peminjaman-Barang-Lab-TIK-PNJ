<script setup>
import { ref, onMounted } from 'vue';
import api from "../plugins/axios";

const userProfile = ref({});
const isLoading = ref(true);

const getProfile = async () => {
  try {
    const response = await api.get('/auth/me'); // Cukup tulis path-nya saja
    userProfile.value = response.data.data;
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getProfile);
</script>

<template>
  <div v-if="!isLoading">
    <h1 class="text-2xl font-bold">Profil Peminjam</h1>
    <p>Nama: {{ userProfile.nama_lengkap }}</p>
    <p>Email: {{ userProfile.email }}</p>
  </div>
</template>