<template>
  <v-container class="fill-height">
    <v-card width="400" class="mx-auto pa-5" elevation="3" rounded="lg">
      <v-card-title class="text-h5 text-center">เข้าสู่ระบบ</v-card-title>
      
      <v-form class="mt-4" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
        ></v-text-field>

        <v-text-field
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          type="password"
          variant="outlined"
          density="comfortable"
        ></v-text-field>

        <v-btn type="submit" color="primary" block size="large" class="mt-2" variant="elevated">
          Login
        </v-btn>
      </v-form>

      <v-card-text class="text-center">
        ยังไม่มีบัญชี? <NuxtLink to="/auth/register" class="text-primary">สมัครที่นี่</NuxtLink>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

// 🟢 คำสั่งนี้จะปิดการแสดงผล default layout (แถบเมนูด้านบน) สำหรับหน้านี้
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  if (email.value) {
    authStore.login(email.value) 
    await navigateTo('/') 
  } else {
    alert('กรุณากรอก Email ก่อนเข้าสู่ระบบครับ')
  }
}
</script>