<template>
  <v-container>
    <v-row class="my-5">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary">🛍️ สินค้าแนะนำ</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col 
        v-for="product in products" 
        :key="product.id" 
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="mx-auto h-100" elevation="2" hover>
          <v-img
            :src="product.image"
            height="200px"
            cover
            class="bg-grey-lighten-2"
          ></v-img>

          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ product.name }}
          </v-card-title>

          <v-card-text>
            <div class="text-primary font-weight-black text-h6">
              {{ product.price.toLocaleString() }} บาท
            </div>
            <div class="text-caption text-grey mt-2">
              เหลือในสต็อก: {{ product.stock }} ชิ้น
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="flat"
              block
              prepend-icon="mdi-cart-plus"
              @click="addToCart(product)"
            >
              เพิ่มลงตะกร้า
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'

// เรียกใช้งาน Pinia Store ของตะกร้าสินค้า
const cartStore = useCartStore()

// ข้อมูลจำลอง (เดี๋ยวรอเชื่อมกับ .NET API ของคุณในอนาคต)
const products = ref([
  { id: 1, name: 'คีย์บอร์ดไร้สาย RGB', price: 1290, stock: 15, image: 'https://via.placeholder.com/300?text=Keyboard' },
  { id: 2, name: 'เมาส์เกมมิ่ง 16000 DPI', price: 890, stock: 8, image: 'https://via.placeholder.com/300?text=Mouse' },
  { id: 3, name: 'หูฟังตัดเสียงรบกวน', price: 2500, stock: 5, image: 'https://via.placeholder.com/300?text=Headset' },
  { id: 4, name: 'แผ่นรองเมาส์ XL', price: 350, stock: 20, image: 'https://via.placeholder.com/300?text=Mousepad' },
])

const addToCart = (product) => {
  // ส่งข้อมูลเข้า Pinia
  cartStore.addToCart(product)
  
  // แจ้งเตือนเพื่อให้รู้ว่ากดติดแล้ว (ตัวเลขบน Navbar ด้านบนจะเด้งขึ้นเองอัตโนมัติ)
  alert(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`)
}
</script>