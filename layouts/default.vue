<template>
  <div>
    <v-app-bar color="primary" prominent elevation="3">
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none text-white font-weight-bold">
          <v-icon start>mdi-storefront</v-icon>
          Poom E-Commerce
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" variant="text" class="hidden-sm-and-down" prepend-icon="mdi-home">
        หน้าแรก
      </v-btn>

      <v-btn 
        v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'" 
        to="/admin/orders" 
        variant="text" 
        color="yellow-accent-2"
        class="font-weight-bold"
        prepend-icon="mdi-shield-check"
      >
        จัดการระบบ
      </v-btn>

      <v-btn 
        v-if="authStore.isAuthenticated"
        to="/history" 
        variant="text" 
        prepend-icon="mdi-clipboard-text-clock-outline"
      >
        ประวัติสั่งซื้อ
      </v-btn>

      <v-btn to="/cart" variant="text" class="position-relative mr-2">
        <v-icon size="large">mdi-cart-outline</v-icon>
        <v-badge
          v-if="cartStore.totalItems > 0"
          :content="cartStore.totalItems"
          color="error"
          floating
          offset-x="-5"
          offset-y="-5"
        ></v-badge>
      </v-btn>

      <v-divider vertical class="mx-2 hidden-sm-and-down"></v-divider>

      <div v-if="authStore.isAuthenticated" class="d-flex align-center ml-2">
        <v-icon size="large" class="mr-2">mdi-account-circle</v-icon>
        <div class="d-flex flex-column mr-4">
          <span class="text-caption leading-none text-grey-lighten-2">{{ authStore.user?.role }}</span>
          <span class="font-weight-medium text-white">{{ authStore.user?.name }}</span>
        </div>
        
        <v-btn @click="handleLogout" variant="tonal" color="white" prepend-icon="mdi-logout" size="small">
          ออกจากระบบ
        </v-btn>
      </div>

      <v-btn v-else to="/auth/login" variant="outlined" class="ml-2 bg-white text-primary" prepend-icon="mdi-login">
        เข้าสู่ระบบ
      </v-btn>

    </v-app-bar>

    <v-main class="bg-grey-lighten-4" style="min-height: 100vh;">
      <slot /> 
    </v-main>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth' // ดึง Auth Store มาใช้เช็คสิทธิ์

const cartStore = useCartStore()
const authStore = useAuthStore()

// ฟังก์ชันสำหรับกดปุ่มออกจากระบบ
const handleLogout = async () => {
  authStore.logout() // เคลียร์สถานะใน Pinia ให้กลายเป็น false
  cartStore.clearCart() // (Option) ล้างตะกร้าสินค้าด้วยเพื่อความปลอดภัย
  await navigateTo('/auth/login') // เตะกลับไปหน้า Login
}
</script>