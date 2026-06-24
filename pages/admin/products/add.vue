<template>
  <v-container class="my-5">
    <v-card width="600" class="mx-auto pa-5" elevation="3" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold px-0 pt-0">
        <v-icon left color="primary" class="mr-2">mdi-plus-box-outline</v-icon>
        เพิ่มสินค้าใหม่เข้าสู่คลัง
      </v-card-title>
      <v-divider class="mb-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleAddProduct">
        <v-text-field
          v-model="product.name"
          label="ชื่อสินค้า"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'กรุณากรอกชื่อสินค้า']"
          class="mb-2"
        ></v-text-field>

        <v-textarea
          v-model="product.description"
          label="รายละเอียดคำอธิบายสินค้า"
          variant="outlined"
          density="comfortable"
          rows="3"
        ></v-textarea>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="product.price"
              label="ราคา (บาท)"
              type="number"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'กรุณากรอกราคา', v => v > 0 || 'ราคาต้องมากกว่า 0']"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="product.stock"
              label="จำนวนสินค้าในคลัง (ชิ้น)"
              type="number"
              variant="outlined"
              density="comfortable"
              :rules="[v => v !== '' || 'กรุณากรอกจำนวนคลัง', v => v >= 0 || 'คลังห้ามติดลบ']"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-text-field
          v-model="product.image"
          label="ลิงก์ URL รูปภาพสินค้า"
          prepend-inner-icon="mdi-image-outline"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'กรุณาใส่ลิงก์รูปภาพ']"
          class="mb-4"
        ></v-text-field>

        <v-img v-if="product.image" :src="product.image" height="150" class="bg-grey-lighten-3 rounded-lg mb-4" contain></v-img>

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          :disabled="!isFormValid || loading"
        >
          บันทึกและเพิ่มเข้าสู่หน้าร้าน
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const formRef = ref(null)
const isFormValid = ref(false)
const loading = ref(false)

const product = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: ''
})

const handleAddProduct = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const token = useCookie('auth_token').value || authStore.token
  loading.value = true

  try {
    const response = await axios.post('http://localhost:3001/products', product.value, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.success) {
      alert('เพิ่มสินค้าชิ้นใหม่เรียบร้อยแล้ว!')
      // ล้างข้อมูลในฟอร์มเพื่อรอกรอกชิ้นต่อไป
      product.value = { name: '', description: '', price: '', stock: '', image: '' }
      formRef.value.resetValidation()
    }
  } catch (error) {
    console.error('Add product error:', error)
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า')
  } finally {
    loading.value = false
  }
}
</script>