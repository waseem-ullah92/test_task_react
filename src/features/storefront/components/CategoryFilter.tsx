'use client'

import { CATEGORIES } from '@/constants/categories'
import { useStorefrontFilters } from '../hooks/useStorefrontFilters'
import { cn } from '@/lib/utils/cn'

export function CategoryFilter() {
  const { category, setCategory } = useStorefrontFilters()

  const all = [{ label: 'All', value: '' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {all.map(({ label, value }) => {
        const isActive = category === value
        return (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setCategory(value)}
            aria-pressed={isActive}
            className={cn(
              'h-9 rounded-full px-4 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              isActive
                ? 'bg-brand text-brand-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
