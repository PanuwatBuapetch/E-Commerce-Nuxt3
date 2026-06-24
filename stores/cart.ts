// stores/cart.ts
import { defineStore } from 'pinia'

<<<<<<< HEAD
interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  stock: number
=======
// 1. กำหนด Interface ให้ชัดเจน
export interface Product {
  id: number
  name: string
  price: number | string 
  stock: number
  image: string
}

export interface CartItem extends Product {
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
<<<<<<< HEAD
    // โหลดของในตะกร้าจากคุกกี้ เพื่อให้กดรีเฟรชหน้า Cart แล้วของไม่หาย
    items: useCookie<CartItem[]>('cart_items', { default: () => [] })
=======
    // แก้ไข Error 'process': ใช้ import.meta.client แทนตามมาตรฐาน Nuxt 3
    items: (import.meta.client && localStorage.getItem('cart_items')) 
      ? JSON.parse(localStorage.getItem('cart_items')!) 
      : [] as CartItem[]
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
  }),

  getters: {
<<<<<<< HEAD
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    // ฟังก์ชันเพิ่มสินค้า
    addToCart(product: any) {
      const existingItem = this.items.find(item => item.id === product.id)

=======
    totalPrice: (state) => {
      // ระบุ (total: number, item: CartItem)
      return state.items.reduce((total: number, item: CartItem) => {
        return total + (Number(item.price) * item.quantity)
      }, 0) // อย่าลืมใส่เลข 0 เป็นค่าเริ่มต้นตรงนี้ด้วย
    },
    totalItems: (state) => {
      // ระบุ (total: number, item: CartItem)
      return state.items.reduce((total: number, item: CartItem) => {
        return total + item.quantity
      }, 0)
    }
  },

  actions: {
    saveToLocal() {
      if (import.meta.client) {
        localStorage.setItem('cart_items', JSON.stringify(this.items))
      }
    },

    addToCart(product: Product) {
      // ระบุ Type (item: CartItem) เพื่อแก้ Error 'implicitly any'
      const existingItem = this.items.find((item: CartItem) => item.id === product.id)
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity++
        } else {
          alert('ไม่สามารถเพิ่มสินค้าได้เนื่องจากสินค้าในสต็อกไม่พอ')
        }
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          stock: product.stock,
          quantity: 1
        })
      }
      this.saveToLocal()
    },
<<<<<<< HEAD

    // 🟢 ✨ เพิ่มฟังก์ชันอัปเดตจำนวน เพื่อสยบบั๊กเวลากดบวก/ลดในหน้า Cart.vue
    updateQuantity(productId: number, newQuantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item && newQuantity > 0 && newQuantity <= item.stock) {
        item.quantity = newQuantity
      }
    },

    // ฟังก์ชันลบสินค้ารายชิ้น
=======
    
>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
    removeFromCart(productId: number) {
      this.items = this.items.filter((item: CartItem) => item.id !== productId)
      this.saveToLocal()
    },

<<<<<<< HEAD
    // ฟังก์ชันเคลียร์ตะกร้าหลังสั่งซื้อเสร็จ
=======
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((item: CartItem) => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
      this.saveToLocal()
    },

>>>>>>> 6828f68c6325b0c8b86278e1ad390fcadd85dd28
    clearCart() {
      this.items = []
      if (import.meta.client) {
        localStorage.removeItem('cart_items')
      }
    }
  }
})