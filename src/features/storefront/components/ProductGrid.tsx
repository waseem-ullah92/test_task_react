'use client'

import { useProducts } from '@/features/products/hooks/useProducts'
import { useStorefrontFilters } from '../hooks/useStorefrontFilters'
import { ProductCard } from './ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/product'

const PAGE_SIZE = 8

export function ProductGrid() {
  const { data: allProducts = [], isLoading } = useProducts()
  const { search, category, page, setPage } = useStorefrontFilters()

  if (isLoading) return <ProductGridSkeleton />

  const active = (allProducts as Product[]).filter((p) => p.status === 'active')

  const filtered = active
    .filter((p) =>
      search
        ? p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((p) => (category ? p.category === category : true))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  if (paginated.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description={
          search || category
            ? 'Try adjusting your search or filters.'
            : 'Check back soon for new arrivals.'
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {paginated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-8"
      />
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  )
}
