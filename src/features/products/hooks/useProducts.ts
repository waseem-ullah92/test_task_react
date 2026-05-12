'use client'
// Requires client context: uses TanStack Query useQuery

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { productsApi } from '../api/productsApi'

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: productsApi.getAll,
  })
}
