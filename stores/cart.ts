import { defineStore } from 'pinia'

// 1. สร้าง Interface เพื่อกำหนดโครงสร้างของข้อมูลสินค้า
export interface Product {
  id: number
  name: string
  price: number
  stock: number
  image: string
}

// 2. สร้าง Interface สำหรับสินค้าในตะกร้า (สืบทอดจาก Product แล้วเพิ่ม quantity)
export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  // 3. ระบุ Type ให้กับ items ใน State ว่าเป็น Array ของ CartItem
  state: () => ({
    items: [] as CartItem[]
  }),
  
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    }
  },

  actions: {
    // ระบุ Type ให้ product เป็น Product
    addToCart(product: Product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    
    // ระบุ Type ให้ productId เป็น number
    removeFromCart(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
    },

    // ระบุ Type ให้ productId และ quantity เป็น number
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
    },

    clearCart() {
      this.items = []
    }
  }
})