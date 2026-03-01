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