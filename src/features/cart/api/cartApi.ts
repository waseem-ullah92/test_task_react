import { apiClient } from '@/lib/api/axiosClient'
import type { CartItem } from '@/types/cart'

export const cartApi = {
  getAll: async (): Promise<CartItem[]> => {
    const { data } = await apiClient.get<CartItem[]>('/cart')
    return data
  },

  add: async (item: CartItem): Promise<CartItem> => {
    const { data } = await apiClient.post<CartItem>('/cart', item)
    return data
  },

  update: async (id: string, quantity: number): Promise<CartItem> => {
    const { data } = await apiClient.patch<CartItem>(`/cart/${id}`, { quantity })
    return data
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/cart/${id}`)
  },

  clear: async (items: CartItem[]): Promise<void> => {
    await Promise.all(items.map((item) => apiClient.delete(`/cart/${item.id}`)))
  },
}
