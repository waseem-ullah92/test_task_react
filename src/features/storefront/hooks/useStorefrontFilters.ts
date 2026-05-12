'use client'
// Requires client context: reads/writes URL search params via next/navigation

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export type StorefrontFilters = {
  search: string
  category: string
  page: number
}

export function useStorefrontFilters(): StorefrontFilters & {
  setSearch: (q: string) => void
  setCategory: (cat: string) => void
  setPage: (p: number) => void
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const debouncedSearch = useDebounce(search, 300)

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 on filter change
      if (key !== 'page') params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return {
    search: debouncedSearch,
    category,
    page,
    setSearch: (q) => update('q', q),
    setCategory: (cat) => update('category', cat),
    setPage: (p) => update('page', String(p)),
  }
}
