'use client'

import Image from 'next/image'
import { useCartMutations } from '../hooks/useCartMutations'
import { formatCurrency } from '@/lib/utils/formatters'
import { effectivePrice } from '@/features/products/utils/permutations'
import type { CartItem as CartItemType } from '@/types/cart'
import type { Product } from '@/types/product'

type Props = {
  item: CartItemType
  products: Product[]
}

export function CartItem({ item, products }: Props) {
  const { removeItem, changeQuantity } = useCartMutations(products)

  const product = products.find((p) => p.id === item.productId)
  const variant = product?.variants.find((v) => v.id === item.variantId)

  if (!product || !variant) return null

  const unitPrice = effectivePrice(product.basePrice, variant.priceOverride)
  const lineTotal = unitPrice * item.quantity

  return (
    <div className="flex gap-4 p-4 border-b border-border last:border-0">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium truncate">{product.title}</p>
        {Object.entries(variant.options).length > 0 && (
          <p className="text-xs text-muted-foreground">
            {Object.entries(variant.options)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · ')}
          </p>
        )}
        <p className="text-sm font-semibold">{formatCurrency(lineTotal)}</p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${product.title}`}
          className="text-muted-foreground hover:text-red-500 transition-colors text-lg leading-none"
        >
          ×
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => changeQuantity(item.id, item.quantity - 1, variant.stock)}
            className="flex size-8 items-center justify-center rounded-l-lg hover:bg-muted transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={item.quantity >= variant.stock}
            onClick={() => changeQuantity(item.id, item.quantity + 1, variant.stock)}
            className="flex size-8 items-center justify-center rounded-r-lg hover:bg-muted transition-colors text-lg leading-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
