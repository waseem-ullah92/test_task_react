'use client'
// Requires client context: uses TanStack Query useMutation

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/api/queryKeys'
import { productsApi } from '../api/productsApi'
import type { Product } from '@/types/product'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => productsApi.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      toast.success('Product created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to create product')
    },
  })
}
