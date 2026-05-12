import { describe, it, expect } from 'vitest'
import {
  optionKey,
  cartesianProduct,
  reconcileVariants,
  effectivePrice,
  priceRange,
} from './permutations'
import type { Variant, VariantType } from '@/types/variant'

// ─── Helpers ─────────────────────────────────────────────────────────────────

let idCounter = 0
const fakeId = () => `id_${++idCounter}`

function makeVariantType(name: string, values: string[]): VariantType {
  return { id: `vt_${name}`, name, values }
}

function makeVariant(
  options: Record<string, string>,
  overrides: Partial<Variant> = {}
): Variant {
  return {
    id: fakeId(),
    sku: `sku-${Object.values(options).join('-')}`,
    options,
    stock: 10,
    priceOverride: null,
    enabled: true,
    ...overrides,
  }
}

// ─── optionKey ────────────────────────────────────────────────────────────────

describe('optionKey', () => {
  it('produces a stable key from a single-entry options map', () => {
    expect(optionKey({ Size: 'M' })).toBe('Size:M')
  })

  it('sorts entries alphabetically so insertion order does not matter', () => {
    const a = optionKey({ Color: 'Red', Size: 'M' })
    const b = optionKey({ Size: 'M', Color: 'Red' })
    expect(a).toBe(b)
  })

  it('produces different keys for different values', () => {
    expect(optionKey({ Size: 'M' })).not.toBe(optionKey({ Size: 'L' }))
  })

  it('handles many options deterministically', () => {
    const options = { C: '3', A: '1', B: '2' }
    expect(optionKey(options)).toBe('A:1|B:2|C:3')
  })

  it('returns empty string for an empty options map', () => {
    expect(optionKey({})).toBe('')
  })
})

// ─── cartesianProduct ─────────────────────────────────────────────────────────

describe('cartesianProduct', () => {
  it('returns [] for an empty variant types array', () => {
    expect(cartesianProduct([])).toEqual([])
  })

  it('returns one option map per value for a single variant type', () => {
    const result = cartesianProduct([makeVariantType('Size', ['S', 'M', 'L'])])
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ Size: 'S' })
    expect(result[1]).toEqual({ Size: 'M' })
    expect(result[2]).toEqual({ Size: 'L' })
  })

  it('returns m × n maps for two variant types (Cartesian product)', () => {
    const result = cartesianProduct([
      makeVariantType('Size', ['S', 'M']),
      makeVariantType('Color', ['Red', 'Blue']),
    ])
    expect(result).toHaveLength(4)
    expect(result).toContainEqual({ Size: 'S', Color: 'Red' })
    expect(result).toContainEqual({ Size: 'S', Color: 'Blue' })
    expect(result).toContainEqual({ Size: 'M', Color: 'Red' })
    expect(result).toContainEqual({ Size: 'M', Color: 'Blue' })
  })

  it('returns m × n × p maps for three variant types', () => {
    const result = cartesianProduct([
      makeVariantType('Size', ['S', 'M']),
      makeVariantType('Color', ['Red', 'Blue']),
      makeVariantType('Material', ['Cotton', 'Polyester']),
    ])
    expect(result).toHaveLength(8) // 2 × 2 × 2
  })

  it('returns a single map for a type with exactly one value', () => {
    const result = cartesianProduct([makeVariantType('Size', ['One Size'])])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ Size: 'One Size' })
  })

  it('each option map in the result is independent (no shared references)', () => {
    const result = cartesianProduct([
      makeVariantType('Size', ['S', 'M']),
      makeVariantType('Color', ['Red']),
    ])
    // Mutating one entry must not affect another
    if (result[0]) result[0]['Extra'] = 'x'
    expect(result[1]).not.toHaveProperty('Extra')
  })
})

// ─── reconcileVariants ────────────────────────────────────────────────────────

describe('reconcileVariants', () => {
  it('returns [] when variantTypes is empty', () => {
    const existing = [makeVariant({ Size: 'M' })]
    expect(reconcileVariants([], existing, 'my-product', fakeId)).toEqual([])
  })

  it('generates default variants with auto-SKU when there are no existing variants', () => {
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M'])],
      [],
      'tshirt',
      fakeId
    )
    expect(result).toHaveLength(2)
    expect(result[0]?.sku).toBe('tshirt-s')
    expect(result[1]?.sku).toBe('tshirt-m')
    expect(result[0]?.stock).toBe(0)
    expect(result[0]?.priceOverride).toBeNull()
    expect(result[0]?.enabled).toBe(true)
  })

  it('preserves stock, SKU, priceOverride, and enabled from matching existing variants', () => {
    const existing = [
      makeVariant({ Size: 'M', Color: 'Red' }, { sku: 'custom-sku', stock: 42, priceOverride: 29.99, enabled: false }),
    ]
    const result = reconcileVariants(
      [makeVariantType('Size', ['M']), makeVariantType('Color', ['Red'])],
      existing,
      'product',
      fakeId
    )
    expect(result).toHaveLength(1)
    expect(result[0]?.sku).toBe('custom-sku')
    expect(result[0]?.stock).toBe(42)
    expect(result[0]?.priceOverride).toBe(29.99)
    expect(result[0]?.enabled).toBe(false)
  })

  it('preserves matching variants even when options insertion order differs', () => {
    // Existing variant has { Color, Size } — new type order is { Size, Color }
    const existing = [
      makeVariant({ Color: 'Blue', Size: 'L' }, { stock: 99 }),
    ]
    const result = reconcileVariants(
      [makeVariantType('Size', ['L']), makeVariantType('Color', ['Blue'])],
      existing,
      'product',
      fakeId
    )
    expect(result[0]?.stock).toBe(99)
  })

  it('drops variants whose option combination no longer exists', () => {
    const existing = [
      makeVariant({ Size: 'S' }),
      makeVariant({ Size: 'M' }),
      makeVariant({ Size: 'XL' }), // XL will be removed
    ]
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M'])], // XL dropped
      existing,
      'product',
      fakeId
    )
    expect(result).toHaveLength(2)
    expect(result.map((v) => v.options['Size'])).toEqual(['S', 'M'])
  })

  it('adds new permutations with defaults when a value is added to an existing type', () => {
    const existing = [
      makeVariant({ Size: 'S' }, { stock: 10 }),
      makeVariant({ Size: 'M' }, { stock: 20 }),
    ]
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M', 'L'])], // L is new
      existing,
      'product',
      fakeId
    )
    expect(result).toHaveLength(3)
    const lVariant = result.find((v) => v.options['Size'] === 'L')
    expect(lVariant?.stock).toBe(0) // default
    expect(lVariant?.priceOverride).toBeNull()
    // Existing variants still have their data
    expect(result.find((v) => v.options['Size'] === 'S')?.stock).toBe(10)
    expect(result.find((v) => v.options['Size'] === 'M')?.stock).toBe(20)
  })

  it('correctly handles adding a second variant type to a previously single-type product', () => {
    const existing = [
      makeVariant({ Size: 'S' }, { sku: 'preserved-s', stock: 5 }),
      makeVariant({ Size: 'M' }, { sku: 'preserved-m', stock: 8 }),
    ]
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M']), makeVariantType('Color', ['Red', 'Blue'])],
      existing,
      'product',
      fakeId
    )
    // All old single-type variants are gone (options signature changed)
    // New variants are 2×2 = 4
    expect(result).toHaveLength(4)
    // None should have preserved SKUs since the combinations are entirely new
    expect(result.every((v) => !v.sku.startsWith('preserved'))).toBe(true)
  })

  it('uses generateId for each new variant id', () => {
    const ids: string[] = []
    const trackingId = () => {
      const id = `tracked_${ids.length}`
      ids.push(id)
      return id
    }
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M', 'L'])],
      [],
      'p',
      trackingId
    )
    expect(ids).toHaveLength(3)
    expect(result.map((v) => v.id)).toEqual(ids)
  })

  it('returns variants in the same order as the Cartesian product', () => {
    const result = reconcileVariants(
      [makeVariantType('Size', ['S', 'M']), makeVariantType('Color', ['Red', 'Blue'])],
      [],
      'p',
      fakeId
    )
    expect(result[0]?.options).toEqual({ Size: 'S', Color: 'Red' })
    expect(result[1]?.options).toEqual({ Size: 'S', Color: 'Blue' })
    expect(result[2]?.options).toEqual({ Size: 'M', Color: 'Red' })
    expect(result[3]?.options).toEqual({ Size: 'M', Color: 'Blue' })
  })
})

// ─── effectivePrice ───────────────────────────────────────────────────────────

describe('effectivePrice', () => {
  it('returns basePrice when priceOverride is null', () => {
    expect(effectivePrice(29.99, null)).toBe(29.99)
  })

  it('returns priceOverride when set', () => {
    expect(effectivePrice(29.99, 39.99)).toBe(39.99)
  })

  it('returns 0 when priceOverride is explicitly 0', () => {
    expect(effectivePrice(29.99, 0)).toBe(0)
  })
})

// ─── priceRange ───────────────────────────────────────────────────────────────

describe('priceRange', () => {
  it('returns null for an empty variants array', () => {
    expect(priceRange(29.99, [])).toBeNull()
  })

  it('returns null when all variants are disabled', () => {
    const variants = [
      makeVariant({ Size: 'S' }, { enabled: false }),
      makeVariant({ Size: 'M' }, { enabled: false }),
    ]
    expect(priceRange(29.99, variants)).toBeNull()
  })

  it('returns basePrice for both min and max when no overrides exist', () => {
    const variants = [makeVariant({ Size: 'S' }), makeVariant({ Size: 'M' })]
    expect(priceRange(29.99, variants)).toEqual({ min: 29.99, max: 29.99 })
  })

  it('computes min/max correctly from a mix of overrides and base prices', () => {
    const variants = [
      makeVariant({ Size: 'S' }, { priceOverride: 19.99 }),
      makeVariant({ Size: 'M' }, { priceOverride: null }),  // uses basePrice 29.99
      makeVariant({ Size: 'L' }, { priceOverride: 39.99 }),
    ]
    expect(priceRange(29.99, variants)).toEqual({ min: 19.99, max: 39.99 })
  })

  it('ignores disabled variants when computing range', () => {
    const variants = [
      makeVariant({ Size: 'S' }, { priceOverride: 9.99 }),  // cheap but disabled
      makeVariant({ Size: 'M' }, { priceOverride: null, enabled: false }),
      makeVariant({ Size: 'L' }, { priceOverride: null }),
    ]
    // Disabled S has override 9.99 but should be excluded
    const range = priceRange(29.99, variants)
    expect(range).not.toBeNull()
    expect(range?.min).toBe(9.99)  // S is enabled, L uses basePrice
    expect(range?.max).toBe(29.99)
  })

  it('returns equal min and max for a single enabled variant', () => {
    const variants = [makeVariant({ Size: 'M' }, { priceOverride: 44.99 })]
    expect(priceRange(29.99, variants)).toEqual({ min: 44.99, max: 44.99 })
  })
})
