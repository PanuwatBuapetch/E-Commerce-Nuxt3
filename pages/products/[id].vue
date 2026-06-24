<template>
  <div>
    <v-container v-if="product">
      <v-row class="mt-5">
        <v-col cols="12" md="6">
          <v-img :src="product.image" height="400" cover rounded="lg" class="bg-grey-lighten-2"></v-img>
        </v-col>

        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold">{{ product.name }}</h1>
          <p class="text-h5 text-primary my-4 font-weight-black">
            {{ Number(product.price).toLocaleString() }} บาท
          </p>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1">{{ product.description || 'ไม่มีคำอธิบายสินค้า' }}</p>
          
          <div class="mt-6">
            <p class="text-subtitle-1 mb-2">คงเหลือในคลัง: {{ product.stock }} ชิ้น</p>
            <v-btn 
              color="primary" 
              size="x-large" 
              prepend-icon="mdi-cart" 
              block 
              @click="addToCart"
              :disabled="product.stock <= 0"
            >
              {{ product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด' }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="text-center mt-10">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-3">กำลังโหลดข้อมูลสินค้า...</p>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const product = ref(null)
const fetchProductDetail = async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`http://localhost:3001/products/${id}`)
    
    // 🟢 ✨ แก้ไขจุดนี้: เติม .data ซ้อนเข้าไปอีกชั้น เพื่อดึง Object สินค้าตัวจริงอกมาใช้
    product.value = response.data.data
    
  } catch (error) {
    console.error('Error fetching product detail:', error)
    alert('ไม่พบข้อมูลสินค้าชิ้นนี้')
  }
}
const addToCart = () => {
  if (product.value) {
    const safeProduct = {
      ...product.value,
      price: parseFloat(product.value.price || 0),
      stock: parseInt(product.value.stock || 0)
    }

    cartStore.addToCart(safeProduct)
    alert(`เพิ่ม ${safeProduct.name} เรียบร้อย!`)
  }
}

onMounted(() => {
  fetchProductDetail()
})
</script>