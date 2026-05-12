'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { ordersApi } from '../api/ordersApi'
import { cartApi } from '@/features/cart/api/cartApi'
import { queryKeys } from '@/lib/api/queryKeys'
import { ROUTES } from '@/constants/routes'
import { effectivePrice } from '@/features/products/utils/permutations'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import type { Order, ShippingAddress, OrderItem } from '@/types/order'

type PlaceOrderVars = {
  cartItems: CartItem[]
  products: Product[]
  shipping: ShippingAddress
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<Order, Error, PlaceOrderVars>({
    mutationFn: async ({ cartItems, products, shipping }) => {
      const orderItems: OrderItem[] = cartItems.flatMap((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId)
        if (!product) return []
        const variant = product.variants.find((v) => v.id === cartItem.variantId)
        if (!variant) return []
        return [
          {
            productId: cartItem.productId,
            variantId: cartItem.variantId,
            quantity: cartItem.quantity,
            title: product.title,
            variantLabel: Object.entries(variant.options)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · '),
            unitPrice: effectivePrice(product.basePrice, variant.priceOverride),
          },
        ]
      })

      const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

      const order: Order = {
        id: `ord_${nanoid()}`,
        items: orderItems,
        shipping,
        subtotal,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }

      const placed = await ordersApi.create(order)
      await cartApi.clear(cartItems)
      return placed
    },

    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.cart.items(), [])
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items() })
      router.push(ROUTES.orderSuccess(order.id))
    },

    onError: () => {
      toast.error('Failed to place order. Please try again.')
    },
  })
}
