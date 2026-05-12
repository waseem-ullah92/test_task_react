'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string, { previous: CartItem[] }>({
    mutationFn: (cartItemId) => cartApi.remove(cartItemId),

    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      queryClient.setQueryData<CartItem[]>(
        queryKeys.cart.items(),
        previous.filter((i) => i.id !== cartItemId)
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cart.items(), context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() })
    },
  })
}
