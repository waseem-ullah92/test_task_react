'use client'

import { cn } from '@/lib/utils/cn'
import type { Product } from '@/types/product'

type Props = {
  product: Product
  selectedOptions: Record<string, string>
  onSelect: (typeName: string, value: string) => void
}

export function VariantSelector({ product, selectedOptions, onSelect }: Props) {
  return (
    <div className="space-y-4">
      {product.variantTypes.map((variantType) => {
        // For each value, sum stock across all matching enabled variants
        // (respecting other already-selected dimensions)
        const stockByValue = Object.fromEntries(
          variantType.values.map((value) => {
            const totalStock = product.variants
              .filter(
                (v) =>
                  v.options[variantType.name] === value &&
                  v.enabled &&
                  Object.entries(selectedOptions).every(
                    ([k, sel]) => k === variantType.name || v.options[k] === sel
                  )
              )
              .reduce((sum, v) => sum + v.stock, 0)
            return [value, totalStock] as [string, number]
          })
        )

        return (
          <div key={variantType.id}>
            <p className="mb-2 text-sm font-semibold">
              {variantType.name}
              {selectedOptions[variantType.name] && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {selectedOptions[variantType.name]}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {variantType.values.map((value) => {
                const isSelected = selectedOptions[variantType.name] === value
                const hasStock = (stockByValue[value] ?? 0) > 0
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!hasStock}
                    onClick={() => onSelect(variantType.name, value)}
                    className={cn(
                      'h-9 min-w-[3rem] rounded-lg border px-3 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                      'disabled:cursor-not-allowed disabled:opacity-40',
                      !hasStock && 'line-through',
                      isSelected
                        ? 'border-brand bg-brand text-brand-foreground'
                        : 'border-border hover:border-foreground/60'
                    )}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
