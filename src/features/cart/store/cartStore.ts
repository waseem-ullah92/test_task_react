'use client'
// Requires client context: Zustand store accesses localStorage via persist middleware

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import { calcItemCount, calcSubtotal } from '../utils/cartCalculations'

type CartStore = {
  items: CartItem[]
  addItem: (productId: string, variantId: string, quantity: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: (products: Product[]) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, variantId, quantity) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId && item.variantId === variantId
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, { id: nanoid(), productId, variantId, quantity }],
          }
        })
      },

      removeItem: (cartItemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== cartItemId) }))
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => calcItemCount(get().items),

      getSubtotal: (products) => calcSubtotal(get().items, products),
    }),
    {
      name: 'acs_cart_v1',
      // skipHydration prevents SSR mismatch: the cart only reads localStorage after mount.
      // useCartStore.persist.rehydrate() is called in a useEffect in providers.tsx.
      skipHydration: true,
    }
  )
)
