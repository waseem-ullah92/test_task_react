'use client'
// Requires client context: uses TanStack Query useMutation

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/api/queryKeys'
import { productsApi } from '../api/productsApi'
import type { Product } from '@/types/product'

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(updated.id) })
      toast.success('Product updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update product')
    },
  })
}
