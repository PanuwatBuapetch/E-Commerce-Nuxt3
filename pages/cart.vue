<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6 mt-4">🛒 ตะกร้าสินค้าของคุณ</h2>

    <v-card v-if="cartStore.items.length === 0" class="text-center py-12" elevation="2">
      <v-icon size="100" color="grey-lighten-2">mdi-cart-off</v-icon>
      <h3 class="text-h5 text-grey-darken-1 mt-4">ยังไม่มีสินค้าในตะกร้า</h3>
      <v-btn color="primary" class="mt-6" to="/" prepend-icon="mdi-storefront-outline" size="large">
        กลับไปเลือกซื้อสินค้า
      </v-btn>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">สินค้า</th>
                <th class="text-center">ราคาต่อชิ้น</th>
                <th class="text-center">จำนวน</th>
                <th class="text-center">รวม (บาท)</th>
                <th class="text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartStore.items" :key="item.id">
                <td>
                  <div class="d-flex align-center py-3">
                    <span class="font-weight-medium text-subtitle-1">{{ item.name }}</span>
                  </div>
                </td>
                
                <td class="text-center text-grey-darken-2">
                  {{ item.price.toLocaleString() }}
                </td>
                
                <td class="text-center">
                  <div class="d-flex align-center justify-center">
                    <v-btn 
                      icon="mdi-minus" 
                      size="x-small" 
                      variant="tonal" 
                      color="error" 
                      @click="decreaseQty(item)"
                    ></v-btn>
                    
                    <span class="mx-4 font-weight-bold">{{ item.quantity }}</span>
                    
                    <v-btn 
                      icon="mdi-plus" 
                      size="x-small" 
                      variant="tonal" 
                      color="success" 
                      @click="increaseQty(item)"
                    ></v-btn>
                  </div>
                </td>
                
                <td class="text-center font-weight-bold text-primary">
                  {{ (item.price * item.quantity).toLocaleString() }}
                </td>
                
                <td class="text-center">
                  <v-btn 
                    icon="mdi-delete" 
                    size="small" 
                    variant="text" 
                    color="error" 
                    @click="cartStore.removeFromCart(item.id)"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-5" rounded="lg">
          <h3 class="text-h6 font-weight-bold mb-4">สรุปคำสั่งซื้อ</h3>
          <v-divider class="mb-4"></v-divider>
          
          <div class="d-flex justify-space-between mb-3 text-body-1">
            <span class="text-grey-darken-1">จำนวนสินค้าทั้งหมด</span>
            <span class="font-weight-medium">{{ cartStore.totalItems }} ชิ้น</span>
          </div>
          
          <div class="d-flex justify-space-between mb-6 align-center">
            <span class="text-h6">ยอดรวมสุทธิ</span>
            <span class="text-h5 text-primary font-weight-black">
              {{ cartStore.totalPrice.toLocaleString() }} ฿
            </span>
          </div>
          
          <v-btn 
            color="primary" 
            block 
            size="x-large" 
            to="/checkout"
            prepend-icon="mdi-check-circle-outline"
            elevation="3"
          >
            ดำเนินการสั่งซื้อ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// ฟังก์ชันเพิ่มจำนวน
const increaseQty = (item: any) => {
  // ตรวจสอบสต็อก (ถ้าใน DB เป็น Number ให้ใช้ได้เลย ถ้าเป็น String ให้ใส่ Number() ครอบ)
  const currentStock = Number(item.stock) || 999; 
  if (item.quantity < currentStock) {
    cartStore.updateQuantity(item.id, item.quantity + 1)
  } else {
    alert('ขออภัย สินค้าในสต็อกไม่พอ')
  }
}

// ฟังก์ชันลดจำนวน
const decreaseQty = (item: any) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  } else {
    // ถ้าเหลือ 1 แล้วกดลด ให้ถามเพื่อความแน่ใจก่อนลบ
    if (confirm('ต้องการลบสินค้าชิ้นนี้ออกจากตะกร้าหรือไม่?')) {
      cartStore.removeFromCart(item.id)
    }
  }
}

// ตรวจสอบค่าตัวเลขก่อนคำนวณใน Template
const calculateTotal = (price: any, qty: number) => {
  return (Number(price) * qty).toLocaleString()
}
</script>