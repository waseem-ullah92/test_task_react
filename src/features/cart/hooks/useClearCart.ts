'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void, { previous: CartItem[] }>({
    mutationFn: async () => {
      const current = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      await cartApi.clear(current)
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      queryClient.setQueryData<CartItem[]>(queryKeys.cart.items(), [])
      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cart.items(), context.previous)
      }
      toast.error('Failed to clear cart')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() })
    },
  })
}
