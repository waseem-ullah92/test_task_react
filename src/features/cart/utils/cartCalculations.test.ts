import { describe, it, expect } from 'vitest'
import { calcLineTotal, calcItemCount, calcSubtotal, availableToAdd } from './cartCalculations'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeCartItem(
  overrides: Partial<CartItem> & Pick<CartItem, 'productId' | 'variantId'>
): CartItem {
  return { id: `ci_${Math.random()}`, quantity: 1, ...overrides }
}

const PRODUCT_A: Product = {
  id: 'prod_a',
  title: 'Tee',
  description: 'A tee',
  category: 'Clothing',
  basePrice: 29.99,
  status: 'active',
  images: [],
  variantTypes: [{ id: 'vt1', name: 'Size', values: ['S', 'M'] }],
  variants: [
    { id: 'var_s', sku: 'tee-s', options: { Size: 'S' }, stock: 10, priceOverride: null, enabled: true },
    { id: 'var_m', sku: 'tee-m', options: { Size: 'M' }, stock: 5, priceOverride: 34.99, enabled: true },
  ],
}

const PRODUCT_B: Product = {
  id: 'prod_b',
  title: 'Hoodie',
  description: 'A hoodie',
  category: 'Clothing',
  basePrice: 74.99,
  status: 'active',
  images: [],
  variantTypes: [{ id: 'vt2', name: 'Size', values: ['M'] }],
  variants: [
    { id: 'var_hm', sku: 'hoodie-m', options: { Size: 'M' }, stock: 3, priceOverride: null, enabled: true },
  ],
}

// ─── calcLineTotal ────────────────────────────────────────────────────────────

describe('calcLineTotal', () => {
  it('uses basePrice when priceOverride is null', () => {
    expect(calcLineTotal(29.99, null, 1)).toBe(29.99)
  })

  it('uses priceOverride when set', () => {
    expect(calcLineTotal(29.99, 39.99, 1)).toBe(39.99)
  })

  it('multiplies the unit price by quantity', () => {
    expect(calcLineTotal(10, null, 3)).toBe(30)
  })

  it('returns 0 for zero quantity', () => {
    expect(calcLineTotal(29.99, null, 0)).toBe(0)
  })

  it('works when priceOverride is 0 (free item)', () => {
    expect(calcLineTotal(29.99, 0, 1)).toBe(0)
  })

  it('handles floating-point prices without catastrophic error', () => {
    // 3 × $19.99 should be $59.97 (not a recurring float mess)
    expect(calcLineTotal(19.99, null, 3)).toBeCloseTo(59.97, 2)
  })
})

// ─── calcItemCount ────────────────────────────────────────────────────────────

describe('calcItemCount', () => {
  it('returns 0 for an empty cart', () => {
    expect(calcItemCount([])).toBe(0)
  })

  it('returns the quantity when there is a single item with qty 1', () => {
    const items = [makeCartItem({ productId: 'p1', variantId: 'v1', quantity: 1 })]
    expect(calcItemCount(items)).toBe(1)
  })

  it('sums quantities across multiple line items', () => {
    const items = [
      makeCartItem({ productId: 'p1', variantId: 'v1', quantity: 2 }),
      makeCartItem({ productId: 'p1', variantId: 'v2', quantity: 3 }),
      makeCartItem({ productId: 'p2', variantId: 'v3', quantity: 1 }),
    ]
    expect(calcItemCount(items)).toBe(6)
  })

  it('counts large quantities correctly', () => {
    const items = [makeCartItem({ productId: 'p1', variantId: 'v1', quantity: 99 })]
    expect(calcItemCount(items)).toBe(99)
  })
})

// ─── calcSubtotal ─────────────────────────────────────────────────────────────

describe('calcSubtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calcSubtotal([], [PRODUCT_A])).toBe(0)
  })

  it('returns 0 when products array is empty (stale cart)', () => {
    const items = [makeCartItem({ productId: 'prod_a', variantId: 'var_s', quantity: 1 })]
    expect(calcSubtotal(items, [])).toBe(0)
  })

  it('calculates correctly for a single item using basePrice', () => {
    const items = [makeCartItem({ productId: 'prod_a', variantId: 'var_s', quantity: 2 })]
    expect(calcSubtotal(items, [PRODUCT_A])).toBeCloseTo(59.98, 2) // 2 × 29.99
  })

  it('uses priceOverride instead of basePrice when the variant has one', () => {
    const items = [makeCartItem({ productId: 'prod_a', variantId: 'var_m', quantity: 1 })]
    expect(calcSubtotal(items, [PRODUCT_A])).toBeCloseTo(34.99, 2) // override price
  })

  it('sums multiple line items from different products', () => {
    const items = [
      makeCartItem({ productId: 'prod_a', variantId: 'var_s', quantity: 1 }), // 29.99
      makeCartItem({ productId: 'prod_b', variantId: 'var_hm', quantity: 2 }), // 2 × 74.99
    ]
    const total = calcSubtotal(items, [PRODUCT_A, PRODUCT_B])
    expect(total).toBeCloseTo(29.99 + 74.99 * 2, 2)
  })

  it('silently skips a line item whose product is not in the catalogue', () => {
    const items = [
      makeCartItem({ productId: 'ghost_product', variantId: 'ghost_variant', quantity: 1 }),
      makeCartItem({ productId: 'prod_a', variantId: 'var_s', quantity: 1 }),
    ]
    expect(calcSubtotal(items, [PRODUCT_A])).toBeCloseTo(29.99, 2)
  })

  it('silently skips a line item whose variant id no longer exists', () => {
    const items = [
      makeCartItem({ productId: 'prod_a', variantId: 'deleted_variant', quantity: 1 }),
    ]
    expect(calcSubtotal(items, [PRODUCT_A])).toBe(0)
  })
})

// ─── availableToAdd ───────────────────────────────────────────────────────────

describe('availableToAdd', () => {
  it('returns full stock when cart has none of this variant', () => {
    expect(availableToAdd(10, 0)).toBe(10)
  })

  it('returns the remaining stock after accounting for cart quantity', () => {
    expect(availableToAdd(10, 3)).toBe(7)
  })

  it('returns 0 when cart quantity already equals stock', () => {
    expect(availableToAdd(5, 5)).toBe(0)
  })

  it('returns 0 (never negative) when cart qty somehow exceeds stock', () => {
    expect(availableToAdd(3, 5)).toBe(0)
  })

  it('returns 0 for out-of-stock items', () => {
    expect(availableToAdd(0, 0)).toBe(0)
  })
})
