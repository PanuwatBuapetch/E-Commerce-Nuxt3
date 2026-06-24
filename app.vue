<script setup>
const authStore = useAuthStore()

// เมื่อหน้าเว็บโหลด (Client-side)
onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <v-app>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// 🟢 โหลดข้อมูลจากคุกกี้กลับเข้า Store ทันทีที่มีการรีเฟรชหน้าจอ (ล็อกอินไม่หลุด)
authStore.initAuth()
</script>