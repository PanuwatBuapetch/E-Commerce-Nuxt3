import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')
  const isAuthenticated = !!token.value

  // 1. ถ้า Login แล้ว ห้ามกลับไปหน้า Login/Register
  if (isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/')
  }

  // 2. ถ้ายังไม่ Login ห้ามเข้าหน้าอื่นที่ต้องการสิทธิ์ (ยกเว้นหน้า login/register)
  if (!isAuthenticated && to.path !== '/auth/login' && to.path !== '/auth/register') {
    return navigateTo('/auth/login')
  }
})