<template>
  <v-container>
    <div class="d-flex align-center mb-6 mt-4">
      <h2 class="text-h4 font-weight-bold">👨‍💼 จัดการคำสั่งซื้อ (Admin)</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="fetchAllOrders" :loading="loading">
        รีเฟรชข้อมูล
      </v-btn>
    </div>

    <v-card elevation="2" rounded="lg">
      <v-table hover>
        <thead>
          <tr class="bg-grey-lighten-4">
            <th class="text-left font-weight-bold">เลขที่สั่งซื้อ</th>
            <th class="text-left font-weight-bold">ลูกค้า / ที่อยู่</th>
            <th class="text-right font-weight-bold">ยอดรวม</th>
            <th class="text-center font-weight-bold">สถานะ</th>
            <th class="text-center font-weight-bold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="5" class="text-center py-8 text-grey">ไม่มีรายการสั่งซื้อในระบบ</td>
          </tr>
          <tr v-for="order in orders" :key="order.id">
            <td class="font-weight-bold text-primary">ORD-{{ order.id.toString().padStart(4, '0') }}</td>
            
            <td>
              <div class="font-weight-bold">{{ order.customer_name || 'ไม่ระบุชื่อ' }}</div>
              <div class="text-caption text-grey-darken-1">{{ order.address || 'ไม่ระบุที่อยู่' }}</div>
              <div class="text-caption text-primary">{{ order.phone }}</div>
            </td>

            <td class="text-right font-weight-bold">
              {{ Number(order.total).toLocaleString() }} ฿
            </td>

            <td class="text-center">
              <v-chip :color="getStatusColor(order.status)" size="small" label variant="flat">
                {{ translateStatus(order.status) }}
              </v-chip>
            </td>

            <td class="text-center">
              <v-btn
                v-if="order.status === 'pending'"
                color="success"
                size="small"
                variant="flat"
                prepend-icon="mdi-check-circle"
                @click="updateStatus(order.id, 'success')"
              >
                ยืนยันการจ่ายเงิน
              </v-btn>
              <v-btn
                v-else
                color="grey"
                size="small"
                variant="outlined"
                disabled
              >
                เรียบร้อยแล้ว
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(false)

// 🟢 ดึงออเดอร์ทั้งหมด (คนละตัวกับหน้า History ของ User)
const fetchAllOrders = async () => {
  try {
    loading.value = true
    // เรียก API ตัวใหม่ที่เราสร้างใน Backend สำหรับ Admin
    const res = await axios.get('http://localhost:3001/orders/admin/all-orders')
    orders.value = res.data
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

// 🟢 เปลี่ยนสถานะออเดอร์
const updateStatus = async (orderId, newStatus) => {
  if (!confirm(`ยืนยันการเปลี่ยนสถานะออเดอร์ ORD-${orderId.toString().padStart(4, '0')} เป็น "ชำระเงินแล้ว"?`)) return
  
  try {
    await axios.post(`http://localhost:3001/orders/${orderId}/status`, { status: newStatus })
    alert('อัปเดตสถานะสำเร็จ!')
    fetchAllOrders() // โหลดข้อมูลใหม่หลังจากอัปเดต
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const translateStatus = (status) => {
  const statusMap = { 'pending': 'รอดำเนินการ', 'success': 'ชำระเงินแล้ว', 'cancelled': 'ยกเลิก' }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'success': return 'success'
    case 'cancelled': return 'error'
    default: return 'grey'
  }
}

onMounted(() => {
  fetchAllOrders()
})
</script>