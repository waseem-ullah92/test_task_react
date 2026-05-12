'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartMutations } from '@/features/cart/hooks/useCartMutations'
import { useVariantSelection } from '../hooks/useVariantSelection'
import { VariantSelector } from './VariantSelector'
import { StockBadge } from './StockBadge'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatters'
import { effectivePrice } from '@/features/products/utils/permutations'
import type { Product } from '@/types/product'

export function ProductDetailView({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0)
  const { selectedOptions, selectOption, selectedVariant, isComplete } =
    useVariantSelection(product)
  const { addToCart } = useCartMutations([product])

  const hasVariants = product.variantTypes.length > 0

  const displayPrice = selectedVariant
    ? effectivePrice(product.basePrice, selectedVariant.priceOverride)
    : product.basePrice

  const canAdd = hasVariants
    ? isComplete && selectedVariant !== null && selectedVariant.stock > 0
    : false

  function handleAddToCart() {
    if (!selectedVariant) return
    addToCart(product.id, selectedVariant.id, 1)
  }

  function addToCartLabel() {
    if (hasVariants && !isComplete) return 'Select Options'
    if (selectedVariant?.stock === 0) return 'Out of Stock'
    return 'Add to Cart'
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* ── Image Gallery ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.images[activeImage] ? (
            <Image
              src={product.images[activeImage]!}
              alt={product.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative aspect-square overflow-hidden rounded-lg bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  i === activeImage ? 'ring-2 ring-brand' : 'opacity-70 hover:opacity-100'
                } transition-opacity`}
              >
                <Image src={img} alt="" fill unoptimized className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Info ────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-2xl font-semibold">{formatCurrency(displayPrice)}</p>
        </div>

        <p className="leading-relaxed text-muted-foreground">{product.description}</p>

        {hasVariants && (
          <VariantSelector
            product={product}
            selectedOptions={selectedOptions}
            onSelect={selectOption}
          />
        )}

        {selectedVariant && <StockBadge stock={selectedVariant.stock} />}

        <Button
          size="lg"
          className="w-full"
          disabled={hasVariants && !canAdd}
          onClick={handleAddToCart}
        >
          {addToCartLabel()}
        </Button>
      </div>
    </div>
  )
}
