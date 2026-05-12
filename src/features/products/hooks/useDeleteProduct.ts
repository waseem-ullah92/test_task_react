'use client'
// Requires client context: uses TanStack Query useMutation

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/api/queryKeys'
import { productsApi } from '../api/productsApi'

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      toast.success('Product deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to delete product')
    },
  })
}
