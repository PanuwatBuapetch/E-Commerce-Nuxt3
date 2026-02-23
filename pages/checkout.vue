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
          <v-form ref="form" v-model="isFormValid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="shipping.name" 
                  label="ชื่อ-นามสกุล" 
                  variant="outlined" 
                  :rules="[v => !!v || 'กรุณากรอกชื่อ']"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="shipping.phone" 
                  label="เบอร์โทรศัพท์" 
                  variant="outlined" 
                  :rules="[v => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea 
                  v-model="shipping.address" 
                  label="ที่อยู่จัดส่งโดยละเอียด" 
                  variant="outlined" 
                  rows="3"
                  :rules="[v => !!v || 'กรุณากรอกที่อยู่']"
                ></v-textarea>
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
          
          <v-btn 
            color="success" 
            block 
            size="x-large" 
            prepend-icon="mdi-check-circle"
            :disabled="!isFormValid || isProcessing"
            :loading="isProcessing"
            @click="confirmOrder"
          >
            ยืนยันคำสั่งซื้อ
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const router = useRouter()

// ตัวแปรสำหรับฟอร์ม
const isFormValid = ref(false)
const isProcessing = ref(false)

const shipping = ref({
  name: '',
  phone: '',
  address: ''
})

const paymentMethod = ref('promptpay')

// ฟังก์ชันยืนยันการสั่งซื้อ
const confirmOrder = async () => {
  if (!isFormValid.value) return

  isProcessing.value = true

  // จำลองการส่งข้อมูลไปหา Backend API (เช่น .NET Web API ของคุณ)
  setTimeout(() => {
    isProcessing.value = false
    
    // แจ้งเตือนความสำเร็จ (ชีวิตจริงอาจจะดึง Order ID จาก API มาโชว์)
    alert('สั่งซื้อสำเร็จ! รอรับสินค้าได้เลยครับ')
    
    // ล้างตะกร้า
    cartStore.clearCart()
    
    // พาผู้ใช้ไปหน้าประวัติการสั่งซื้อ (ที่เรากำลังจะสร้างต่อไป)
    router.push('/history')
  }, 1500) // หน่วงเวลา 1.5 วินาทีให้ดูเหมือนกำลังโหลดข้อมูลจริงๆ
}
</script>