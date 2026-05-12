'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

// existingId and baseQuantity are pre-computed by the caller (before optimistic updates
// contaminate the cache), so mutationFn never has to re-read a stale/optimistic cache.
type AddToCartVars = {
  productId: string
  variantId: string
  quantity: number
  existingId?: string
  baseQuantity?: number
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation<CartItem, Error, AddToCartVars, { previous: CartItem[] }>({
    mutationFn: async (vars) => {
      if (vars.existingId) {
        return cartApi.update(vars.existingId, (vars.baseQuantity ?? 0) + vars.quantity)
      }
      return cartApi.add({ id: nanoid(), productId: vars.productId, variantId: vars.variantId, quantity: vars.quantity })
    },

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []

      const optimistic: CartItem[] = vars.existingId
        ? previous.map((i) =>
            i.id === vars.existingId
              ? { ...i, quantity: (vars.baseQuantity ?? i.quantity) + vars.quantity }
              : i
          )
        : [...previous, { id: `opt_${nanoid()}`, productId: vars.productId, variantId: vars.variantId, quantity: vars.quantity }]

      queryClient.setQueryData<CartItem[]>(queryKeys.cart.items(), optimistic)
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
