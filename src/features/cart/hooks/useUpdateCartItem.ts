'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

type UpdateCartItemVars = { cartItemId: string; quantity: number }

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation<CartItem, Error, UpdateCartItemVars, { previous: CartItem[] }>({
    mutationFn: ({ cartItemId, quantity }) => cartApi.update(cartItemId, quantity),

    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      queryClient.setQueryData<CartItem[]>(
        queryKeys.cart.items(),
        previous.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
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
