'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, CartItem[], { previous: CartItem[] }>({
    mutationFn: async (items) => {
      await cartApi.clear(items)
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      queryClient.setQueryData<CartItem[]>(queryKeys.cart.items(), [])
      return { previous }
    },

    onSuccess: () => {
      toast.success('Cart cleared')
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
