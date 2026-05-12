'use client'
// Requires client context: uses TanStack Query useQuery

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { productsApi } from '../api/productsApi'

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
  })
}
