'use client'
// Requires client context: manages interactive variant selection state

import { useState, useMemo } from 'react'
import type { Product } from '@/types/product'
import type { Variant } from '@/types/variant'
import { optionKey } from '@/features/products/utils/permutations'

type VariantSelectionResult = {
  selectedOptions: Record<string, string>
  selectOption: (typeName: string, value: string) => void
  selectedVariant: Variant | null
  isComplete: boolean
}

export function useVariantSelection(product: Product): VariantSelectionResult {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const selectOption = (typeName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [typeName]: value }))
  }

  const selectedVariant = useMemo(() => {
    if (product.variantTypes.length === 0) return null
    const key = optionKey(selectedOptions)
    return (
      product.variants.find(
        (v) => optionKey(v.options) === key && v.enabled
      ) ?? null
    )
  }, [selectedOptions, product.variants, product.variantTypes.length])

  const isComplete = product.variantTypes.every((vt) => selectedOptions[vt.name] !== undefined)

  return { selectedOptions, selectOption, selectedVariant, isComplete }
}
