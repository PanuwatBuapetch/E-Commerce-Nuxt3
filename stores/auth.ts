// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    // 🟢 ✨ ดึงคุกกี้มาเป็นค่าเริ่มต้นของ State ทันทีเวลารีเฟรชหน้าจอ
    const tokenCookie = useCookie('auth_token')
    const userCookie = useCookie('auth_user')

    return {
      token: tokenCookie.value || null as string | null,
      user: userCookie.value ? (typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value) : null as User | null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    setUserSession(token: string, userData: User) {
      this.token = token
      this.user = userData

      // เซฟลงคุกกี้ให้อยู่ยาว 7 วัน
      const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      tokenCookie.value = token

      const userCookie = useCookie('auth_user', { maxAge: 60 * 60 * 24 * 7 })
      userCookie.value = JSON.stringify(userData)
    },

    // 🟢 ฟังก์ชันนี้เก็บไว้ หรือเอาออกก็ได้เพราะ State ดึงคุกกี้ออโต้แล้ว
    initAuth() {
      const tokenCookie = useCookie('auth_token')
      const userCookie = useCookie('auth_user')

      if (tokenCookie.value && userCookie.value) {
        this.token = tokenCookie.value
        this.user = typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value
      }
    },

    logout() {
      this.user = null
      this.token = null
      useCookie('auth_token').value = null
      useCookie('auth_user').value = null
    }
  }
})