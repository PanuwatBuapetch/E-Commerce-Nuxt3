<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400" title="สมัครสมาชิก">
      <v-card-text>
        <v-text-field v-model="form.name" label="ชื่อ-นามสกุล" variant="outlined"></v-text-field>
        <v-text-field v-model="form.email" label="Email" variant="outlined"></v-text-field>
        <v-text-field v-model="form.password" label="รหัสผ่าน" type="password" variant="outlined"></v-text-field>
        <v-btn color="primary" block size="large" @click="handleRegister">ตกลง</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({ name: '', email: '', password: '' })

const handleRegister = async () => {
  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  });

  if (success) {
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    navigateTo('/auth/login');
  }
};
</script>