'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useStorefrontFilters } from '../hooks/useStorefrontFilters'
import { cn } from '@/lib/utils/cn'

type SearchBarProps = { className?: string }

export function SearchBar({ className }: SearchBarProps) {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const { setSearch } = useStorefrontFilters()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    setSearch(e.target.value)
  }

  return (
    <div className={cn('relative', className)}>
      <span
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none"
      >
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search products…"
        aria-label="Search products"
        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      />
    </div>
  )
}
