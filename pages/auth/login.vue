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
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('') // 🟢 เพิ่มตัวแปร password
const authStore = useAuthStore()

const handleLogin = async () => {
  if (email.value && password.value) {
    // 🟢 ส่งทั้ง email และ password ไปที่ store
    const success = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (success) {
      await navigateTo('/')
    } else {
      alert('Login ล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง')
    }
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}
</script>