<template>
  <v-container class="fill-height">
    <v-card width="400" class="mx-auto pa-5" elevation="3" rounded="lg">
      <v-card-title class="text-h5 text-center">เข้าสู่ระบบ</v-card-title>

      <v-form class="mt-4" @submit.prevent="handleLogin">
        <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"
          density="comfortable"></v-text-field>

        <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock-outline" type="password"
          variant="outlined" density="comfortable"></v-text-field>

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
import { useRouter } from 'vue-router' // 🟢 1. นำเข้า useRouter
import axios from 'axios' // 🟢 2. นำเข้า axios (ถ้าไม่ได้ทำ auto-import ไว้)
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('') 
const authStore = useAuthStore()
const router = useRouter() // 🟢 3. ประกาศใช้งาน router

const handleLogin = async () => {
  try {
    // ยิง API ล็อกอินเข้าหลังบ้าน
    const response = await axios.post('http://localhost:3001/auth/login', {
      email: email.value,
      password: password.value
    })

    if (response.data.success) {
      // ส่ง Token และ User ไปเซฟลงคุกกี้ผ่าน Store ตัวใหม่
      authStore.setUserSession(response.data.token, response.data.user)
      
      alert('เข้าสู่ระบบสำเร็จ!')
      router.push('/') // 🟢 ตอนนี้จะสามารถเปลี่ยนหน้าได้ปกติแล้ว
    }
  } catch (error) {
    console.error('Login error:', error)
    // แสดงข้อความแจ้งเตือนความผิดพลาดจริงจากระบบหลังบ้าน
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
  }
}
</script>