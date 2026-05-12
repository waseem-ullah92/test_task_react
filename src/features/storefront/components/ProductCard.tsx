import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { formatPriceRange } from '@/lib/utils/formatters'
import { priceRange } from '@/features/products/utils/permutations'
import type { Product } from '@/types/product'

export function ProductCard({ product }: { product: Product }) {
  const range = priceRange(product.basePrice, product.variants)
  const priceDisplay = range
    ? formatPriceRange(range.min, range.max)
    : formatPriceRange(product.basePrice, product.basePrice)

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col rounded-xl border border-border overflow-hidden hover:border-foreground/30 transition-colors"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight">{product.title}</h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm font-semibold">{priceDisplay}</p>
      </div>
    </Link>
  )
}
