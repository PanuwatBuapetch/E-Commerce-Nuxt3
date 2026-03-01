import { defineStore } from "pinia";
import axios from "axios";

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
      }
    },

    logout() {
      const token = useCookie("auth_token");
      token.value = null;
      localStorage.removeItem("user_info");
      this.isAuthenticated = false;
      this.user = null;
    }
  },
});