import { defineStore } from 'pinia'

// 1. กำหนด Interface ให้ชัดเจน
export interface Product {
  id: number
  name: string
  price: number | string 
  stock: number
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    // แก้ไข Error 'process': ใช้ import.meta.client แทนตามมาตรฐาน Nuxt 3
    items: (import.meta.client && localStorage.getItem('cart_items')) 
      ? JSON.parse(localStorage.getItem('cart_items')!) 
      : [] as CartItem[]
  }),
  
  getters: {
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
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.saveToLocal()
    },
    
    removeFromCart(productId: number) {
      this.items = this.items.filter((item: CartItem) => item.id !== productId)
      this.saveToLocal()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((item: CartItem) => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
      this.saveToLocal()
    },

    clearCart() {
      this.items = []
      if (import.meta.client) {
        localStorage.removeItem('cart_items')
      }
    }
  }
})