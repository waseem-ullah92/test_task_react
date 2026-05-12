'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'

export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart.items(),
    queryFn: cartApi.getAll,
    staleTime: 30 * 1000,
  })
}
