import { useAuthStore } from '~/stores/auth'

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
<<<<<<< HEAD
  // อ่านจากคุกกี้ตรงๆ เพื่อความแม่นยำสูงสุดฝั่ง Server และ Client
  const token = useCookie('auth_token').value

  // ถ้าไม่มี token และจะไปหน้าอื่นที่ไม่ใช่หน้าล็อกอิน/สมัครสมาชิก -> ให้ดีดไป login
  if (!token && !to.path.startsWith('/auth')) {
=======
  const token = useCookie('auth_token')
  const isAuthenticated = !!token.value

  // 1. ถ้า Login แล้ว ห้ามกลับไปหน้า Login/Register
  if (isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/')
  }

  // 2. ถ้ายังไม่ Login ห้ามเข้าหน้าอื่นที่ต้องการสิทธิ์ (ยกเว้นหน้า login/register)
  if (!isAuthenticated && to.path !== '/auth/login' && to.path !== '/auth/register') {
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
    return navigateTo('/auth/login')
  }

  // ถ้ามี token อยู่แล้ว แต่ดันทะลึ่งจะเปิดหน้า login -> ดีดไปหน้าแรก
  if (token && to.path.startsWith('/auth')) {
    return navigateTo('/')
  }
})