// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false, // สถานะว่า Login หรือยัง (ค่าเริ่มต้นคือ ยัง)
    user: null as any       // เก็บข้อมูลผู้ใช้
  }),
  
  actions: {
    // ฟังก์ชันจำลองการ Login
    login(email: string) {
      this.isAuthenticated = true
      this.user = { email: email }
    },
    
    // ฟังก์ชัน Logout
    logout() {
      this.isAuthenticated = false
      this.user = null
    }
  }
})