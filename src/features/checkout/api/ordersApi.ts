import { apiClient } from '@/lib/api/axiosClient'
import type { Order } from '@/types/order'

export const ordersApi = {
  create: async (order: Order): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/orders', order)
    return data
  },
}
