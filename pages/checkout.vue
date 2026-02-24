<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6 mt-4">💳 ยืนยันการสั่งซื้อ</h2>

    <v-card v-if="cartStore.items.length === 0" class="text-center py-12" elevation="2">
      <v-icon size="80" color="warning">mdi-alert-circle-outline</v-icon>
      <h3 class="text-h5 mt-4">ไม่มีสินค้าให้ทำรายการ</h3>
      <v-btn color="primary" class="mt-4" to="/">กลับไปเลือกสินค้า</v-btn>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-5 mb-4" rounded="lg">
          <h3 class="text-h6 font-weight-bold mb-4">📍 ข้อมูลการจัดส่ง</h3>
          <v-form ref="formRef" v-model="isFormValid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="shipping.name" label="ชื่อ-นามสกุล" variant="outlined"
                  :rules="[v => !!v || 'กรุณากรอกชื่อ']" density="comfortable"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="shipping.phone" label="เบอร์โทรศัพท์" variant="outlined"
                  :rules="[v => !!v || 'กรุณากรอกเบอร์โทรศัพท์']" density="comfortable"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="shipping.address" label="ที่อยู่จัดส่งโดยละเอียด" variant="outlined" rows="3"
                  :rules="[v => !!v || 'กรุณากรอกที่อยู่']"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <v-card elevation="2" class="pa-5" rounded="lg">
          <h3 class="text-h6 font-weight-bold mb-4">💰 วิธีการชำระเงิน</h3>
          <v-radio-group v-model="paymentMethod" color="primary">
            <v-radio label="โอนเงินผ่านธนาคาร (QR PromptPay)" value="promptpay"></v-radio>
            <v-radio label="บัตรเครดิต / เดบิต" value="credit_card"></v-radio>
            <v-radio label="เก็บเงินปลายทาง (COD)" value="cod"></v-radio>
          </v-radio-group>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-5 position-sticky" style="top: 20px;" rounded="lg">
          <h3 class="text-h6 font-weight-bold mb-4">สรุปคำสั่งซื้อ</h3>

          <v-list density="compact" class="mb-4">
            <v-list-item v-for="item in cartStore.items" :key="item.id" class="px-0">
              <v-list-item-title class="text-body-2">
                {{ item.name }} <span class="text-grey">(x{{ item.quantity }})</span>
              </v-list-item-title>
              <template v-slot:append>
                <div class="text-body-2 font-weight-bold">
                  {{ (item.price * item.quantity).toLocaleString() }} ฿
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="mb-4"></v-divider>

          <div class="d-flex justify-space-between mb-6 align-center">
            <span class="text-subtitle-1">ยอดชำระสุทธิ</span>
            <span class="text-h5 text-primary font-weight-black">
              {{ cartStore.totalPrice.toLocaleString() }} ฿
            </span>
          </div>

          <v-btn color="success" block size="x-large" prepend-icon="mdi-check-circle"
            :disabled="!isFormValid || isProcessing" :loading="isProcessing" @click="confirmOrder">
            ยืนยันคำสั่งซื้อ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue' // เพิ่ม onMounted เพื่อโหลดข้อมูลผู้ใช้
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import axios from 'axios'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const isFormValid = ref(false)
const isProcessing = ref(false)
const formRef = ref(null)

const shipping = ref({
  name: '',
  phone: '',
  address: ''
})

const paymentMethod = ref('promptpay')

// ดึงข้อมูลชื่อจาก authStore มาใส่ในฟอร์มโดยอัตโนมัติ (ถ้ามี)
onMounted(() => {
  if (authStore.user) {
    shipping.value.name = authStore.user.name || ''
  }
})

const confirmOrder = async () => {
  // 1. ตรวจสอบความถูกต้องของฟอร์ม
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // 2. ตรวจสอบว่าผู้ใช้ Login อยู่หรือไม่ เพื่อป้องกัน userId เป็น NULL
  if (!authStore.user?.id) {
    alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ')
    router.push('/login')
    return
  }

  isProcessing.value = true

  try {
    // 3. เตรียมข้อมูลส่ง Backend โดยรวม userId: 4 เข้าไปด้วย
    const orderData = {
      userId: authStore.user?.id,
      total: cartStore.totalPrice,
      items: cartStore.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      // 🟢 ข้อมูลที่ผู้ใช้กรอกในหน้าเว็บ
      customerName: shipping.value.name,
      phone: shipping.value.phone,
      address: shipping.value.address,
      paymentMethod: paymentMethod.value
    }

    console.log('ส่งข้อมูลการสั่งซื้อ:', orderData)

    // 4. ยิง API ไปที่ NestJS
    const response = await axios.post('http://localhost:3001/orders/checkout', orderData)

    if (response.data) {
      alert('สั่งซื้อสำเร็จ! เลขที่คำสั่งซื้อของคุณคือ: ORD-' + response.data.orderId.toString().padStart(4, '0'))

      // 5. ล้างตะกร้าและไปหน้าประวัติ
      cartStore.clearCart()
      router.push('/history')
    }
  } catch (error) {
    console.error('Checkout error:', error.response?.data)
    // แสดงข้อความ Error จริงจาก Backend เช่น "กรุณาส่ง userId มาด้วย" หรือ "สต็อกไม่พอ"
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ')
  } finally {
    isProcessing.value = false
  }
}
</script>