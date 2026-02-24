<template>
  <v-container>
    <v-row class="my-5">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary">🛍️ สินค้าแนะนำ</h2>
      </v-col>
    </v-row>

    <v-row v-if="pending">
      <v-col class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-grey-darken-1">กำลังโหลดข้อมูลสินค้า...</div>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col>
        <v-alert type="error" variant="tonal">
          ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ โปรดตรวจสอบว่ารัน API พอร์ต 3001 อยู่หรือไม่
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto h-100 d-flex flex-column" elevation="2" hover>
          <v-img :src="product.image || 'https://placehold.co/300x200/EEEEEE/999999?text=No+Image'" height="200px" cover
            class="bg-grey-lighten-2">
            <template v-slot:error>
              <div class="d-flex align-center justify-center h-100 bg-grey-lighten-2">
                <div class="text-center text-grey-darken-1">
                  <v-icon size="40" class="mb-2">mdi-image-off-outline</v-icon>
                  <div class="text-caption">ไม่มีรูปภาพ</div>
                </div>
              </div>
            </template>
          </v-img>

          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ product.name }}
          </v-card-title>

          <v-card-text class="flex-grow-1">
            <div class="text-body-2 text-grey-darken-1 mb-2 text-truncate" style="min-height: 20px;">
              {{ product.description || 'ไม่มีรายละเอียดสินค้า' }}
            </div>
          <v-card 
            class="mx-auto h-100" 
            elevation="2" 
            hover
            :to="`/products/${product.id}`" 
          >
            </v-card>
            <div class="text-primary font-weight-black text-h6">
              {{ Number(product.price).toLocaleString() }} บาท
            </div>
            <div class="text-caption text-grey mt-2">
              เหลือในสต็อก: {{ product.stock }} ชิ้น
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn :color="product.stock > 0 ? 'primary' : 'grey'" variant="flat" block
              :prepend-icon="product.stock > 0 ? 'mdi-cart-plus' : 'mdi-cancel'" :disabled="product.stock <= 0"
              @click="addToCart(product)">
              {{ product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด' }}
            </v-btn>
          </v-card-actions>
          
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// 🚀 ใช้ useFetch ของ Nuxt 3 แทน axios (ไม่ต้องใช้ onMounted ด้วย)
const { data: products, pending, error } = await useFetch('http://localhost:3001/products')

const addToCart = (product) => {
  // สร้าง Object ใหม่เพื่อแปลงราคาให้เป็นตัวเลข (ป้องกันบั๊กตอนเอาไปรวมยอดในตะกร้า)
  const productToCart = {
    ...product,
    price: Number(product.price)
  }

  cartStore.addToCart(productToCart)
  alert(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`)
}
</script>