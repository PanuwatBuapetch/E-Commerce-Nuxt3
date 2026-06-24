<template>
  <v-container class="my-5">
    <h1 class="text-h4 font-weight-bold mb-6">⚙️ ระบบจัดการคำสั่งซื้อลูกค้า (Admin)</h1>

    <v-card v-if="loading" class="text-center py-10" flat>
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      <p class="mt-3 text-grey">กำลังโหลดข้อมูลออเดอร์ของลูกค้า...</p>
    </v-card>

    <v-card v-else-if="orders.length === 0" class="text-center py-10" flat>
      <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
      <p class="text-h6 text-grey mt-2">ยังไม่มีรายการสั่งซื้อใดๆ ในระบบคอมเมิร์ซ</p>
    </v-card>

    <v-row v-else>
      <v-col cols="12" v-for="order in orders" :key="order.id" class="mb-2">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex justify-between align-center flex-wrap border-b pb-3 mb-3">
            <div>
              <span class="text-h6 font-weight-bold text-primary">ORD-{{ order.id.toString().padStart(4, '0') }}</span>
              <span class="text-body-2 text-grey ml-3">สั่งซื้อเมื่อ: {{ formatDate(order.created_at) }}</span>
            </div>
            <div class="d-flex align-center" style="width: 250px;">
              <v-select
                v-model="order.status"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                label="สถานะบิล"
                variant="outlined"
                density="compact"
                hide-details
                class="mr-2"
                @update:model-value="(val) => updateOrderStatus(order.id, val)"
              ></v-select>
            </div>
          </div>

          <div class="bg-grey-lighten-5 pa-3 rounded-lg mb-3 text-body-2">
            <div><strong>ชื่อลูกค้า:</strong> {{ order.customer_name }} | <strong>เบอร์โทร:</strong> {{ order.phone }}</div>
            <div class="mt-1"><strong>ที่อยู่จัดส่ง:</strong> {{ order.address }}</div>
            <div class="mt-1"><strong>การชำระเงิน:</strong> {{ order.payment_method.toUpperCase() }}</div>
          </div>

          <v-row v-for="(item, idx) in order.items" :key="idx" class="align-center py-1 text-body-2 px-2">
            <v-col cols="8">- {{ item.name }} (x{{ item.quantity }})</v-col>
            <v-col cols="4" class="text-right font-weight-medium">
              {{ Number(item.price * item.quantity).toLocaleString() }} บาท
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>
          <div class="text-right text-h6">
            ยอดรวมทั้งหมด: <span class="text-primary font-weight-black">{{ Number(order.total_price).toLocaleString() }} บาท</span>
          </div>
        </v-card>
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

const statusOptions = [
  { label: '⏳ รอการตรวจสอบ (Pending)', value: 'pending' },
  { label: '📦 จัดส่งแล้ว (Shipped)', value: 'shipped' },
  { label: '✅ สำเร็จสิ้นสุด (Completed)', value: 'completed' },
  { label: '❌ ยกเลิกบิล (Cancelled)', value: 'cancelled' }
]

const fetchAllOrders = async () => {
  try {
    loading.value = true
    const token = useCookie('auth_token').value || authStore.token
    const res = await axios.get('http://localhost:3001/orders/history', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // 🟢 ✨ แก้ไขจุดนี้: ถ้าหลังบ้านส่งมาเป็นโครงสร้าง { success: true, data: [...] }
    // ให้เติม .data เข้าไปอีกชั้นหนึ่ง เพื่อดึง Array แท้ๆ ออกมาใช้งานครับ
    orders.value = res.data.data || res.data 
    
  } catch (error) {
    console.error('Fetch all orders error:', error)
  } finally {
    loading.value = false
  }
}

// 🟢 ฟังก์ชันอัปเดตสถานะบิลกลับไปยังหลังบ้าน
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = useCookie('auth_token').value || authStore.token
    
    // 1. ยิง PUT อัปเดตสถานะ (มั่นใจว่าส่งข้อมูลในรูปแบบ { status: 'shipped' })
    const response = await axios.put(`http://localhost:3001/orders/${orderId}/status`, 
      { status: newStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (response.data.success) {
      alert(`อัปเดตสถานะออเดอร์ ORD-${orderId.toString().padStart(4, '0')} เป็น ${newStatus} สำเร็จ!`)
      
      // 2. 🚨 ไฮไลท์เด็ด: สั่งเรียกฟังก์ชันดึงข้อมูลใหม่ทันที เพื่อให้ UI เปลี่ยนสีอัปเดตตามหลังบ้าน
      await fetchAllOrders() 
    }
  } catch (error) {
    console.error('Update status error:', error)
    alert(error.response?.data?.message || 'ไม่สามารถอัปเดตสถานะได้')
    
    // ถ้าอัปเดตพัง ให้ดึงค่าเก่ากลับมาคืนฟอร์ม
    await fetchAllOrders()
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('th-TH')
}

onMounted(() => {
  fetchAllOrders()
})
</script>