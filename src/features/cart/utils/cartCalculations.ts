import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import { effectivePrice } from '@/features/products/utils/permutations'

/**
 * Total cost of a single line item.
 */
export function calcLineTotal(
  basePrice: number,
  priceOverride: number | null,
  quantity: number
): number {
  return effectivePrice(basePrice, priceOverride) * quantity
}

/**
 * Total number of items across all cart lines.
 */
export function calcItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Cart subtotal: resolves each line's unit price from the product catalogue
 * and multiplies by quantity. Lines whose product or variant is missing
 * (e.g. deleted since last visit) are silently skipped.
 */
export function calcSubtotal(items: CartItem[], products: Product[]): number {
  return items.reduce((sum, cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId)
    if (!product) return sum
    const variant = product.variants.find((v) => v.id === cartItem.variantId)
    if (!variant) return sum
    return sum + calcLineTotal(product.basePrice, variant.priceOverride, cartItem.quantity)
  }, 0)
}

/**
 * Returns the maximum quantity a user can add for a given product/variant,
 * taking their existing cart quantity into account.
 */
export function availableToAdd(
  stock: number,
  currentCartQty: number
): number {
  return Math.max(0, stock - currentCartQty)
}
