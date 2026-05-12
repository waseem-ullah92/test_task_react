'use client'

import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import { ProductGrid } from './ProductGrid'

export function StorefrontContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBar className="flex-1 max-w-sm" />
        <CategoryFilter />
      </div>
      <ProductGrid />
    </div>
  )
}
