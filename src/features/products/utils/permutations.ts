import type { Variant, VariantType } from '@/types/variant'

/**
 * Produces a stable, sorted key from a variant's options map so two variants
 * with the same logical options always produce the same key regardless of
 * insertion order.
 */
export function optionKey(options: Record<string, string>): string {
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|')
}

/**
 * Computes the Cartesian product of all variant type values.
 * Returns an array of options maps (one per permutation).
 */
export function cartesianProduct(variantTypes: VariantType[]): Array<Record<string, string>> {
  if (variantTypes.length === 0) return []

  return variantTypes.reduce<Array<Record<string, string>>>(
    (acc, variantType) => {
      if (acc.length === 0) {
        return variantType.values.map((value) => ({ [variantType.name]: value }))
      }
      return acc.flatMap((existing) =>
        variantType.values.map((value) => ({ ...existing, [variantType.name]: value }))
      )
    },
    []
  )
}

/**
 * Regenerates the variant list from updated variant types while preserving
 * existing data (SKU, stock, priceOverride, enabled) for unchanged permutations.
 *
 * Matching is done by the sorted options signature so order-of-definition
 * changes don't lose data.
 */
export function reconcileVariants(
  variantTypes: VariantType[],
  existingVariants: Variant[],
  productTitleSlug: string,
  generateId: () => string
): Variant[] {
  // Short-circuit: if no variant types, return empty (no-variant products handled separately)
  if (variantTypes.length === 0) return []

  // Build a lookup of existing variants by their options key
  const existingByKey = new Map<string, Variant>(
    existingVariants.map((v) => [optionKey(v.options), v])
  )

  const permutations = cartesianProduct(variantTypes)

  return permutations.map((options) => {
    const key = optionKey(options)
    const existing = existingByKey.get(key)

    if (existing) {
      // Preserve all user-entered data, just update the options reference
      return { ...existing, options }
    }

    // New permutation — generate defaults
    const skuSuffix = Object.values(options).join('-').toLowerCase()
    return {
      id: generateId(),
      sku: `${productTitleSlug}-${skuSuffix}`,
      options,
      stock: 0,
      priceOverride: null,
      enabled: true,
    }
  })
}

/**
 * Derives the effective price for a variant:
 * uses priceOverride if set, otherwise falls back to the product's basePrice.
 */
export function effectivePrice(basePrice: number, priceOverride: number | null): number {
  return priceOverride ?? basePrice
}

/**
 * Computes the min/max price range across all enabled variants.
 * Returns { min, max } or null if no enabled variants exist.
 */
export function priceRange(
  basePrice: number,
  variants: Variant[]
): { min: number; max: number } | null {
  const enabledPrices = variants
    .filter((v) => v.enabled)
    .map((v) => effectivePrice(basePrice, v.priceOverride))

  if (enabledPrices.length === 0) return null

  return { min: Math.min(...enabledPrices), max: Math.max(...enabledPrices) }
}
