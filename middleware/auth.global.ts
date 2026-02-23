import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // ปล่อยให้เข้าหน้า Login กับ Register ได้ปกติ
  if (to.path === '/auth/login' || to.path === '/auth/register') {
    return
  }

  // ถ้าจะไปหน้าอื่น แล้วยังไม่ได้ Login -> เตะไปหน้า Login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})