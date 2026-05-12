'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { queryKeys } from '@/lib/api/queryKeys'
import { cartApi } from '../api/cartApi'
import type { CartItem } from '@/types/cart'

type AddToCartVars = { productId: string; variantId: string; quantity: number }

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation<CartItem, Error, AddToCartVars, { previous: CartItem[] }>({
    mutationFn: async (vars) => {
      const current = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []
      const existing = current.find(
        (i) => i.productId === vars.productId && i.variantId === vars.variantId
      )
      if (existing) {
        return cartApi.update(existing.id, existing.quantity + vars.quantity)
      }
      return cartApi.add({ id: nanoid(), ...vars })
    },

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.items() })
      const previous = queryClient.getQueryData<CartItem[]>(queryKeys.cart.items()) ?? []

      const existing = previous.find(
        (i) => i.productId === vars.productId && i.variantId === vars.variantId
      )
      const optimistic: CartItem[] = existing
        ? previous.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + vars.quantity } : i
          )
        : [...previous, { id: `opt_${nanoid()}`, ...vars }]

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
