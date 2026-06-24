<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400" title="สมัครสมาชิก" elevation="3" rounded="lg">
      <v-card-text>
        <v-text-field v-model="form.name" label="ชื่อ-นามสกุล" variant="outlined" density="comfortable"></v-text-field>
        <v-text-field v-model="form.email" label="Email" variant="outlined" density="comfortable"></v-text-field>
        <v-text-field v-model="form.password" label="รหัสผ่าน" type="password" variant="outlined" density="comfortable"></v-text-field>
        <v-btn color="primary" block size="large" class="mt-2" @click="handleRegister">ตกลง</v-btn>
      </v-card-text>
      
      <v-card-text class="text-center pt-0">
        มีบัญชีอยู่แล้ว? <NuxtLink to="/auth/login" class="text-primary">เข้าสู่ระบบที่นี่</NuxtLink>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth' // 🟢 1. นำเข้า useAuthStore จาก Pinia

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore() // 🟢 2. ประกาศตัวแปร authStore เพื่อเรียกใช้ฟังก์ชันใน Store
const form = ref({ name: '', email: '', password: '' })

const handleRegister = async () => {
  // ตรวจเช็คเบื้องต้นว่ากรอกข้อมูลครบไหม
  if (!form.value.name || !form.value.email || !form.value.password) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  // 🟢 3. แก้ไขจุดส่งค่าจาก name.value เป็น form.value.name ให้ตรงกับที่ผูก v-model ไว้
  const success = await authStore.register({
    name: form.value.name,
    email: form.value.email,
    password: form.value.password
  })

  if (success) {
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ')
    navigateTo('/auth/login')
  }
}
</script>