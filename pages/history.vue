<template>
  <v-container>
    <v-btn 
  variant="outlined" 
  color="secondary" 
  prepend-icon="mdi-printer"
  @click="printReceipt(order)"
>
  พิมพ์ใบเสร็จ
</v-btn>
    <h2 class="text-h4 font-weight-bold mb-6 mt-4">📦 ประวัติการสั่งซื้อ</h2>

    <v-row v-if="loading">
      <v-col class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-grey">กำลังโหลดประวัติการสั่งซื้อ...</div>
      </v-col>
    </v-row>

    <v-row v-else-if="orders.length === 0">
      <v-col cols="12">
        <v-card class="text-center py-12" elevation="2" rounded="lg">
          <v-icon size="80" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
          <h3 class="text-h6 mt-4 text-grey-darken-1">คุณยังไม่มีประวัติการสั่งซื้อสินค้า</h3>
          <v-btn color="primary" class="mt-6" to="/" prepend-icon="mdi-shopping-outline">
            ไปช้อปปิ้งกันเลย
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel 
            v-for="order in orders" 
            :key="order.orderId" 
            class="mb-2 border rounded"
            elevation="1"
          >
            <v-expansion-panel-title>
              <v-row align="center" no-gutters>
                <v-col cols="12" sm="3" class="font-weight-bold text-primary mb-1 mb-sm-0">
                  <v-icon start size="small">mdi-receipt-text-outline</v-icon>
                  {{ order.orderId }}
                </v-col>
                <v-col cols="6" sm="3" class="text-grey-darken-1 text-caption text-sm-body-2">
                  {{ order.date }}
                </v-col>
                <v-col cols="6" sm="3" class="text-right text-sm-left font-weight-bold">
                  {{ order.total.toLocaleString() }} ฿
                </v-col>
                <v-col cols="12" sm="3" class="text-sm-right mt-2 mt-sm-0">
                  <v-chip :color="getStatusColor(order.statusLabel)" size="small" label variant="flat">
                    {{ order.statusLabel }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-divider class="mb-4"></v-divider>
              
              <v-row>
                <v-col cols="12" md="7">
                  <h4 class="text-subtitle-2 mb-2 font-weight-bold">รายการสินค้า:</h4>
                  <v-table density="compact" class="border rounded">
                    <tbody>
                      <tr v-for="(item, index) in order.items" :key="index">
                        <td class="text-body-2">{{ item.name }}</td>
                        <td class="text-center text-body-2 text-grey">x{{ item.quantity }}</td>
                        <td class="text-right text-body-2 font-weight-medium">
                          {{ (item.price * item.quantity).toLocaleString() }} ฿
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>

                <v-col cols="12" md="5">
                  <h4 class="text-subtitle-2 mb-2 font-weight-bold">ข้อมูลการจัดส่ง & ชำระเงิน:</h4>
                  <v-card variant="tonal" color="grey-lighten-3" class="pa-3 rounded-lg text-black">
                    <div class="d-flex mb-2">
                      <v-icon size="small" color="primary" class="mr-2">mdi-account-outline</v-icon>
                      <div class="text-black">
                        <strong>ผู้รับ:</strong> {{ order.customerName || 'ไม่ระบุชื่อ' }} 
                        <span v-if="order.phone">({{ order.phone }})</span>
                      </div>
                    </div>
                    <div class="d-flex mb-2">
                      <v-icon size="small" color="primary" class="mr-2">mdi-map-marker-outline</v-icon>
                      <div class="text-black">
                        <strong>ที่อยู่:</strong> {{ order.shippingAddress || 'ไม่ระบุที่อยู่' }}
                      </div>
                    </div>
                    <div class="d-flex">
                      <v-icon size="small" color="primary" class="mr-2">mdi-credit-card-outline</v-icon>
                      <div class="text-black">
                        <strong>การชำระเงิน:</strong> {{ order.paymentMethodLabel }}
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(true)

const fetchHistory = async () => {
  try {
    loading.value = true
    // ใช้ ID 4 จากคนที่ Login อยู่จริง
    const userId = authStore.user?.id || 4 
    
    // ดึงข้อมูลจาก API (ตรวจสอบว่า NestJS ของคุณใช้ Route นี้จริง)
    const res = await axios.get(`http://localhost:3001/orders/history?userId=${userId}`)
    
    // แมพข้อมูลจาก JSON เข้ากับตัวแปรที่ UI ใช้งาน
    orders.value = res.data.map(order => ({
      orderId: `ORD-${order.id.toString().padStart(4, '0')}`,
      date: formatDate(order.created_at),
      total: parseFloat(order.total),
      statusLabel: translateStatus(order.status),
      
      // ดึงข้อมูลจริงจากฐานข้อมูลมาแสดง
      customerName: order.customer_name, 
      phone: order.phone,
      shippingAddress: order.address, 
      paymentMethodLabel: translatePayment(order.payment_method),

      items: order.items.map(item => ({
        name: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }))
    }))
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const translateStatus = (status) => {
  const statusMap = {
    'pending': 'รอดำเนินการ',
    'shipped': 'จัดส่งแล้ว',
    'success': 'ชำระเงินแล้ว',
    'cancelled': 'ยกเลิก'
  }
  return statusMap[status] || status
}

const translatePayment = (method) => {
  const paymentMap = {
    'promptpay': 'โอนเงิน (PromptPay)',
    'credit_card': 'บัตรเครดิต/เดบิต',
    'cod': 'เก็บเงินปลายทาง'
  }
  return paymentMap[method] || 'ไม่ระบุ'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'รอดำเนินการ': return 'warning'
    case 'ชำระเงินแล้ว':
    case 'จัดส่งแล้ว': return 'success'
    case 'ยกเลิก': return 'error'
    default: return 'grey'
  }
}
const printReceipt = (order) => {
  // สั่งพิมพ์หน้าจอปัจจุบัน (ใช้ CSS ซ่อนส่วนที่ไม่ต้องการ)
  window.print();
}

onMounted(() => {
  fetchHistory()
})
</script>