// stores/cart.ts
import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  stock: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    // โหลดของในตะกร้าจากคุกกี้ เพื่อให้กดรีเฟรชหน้า Cart แล้วของไม่หาย
    items: useCookie<CartItem[]>('cart_items', { default: () => [] })
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    // ฟังก์ชันเพิ่มสินค้า
    addToCart(product: any) {
      const existingItem = this.items.find(item => item.id === product.id)

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
    },

    // 🟢 ✨ เพิ่มฟังก์ชันอัปเดตจำนวน เพื่อสยบบั๊กเวลากดบวก/ลดในหน้า Cart.vue
    updateQuantity(productId: number, newQuantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item && newQuantity > 0 && newQuantity <= item.stock) {
        item.quantity = newQuantity
      }
    },

    // ฟังก์ชันลบสินค้ารายชิ้น
    removeFromCart(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
    },

    // ฟังก์ชันเคลียร์ตะกร้าหลังสั่งซื้อเสร็จ
    clearCart() {
      this.items = []
    }
  }
})