<template>
  <v-container class="my-5">
    <h1 class="text-h4 font-weight-bold mb-6">ชำระเงินและยืนยันคำสั่งซื้อ</h1>

    <v-row v-if="cartStore.items.length === 0">
      <v-col cols="12" class="text-center py-10">
        <v-icon size="64" color="grey-lighten-1">mdi-cart-outline</v-icon>
        <p class="text-h6 text-grey mt-3">ไม่มีสินค้าในตะกร้าช็อปปิ้งของคุณในขณะนี้</p>
        <v-btn color="primary" class="mt-4" to="/">กลับไปเลือกซื้อเครื่องดนตรี</v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="7">
        <v-card class="pa-5 mb-4" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0">
            <v-icon left color="primary" class="mr-2">mdi-truck-delivery-outline</v-icon>
            ข้อมูลสถานที่จัดส่งสินค้า
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-form ref="formRef" v-model="isFormValid">
            <v-text-field
              v-model="shipping.name"
              label="ชื่อ-นามสกุล ผู้รับสินค้า"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'กรุณากรอกชื่อผู้รับ']"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="shipping.phone"
              label="เบอร์โทรศัพท์ติดต่อ"
              variant="outlined"
              density="comfortable"
              :rules="[
                v => !!v || 'กรุณากรอกเบอร์โทรศัพท์',
                v => /^[0-9]{10}$/.test(v) || 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก'
              ]"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="shipping.address"
              label="ที่อยู่สำหรับจัดส่ง (บ้านเลขที่, ตำบล, อำเภอ, จังหวัด)"
              variant="outlined"
              density="comfortable"
              rows="3"
              :rules="[v => !!v || 'กรุณากรอกที่อยู่จัดส่ง']"
            ></v-textarea>
          </v-form>
        </v-card>

        <v-card class="pa-5" elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0">
            <v-icon left color="primary" class="mr-2">mdi-credit-card-outline</v-icon>
            เลือกช่องทางการชำระเงิน
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-radio-group v-model="paymentMethod" inline>
            <v-radio label="โอนเงินผ่าน PromptPay" value="promptpay" color="primary" class="mr-4"></v-radio>
            <v-radio label="เก็บเงินปลายทาง (COD)" value="cod" color="primary"></v-radio>
          </v-radio-group>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-5" elevation="2" rounded="lg" color="grey-lighten-5">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0">
            สรุปรายการสั่งซื้อ
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-list bg-color="transparent" class="pa-0">
            <v-list-item
              v-for="item in cartStore.items"
              :key="item.id"
              class="px-0 py-2 border-b-sm"
            >
              <template v-slot:prepend>
                <v-avatar rounded="md" size="50" class="mr-3 bg-white" border>
                  <v-img :src="item.image"></v-img>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium text-body-1">
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-grey-darken-1 mt-1">
                {{ Number(item.price).toLocaleString() }} บาท x {{ item.quantity }} ชิ้น
              </v-list-item-subtitle>

              <template v-slot:append>
                <span class="font-weight-bold text-body-1 text-primary">
                  {{ Number(item.price * item.quantity).toLocaleString() }}.-
                </span>
              </template>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-between align-center my-6">
            <span class="text-h6 font-weight-medium">ยอดรวมสุทธิทั้งสิ้น:</span>
            <span class="text-h5 font-weight-black text-primary">
              {{ Number(cartStore.totalPrice).toLocaleString() }} บาท
            </span>
          </div>

          <v-btn
            color="success"
            size="x-large"
            block
            rounded="lg"
            elevation="2"
            :loading="isProcessing"
            :disabled="!isFormValid || isProcessing"
            @click="confirmOrder"
          >
            <v-icon left class="mr-2">mdi-lock-check-outline</v-icon>
            ยืนยันการชำระเงินสั่งซื้อ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const shipping = ref({ name: '', phone: '', address: '' })
const paymentMethod = ref('promptpay')

onMounted(() => {
  // มั่นใจว่าโหลดเซสชันผู้ใช้ขึ้นมาแล้ว
  authStore.initAuth()
  if (authStore.user) {
    shipping.value.name = authStore.user.name || ''
  }
})

const confirmOrder = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // 🚨 ตรวจสิทธิ์: ต้องล็อกอินจริงและต้องมี Token อยู่ในเครื่อง
  const token = useCookie('auth_token').value || authStore.token
  if (!token) {
    alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า')
    router.push('/auth/login')
    return
  }

  isProcessing.value = true

  // 🟢 ส่งข้อมูลตามโครงสร้างใหม่ (ไม่ต้องแนบ userId ดิบไปแล้ว)
  const orderData = {
    total: cartStore.totalPrice,
    customerName: shipping.value.name,
    phone: shipping.value.phone,
    address: shipping.value.address,
    paymentMethod: paymentMethod.value,
    items: cartStore.items.map(item => ({
      productId: item.id, // ส่งไอดีสินค้าไปตัดสต็อก
      quantity: item.quantity,
      price: item.price
    }))
  }

  try {
    // ยิงคำสั่งซื้อพร้อมยื่น Bearer Token ใน Headers
    const response = await axios.post('http://localhost:3001/orders/checkout', orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      const displayId = response.data.orderId.toString().padStart(4, '0')
      alert('สั่งซื้อสำเร็จ! เลขที่คำสั่งซื้อของคุณคือ: ORD-' + displayId)
      
      cartStore.clearCart() // ล้างตะกร้าฝั่งหน้าบ้าน
      router.push('/history') // ดีดไปหน้าประวัติทันที
    }
  } catch (error) {
    console.error('Checkout error:', error.response?.data)
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ')
  } finally {
    isProcessing.value = false
  }
}
</script>