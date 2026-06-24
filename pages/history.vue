<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6 mt-4">📦 ประวัติการสั่งซื้อ</h2>

    <v-row v-if="loading">
      <v-col class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <div class="mt-4 text-grey">กำลังโหลดประวัติการสั่งซื้อ...</div>
      </v-col>
    </v-row>

    <v-row v-else-if="orders.length === 0">
      <v-col cols="12">
        <v-card class="text-center py-12" elevation="2" rounded="lg">
          <v-icon size="80" color="grey-lighten-1"
            >mdi-package-variant-closed</v-icon
          >
          <h3 class="text-h6 mt-4 text-grey-darken-1">
            คุณยังไม่มีประวัติการสั่งซื้อสินค้า
          </h3>
          <v-btn
            color="primary"
            class="mt-6"
            to="/"
            prepend-icon="mdi-shopping-outline"
          >
            กลับไปเลือกซื้อสินค้า
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
                <v-col
                  cols="12"
                  sm="3"
                  class="font-weight-bold text-primary mb-1 mb-sm-0"
                >
                  <v-icon start size="small">mdi-receipt-text-outline</v-icon>
                  {{ order.orderId }}
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                  class="text-grey-darken-1 text-caption text-sm-body-2"
                >
                  {{ order.date }}
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                  class="text-right text-sm-left font-weight-bold"
                >
                  {{ order.total.toLocaleString() }} ฿
                </v-col>
                <v-col cols="12" sm="3" class="text-sm-right mt-2 mt-sm-0">
                  <v-chip
                    :color="getStatusColor(order.statusLabel)"
                    size="small"
                    label
                    variant="flat"
                    class="mr-2"
                  >
                    {{ order.statusLabel }}
                  </v-chip>
                  <v-btn
                    variant="outlined"
                    size="x-small"
                    color="secondary"
                    icon="mdi-printer"
                    @click.stop="printReceipt(order)"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-divider class="mb-4"></v-divider>

              <v-row>
                <v-col cols="12" md="7">
                  <h4 class="text-subtitle-2 mb-2 font-weight-bold">
                    รายการสินค้า:
                  </h4>
                  <v-table density="compact" class="border rounded">
                    <tbody>
                      <tr v-for="(item, index) in order.items" :key="index">
                        <td class="text-body-2">{{ item.name }}</td>
                        <td class="text-center text-body-2 text-grey">
                          x{{ item.quantity }}
                        </td>
                        <td class="text-right text-body-2 font-weight-medium">
                          {{ (item.price * item.quantity).toLocaleString() }} ฿
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>

                <v-col cols="12" md="5">
                  <h4 class="text-subtitle-2 mb-2 font-weight-bold">
                    ข้อมูลการจัดส่ง & ชำระเงิน:
                  </h4>
                  <v-card
                    variant="tonal"
                    color="grey-lighten-3"
                    class="pa-3 rounded-lg text-black"
                  >
                    <div class="d-flex mb-2">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-account-outline</v-icon
                      >
                      <div class="text-black">
                        <strong>ผู้รับ:</strong>
                        {{ order.customerName || "ไม่ระบุชื่อ" }}
                        <span v-if="order.phone">({{ order.phone }})</span>
                      </div>
                    </div>
                    <div class="d-flex mb-2">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-map-marker-outline</v-icon
                      >
                      <div class="text-black">
                        <strong>ที่อยู่:</strong>
                        {{ order.shippingAddress || "ไม่ระบุที่อยู่" }}
                      </div>
                    </div>
                    <div class="d-flex">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-credit-card-outline</v-icon
                      >
                      <div class="text-black">
                        <strong>การชำระเงิน:</strong>
                        {{ order.paymentMethodLabel }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const orders = ref([]);
const loading = ref(true);

// 🟢 ✨ แก้ไขจุดที่ 1: ดึงคุกกี้ขึ้นมาประกาศไว้ที่ระดับบนสุด (Top-level) ตามไวยากรณ์ Nuxt 3
const tokenCookie = useCookie("auth_token");

const fetchHistory = async () => {
  try {
    loading.value = true;
    authStore.initAuth(); // ตรวจทานการโหลดคุกกี้สิทธิ์ของผู้ใช้

    const token = useCookie("auth_token").value || authStore.token;
    if (!token) {
      alert("กรุณาเข้าสู่ระบบเพื่อตรวจสอบประวัติคำสั่งซื้อ");
      router.push("/auth/login");
      return;
    }

    // ยิงดึงประวัติสั่งซื้อโดยให้หลังบ้านแยกแยะสิทธิ์เอาจากบัตร Token เอง
    const res = await axios.get("http://localhost:3001/orders/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🟢 ✨ ปรับการดึงค่ายอดรวมให้รองรับ total_price จากฐานข้อมูลหลังบ้าน
    orders.value = res.data.map((order) => ({
      orderId: `ORD-${order.id.toString().padStart(4, "0")}`,
      date: formatDate(order.created_at),

      // 🔥 เปลี่ยนจาก order.total เป็นบรรทัดนี้ครับ:
      total: parseFloat(order.total_price || order.total || 0),

      statusLabel: translateStatus(order.status),
      customerName: order.customer_name,
      phone: order.phone,
      shippingAddress: order.address,
      paymentMethodLabel: translatePayment(order.payment_method),
      items:
        order.items && Array.isArray(order.items)
          ? order.items.map((item) => ({
              name: item.name || "สินค้าทั่วไป",
              price: parseFloat(item.price || 0),
              quantity: item.quantity || 1,
            }))
          : [],
    }));
  } catch (error) {
    console.error("Error fetching history:", error);
    if (error.response?.status === 401) {
      alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      authStore.logout();
      router.push("/auth/login");
    }
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const translateStatus = (status) => {
  const statusMap = {
    pending: "รอดำเนินการ",
    shipped: "จัดส่งแล้ว",
    success: "ชำระเงินแล้ว",
    cancelled: "ยกเลิก",
  };
  return statusMap[status] || status;
};

const translatePayment = (method) => {
  const paymentMap = {
    promptpay: "โอนเงิน (PromptPay)",
    credit_card: "บัตรเครดิต/เดบิต",
    cod: "เก็บเงินปลายทาง",
  };
  return paymentMap[method] || "ไม่ระบุ";
};

const getStatusColor = (status) => {
  switch (status) {
    case "รอดำเนินการ":
      return "warning";
    case "ชำระเงินแล้ว":
    case "จัดส่งแล้ว":
      return "success";
    case "ยกเลิก":
      return "error";
    default:
      return "grey";
  }
};

const printReceipt = (order) => {
  window.print();
};

onMounted(() => {
  fetchHistory();
});
</script>