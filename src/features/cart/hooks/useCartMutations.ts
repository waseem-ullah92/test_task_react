'use client'

import { toast } from 'sonner'
import { useAddToCart } from './useAddToCart'
import { useRemoveFromCart } from './useRemoveFromCart'
import { useUpdateCartItem } from './useUpdateCartItem'
import { useCartQuery } from './useCartQuery'
import type { Product } from '@/types/product'

export function useCartMutations(products: Product[]) {
  const { data: cartItems = [] } = useCartQuery()
  const addToCartMutation = useAddToCart()
  const removeFromCartMutation = useRemoveFromCart()
  const updateCartItemMutation = useUpdateCartItem()

  const addToCart = (productId: string, variantId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    const variant = product?.variants.find((v) => v.id === variantId)

    if (!product || !variant) {
      toast.error('Product not found')
      return
    }

    if (!variant.enabled) {
      toast.error('This variant is unavailable')
      return
    }

    const currentQty =
      cartItems.find((i) => i.productId === productId && i.variantId === variantId)?.quantity ?? 0

    if (currentQty + quantity > variant.stock) {
      toast.error(`Only ${variant.stock} left in stock`)
      return
    }

    addToCartMutation.mutate(
      { productId, variantId, quantity },
      { onSuccess: () => toast.success(`${product.title} added to cart`) }
    )
  }

  const removeItem = (cartItemId: string) => {
    removeFromCartMutation.mutate(cartItemId)
  }

  const changeQuantity = (cartItemId: string, newQty: number, maxStock: number) => {
    if (newQty > maxStock) {
      toast.error(`Only ${maxStock} left in stock`)
      return
    }
    if (newQty <= 0) {
      removeFromCartMutation.mutate(cartItemId)
      return
    }
    updateCartItemMutation.mutate({ cartItemId, quantity: newQty })
  }

  return { addToCart, removeItem, changeQuantity }
}
