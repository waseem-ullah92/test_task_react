import { apiClient } from '@/lib/api/axiosClient'
import type { Product } from '@/types/product'

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products')
    return data
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`)
    return data
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/products', product)
    return data
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await apiClient.put<Product>(`/products/${id}`, product)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}
