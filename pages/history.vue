<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6 mt-4">📦 ประวัติการสั่งซื้อ</h2>

    <v-row v-if="orders.length === 0">
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
                  <v-chip :color="getStatusColor(order.status)" size="small" label variant="flat">
                    {{ order.status }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-divider class="mb-4"></v-divider>
              <h4 class="text-subtitle-2 mb-2 font-weight-bold">รายการสินค้า:</h4>
              <v-table density="compact">
                <tbody>
                  <tr v-for="(item, index) in order.items" :key="index">
                    <td class="text-body-2">{{ item.name }}</td>
                    <td class="text-center text-body-2">x{{ item.quantity }}</td>
                    <td class="text-right text-body-2 text-grey-darken-2">
                      {{ (item.price * item.quantity).toLocaleString() }} ฿
                    </td>
                  </tr>
                </tbody>
              </v-table>
              
              <div class="mt-4 pa-3 bg-grey-lighten-4 rounded text-caption">
                <v-icon start size="small" color="grey-darken-1">mdi-map-marker-outline</v-icon>
                <strong class="text-grey-darken-2">จัดส่งไปที่:</strong> {{ order.shippingAddress }}
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// ข้อมูล Mock up (เวลาทำจริง สามารถใช้ useFetch ยิงไปดึงข้อมูลจาก .NET API ฝั่ง Backend ได้เลยครับ)
const orders = ref([
  {
    orderId: 'ORD-20260223-001',
    date: '23 ก.พ. 2026 14:30',
    total: 1290,
    status: 'รอดำเนินการ',
    shippingAddress: 'อ.หาดใหญ่ จ.สงขลา 90110',
    items: [
      { name: 'คีย์บอร์ดไร้สาย RGB', price: 1290, quantity: 1 }
    ]
  },
  {
    orderId: 'ORD-20260214-089',
    date: '14 ก.พ. 2026 09:15',
    total: 3390,
    status: 'จัดส่งแล้ว',
    shippingAddress: 'อ.หาดใหญ่ จ.สงขลา 90110',
    items: [
      { name: 'เมาส์เกมมิ่ง 16000 DPI', price: 890, quantity: 1 },
      { name: 'หูฟังตัดเสียงรบกวน', price: 2500, quantity: 1 }
    ]
  },
  {
    orderId: 'ORD-20260120-045',
    date: '20 ม.ค. 2026 18:45',
    total: 350,
    status: 'ยกเลิก',
    shippingAddress: 'อ.หาดใหญ่ จ.สงขลา 90110',
    items: [
      { name: 'แผ่นรองเมาส์ XL', price: 350, quantity: 1 }
    ]
  }
])

// ฟังก์ชันแปลงข้อความสถานะให้เป็นสีของ Vuetify
const getStatusColor = (status) => {
  switch (status) {
    case 'รอดำเนินการ': return 'warning'   // สีส้ม
    case 'กำลังจัดเตรียม': return 'info'      // สีฟ้า
    case 'จัดส่งแล้ว': return 'success'     // สีเขียว
    case 'ยกเลิก': return 'error'         // สีแดง
    default: return 'grey'
  }
}
</script>