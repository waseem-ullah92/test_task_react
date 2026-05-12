'use client'
// Requires client context: uses React hooks

import { useMemo } from 'react'
import { nanoid } from 'nanoid'
import { reconcileVariants } from '@/features/products/utils/permutations'
import { titleToSlug } from '@/features/products/utils/sku'
import type { Variant, VariantType } from '@/types/variant'

/**
 * Derives the current variant list from variantTypes + existingVariants.
 * When variantTypes change, new permutations are computed and merged with
 * existing data via reconcileVariants (options-key matching). Stale permutations
 * are dropped; new ones get defaults. Unchanged permutations keep their edits.
 */
export function usePermutations(
  variantTypes: VariantType[],
  existingVariants: Variant[],
  productTitle: string
): Variant[] {
  return useMemo(
    () =>
      reconcileVariants(variantTypes, existingVariants, titleToSlug(productTitle), nanoid),
    [variantTypes, existingVariants, productTitle]
  )
}
