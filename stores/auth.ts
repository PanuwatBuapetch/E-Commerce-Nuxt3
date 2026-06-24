import { defineStore } from "pinia";
import axios from "axios";

<<<<<<< HEAD
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
=======
export const useAuthStore = defineStore("auth", {
  state: () => ({
    // ตรวจสอบจาก Cookie ทันทีที่โหลด
    isAuthenticated: !!useCookie("auth_token").value,
    user: null as any,
  }),

  actions: {
    // 🟢 ฟังก์ชันสำหรับกู้คืนข้อมูล User เมื่อโหลดหน้าจอ
    initAuth() {
      const token = useCookie("auth_token").value;
      const savedUser = localStorage.getItem("user_info");
      
      if (token && savedUser) {
        this.isAuthenticated = true;
        this.user = JSON.parse(savedUser);
      } else if (!token) {
        this.logout();
      }
    },

    async login(credentials: any) {
      try {
        const res = await axios.post("http://localhost:3001/auth/login", credentials);
        if (res.data) {
          const token = useCookie("auth_token");
          token.value = "abc-123"; // ในงานจริงใช้ JWT จากหลังบ้าน

          this.isAuthenticated = true;
          this.user = res.data.data;

          // เก็บไว้ใน LocalStorage ป้องกันข้อมูลหายตอน Refresh
          localStorage.setItem("user_info", JSON.stringify(res.data.data));
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    async register(credentials: any) {
      try {
        await axios.post("http://localhost:3001/auth/register", credentials);
        return true;
      } catch (error) {
        return false;
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
      }
    },

    logout() {
<<<<<<< HEAD
      this.user = null
      this.token = null
      useCookie('auth_token').value = null
      useCookie('auth_user').value = null
=======
      const token = useCookie("auth_token");
      token.value = null;
      localStorage.removeItem("user_info");
      this.isAuthenticated = false;
      this.user = null;
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
    }
  },
});