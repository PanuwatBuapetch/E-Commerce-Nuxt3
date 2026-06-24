import { useAuthStore } from '~/stores/auth'

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // อ่านจากคุกกี้ตรงๆ เพื่อความแม่นยำสูงสุดฝั่ง Server และ Client
  const token = useCookie('auth_token').value

  // ถ้าไม่มี token และจะไปหน้าอื่นที่ไม่ใช่หน้าล็อกอิน/สมัครสมาชิก -> ให้ดีดไป login
  if (!token && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }

  // ถ้ามี token อยู่แล้ว แต่ดันทะลึ่งจะเปิดหน้า login -> ดีดไปหน้าแรก
  if (token && to.path.startsWith('/auth')) {
    return navigateTo('/')
  }
})